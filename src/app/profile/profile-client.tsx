'use client'

import { useActionState, useState, useEffect } from 'react'
import { requestPasswordReset, ActionState } from '@/app/login/actions'
import { CheckCircle2, AlertCircle, Loader2, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProfileClient({ email }: { email: string }) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: ActionState, formData: FormData) => {
        return await requestPasswordReset(prevState, formData)
    },
    null
  )

  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (state?.success || state?.error) {
      setShowToast(true)
      const timer = setTimeout(() => setShowToast(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [state])

  return (
    <div className="relative">
      <form action={formAction}>
        <input type="hidden" name="email" value={email} />
        <button
            type="submit"
            disabled={isPending}
            className="group relative inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-none font-bold text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-[#E2E2E2] transition-all active:scale-[0.98] disabled:opacity-50"
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Mail className="h-4 w-4" />
            )}
            {isPending ? 'Processing...' : 'Send Reset Link'}
        </button>
      </form>
 
      <AnimatePresence>
        {showToast && state && (state.success || state.error) && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`fixed bottom-12 right-12 z-[100] px-8 py-6 rounded-none border backdrop-blur-3xl shadow-2xl flex items-center gap-6 transition-all min-w-[320px]
                ${state.success ? 'border-white/20 bg-black' : 'border-red-500/20 bg-black'}
            `}
          >
            <div className={`h-1.5 w-1.5 animate-pulse
                ${state.success ? 'bg-white' : 'bg-red-500'}
            `} />
            <div className="flex flex-col gap-1">
                <span className={`text-[11px] font-black uppercase tracking-[0.5em]
                    ${state.success ? 'text-white' : 'text-red-500'}
                `}>
                    {state.success ? 'Success' : 'Error'}
                </span>
                <p className="text-[12px] font-bold text-white/40 uppercase tracking-[0.2em] leading-relaxed">{state.success || state.error}</p>
            </div>
            <div className="absolute top-0 right-0 p-2 opacity-10">
                 <div className="text-[9px] font-black uppercase tracking-widest">V2.5</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
