import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, LogOut, Sparkles } from 'lucide-react'
import ScriptGrid from './script-grid'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
      redirect('/login')
  }

  const { data: scripts } = await supabase
    .from('scripts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const signOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3 group cursor-pointer">
             <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform">
               S
             </div>
             <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent group-hover:to-white transition-all">
               ScriptGo
             </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm text-zinc-400 font-medium hidden sm:inline-block hover:text-white transition-colors cursor-default">{user.email}</span>
             <form action={signOut}>
              <button className="text-sm text-zinc-400 hover:text-white transition-all flex items-center gap-2 hover:bg-white/5 px-4 py-2 rounded-lg border border-transparent hover:border-white/10">
                  <LogOut className="w-4 h-4" />
                  Sign out
              </button>
             </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Your <span className="text-indigo-500">Workspace</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
              Create, manage and refine your AI-powered scripts for social growth.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/planner">
              <button className="group relative inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:-translate-y-0.5 active:translate-y-0">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                Plan Multi-Day Content
              </button>
            </Link>
             <Link href="/editor">
              <button className="group relative inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-2xl shadow-indigo-500/20 hover:bg-indigo-500 transition-all hover:-translate-y-0.5 active:translate-y-0">
                <Plus className="h-5 w-5" />
                Create New Script
                <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </button>
            </Link>
          </div>
        </div>

        {!scripts || scripts.length === 0 ? (
          <div className="relative overflow-hidden flex flex-col items-center justify-center rounded-2xl border border-white/10 p-16 text-center bg-zinc-900/40 backdrop-blur-sm group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-500/10 mb-6 group-hover:scale-110 transition-transform duration-500">
                <Sparkles className="h-10 w-10 text-indigo-400" />
            </div>
            <h3 className="relative text-2xl font-bold text-white mb-2">Ready to grow?</h3>
            <p className="relative mt-1 text-zinc-400 max-w-md mx-auto leading-relaxed">
              You haven't generated any scripts yet. Start your journey by creating a highly engaging script for YouTube or LinkedIn.
            </p>
             <Link href="/editor" className="relative mt-8">
                <span className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors text-base font-semibold">
                  Generate your first script 
                  <Plus className="w-4 h-4" />
                </span>
             </Link>
          </div>
        ) : (
          <div className="space-y-16">
            {/* One-off / Individual Scripts */}
            {scripts.filter(s => !s.scheduled_date).length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/5" />
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">Individual Scripts</h2>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <ScriptGrid scripts={scripts.filter(s => !s.scheduled_date)} />
              </section>
            )}

            {/* Planned / Multi-day Scripts */}
            {scripts.filter(s => s.scheduled_date).length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/5" />
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-500/70">Planned Campaigns</h2>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <ScriptGrid scripts={scripts.filter(s => s.scheduled_date)} />
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
