'use client'

import { useActionState, useState, useEffect } from 'react'
import { changePassword } from '@/app/login/actions'
import { KeyRound, Lock, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function ChangePasswordForm() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(
    (async (state: any, formData: FormData) => {
        return await changePassword(state, formData)
    }) as any,
    { error: null, success: null }
  )

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => router.push('/profile'), 3000)
      return () => clearTimeout(timer)
    }
  }, [state.success, router])

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-zinc-500 pl-4">Current Password</label>
        <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
            <input
                name="currentPassword"
                type={showCurrent ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-14 text-white placeholder:text-zinc-700 outline-none focus:border-indigo-500/50 focus:bg-black/60 transition-all font-medium"
            />
            <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
            >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-zinc-500 pl-4">New Password</label>
        <div className="relative group">
            <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
            <input
                name="newPassword"
                type={showNew ? "text" : "password"}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-14 text-white placeholder:text-zinc-700 outline-none focus:border-indigo-500/50 focus:bg-black/60 transition-all font-medium"
            />
            <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
            >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {state.error && (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-500 text-sm font-bold"
            >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {state.error}
            </motion.div>
        )}

        {state.success && (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3 text-emerald-500 text-sm font-bold"
            >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Password changed! Redirecting...
            </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={isPending || !!state.success}
        className="w-full relative group overflow-hidden rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow-2xl shadow-indigo-500/20 hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:hover:bg-indigo-600 mt-4"
      >
        <span className="relative z-10 flex items-center justify-center gap-3">
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <KeyRound className="w-5 h-5" />}
            {isPending ? 'Validating...' : 'Update Password'}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </button>
    </form>
  )
}
