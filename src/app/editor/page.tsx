import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EditorClient from './editor-client'

export const dynamic = 'force-dynamic'

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  let initialData = null

  // Await searchParams since it's a promise in Next.js 15+
  const res = await searchParams
  const id = res?.id
  
  console.log('Editor Page - Script ID:', id)

  if (id && id !== 'undefined') {
    const { data, error } = await supabase
      .from('scripts')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    
    if (error) {
        console.error('Error fetching script:', error)
    }

    if (data) {
        console.log('Script data found:', data.id)
        initialData = data
    } else {
        console.log('No script data found for ID:', id)
    }
  }

  return <EditorClient key={id || 'new'} initialData={initialData} />
}
