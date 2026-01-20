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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="fixed inset-0 pointer-events-none z-0 grid-pattern opacity-[0.4]"></div>
        <div className="fixed top-[-15%] right-[-10%] w-[50vw] h-[50vw] lens-flare pointer-events-none z-0 opacity-40"></div>
        <div className="fixed bottom-[-15%] left-[-10%] w-[50vw] h-[50vw] lens-flare pointer-events-none z-0 opacity-20"></div>

        <div className="max-w-2xl mx-auto px-4 md:px-8 py-10 relative z-10">
            {/* Header */}
            <div className="mb-10">
                <Link href="/profile" className="group flex items-center gap-4">
                    <div className="h-9 w-9 rounded-none bg-white border border-white flex items-center justify-center group-hover:bg-[#E2E2E2] transition-all">
                        <ArrowLeft className="w-3.5 h-3.5 text-black" />
                    </div>
                    <div className="space-y-0.5">
                        <span className="block text-[10px] font-black uppercase tracking-[0.5em] text-white/40 group-hover:text-white/60 transition-colors">Back</span>
                        <span className="block font-display font-medium text-sm tracking-[0.2em] text-white uppercase">Profile</span>
                    </div>
                </Link>
            </div>

            <div className="relative p-8 lg:p-12 border border-white/5 bg-white/[0.01] backdrop-blur-3xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="mb-10 space-y-4 relative z-10">
                    <div className="inline-flex items-center gap-2.5 px-3.5 py-1 border border-white/10 bg-white/[0.02]">
                        <div className="h-1 w-1 bg-white animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Security</span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-display font-semibold tracking-[0.2em] text-gradient uppercase leading-none">
                        Change Password
                    </h1>
                    <p className="text-white/30 font-bold text-[10px] uppercase tracking-[0.2em] max-w-lg leading-relaxed">
                        Authorized update of your account security credentials.
                    </p>
                </div>

                <ChangePasswordForm />
            </div>

            {/* Footer Branding */}
            <div className="mt-16 text-center space-y-4 opacity-30">
                <div className="h-px w-24 bg-white/10 mx-auto" />
                <p className="text-[8px] font-black uppercase tracking-[0.4em]">ScriptGo_Security_Module_X2</p>
            </div>
        </div>
    </div>
  )
}
