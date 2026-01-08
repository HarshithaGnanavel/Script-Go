import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EditorClient from './editor-client'

export default async function EditorPage({
  searchParams,
}: {
  searchParams: { id?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  let initialData = null

  if (searchParams.id) {
    const { data } = await supabase
      .from('scripts')
      .select('*')
      .eq('id', searchParams.id)
      .eq('user_id', user.id)
      .single()
    
    if (data) initialData = data
  }

  return <EditorClient initialData={initialData} />
}
