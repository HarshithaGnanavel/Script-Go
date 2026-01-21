import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, LogOut, Calendar, FileText, Youtube, Linkedin, User, Zap, ChevronRight } from 'lucide-react'
import ScriptGrid from './script-grid'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DashboardPage(props: { searchParams: Promise<{ new_user?: string }> }) {
  const searchParams = await props.searchParams
  const isNewUser = searchParams.new_user === 'true'
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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 relative overflow-hidden">
      {/* Background Elements - Absolute Sync with Landing Page */}
      <div className="fixed inset-0 pointer-events-none z-0 grid-pattern opacity-[0.4]"></div>
      <div className="fixed top-[-15%] right-[-10%] w-[60vw] h-[60vw] lens-flare pointer-events-none z-0 opacity-40"></div>

      {/* Premium Header - Matching Landing Page Nav */}
      <nav className="relative z-50 w-full border-b border-white/5 bg-black/40 backdrop-blur-3xl">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-24 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-5 group">
            <div className="w-9 h-9 bg-white rounded-none flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-black font-display font-bold text-lg">S</span>
            </div>
            <span className="font-display text-2xl tracking-[0.15em] font-semibold uppercase text-gradient">ScriptGo</span>
          </Link>
          
          <div className="flex items-center gap-10">
            <Link href="/planner" className="flex items-center gap-3 text-[10px] font-bold text-white/80 uppercase tracking-[0.4em] hover:text-white transition-colors">
                <Zap className="w-4 h-4" />
                Planner
            </Link>
            <Link href="/profile" className="w-12 h-12 border border-white/10 flex items-center justify-center hover:border-white transition-all bg-white/[0.02]">
                <User className="w-5 h-5 text-white/90" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 py-24 min-h-screen">
        <div className="mb-32 flex flex-col md:flex-row md:items-end justify-between gap-16">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-4 px-5 py-2 border border-white/10 bg-white/[0.02]">
                <div className="h-2 w-2 rounded-none bg-white animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/70">Dashboard</span>
            </div>
            <h1 className="text-6xl lg:text-8xl font-display font-semibold text-gradient tracking-[0.05em] leading-[0.95]">
              {isNewUser ? 'Welcome' : 'Welcome Back'}
            </h1>
            <p className="text-white/70 text-base md:text-lg font-medium max-w-3xl uppercase tracking-[0.4em] leading-relaxed">
              Manage your scripts and plan your social media content.
            </p>
          </div>
          
          <Link href="/editor">
            <button className="group relative bg-white text-black px-12 py-7 rounded-none font-bold text-[11px] uppercase tracking-[0.5em] transition-all hover:bg-silver active:scale-[0.98] cta-glow-pulse flex items-center gap-3">
              <Plus className="h-4 w-4" />
              New Script
            </button>
          </Link>
        </div>

        {/* Stats Grid - Sharp and Premium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {[
                { label: 'Total Scripts', value: scripts.length },
                { label: 'YouTube Scripts', value: scripts.filter(s => s.platform === 'YouTube').length },
                { label: 'LinkedIn Posts', value: scripts.filter(s => s.platform === 'LinkedIn').length },
            ].map((stat, i) => (
                <div key={i} className="min-h-[140px] rounded-none border border-white/10 bg-white/[0.01] p-6 flex flex-col justify-between group transition-all hover:border-white/30 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-0 bg-white group-hover:h-full transition-all duration-500" />
                    <div className="space-y-2">
                        <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.6em]">{stat.label}</p>
                        <p className="text-4xl font-display font-bold text-white group-hover:text-gradient transition-all duration-500 tracking-tighter">
                            {stat.value.toString().padStart(2, '0')}
                        </p>
                    </div>
                    <div className="flex items-center justify-between text-[8px] font-black tracking-[0.5em] text-white/30 group-hover:text-white/80 transition-colors">
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            ))}
        </div>

        <div className="space-y-12">
          <div className="flex items-center gap-6">
            <h2 className="text-xs font-black text-white uppercase tracking-[0.8em] flex items-center gap-4">
               My Scripts
            </h2>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          
          {!scripts || scripts.length === 0 ? (
            <div className="text-center py-40 border border-white/5 bg-white/[0.01] flex flex-col items-center">
              <div className="w-16 h-16 border border-white/10 rotate-45 flex items-center justify-center mb-10 group hover:border-white transition-all">
                <FileText className="h-6 w-6 text-white/60 group-hover:text-white rotate-[-45deg] transition-all" />
              </div>
              <h3 className="text-[11px] font-black text-white uppercase tracking-[0.5em] mb-4">No scripts yet</h3>
              <p className="text-white/60 text-[9px] uppercase tracking-[0.3em] mb-12">Start creating content to see it here.</p>
              <Link href="/editor">
                <button className="px-10 py-5 rounded-none border border-white/20 text-white font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">
                  Create First Script
                </button>
              </Link>
            </div>
          ) : (
            <ScriptGrid scripts={scripts} />
          )}
        </div>
      </main>
      
      {/* Footer Branding */}
      <footer className="relative z-10 py-20 border-t border-white/5 flex flex-col items-center justify-center opacity-40">
          <div className="w-8 h-8 border border-white/40 flex items-center justify-center font-display font-bold text-base mb-4">S</div>
          <span className="text-[8px] font-black uppercase tracking-[0.6em] text-white/80">ScriptGo</span>
      </footer>
    </div>
  )
}
