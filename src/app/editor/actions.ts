'use server'

import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'
import { revalidatePath } from 'next/cache'
import { sendScriptEmail } from '@/lib/email'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateScript(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized', success: false, content: '', id: '' }
  }

  const topic = formData.get('topic') as string
  const platform = formData.get('platform') as string
  const tone = formData.get('tone') as string
  const language = formData.get('language') as string || 'English'
  const framework = formData.get('framework') as string || 'AIDA'
  const length = formData.get('length') as string
  const existingId = formData.get('id') as string

  if (!topic || !platform || !tone) {
    return { error: 'Please fill in all fields', success: false, content: '', id: '' }
  }

  const frameworkDescription = framework === 'AIDA'
    ? 'AIDA (Attention, Interest, Desire, Action)'
    : 'PAS (Problem, Agitate, Solve)'

  const systemPrompt = `You are a world-class content strategist and professional script writer. 
  You specialize in creating high-conversion, viral content for social media.
  You are fluent in multiple languages and understand cultural nuances, slang, and professional etiquette in each.
  Your goal is to write content that sounds like it was written by a native speaker.`;

  let aiPrompt = ''
  if (platform === 'LinkedIn') {
    aiPrompt = `Write a high-engaging LinkedIn post about "${topic}" entirely in the ${language} language.
    
    CRITICAL INSTRUCTIONS:
    1. Use the NATIVE SCRIPT of ${language} (e.g., Devanagari for Hindi, Tamil script for Tamil). Do NOT use English transliteration.
    2. Tone: ${tone}.
    3. Marketing Framework: ${frameworkDescription}.
    4. Structure:
       - Viral Hook (Stop the scroll)
       - Body following the ${framework} framework
       - Clear, compelling Call to Action
       - 3-5 relevant hashtags in ${language}
    
    Ensure the phrasing is natural, modern, and sounds like a native human expert in the topic.`
  } else {
    aiPrompt = `Write a comprehensive YouTube script about "${topic}" entirely in the ${language} language.
    
    CRITICAL INSTRUCTIONS:
    1. Use the NATIVE SCRIPT of ${language} (e.g., Devanagari for Hindi, Tamil script for Tamil). Do NOT use English transliteration.
    2. Tone: ${tone}.
    3. Target Duration: ${length || 'Medium'}.
    4. Marketing Framework: ${frameworkDescription}.
    5. Structure:
       - High-retention Hook
       - Engaging Intro
       - Detailed segments following the ${framework} framework
       - Outro + strong CTA
    
    Ensure the content is plausible, factually grounded, and uses authentic ${language} idioms and phrasing.`
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: aiPrompt }
      ],
      model: 'gpt-4o',
      temperature: 0.8,
    })

    const content = completion.choices[0].message.content || ''

    if (existingId && existingId !== 'undefined' && existingId !== '') {
      // Update existing
      const { error: updateError } = await supabase
        .from('scripts')
        .update({
          content,
          title: topic,
          platform,
          tone,
          language,
          framework,
          length: platform === 'YouTube' ? length : null
        })
        .eq('id', existingId)
        .eq('user_id', user.id)

      if (updateError) throw updateError

      // Send script email
      if (user.email) {
        await sendScriptEmail(user.email, topic, content)
      }

      revalidatePath('/dashboard')
      return { success: true, content, id: existingId, error: null }
    } else {
      // Create new
      const { data, error: insertError } = await supabase
        .from('scripts')
        .insert({
          user_id: user.id,
          title: topic,
          platform,
          tone,
          content,
          language,
          framework,
          length: platform === 'YouTube' ? length : null
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Send script email
      if (user.email) {
        await sendScriptEmail(user.email, topic, content)
      }

      revalidatePath('/dashboard')
      return { success: true, content, id: data.id, error: null }
    }

  } catch (error: any) {
    console.error('Error generating script:', error)
    return { error: error.message || 'Failed to generate script', success: false, content: '', id: '' }
  }
}

export async function saveScript(id: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('scripts')
    .update({ content })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/editor')
  return { success: true }
}
