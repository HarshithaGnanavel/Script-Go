'use client'

import { useState, Suspense } from 'react'
import { login, signup } from './actions'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

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
    <div className="w-full max-w-md space-y-8 rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 shadow-xl backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">ScriptGo</h1>
          <p className="mt-2 text-sm text-zinc-400">
            {mode === 'login' ? 'Sign in to generate your scripts' : 'Create an account to get started'}
          </p>
        </div>

        <div className="flex rounded-md bg-zinc-950 p-1">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${
              mode === 'login' 
                ? 'bg-zinc-800 text-white shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${
              mode === 'signup' 
                ? 'bg-zinc-800 text-white shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sign Up
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-400">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-400">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={mode === 'login' ? "current-password" : "new-password"}
                  required
                  className="block w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === 'login' ? 'Sign in' : 'Sign up'}
          </button>

           {message && (
            <div className={`mt-2 text-center text-sm p-2 rounded ${
              message.includes('Check your email') 
                ? 'text-green-400 bg-green-950/20 border border-green-900/50' 
                : 'text-red-400 bg-red-950/20 border border-red-900/50'
            }`}>
              {message}
            </div>
          )}
        </form>
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
