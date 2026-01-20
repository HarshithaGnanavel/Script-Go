'use server'

import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'
import { revalidatePath } from 'next/cache'

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL,
    "X-Title": "ScriptGo",
  }
})

export async function generatePlannerScripts(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized', success: false }
  }

  const topic = formData.get('topic') as string
  const platform = formData.get('platform') as string
  const tone = formData.get('tone') as string
  const language = formData.get('language') as string || 'English'
  const framework = formData.get('framework') as string || 'AIDA'
  const length = formData.get('length') as string
  const days = parseInt(formData.get('days') as string) || 7
  const startDateStr = formData.get('startDate') as string

  if (!topic || !platform || !tone || !startDateStr) {
    return { error: 'Please fill in all fields', success: false }
  }

  const startDate = new Date(startDateStr)

  const systemPrompt = `You are a world-class content strategist and professional script writer. 
  You specialize in creating high-conversion, viral content calendars for social media.
  You speak native-level ${language} and specialize in the ${framework} marketing framework.`;

  const aiPrompt = `Generate a ${days}-day content calendar about "${topic}" for ${platform}.
  Tone: ${tone}.
  Marketing Framework: ${framework}.
  Language: ${language}.
  Target Duration/Length: ${platform === 'YouTube' ? length : 'Standard post length'}.

  For each day, provide:
  1. A compelling Title
  2. A full script/post content that follows the ${framework} framework and matches the ${tone} tone perfectly.
  
  Format the output as a JSON object with a "scripts" key containing an array of objects.
  Each object in the array should have: "day" (1 to ${days}), "title", and "content".
  Return ONLY the raw JSON object.`;

  console.log('Generating planner scripts for:', { topic, days, platform });

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
        response_format: { type: 'json_object' },
      });
    } catch (e: any) {
      if (e.status === 429 || e.status === 404) {
        console.log("Primary model busy in Planner, trying Fallback 1 (Gemini 1.5 Flash)...");
        try {
          // 2. Fallback 1: Gemini 1.5 Flash (Free)
          result = await openai.chat.completions.create({
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: aiPrompt }
            ],
            model: 'google/gemini-flash-1.5-exp:free',
            response_format: { type: 'json_object' },
          });
        } catch (e2: any) {
          console.log("Fallback 1 busy in Planner, trying Fallback 2 (Llama 3.1 8B)...");
          // 3. Fallback 2: Llama 3.1 8B (Free)
          // Note: Llama 3.1 8B might not support strict JSON mode, so we append instruction
          result = await openai.chat.completions.create({
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: aiPrompt + " Return ONLY the raw JSON object." }
            ],
            model: 'meta-llama/llama-3.1-8b-instruct:free',
          });
        }
      } else {
        throw e;
      }
    }

    const rawResponse = result.choices[0].message.content || ''
    console.log('AI Response received');

    let data;
    try {
      // Clean up potential markdown code blocks if the model didn't follow JSON mode
      const cleanJson = rawResponse.replace(/```json\n?|```/g, '').trim();
      data = JSON.parse(cleanJson);
    } catch (e) {
      console.error('JSON Parse Error:', e, rawResponse);
      throw new Error('Failed to parse AI response as JSON');
    }

    const scriptArray = data.scripts || (Array.isArray(data) ? data : []);

    if (!Array.isArray(scriptArray) || scriptArray.length === 0) {
      console.error('Invalid script array:', scriptArray);
      throw new Error('AI did not return any scripts. Try a more specific topic.');
    }

    console.log(`Found ${scriptArray.length} scripts. Inserting into DB...`);

    // Insert scripts into database
    const scriptsToInsert = scriptArray.map((s: any, index: number) => {
      const scheduledDate = new Date(startDate);
      scheduledDate.setDate(startDate.getDate() + index);

      return {
        user_id: user.id,
        title: s.title || `${topic} - Day ${index + 1}`,
        platform,
        tone,
        content: s.content || '',
        language,
        framework,
        length: platform === 'YouTube' ? length : null,
        scheduled_date: scheduledDate.toISOString().split('T')[0]
      };
    });

    const { error: insertError } = await supabase
      .from('scripts')
      .insert(scriptsToInsert);

    if (insertError) {
      console.error('DB Insert Error:', insertError);
      throw insertError;
    }

    console.log('Successfully inserted scripts');
    revalidatePath('/planner');
    revalidatePath('/dashboard');

    return { success: true, count: scriptsToInsert.length };

  } catch (error: any) {
    console.error('Error generating multi-day scripts:', error);
    return { error: error.message || 'Failed to generate scripts', success: false };
  }
}
