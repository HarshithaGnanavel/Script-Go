import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, LogOut, Calendar, FileText, Youtube, Linkedin } from 'lucide-react'
import ScriptGrid from './script-grid'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
      redirect('/login')
  }

  const { data } = await supabase
    .from('scripts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const scripts = data || []

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Premium Header */}
      <header className="border-b border-white/5 bg-zinc-950/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3 group transition-all">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-xl shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
              S
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">ScriptGo</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/planner">
                <button className="hidden sm:flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-indigo-400 transition-colors px-4 py-2 rounded-xl hover:bg-white/5">
                    <Calendar className="w-4 h-4" />
                    Planner
                </button>
            </Link>
            <div className="h-6 w-px bg-white/10 hidden sm:block" />
            <form action={async () => {
              'use server'
              const supabase = await createClient()
              await supabase.auth.signOut()
              redirect('/login')
            }}>
              <button 
                type="submit"
                className="group flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-500 transition-all"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Personal Workspace</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Welcome Back!!
            </h1>
            <p className="text-zinc-500 text-lg font-medium max-w-2xl">
              Manage your content strategy and generate high-performing scripts for your social platforms.
            </p>
          </div>
          
          <Link href="/editor">
            <button className="group relative inline-flex items-center gap-3 rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-2xl shadow-indigo-500/20 hover:bg-indigo-500 transition-all hover:-translate-y-1 active:scale-95">
              <Plus className="h-5 w-5" />
              Create New Script
              <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
                { label: 'Total Content', value: scripts.length, icon: <FileText className="w-5 h-5" />, color: 'indigo' },
                { label: 'YouTube Assets', value: scripts.filter(s => s.platform === 'YouTube').length, icon: <Youtube className="w-5 h-5" />, color: 'red' },
                { label: 'LinkedIn Posts', value: scripts.filter(s => s.platform === 'LinkedIn').length, icon: <Linkedin className="w-5 h-5" />, color: 'blue' },
            ].map((stat, i) => (
                <div key={i} className="premium-card p-6 rounded-3xl border-white/5 flex items-center justify-between group">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-3xl font-black text-white group-hover:text-indigo-400 transition-colors">{stat.value}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500
                        ${stat.color === 'indigo' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white' : ''}
                        ${stat.color === 'red' ? 'bg-red-500/10 text-red-400 border-red-500/20 group-hover:bg-red-500 group-hover:text-white' : ''}
                        ${stat.color === 'blue' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white' : ''}
                    `}>
                        {stat.icon}
                    </div>
                </div>
            ))}
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
               <div className="h-8 w-1 bg-indigo-500 rounded-full" />
               Recent Content
            </h2>
          </div>
          
          {!scripts || scripts.length === 0 ? (
            <div className="text-center py-32 rounded-[3rem] border border-dashed border-white/10 bg-white/[0.01]">
              <div className="h-20 w-20 rounded-3xl bg-indigo-500/5 flex items-center justify-center mx-auto mb-6">
                <FileText className="h-10 w-10 text-zinc-800" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Workspace Empty</h3>
              <p className="text-zinc-500 mb-8 font-medium">Your creative journey begins with a single masterpiece.</p>
              <Link href="/editor">
                <button className="px-8 py-4 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all border border-white/10">
                  Generate Your First Script
                </button>
              </Link>
            </div>
          ) : (
            <ScriptGrid scripts={scripts} />
          )}
        </div>
      </main>
    </div>
  )
}
