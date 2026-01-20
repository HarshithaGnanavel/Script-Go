'use client'

import { useState, Suspense, useActionState } from 'react'
import { login, signup, requestPasswordReset, updatePassword } from './actions'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Mail, Lock, Sparkles, ArrowRight, Github } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = (searchParams.get('mode') as 'signin' | 'signup' | 'forgot-password' | 'reset-password') || 'signin'
  
  const [state, formAction, pending] = useActionState(
    (async (state: any, formData: FormData) => {
      switch (mode) {
        case 'signin': return await login(state, formData)
        case 'signup': return await signup(state, formData)
        case 'forgot-password': return await requestPasswordReset(state, formData)
        case 'reset-password': return await updatePassword(state, formData)
        default: return null
      }
    }) as any,
    { error: null, success: null }
  )

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 md:p-8 font-sans selection:bg-indigo-500/30">
      {/* Background Abstract Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[100px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center">
            {/* Logo */}
            <Link href="/" className="mb-8 flex items-center gap-3 group">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-black text-white font-black text-xl shadow-xl group-hover:scale-110 transition-transform">
                    S
                </div>
            </Link>

            {/* Toggle Switch */}
            {(mode === 'signin' || mode === 'signup') && (
                <div className="bg-zinc-100 p-1.5 rounded-full flex w-full max-w-[280px] mb-8 relative">
                   <div 
                      className={`absolute top-1.5 bottom-1.5 rounded-full bg-white shadow-sm transition-all duration-300 ease-out ${mode === 'signin' ? 'left-1.5 w-[calc(50%-6px)]' : 'left-[50%] w-[calc(50%-6px)]'}`}
                   />
                   <button 
                      onClick={() => router.push('/login?mode=signin')}
                      className={`relative z-10 flex-1 py-2 text-[11px] font-bold uppercase tracking-wider text-center transition-colors ${mode === 'signin' ? 'text-black' : 'text-zinc-600 hover:text-zinc-800'}`}
                   >
                     Log In
                   </button>
                   <button 
                      onClick={() => router.push('/login?mode=signup')}
                      className={`relative z-10 flex-1 py-2 text-[11px] font-bold uppercase tracking-wider text-center transition-colors ${mode === 'signup' ? 'text-black' : 'text-zinc-600 hover:text-zinc-800'}`}
                   >
                     Sign Up
                   </button>
                </div>
            )}

            <header className="w-full mb-8 text-center">
                <h1 className="text-3xl font-bold text-black mb-3 tracking-tight">
                    {mode === 'signin' && 'Welcome Back'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'forgot-password' && 'Reset Password'}
                    {mode === 'reset-password' && 'New Password'}
                </h1>
                <p className="text-zinc-600 text-sm font-medium">
                    {mode === 'signin' && "Enter your credentials to access your workspace."}
                    {mode === 'signup' && "Join the ScriptGo community today."}
                    {mode === 'forgot-password' && "Enter your email to receive a reset link."}
                    {mode === 'reset-password' && "Enter your new secure password below."}
                </p>
            </header>

            <form action={formAction} className="w-full space-y-5">
                {(mode !== 'reset-password') && (
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Work Email</label>
                        <div className="relative group/input">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within/input:text-indigo-600 transition-colors" />
                            <input
                              name="email"
                              type="email"
                              required
                              placeholder="name@company.com"
                              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-6 py-3.5 text-sm outline-none focus:border-indigo-600 focus:bg-white transition-all text-black font-medium placeholder:text-zinc-400"
                            />
                        </div>
                    </div>
                )}

                {(mode !== 'forgot-password') && (
                    <div className="space-y-2">
                         <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                                {mode === 'reset-password' ? 'New Password' : 'Password'}
                            </label>
                            {mode === 'signin' && (
                                <button 
                                    type="button"
                                    onClick={() => router.push('/login?mode=forgot-password')}
                                    className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline"
                                >
                                    Forgot?
                                </button>
                            )}
                        </div>
                        <div className="relative group/input">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within/input:text-indigo-600 transition-colors" />
                            <input
                              name="password"
                              type="password"
                              required
                              placeholder="••••••••"
                              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-6 py-3.5 text-sm outline-none focus:border-indigo-600 focus:bg-white transition-all text-black font-medium placeholder:text-zinc-400"
                            />
                        </div>
                    </div>
                )}

                <button
                    disabled={pending}
                    type="submit"
                    className="w-full py-4 rounded-xl bg-black text-white font-bold shadow-lg hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs uppercase tracking-widest mt-6"
                >
                    {pending ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            {mode === 'signin' && 'Sign In'}
                            {mode === 'signup' && 'Create Account'}
                            {mode === 'forgot-password' && 'Send Link'}
                            {mode === 'reset-password' && 'Update'}
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>

                {(mode === 'forgot-password' || mode === 'reset-password') && (
                     <button 
                        type="button"
                        onClick={() => router.push('/login?mode=signin')}
                        className="w-full text-center text-xs font-bold text-zinc-500 hover:text-black mt-4 transition-colors"
                     >
                        Back to Sign In
                     </button>
                )}

                {state?.error && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold text-center uppercase tracking-widest"
                    >
                        {state.error}
                    </motion.div>
                )}

                {state?.success && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-[10px] font-bold text-center uppercase tracking-widest"
                    >
                        {state.success}
                    </motion.div>
                )}
            </form>
        </div>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#020617] text-white gap-4">
                <Loader2 className="animate-spin h-8 w-8 text-indigo-500" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}
