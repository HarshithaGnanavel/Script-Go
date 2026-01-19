'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

import { sendScriptEmail } from '@/lib/email'

export async function deleteScript(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('scripts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function sendSelectedScripts(ids: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email) {
    return { error: 'Unauthorized' }
  }

  const { data: scripts, error } = await supabase
    .from('scripts')
    .select('title, content')
    .in('id', ids)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  if (!scripts || scripts.length === 0) {
    return { error: 'No scripts found' }
  }

  try {
    for (const script of scripts) {
      await sendScriptEmail(user.email, script.title, script.content)
    }
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to send emails' }
  }
}

export async function deleteMultipleScripts(ids: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('scripts')
    .delete()
    .in('id', ids)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
