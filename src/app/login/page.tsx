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

      {/* Main Split Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-6xl min-h-[700px] bg-black border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        
        {/* LEFT SIDE: White Form Area */}
        <div className="w-full md:w-3/5 bg-white p-8 md:p-16 lg:p-24 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
                <header className="mb-10">
                    <h1 className="text-4xl font-bold text-black mb-4 tracking-tight">
                        {mode === 'signin' && 'Welcome Back'}
                        {mode === 'signup' && 'Join the Studio'}
                        {mode === 'forgot-password' && 'Reset Password'}
                        {mode === 'reset-password' && 'New Password'}
                    </h1>
                    <p className="text-zinc-500 font-medium">
                        {mode === 'signin' && "Ready to pick up where you left off? New to ScriptGo?"}
                        {mode === 'signup' && "Start your creative journey with us today. Already a member?"}
                        {mode === 'forgot-password' && "Enter your email to receive a reset link."}
                        {mode === 'reset-password' && "Enter your new secure password below."}
                        {' '}
                        {(mode === 'signin' || mode === 'signup') && (
                            <button 
                                onClick={() => {
                                    const newMode = mode === 'signin' ? 'signup' : 'signin'
                                    router.push(`/login?mode=${newMode}`)
                                }}
                                className="text-indigo-600 font-bold hover:underline underline-offset-4"
                            >
                                {mode === 'signin' ? 'Create an account' : 'Sign in'}
                            </button>
                        )}
                        {(mode === 'forgot-password' || mode === 'reset-password') && (
                            <button 
                                onClick={() => router.push('/login?mode=signin')}
                                className="text-indigo-600 font-bold hover:underline underline-offset-4"
                            >
                                Back to sign in
                            </button>
                        )}
                    </p>
                </header>

                <form action={formAction} className="space-y-6">
                    {(mode !== 'reset-password') && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-black uppercase tracking-widest ml-1">Work Email address</label>
                            <div className="relative group/input">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within/input:text-indigo-600 transition-colors" />
                                <input
                                  name="email"
                                  type="email"
                                  required
                                  placeholder="Provide your email address"
                                  className="w-full bg-[#f8fafc] border border-zinc-200 rounded-xl pl-12 pr-6 py-4 outline-none focus:border-indigo-600 focus:bg-white transition-all text-black font-medium placeholder:text-zinc-400"
                                />
                            </div>
                        </div>
                    )}

                    {(mode !== 'forgot-password') && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-black uppercase tracking-widest ml-1">
                                    {mode === 'reset-password' ? 'New Password' : 'Secure Password'}
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
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within/input:text-indigo-600 transition-colors" />
                                <input
                                  name="password"
                                  type="password"
                                  required
                                  placeholder="••••••••"
                                  className="w-full bg-[#f8fafc] border border-zinc-200 rounded-xl pl-12 pr-6 py-4 outline-none focus:border-indigo-600 focus:bg-white transition-all text-black font-medium placeholder:text-zinc-400"
                                />
                            </div>
                        </div>
                    )}

                    <button
                        disabled={pending}
                        type="submit"
                        className="w-full py-5 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn relative overflow-hidden flex items-center justify-center gap-3 text-sm uppercase tracking-widest mt-4"
                    >
                        {pending ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                {mode === 'signin' && 'Sign In'}
                                {mode === 'signup' && 'Sign Up'}
                                {mode === 'forgot-password' && 'Send Reset Link'}
                                {mode === 'reset-password' && 'Update Password'}
                            </>
                        )}
                    </button>


                    {state?.error && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold text-center uppercase tracking-widest"
                        >
                            {state.error}
                        </motion.div>
                    )}

                    {state?.success && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 rounded-xl bg-green-50 border border-green-100 text-green-600 text-[11px] font-bold text-center uppercase tracking-widest"
                        >
                            {state.success}
                        </motion.div>
                    )}
                </form>

            </div>
        </div>

        {/* RIGHT SIDE: Dark Brand Area */}
        <div className="hidden md:flex w-2/5 bg-[#020617] relative p-16 flex-col justify-between overflow-hidden">
            {/* Abstract Graphic mimicking the petals/glass effect */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-br from-indigo-900/40 via-transparent to-transparent rotate-45" />
                {/* Decorative Glassy Shapes */}
                <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] bg-white opacity-[0.03] rotate-12 rounded-[3rem] blur-2xl" />
                <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-indigo-500 opacity-[0.05] -rotate-12 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10">
                <Link href="/" className="flex items-center gap-3 mb-16 group">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white text-black font-black text-xl shadow-2xl group-hover:scale-110 transition-transform">
                        S
                    </div>
                    <span className="text-2xl font-black tracking-tight text-white transition-all">ScriptGo</span>
                </Link>

                <h2 className="text-4xl lg:text-5xl font-bold text-white leading-[1.15] tracking-tight">
                    Realize the potential of <span className="text-indigo-400">high-impact</span> content creation.
                </h2>
            </div>

        </div>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#020617] text-indigo-400 gap-4">
                <Loader2 className="animate-spin h-10 w-10" />
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">Initializing Workspace...</p>
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}
