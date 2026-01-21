'use client'

import { useState, useEffect, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { generateScript, saveScript } from './actions'
import Link from 'next/link'
import { ArrowLeft, Copy, Save, Loader2, Sparkles, ChevronRight } from 'lucide-react'
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
      className="group relative w-full h-[70px] flex items-center justify-center gap-4 bg-white text-black font-display font-bold text-[11px] uppercase tracking-[0.5em] transition-all hover:bg-[#E2E2E2] active:scale-[0.98] disabled:opacity-50 cta-glow-pulse"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
          <span>Generate Script</span>
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
    <div className="flex h-screen flex-col bg-black md:flex-row overflow-hidden relative font-sans text-white selection:bg-white/20">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 grid-pattern opacity-[0.4]"></div>
      <div className="fixed top-[-15%] right-[-10%] w-[50vw] h-[50vw] lens-flare pointer-events-none z-0 opacity-40"></div>

      {/* LEFT SIDE: Sidebar */}
      <div className="w-full md:w-[400px] lg:w-[480px] border-r border-white/5 bg-black/50 backdrop-blur-3xl p-12 flex flex-col h-full overflow-y-auto z-10 scrollbar-hide">
        <div className="mb-20 flex items-start gap-10">
          <Link href="/dashboard" className="group rounded-none p-4 border border-white/10 hover:border-white transition-all bg-white/[0.02]">
            <ArrowLeft className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
          </Link>
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-semibold tracking-[0.1em] uppercase text-gradient leading-none">Editor</h1>
            <div className="flex items-center gap-4">
                <Link href="/planner" className="group px-4 py-1.5 rounded-none border border-white/10 bg-white/[0.02] text-white/80 text-[9px] font-black uppercase tracking-[0.4em] hover:border-white hover:text-white transition-all flex items-center gap-2">
                    Planner <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
          </div>
        </div>

        <form action={dispatch} className="flex-1 flex flex-col gap-12">
            <input type="hidden" name="id" value={currentId} />
            
          <div className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.6em] px-1">Social Platform</label>
              <div className="relative group">
                  <select
                  name="platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="flex h-16 w-full items-center justify-between rounded-none border border-white/10 bg-white/[0.01] px-6 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white focus:outline-none focus:border-white/40 transition-all appearance-none cursor-pointer"
                  >
                  <option value="LinkedIn" className="bg-zinc-950 text-white">LinkedIn</option>
                  <option value="Instagram" className="bg-zinc-950 text-white">Instagram</option>
                  <option value="YouTube" className="bg-zinc-950 text-white">YouTube</option>
                  </select>
                  <div className="absolute right-6 top-6 pointer-events-none text-white/20 transition-colors">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                  </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.6em] px-1">Topic</label>
              <input
                name="topic"
                required
                defaultValue={initialData?.title || ''}
                placeholder="What should the script be about?"
                className="flex h-16 w-full rounded-none border border-white/10 bg-white/[0.01] px-6 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/10"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.6em] px-1">Target Audience</label>
              <input
                name="audience"
                required
                defaultValue={initialData?.audience || ''}
                placeholder="Who are you writing this for?"
                className="flex h-16 w-full rounded-none border border-white/10 bg-white/[0.01] px-6 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.6em] px-1">Tone</label>
                 <div className="relative group">
                    <select
                    name="tone"
                    defaultValue={initialData?.tone || 'Professional'}
                    className="flex h-16 w-full items-center justify-between rounded-none border border-white/10 bg-white/[0.01] px-6 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white focus:outline-none focus:border-white/40 transition-all appearance-none cursor-pointer"
                    >
                    <option value="Professional" className="bg-zinc-950 text-white">Professional</option>
                    <option value="Funny" className="bg-zinc-950 text-white">Funny</option>
                    <option value="Casual" className="bg-zinc-950 text-white">Casual</option>
                    <option value="Educational" className="bg-zinc-950 text-white">Educational</option>
                    </select>
                    <div className="absolute right-6 top-6 pointer-events-none text-white/20 transition-colors">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.6em] px-1">Language</label>
                 <div className="relative group">
                    <select
                    name="language"
                    defaultValue={initialData?.language || 'English'}
                    className="flex h-16 w-full items-center justify-between rounded-none border border-white/10 bg-white/[0.01] px-6 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white focus:outline-none focus:border-white/40 transition-all appearance-none cursor-pointer"
                    >
                    <option value="English" className="bg-zinc-950 text-white">English</option>
                    <option value="Tamil" className="bg-zinc-950 text-white">Tamil</option>
                    <option value="Hindi" className="bg-zinc-950 text-white">Hindi</option>
                    <option value="Spanish" className="bg-zinc-950 text-white">Spanish</option>
                    </select>
                    <div className="absolute right-6 top-6 pointer-events-none text-white/20 transition-colors">
                         <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
              </div>
            </div>
          </div>

            <div className="mt-auto pt-12">
                <SubmitButton />
                {state?.error && (
                    <p className="mt-6 text-[9px] text-red-500 bg-red-500/5 border border-red-500/10 p-5 rounded-none text-center font-black uppercase tracking-[0.3em]">{state.error}</p>
                )}
            </div>
        </form>
        
        {/* Logo */}
        <div className="mt-12 opacity-20 hover:opacity-100 transition-opacity">
            <div className="w-10 h-10 border border-white/40 flex items-center justify-center font-display font-bold text-lg text-white">S</div>
        </div>
      </div>

      {/* RIGHT SIDE: Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-black relative z-10">
         <div className="h-28 border-b border-white/5 bg-white/[0.01] backdrop-blur-3xl px-8 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-8">
                <div className="flex h-2.5 w-2.5 rounded-none bg-white animate-pulse" />
                <div className="text-[10px] font-display font-bold text-white uppercase tracking-[0.8em] text-gradient">Your Script</div>
            </div>
            <div className="flex items-center gap-6">
                {currentId && (
                     <button 
                        onClick={handleManualSave}
                        disabled={isSaving}
                        className="inline-flex items-center gap-4 rounded-none border border-white/10 px-10 py-4 text-[9px] font-black uppercase tracking-[0.5em] text-white/70 hover:border-white hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />}
                        Save
                    </button>
                )}
                
                <button 
                    onClick={handleCopy}
                    className="inline-flex items-center gap-4 rounded-none bg-white px-10 py-4 text-[9px] font-black uppercase tracking-[0.5em] text-black hover:bg-[#E2E2E2] transition-all active:scale-[0.98]"
                >
                    <Copy className="w-4 h-4" />
                    Copy
                </button>
            </div>
         </div>
         
         <div className="flex-1 p-8 overflow-hidden relative">
             <div className="absolute top-8 left-8 bottom-8 w-[1px] bg-white/[0.05] -z-0" />
             <div className="absolute top-8 right-8 bottom-8 w-[1px] bg-white/[0.05] -z-0" />
             
            <div className="relative w-full h-full group">
                <div className="absolute -top-4 left-6 bg-black px-6 text-[8px] font-black text-white/60 uppercase tracking-[0.8em] z-10 transition-colors group-focus-within:text-white">Draft</div>
                <textarea
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Type or generate your script here..."
                    className="w-full h-full resize-none rounded-none border border-white/10 bg-transparent p-8 text-white/90 placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all font-sans text-lg tracking-wide leading-[2] scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent selection:bg-white/20"
                />
            </div>
             
             {!content && !isPending && (
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none opacity-[0.05]">
                    <div className="w-40 h-40 border border-white/20 rotate-45 animate-[spin_20s_linear_infinite] flex items-center justify-center">
                        <Sparkles className="w-16 h-16 text-white rotate-[-45deg]" />
                    </div>
                    <p className="mt-16 text-base font-display font-bold tracking-[1.5em] uppercase text-gradient">ScriptGo</p>
                </div>
             )}
         </div>
         
         <div className="h-14 border-t border-white/5 bg-white/[0.01] px-8 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.6em] text-white/60 overflow-hidden">
            <div className="flex gap-16">
                <span className="flex items-center gap-4">Characters <span className="text-white/70">{content?.length || 0}</span></span>
                <span className="flex items-center gap-4">Words <span className="text-white/70">{content ? content.trim().split(/\s+/).length : 0}</span></span>
            </div>
         </div>
      </div>
    </div>
  )
}
