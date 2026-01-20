'use client'

import { useActionState, useState, useEffect } from 'react'
import { changePassword, ActionState } from '@/app/login/actions'
import { KeyRound, Lock, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function ChangePasswordForm() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(
    async (prevState: ActionState, formData: FormData) => {
        return await changePassword(prevState, formData)
    },
    null
  )

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => router.push('/profile'), 3000)
      return () => clearTimeout(timer)
    }
  }, [state, router])

  return (
    <form action={formAction} className="space-y-8 relative z-10">
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 ml-1">Current Password</label>
        <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
            <input
                name="currentPassword"
                type={showCurrent ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full bg-white/[0.02] border border-white/10 rounded-none py-5 pl-14 pr-14 text-white placeholder:text-white/10 outline-none focus:border-white/30 focus:bg-white/[0.04] transition-all font-medium text-sm"
            />
            <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
            >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 ml-1">New Password</label>
        <div className="relative group">
            <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
            <input
                name="newPassword"
                type={showNew ? "text" : "password"}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full bg-white/[0.02] border border-white/10 rounded-none py-5 pl-14 pr-14 text-white placeholder:text-white/10 outline-none focus:border-white/30 focus:bg-white/[0.04] transition-all font-medium text-sm"
            />
            <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
            >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {state?.error && (
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-red-500/5 border border-red-500/20 rounded-none p-5 flex items-center gap-4 text-red-500 text-[10px] font-black uppercase tracking-[0.2em]"
            >
                <div className="h-1.5 w-1.5 bg-red-500 animate-pulse" />
                {state.error}
            </motion.div>
        )}

        {state?.success && (
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white/5 border border-white/20 rounded-none p-5 flex items-center gap-4 text-white text-[10px] font-black uppercase tracking-[0.2em]"
            >
                <div className="h-1.5 w-1.5 bg-white animate-pulse" />
                Password Updated_ Redirecting...
            </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={isPending || !!state?.success}
        className="w-full relative group bg-white text-black py-6 rounded-none font-black text-[11px] uppercase tracking-[0.5em] shadow-2xl hover:bg-[#E2E2E2] transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
      >
        <span className="relative z-10 flex items-center justify-center gap-3">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
            {isPending ? 'Processing...' : 'Update Password'}
        </span>
      </button>
    </form>
  )
}
