import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PlannerClient from './planner-client'

export const dynamic = 'force-dynamic'

export default async function PlannerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch scripts that have a scheduled_date
  const { data: scripts, error } = await supabase
    .from('scripts')
    .select('*')
    .eq('user_id', user.id)
    .not('scheduled_date', 'is', null)
    .order('scheduled_date', { ascending: true })

  if (error) {
    console.error('Error fetching planned scripts:', error)
  }

  return <PlannerClient initialScripts={scripts || []} userEmail={user.email!} />
}
