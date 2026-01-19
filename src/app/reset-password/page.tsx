import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ShieldAlert, KeyRound, Lock, Sparkles } from 'lucide-react'
import ResetPasswordForm from './reset-password-form'

export default async function ResetPasswordPage() {
  // We don't need to check for a user here because Supabase sessions 
  // are often established by the link itself (via the token/code in the URL)
  
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 blur-[120px] rounded-full" />

        <div className="w-full max-w-md relative z-10">
            <div className="text-center mb-10">
                <div className="h-20 w-20 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20 mx-auto mb-6">
                    <KeyRound className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-white mb-3">New Password</h1>
                <p className="text-zinc-500 font-medium">Create a strong password for your account.</p>
            </div>

            <div className="premium-card p-10 rounded-[3rem] border-white/5 bg-zinc-950/40 backdrop-blur-2xl">
                <ResetPasswordForm />
            </div>

            <div className="mt-8 text-center flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Secure Reset Channel</span>
                </div>
                <p className="text-xs font-bold text-zinc-700 uppercase tracking-[0.4em]">ScriptGo Studio Engine</p>
            </div>
        </div>
    </div>
  )
}
