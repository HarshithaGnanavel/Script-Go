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
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-indigo-500/30">
        {/* Background Gradients */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="container mx-auto px-6 py-12 max-w-4xl relative z-10">
            {/* Header */}
            <div className="mb-12 flex items-center justify-between">
                <Link href="/dashboard" className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                    <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm tracking-tight text-white/60 group-hover:text-white">Return to Studio</span>
                </Link>
                
                <form action={async () => {
                  'use server'
                  const supabase = await createClient()
                  await supabase.auth.signOut()
                  redirect('/login')
                }}>
                  <button 
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all text-sm font-bold active:scale-95"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </form>
            </div>

            {/* Profile Hero */}
            <div className="premium-card p-10 lg:p-14 rounded-[3rem] border-white/5 bg-zinc-950/40 backdrop-blur-2xl mb-10 overflow-hidden relative">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-10">
                    <div className="h-32 w-32 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-blue-600 p-1">
                        <div className="h-full w-full rounded-[2.3rem] bg-zinc-950 flex items-center justify-center">
                            <User className="w-14 h-14 text-white" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Authentic Creator</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">{user.email?.split('@')[0]}</h1>
                        <div className="flex items-center gap-3 text-zinc-500 font-medium">
                            <Mail className="w-4 h-4" />
                            {user.email}
                        </div>
                    </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 relative z-10">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col gap-3 group hover:border-indigo-500/20 transition-all">
                            <div className="flex items-center justify-between">
                                {stat.icon}
                                <ChevronRight className="w-4 h-4 text-zinc-800 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{stat.label}</p>
                                <p className="text-xl font-bold text-white">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
            </div>

            {/* Settings Sections */}
            <div className="grid grid-cols-1 gap-8">
                <div className="premium-card p-10 rounded-[3rem] border-white/5 bg-zinc-950/40 backdrop-blur-2xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Key className="w-6 h-6 text-indigo-500" />
                                Security & Access
                            </h2>
                            <p className="text-zinc-500 font-medium max-w-md">
                                Keep your creative assets secure. You can trigger a password reset flow to update your credentials.
                            </p>
                        </div>
                        
                        <ProfileClient email={user.email || ''} />
                    </div>
                </div>
            </div>

            {/* Footer Branding */}
            <div className="mt-20 text-center space-y-4">
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto" />
                <p className="text-xs font-bold text-zinc-600 uppercase tracking-[0.4em]">ScriptGo Studio Engine v2.0</p>
            </div>
        </div>
    </div>
  )
}
