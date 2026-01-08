'use server'

import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'
import { revalidatePath } from 'next/cache'

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
  const existingId = formData.get('id') as string

  if (!topic || !platform || !tone) {
    return { error: 'Please fill in all fields', success: false, content: '', id: '' }
  }

  let prompt = ''
  if (platform === 'LinkedIn') {
    prompt = `Write a structured LinkedIn post about "${topic}".
    Tone: ${tone}.
    Structure:
    - Hook (catchy opening)
    - Short story / insight
    - Clear CTA
    - Relevant hashtags`
  } else {
    prompt = `Write a YouTube script about "${topic}".
    Tone: ${tone}.
    Structure:
    - Hook
    - Intro
    - Main points
    - Outro + CTA`
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: 'You are a professional script writer.' }, { role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
    })

    const content = completion.choices[0].message.content || ''

    if (existingId && existingId !== 'undefined' && existingId !== '') {
      // Update existing
      const { error: updateError } = await supabase
        .from('scripts')
        .update({ content, title: topic, platform, tone })
        .eq('id', existingId)
        .eq('user_id', user.id)

      if (updateError) throw updateError

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
        })
        .select()
        .single()

      if (insertError) throw insertError

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
