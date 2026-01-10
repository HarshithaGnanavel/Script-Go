'use client'

import { useState, Suspense } from 'react'
import { login, signup } from './actions'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Sparkles } from 'lucide-react'

function LoginForm() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    const formData = new FormData(event.currentTarget)
    
    if (mode === 'login') {
      await login(formData)
    } else {
      await signup(formData)
    }
    setIsLoading(false)
  }

  return (
    <div className="relative w-full max-w-md">
        {/* Animated Background Elements */}
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-600/20 blur-[80px] animate-pulse" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-purple-600/20 blur-[80px] animate-pulse delay-700" />

        <div className="relative glass-card rounded-3xl p-10 shadow-3xl overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <div className="text-center mb-10">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xl mb-4 shadow-xl shadow-indigo-500/20">S</div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">ScriptGo</h1>
              <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                {mode === 'login' ? 'Welcome back. Let\'s get writing.' : 'Start your journey to viral content.'}
              </p>
            </div>

            <div className="flex rounded-xl bg-black/40 p-1 mb-8 border border-white/5">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                  mode === 'login' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                  mode === 'signup' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Sign Up
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                    Email Repository
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                    placeholder="name@company.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                    Secret Key
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={mode === 'login' ? "current-password" : "new-password"}
                    required
                    className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-2xl shadow-indigo-500/20 hover:bg-indigo-500 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        {mode === 'login' ? 'Initialize Session' : 'Create Account'}
                        <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </>
                )}
              </button>

               {message && (
                <div className={`mt-6 text-center text-xs font-semibold p-3 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 ${
                  message.includes('Check your email') 
                    ? 'text-green-400 bg-green-500/10 border-green-500/20' 
                    : 'text-red-400 bg-red-500/10 border-red-500/20'
                }`}>
                  {message}
                </div>
              )}
            </form>
            
            <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-600">
                    Trusted by 5,000+ Creators
                </p>
            </div>
        </div>
    </div>
  )
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    )
}
