import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Lock, ShieldCheck, KeyRound } from 'lucide-react'
import ChangePasswordForm from './change-password-form'

export default async function ChangePasswordPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-indigo-500/30">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="container mx-auto px-6 py-12 max-w-2xl relative z-10">
            <div className="mb-12 flex items-center justify-between">
                <Link href="/profile" className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                    <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm tracking-tight text-white/60 group-hover:text-white">Back to Profile</span>
                </Link>
            </div>

            <div className="premium-card p-10 lg:p-14 rounded-[3rem] border-white/5 bg-zinc-950/40 backdrop-blur-2xl">
                <div className="mb-10 text-center space-y-3">
                    <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="w-8 h-8 text-indigo-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Security Update</h1>
                    <p className="text-zinc-500 font-medium">Verified update of your account credentials.</p>
                </div>

                <ChangePasswordForm />
            </div>

            <div className="mt-12 text-center text-zinc-500 text-xs font-medium space-y-2">
                <p className="flex items-center justify-center gap-2">
                    <Lock className="w-3 h-3" />
                    Secure end-to-end encryption
                </p>
                <p>ScriptGo Studio Security v2.0</p>
            </div>
        </div>
    </div>
  )
}
