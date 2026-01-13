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
      className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-4 py-5 text-sm font-bold text-white shadow-2xi shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-[0.98]"
    >
      {pending ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="tracking-widest uppercase text-[10px]">Generating...</span>
        </>
      ) : (
        <>
          <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
          <span className="tracking-widest uppercase text-[10px]">Generate content</span>
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
          if (!currentId && state.id) {
              window.history.pushState(null, '', `/editor?id=${state.id}`)
          }
      }
    }
  }, [state, currentId])

  const handleCopy = async () => {
    if (!content) return
    await navigator.clipboard.writeText(content)
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
      {/* Decorative Professional Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-600/5 blur-[150px] -z-10 pointer-events-none" />

      {/* LEFT SIDE: Professional Sidebar */}
      <div className="w-full md:w-[380px] lg:w-[440px] border-r border-white/5 bg-zinc-950/60 backdrop-blur-3xl p-10 flex flex-col h-full overflow-y-auto z-10 scrollbar-hide">
        <div className="mb-12 flex items-center gap-5">
          <Link href="/dashboard" className="group rounded-2xl p-3 bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all">
            <ArrowLeft className="h-5 w-5 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Editor</h1>
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none">
                AI Content Engine
                </span>
                <Link href="/planner" className="px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-[9px] font-bold uppercase tracking-widest border border-indigo-500/20 hover:bg-indigo-500/20 transition-all">Planner</Link>
            </div>
          </div>
        </div>

        <form action={dispatch} className="flex-1 flex flex-col gap-10">
            <input type="hidden" name="id" value={currentId} />
            
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                Platform
              </label>
              <div className="relative group">
                  <select
                  name="platform"
                  defaultValue={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="flex h-14 w-full items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
                  >
                  <option value="LinkedIn" className="bg-zinc-900 text-white font-sans">LinkedIn Post</option>
                  <option value="YouTube" className="bg-zinc-900 text-white font-sans">YouTube Script</option>
                  </select>
                  <div className="absolute right-5 top-4.5 pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                  </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                Content Topic
              </label>
              <input
                name="topic"
                required
                defaultValue={initialData?.title || ''}
                placeholder="What are we writing about?"
                className="flex h-14 w-full rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                  Tone
                </label>
                 <div className="relative group">
                    <select
                    name="tone"
                    defaultValue={initialData?.tone || 'Professional'}
                    className="flex h-14 w-full items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
                    >
                    <option value="Professional" className="bg-zinc-900 text-white">Professional</option>
                    <option value="Funny" className="bg-zinc-900 text-white">Funny</option>
                    <option value="Casual" className="bg-zinc-900 text-white">Casual</option>
                    <option value="Educational" className="bg-zinc-900 text-white">Educational</option>
                    </select>
                    <div className="absolute right-5 top-4.5 pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                  Language
                </label>
                 <div className="relative group">
                    <select
                    name="language"
                    defaultValue={initialData?.language || 'English'}
                    className="flex h-14 w-full items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
                    >
                    <option value="English" className="bg-zinc-900 text-white font-sans">English</option>
                    <option value="Tamil" className="bg-zinc-900 text-white font-sans">Tamil</option>
                    <option value="Hindi" className="bg-zinc-900 text-white font-sans">Hindi</option>
                    <option value="Spanish" className="bg-zinc-900 text-white font-sans">Spanish</option>
                    </select>
                    <div className="absolute right-5 top-4.5 pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                         <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                Strategy Framework
              </label>
               <div className="relative group">
                  <select
                  name="framework"
                  defaultValue={initialData?.framework || 'AIDA'}
                  className="flex h-14 w-full items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
                  >
                  <option value="AIDA" className="bg-zinc-900 text-white">AIDA (Attention, Interest, Desire, Action)</option>
                  <option value="PAS" className="bg-zinc-900 text-white">PAS (Problem, Agitate, Solution)</option>
                  </select>
                  <div className="absolute right-5 top-4.5 pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                       <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                  </div>
              </div>
            </div>

            {platform === 'YouTube' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                  Target Duration
                </label>
                 <div className="relative group">
                    <select
                    name="length"
                    defaultValue={initialData?.length || 'Medium'}
                    className="flex h-14 w-full items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
                    >
                    <option value="Short" className="bg-zinc-900 text-white">Concise (~3 mins)</option>
                    <option value="Medium" className="bg-zinc-900 text-white">Standard (~8 mins)</option>
                    <option value="Long" className="bg-zinc-900 text-white">Full (~15 mins+)</option>
                    </select>
                    <div className="absolute right-5 top-4.5 pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
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
                    <p className="mt-6 text-xs text-red-500 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center font-bold animate-in fade-in duration-300">{state.error}</p>
                )}
            </div>
        </form>
      </div>

      {/* RIGHT SIDE: Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#010103]">
         <div className="h-20 border-b border-white/5 bg-zinc-950/40 backdrop-blur-3xl px-10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-5">
                <div className="flex h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Editor Workspace</div>
            </div>
            <div className="flex items-center gap-4">
                {currentId && (
                     <button 
                        onClick={handleManualSave}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-6 py-2.5 text-xs font-bold text-white hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                )}
                <button 
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/10 transition-all active:scale-95"
                >
                    <Copy className="w-4 h-4" />
                    Copy Content
                </button>
            </div>
         </div>
         <div className="flex-1 p-10 overflow-hidden relative">
             <div className="absolute top-10 left-10 bottom-10 w-[1px] bg-white/5 -z-0" />
             <div className="absolute top-10 right-10 bottom-10 w-[1px] bg-white/5 -z-0" />
             
             <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Content will appear here..."
                className="w-full h-full resize-none rounded-3xl border border-white/5 bg-zinc-950/30 p-10 text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500/20 transition-all font-sans text-[17px] leading-[1.8] scrollbar-thin scrollbar-thumb-indigo-500/10 scrollbar-track-transparent selection:bg-indigo-500/20"
             />
             
             {!content && !isPending && (
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none opacity-20">
                    <Sparkles className="w-20 h-20 text-indigo-400 mb-8 animate-pulse" />
                    <p className="text-xl font-bold tracking-widest uppercase text-white opacity-40">Create Perfection</p>
                </div>
             )}
         </div>
         
         <div className="h-10 border-t border-white/5 bg-zinc-950/40 px-10 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-zinc-600">
            <div className="flex gap-8">
                <span className="flex items-center gap-2">Characters: <span className="text-zinc-400">{content?.length || 0}</span></span>
                <span className="flex items-center gap-2">Words: <span className="text-zinc-400">{content ? content.trim().split(/\s+/).length : 0}</span></span>
            </div>
            <div className="flex items-center gap-2">
                Engine: <span className="text-indigo-400/60">ScriptGo-A1</span>
            </div>
         </div>
      </div>
    </div>
  )
}
