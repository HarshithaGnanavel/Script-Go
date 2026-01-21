'use server'

import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'
import { revalidatePath } from 'next/cache'
import { sendScriptEmail } from '@/lib/email'
import { GoogleGenerativeAI } from '@google/generative-ai'

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL,
    "X-Title": "ScriptGo",
  }
})

// Initialize Gemini Client
const googleApiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY
const genAI = googleApiKey ? new GoogleGenerativeAI(googleApiKey) : null;

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
  const targetAudience = formData.get('audience') as string

  if (!topic || !platform || !tone) {
    return { error: 'Please fill in all fields', success: false, content: '', id: '' }
  }

  const systemPrompt = `### ROLE & OBJECTIVE 
  You are an expert Content Creator and Social Media Strategist with 10 years of experience. 
  Your goal is to write high-converting, viral content tailored to specific platforms. 
  
  ### TONE & STYLE GUIDELINES (CRITICAL) 
  1. **No Textbook Language:** Never use formal, written-style language. Use conversational, spoken dialect. 
     - If Language is **Tanglish**: Write in Tamil (using English script) mixed with English words, as spoken colloquially in sunny Chennai.
     - If Language is **Hinglish**: Write in Hindi (using English script) mixed with English words, as spoken colloquially in Mumbai/Delhi.
  2. **No Fluff:** Do not use words like "In today's digital world". Start immediately with value. 
  3. **No Meta-Labels:** Do not output headers like "Hook:", "Body:". Just write the content directly.
  `;

  let aiPrompt = ''
  if (platform === 'LinkedIn') {
    aiPrompt = `### INPUT DATA 
     - **Topic:** ${topic} 
     - **Target Audience:** ${targetAudience} 
     - **Platform:** LinkedIn Post 
     
     ### PLATFORM SPECIFIC RULES (LINKEDIN POST)
     - Structure: 1. Hook, 2. Story (Broetry style), 3. Bullet Lesson, 4. Question.
     - Tone: ${tone}, Professional but personal. No emojis in first 2 lines.

     ### GENERATE CONTENT NOW 
     Write the content for ${topic} focusing on ${targetAudience}.`

  } else if (platform === 'Instagram') {
    aiPrompt = `### INPUT DATA 
     - **Topic:** ${topic} 
     - **Target Audience:** ${targetAudience} 
     - **Platform:** Instagram Reels

     ### PLATFORM SPECIFIC RULES (INSTAGRAM REELS)
     - Structure: 1. Visual Hook, 2. Audio Hook, 3. The Meat (3 points), 4. CTA.
     - Format: Vertical video script format. 
     - Add 15-20 viral hashtags at the end.

     ### GENERATE CONTENT NOW 
     Write the content for ${topic} focusing on ${targetAudience}.`

  } else {
    aiPrompt = `### INPUT DATA 
     - **Topic:** ${topic} 
     - **Target Audience:** ${targetAudience} 
     - **Platform:** YouTube Video
      
     ### PLATFORM SPECIFIC RULES (YOUTUBE VIDEO)
     - Structure: 1. Teaser, 2. Intro, 3. Step-by-step deep dive, 4. Conclusion.
     - Tone: ${tone}, Educational and authoritative.

     ### GENERATE CONTENT NOW 
     Write the content for ${topic} focusing on ${targetAudience}.`
  }

  try {
    let content = '';

    // PRIORITIZE: Direct Google Gemini API (if key exists)
    if (genAI) {
      try {
        console.log("Attempting generation via Direct Gemini API...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(systemPrompt + "\n\n" + aiPrompt);
        content = result.response.text();
        console.log("Direct Gemini API Success");
      } catch (geminiError: any) {
        console.error("Direct Gemini API Failed:", geminiError.message);
        // Fallthrough to OpenRouter
      }
    }

    // IF Direct Gemini Failed or No Key, use OpenRouter
    if (!content) {
      try {
        let result;
        try {
          // 1. Primary: Gemini 2.0 Flash (Free)
          result = await openai.chat.completions.create({
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: aiPrompt }
            ],
            model: 'google/gemini-2.0-flash-exp:free',
          });
        } catch (e: any) {
          if (e.status === 429 || e.status === 404 || e.status === 403) {
            console.log("Primary model busy or unavailable, trying Fallback 1 (Llama 3.3 70B)...");
            try {
              // 2. Fallback 1: Llama 3.3 70B (Free) - High quality
              result = await openai.chat.completions.create({
                messages: [
                  { role: 'system', content: systemPrompt },
                  { role: 'user', content: aiPrompt }
                ],
                model: 'meta-llama/llama-3.3-70b-instruct:free',
              });
            } catch (e2: any) {
              console.log("Fallback 1 busy, trying Fallback 2 (Llama 3.2 3B)...");
              // 3. Fallback 2: Llama 3.2 3B (Free) - Fast backup
              result = await openai.chat.completions.create({
                messages: [
                  { role: 'system', content: systemPrompt },
                  { role: 'user', content: aiPrompt }
                ],
                model: 'meta-llama/llama-3.2-3b-instruct:free',
              });
            }
          } else {
            throw e;
          }
        }
        content = result?.choices[0].message.content || '';
      } catch (openRouterError) {
        console.error("OpenRouter Exhausted:", openRouterError);
        if (!genAI) {
          return { error: 'Rate Limit Exceeded. Please add a GOOGLE_API_KEY to your .env file to use the free Gemini tier.', success: false, content: '', id: '' }
        }
        throw openRouterError;
      }
    }

    if (existingId && existingId !== 'undefined' && existingId !== '') {
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
      if (user.email) await sendScriptEmail(user.email, topic, content)

      revalidatePath('/dashboard')
      return { success: true, content, id: existingId, error: null }
    } else {
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
      if (user.email) await sendScriptEmail(user.email, topic, content)

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
