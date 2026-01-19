'use client'

import { useActionState, useState, useEffect } from 'react'
import { requestPasswordReset } from '@/app/login/actions'
import { Key, Sparkles, CheckCircle2, AlertCircle, Loader2, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProfileClient({ email }: { email: string }) {
  const [state, formAction, isPending] = useActionState(
    (async (state: any, formData: FormData) => {
        return await requestPasswordReset(state, formData)
    }) as any,
    { error: null, success: null }
  )

  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (state.success || state.error) {
      setShowToast(true)
      const timer = setTimeout(() => setShowToast(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [state.success, state.error])

  return (
    <div className="relative">
      <form action={formAction}>
        <input type="hidden" name="email" value={email} />
        <button
            type="submit"
            disabled={isPending}
            className="group relative inline-flex items-center gap-3 rounded-2xl bg-white/5 border border-indigo-500/30 px-10 py-5 text-sm font-bold text-white shadow-2xl hover:bg-indigo-600 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0"
        >
            {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
                <Mail className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            )}
            {isPending ? 'Sending...' : 'Send Reset Email'}
            <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </button>
      </form>

      <AnimatePresence>
        {showToast && (state.success || state.error) && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-[2rem] border backdrop-blur-2xl shadow-2xl flex items-center gap-4 transition-all
                ${state.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}
            `}
          >
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center
                ${state.success ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}
            `}>
                {state.success ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-black uppercase tracking-widest leading-none mb-1">
                    {state.success ? 'Success' : 'Security Alert'}
                </span>
                <p className="text-xs font-bold text-white/60">{state.success || state.error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
