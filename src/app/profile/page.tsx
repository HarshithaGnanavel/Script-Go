import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Mail, Shield, Calendar, FileText, ChevronRight, Key, LogOut } from 'lucide-react'
import { requestPasswordReset } from '@/app/login/actions'
import ProfileClient from './profile-client'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { count } = await supabase
    .from('scripts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const stats = [
    { label: 'Total Scripts', value: count || 0, icon: <FileText className="w-5 h-5 text-indigo-400" /> },
    { label: 'Member Since', value: new Date(user.created_at).toLocaleDateString(), icon: <Calendar className="w-5 h-5 text-indigo-400" /> },
    { label: 'Account Type', value: 'Pro Creator', icon: <Shield className="w-5 h-5 text-indigo-400" /> },
  ]

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 relative overflow-hidden">
        {/* Background Elements - Absolute Sync with Landing Page */}
        <div className="fixed inset-0 pointer-events-none z-0 grid-pattern opacity-[0.4]"></div>
        <div className="fixed top-[-15%] right-[-10%] w-[50vw] h-[50vw] lens-flare pointer-events-none z-0 opacity-40"></div>
        <div className="fixed bottom-[-15%] left-[-10%] w-[50vw] h-[50vw] lens-flare pointer-events-none z-0 opacity-20"></div>

        <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 relative z-10">
            {/* Header */}
            <div className="mb-10 flex items-center justify-between">
                <Link href="/dashboard" className="group flex items-center gap-4">
                    <div className="h-9 w-9 rounded-none bg-white border border-white flex items-center justify-center group-hover:bg-[#E2E2E2] transition-all">
                        <ArrowLeft className="w-3.5 h-3.5 text-black" />
                    </div>
                    <div className="space-y-0.5">
                        <span className="block text-[9px] font-black uppercase tracking-[0.5em] text-white/40 group-hover:text-white/60 transition-colors">Return</span>
                        <span className="block font-display font-medium text-sm tracking-[0.2em] text-white uppercase">Profile</span>
                    </div>
                </Link>
                
                <form action={async () => {
                  'use server'
                  const supabase = await createClient()
                  await supabase.auth.signOut()
                  redirect('/login')
                }}>
                  <button 
                    type="submit"
                    className="flex items-center gap-2.5 px-6 py-2.5 rounded-none border border-white/10 bg-white/[0.02] text-white/50 hover:border-red-500/50 hover:text-red-500 hover:bg-red-500/5 transition-all text-[10px] font-black uppercase tracking-[0.5em] active:scale-95"
                  >
                    <LogOut className="w-3 h-3" />
                    Sign Out
                  </button>
                </form>
            </div>

            {/* Profile Hero */}
            <div className="relative p-8 lg:p-12 border border-white/5 bg-white/[0.01] backdrop-blur-3xl mb-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-10">
                    <div className="h-28 w-28 rounded-none border border-white/10 p-1 bg-white/[0.01]">
                        <div className="h-full w-full rounded-none bg-zinc-900/50 flex items-center justify-center border border-white/5">
                            <User className="w-10 h-10 text-white/10" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2.5 px-3.5 py-1 border border-white/10 bg-white/[0.02]">
                            <div className="h-1 w-1 bg-white animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Identity_Matrix</span>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-display font-semibold tracking-[0.2em] text-gradient uppercase leading-none">
                            {user.email?.split('@')[0]}
                        </h1>
                        <div className="flex items-center gap-2.5 text-white/30 font-bold text-[10px] uppercase tracking-[0.3em]">
                            <Mail className="w-3 h-3" />
                            {user.email}
                        </div>
                    </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 relative z-10">
                    {[
                        { label: 'Total Scripts', value: count || 0, detail: 'DATABASE_LOAD' },
                        { label: 'Member Since', value: new Date(user.created_at).toLocaleDateString(), detail: 'ENTRY_LOG' },
                    ].map((stat, i) => (
                        <div key={i} className="min-h-[140px] rounded-none border border-white/10 bg-white/[0.01] p-6 flex flex-col justify-between group transition-all hover:border-white/30 backdrop-blur-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-0 bg-white group-hover:h-full transition-all duration-500" />
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">{stat.label}</p>
                                <p className="text-2xl font-display font-bold text-white group-hover:text-gradient transition-all duration-500 tracking-[0.2em]">
                                    {typeof stat.value === 'number' ? stat.value.toString().padStart(2, '0') : stat.value}
                                </p>
                            </div>
                            <div className="flex items-center justify-between text-[9px] font-black tracking-[0.3em] text-white/20 group-hover:text-white/60 transition-colors uppercase">
                                <span>{stat.detail} // ANALYTICS</span>
                                <ChevronRight className="w-2.5 h-2.5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Settings Sections */}
            <div className="grid grid-cols-1 gap-6">
                <div className="relative p-8 rounded-none border border-white/5 bg-white/[0.01] backdrop-blur-3xl overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5" />
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                        <div className="space-y-2.5">
                            <h2 className="text-xl font-display font-semibold text-white uppercase tracking-[0.2em] flex items-center gap-4">
                                <Key className="w-5 h-5 text-white/30" />
                                Security & Access
                            </h2>
                            <p className="text-white/30 font-bold text-[11px] uppercase tracking-[0.15em] max-w-lg leading-relaxed">
                                Maintain absolute control over your profile's security layer. Rotate access keys or initialize password recovery protocols below.
                            </p>
                        </div>
                        
                        <ProfileClient email={user.email || ''} />
                    </div>
                </div>
            </div>

            {/* Footer Branding */}
            <div className="mt-24 text-center space-y-6">
                <div className="h-px w-48 bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto" />
                <p className="text-[8px] font-black text-white/15 uppercase tracking-[0.8em]">ScriptGo_Core_V2.5_Stable</p>
            </div>
        </div>
    </div>
  )
}
