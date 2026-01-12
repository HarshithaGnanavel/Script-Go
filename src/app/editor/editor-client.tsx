'use client'

import { useState, useEffect, useRef, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { generateScript, saveScript } from './actions' // We'll add saveScript logic inside client or import
import Link from 'next/link'
import { ArrowLeft, Copy, Save, Loader2, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

type State = {
  error: string | null
  success: boolean
  content: string
  id: string
}

const initialState: State = {
  error: null,
  success: false,
  content: '',
  id: '',
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative flex w-full items-center justify-center gap-3 rounded-xl bg-indigo-600 px-4 py-4 text-sm font-bold text-white shadow-2xl shadow-indigo-500/20 hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
    >
      {pending ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="tracking-widest uppercase text-xs">Architecting...</span>
        </>
      ) : (
        <>
          <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
          <span className="tracking-widest uppercase text-xs">Generate Script</span>
          <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </>
      )}
    </button>
  )
}

export default function EditorClient({ initialData }: { initialData: any }) {
  const [state, dispatch, isPending] = useActionState(generateScript, initialState)
  const [content, setContent] = useState(initialData?.content || '')
  const [currentId, setCurrentId] = useState(initialData?.id || '')
  const [platform, setPlatform] = useState(initialData?.platform || 'LinkedIn')
  const [isSaving, setIsSaving] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    if (initialData) {
        setContent(initialData.content || '')
        setCurrentId(initialData.id || '')
        setPlatform(initialData.platform || 'LinkedIn')
    }
  }, [initialData])

  useEffect(() => {
    if (state?.success && state?.content) {
      setContent(state.content)
      if (state.id) {
          setCurrentId(state.id)
          // Update URL without reload if it's a new script
          if (!currentId && state.id) { // Use currentId to check if it WAS a new script
              window.history.pushState(null, '', `/editor?id=${state.id}`)
          }
      }
    }
  }, [state, currentId])

  const handleCopy = async () => {
    if (!content) return
    await navigator.clipboard.writeText(content)
    // Could add toast here
  }

  const handleManualSave = async () => {
      if (!currentId) return
      setIsSaving(true)
      await saveScript(currentId, content)
      setIsSaving(false)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  return (
    <div className="flex h-screen flex-col bg-background md:flex-row overflow-hidden relative">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] -z-10 pointer-events-none" />

      {/* LEFT SIDE: Input Form */}
      <div className="w-full md:w-[350px] lg:w-[400px] border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl p-8 flex flex-col h-full overflow-y-auto z-10">
        <div className="mb-10 flex items-center gap-4">
          <Link href="/dashboard" className="group rounded-full p-2.5 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all">
            <ArrowLeft className="h-5 w-5 text-zinc-400 group-hover:text-white" />
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-xl font-bold text-white tracking-tight">Script Editor</h1>
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest leading-none flex items-center gap-2">
              AI Integration
              <Link href="/planner" className="ml-2 px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors">Planner</Link>
            </p>
          </div>
        </div>

        <form action={dispatch} className="flex-1 flex flex-col gap-8">
            <input type="hidden" name="id" value={currentId} />
            
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">
                Platform
              </label>
              <div className="relative group">
                  <select
                  name="platform"
                  defaultValue={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="flex h-12 w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer"
                  >
                  <option value="LinkedIn" className="bg-zinc-900 text-white">LinkedIn Post</option>
                  <option value="YouTube" className="bg-zinc-900 text-white">YouTube Script</option>
                  </select>
                  <div className="absolute right-4 top-3.5 pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                  </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">
                Primary Topic
              </label>
              <input
                name="topic"
                required
                defaultValue={initialData?.title || ''}
                placeholder="Ex: The Future of AI Agents..."
                className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">
                  Tone
                </label>
                 <div className="relative group">
                    <select
                    name="tone"
                    defaultValue={initialData?.tone || 'Professional'}
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer"
                    >
                    <option value="Professional" className="bg-zinc-900 text-white">Professional</option>
                    <option value="Funny" className="bg-zinc-900 text-white">Funny</option>
                    <option value="Casual" className="bg-zinc-900 text-white">Casual</option>
                    <option value="Educational" className="bg-zinc-900 text-white">Educational</option>
                    </select>
                    <div className="absolute right-4 top-3.5 pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">
                  Language
                </label>
                 <div className="relative group">
                    <select
                    name="language"
                    defaultValue={initialData?.language || 'English'}
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer"
                    >
                    <option value="English" className="bg-zinc-900 text-white">English</option>
                    <option value="Tamil" className="bg-zinc-900 text-white">Tamil</option>
                    <option value="Hindi" className="bg-zinc-900 text-white">Hindi</option>
                    <option value="Spanish" className="bg-zinc-900 text-white">Spanish</option>
                    </select>
                    <div className="absolute right-4 top-3.5 pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                         <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">
                Strategy
              </label>
               <div className="relative group">
                  <select
                  name="framework"
                  defaultValue={initialData?.framework || 'AIDA'}
                  className="flex h-12 w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer"
                  >
                  <option value="AIDA" className="bg-zinc-900 text-white">AIDA Formula</option>
                  <option value="PAS" className="bg-zinc-900 text-white">PAS Formula</option>
                  </select>
                  <div className="absolute right-4 top-3.5 pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                       <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                  </div>
              </div>
            </div>

            {platform === 'YouTube' && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">
                  Target Duration
                </label>
                 <div className="relative group">
                    <select
                    name="length"
                    defaultValue={initialData?.length || 'Medium'}
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer"
                    >
                    <option value="Short" className="bg-zinc-900 text-white">Short (~2-3 mins)</option>
                    <option value="Medium" className="bg-zinc-900 text-white">Medium (~5-8 mins)</option>
                    <option value="Long" className="bg-zinc-900 text-white">Long (~10-15 mins)</option>
                    </select>
                    <div className="absolute right-4 top-3.5 pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                         <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
              </div>
            )}
          </div>

            <div className="mt-auto pt-10">
                <SubmitButton />
                {state?.error && (
                    <p className="mt-4 text-xs text-red-400 bg-red-400/10 border border-red-400/20 p-3 rounded-lg text-center animate-in fade-in duration-300">{state.error}</p>
                )}
            </div>
        </form>
      </div>

      {/* RIGHT SIDE: Output Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#02040a]">
         <div className="h-16 border-b border-white/5 bg-zinc-950/30 backdrop-blur-md px-8 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
                <div className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Editor Workspace</div>
            </div>
            <div className="flex items-center gap-3">
                {currentId && (
                     <button 
                        onClick={handleManualSave}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />}
                        Save
                    </button>
                )}
                <button 
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
                >
                    <Copy className="w-4 h-4" />
                    Copy Result
                </button>
            </div>
         </div>
         <div className="flex-1 p-8 overflow-hidden relative">
             <div className="absolute top-8 left-8 bottom-8 w-[1px] bg-white/5 -z-0" />
             <div className="absolute top-8 right-8 bottom-8 w-[1px] bg-white/5 -z-0" />
             
             <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Script generation will begin once you click 'Generate Script'..."
                className="w-full h-full resize-none rounded-2xl border border-white/5 bg-zinc-950/20 p-8 text-zinc-200 placeholder:text-zinc-600 focus:outline-none transition-all font-mono text-[15px] leading-[1.8] scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent selection:bg-indigo-500/30"
             />
             
             {!content && !isPending && (
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none opacity-20">
                    <Sparkles className="w-16 h-16 text-indigo-500 mb-6" />
                    <p className="text-lg font-medium text-white">Your masterpiece starts here</p>
                </div>
             )}
         </div>
         
         <div className="h-8 border-t border-white/5 bg-zinc-950/30 px-8 flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-zinc-600">
            <div className="flex gap-4">
                <span>Characters: {content?.length || 0}</span>
                <span>Words: {content ? content.trim().split(/\s+/).length : 0}</span>
            </div>
            <div>AI Version: GPT-3.5-Turbo</div>
         </div>
      </div>
    </div>
  )
}
