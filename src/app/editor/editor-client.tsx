'use client'

import { useState, useEffect, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { generateScript, saveScript } from './actions'
import Link from 'next/link'
import { ArrowLeft, Copy, Save, Loader2, Sparkles, ChevronRight, X } from 'lucide-react'
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
  
  const [topic, setTopic] = useState(initialData?.title || '')
  const [audience, setAudience] = useState(initialData?.audience || '')
  const [wordCount, setWordCount] = useState(initialData?.wordCount || '')

  const router = useRouter()

  useEffect(() => {
    if (initialData) {
        // Always sync the main content if it exists
        if (initialData.content) setContent(initialData.content)
        if (initialData.platform) setPlatform(initialData.platform)
        
        // Only overwrite form fields if we are loading a DIFFERENT script
        // This prevents wiping local state when the page refreshes/revalidates after generation
        // because "audience" and "wordCount" are not persisted in the DB currently.
        if (initialData.id !== currentId) {
            setCurrentId(initialData.id || '')
            setTopic(initialData.title || '')
            // Only set these if they exist in initialData, otherwise keep blank (or existing if we want stricter reset?)
            // For now, if switching IDs, we should probably reset them to avoid carrying over "Audience" from script A to script B
            // But since DB doesn't have them, they will come as undefined.
            setAudience(initialData.audience || '')
            setWordCount(initialData.wordCount || '')
        }
    }
  }, [initialData, currentId])

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
    <div className="flex flex-col md:flex-row min-h-dvh md:h-dvh bg-black overflow-x-hidden md:overflow-hidden relative font-sans text-white selection:bg-white/20">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 grid-pattern opacity-[0.4]"></div>
      <div className="fixed top-[-15%] right-[-10%] w-[50vw] h-[50vw] lens-flare pointer-events-none z-0 opacity-40"></div>

      {/* LEFT SIDE: Sidebar */}
      <div className="w-full md:w-[360px] lg:w-[420px] border-b md:border-b-0 md:border-r border-white/5 bg-black/50 backdrop-blur-3xl p-6 md:p-8 flex flex-col h-auto md:h-full md:overflow-y-auto z-10 scrollbar-hide shrink-0">
        <div className="mb-6 md:mb-8 flex items-center gap-6">
          <Link href="/dashboard" className="group rounded-none p-3 border border-white/10 hover:border-white transition-all bg-white/[0.02]">
            <ArrowLeft className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
          </Link>
          <div className="flex-1 flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-display font-semibold tracking-[0.1em] uppercase text-gradient leading-none">Editor</h1>
             <Link href="/planner" className="group px-3 py-1 rounded-none border border-white/10 bg-white/[0.02] text-white/80 text-[8px] font-black uppercase tracking-[0.4em] hover:border-white hover:text-white transition-all flex items-center gap-2">
                Planner <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <form action={dispatch} className="flex-1 flex flex-col gap-6 md:gap-6">
            <input type="hidden" name="id" value={currentId} />
            
          <div className="space-y-6 md:space-y-6">
            <div className="space-y-2">
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

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.6em] px-1">Topic</label>
              <div className="relative group">
                <input
                  name="topic"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="What should the script be about?"
                  className="flex h-16 w-full rounded-none border border-white/10 bg-white/[0.01] px-6 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/10"
                />
                {topic && (
                    <button 
                        type="button"
                        onClick={() => setTopic('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors p-2"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.6em] px-1">Target Audience</label>
               <div className="relative group">
                  <input
                    name="audience"
                    required
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="Who are you writing this for?"
                    className="flex h-16 w-full rounded-none border border-white/10 bg-white/[0.01] px-6 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/10"
                  />
                   {audience && (
                      <button 
                          type="button"
                          onClick={() => setAudience('')}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors p-2"
                      >
                          <X className="w-4 h-4" />
                      </button>
                  )}
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.6em] px-1">Tone</label>
                 <div className="relative group">
                    <select
                    name="tone"
                    defaultValue={initialData?.tone || 'Professional'}
                    className="flex h-16 w-full items-center justify-between rounded-none border border-white/10 bg-white/[0.01] px-4 md:px-6 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white focus:outline-none focus:border-white/40 transition-all appearance-none cursor-pointer"
                    >
                    <option value="Professional" className="bg-zinc-950 text-white">Professional</option>
                    <option value="Funny" className="bg-zinc-950 text-white">Funny</option>
                    <option value="Casual" className="bg-zinc-950 text-white">Casual</option>
                    <option value="Educational" className="bg-zinc-950 text-white">Educational</option>
                    </select>
                    <div className="absolute right-4 md:right-6 top-6 pointer-events-none text-white/20 transition-colors">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.6em] px-1">Language</label>
                 <div className="relative group">
                    <select
                    name="language"
                    defaultValue={initialData?.language || 'English'}
                    className="flex h-16 w-full items-center justify-between rounded-none border border-white/10 bg-white/[0.01] px-4 md:px-6 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white focus:outline-none focus:border-white/40 transition-all appearance-none cursor-pointer"
                    >
                    <option value="English" className="bg-zinc-950 text-white">English</option>
                    <option value="Tamil" className="bg-zinc-950 text-white">Tamil</option>
                    <option value="Tanglish" className="bg-zinc-950 text-white">Tanglish</option>
                    <option value="Hindi" className="bg-zinc-950 text-white">Hindi</option>
                    <option value="Hinglish" className="bg-zinc-950 text-white">Hinglish</option>
                    <option value="Spanish" className="bg-zinc-950 text-white">Spanish</option>
                    </select>
                    <div className="absolute right-4 md:right-6 top-6 pointer-events-none text-white/20 transition-colors">
                         <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
              </div>
            </div>
          </div>

            <div className="grid grid-cols-2 gap-4 md:gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.6em] px-1">Word Count</label>
                 <div className="relative group">
                    <input
                      name="wordCount"
                      type="number"
                      value={wordCount}
                      onChange={(e) => setWordCount(e.target.value)}
                      placeholder="e.g. 300"
                      className="flex h-16 w-full rounded-none border border-white/10 bg-white/[0.01] px-6 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/10"
                    />
                     {wordCount && (
                      <button 
                          type="button"
                          onClick={() => setWordCount('')}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors p-2"
                      >
                          <X className="w-4 h-4" />
                      </button>
                  )}
                </div>
              </div>

               <div className="space-y-2">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.6em] px-1">Visuals</label>
                <div className="flex h-16 w-full items-center rounded-none border border-white/10 bg-white/[0.01] px-6 transition-all hover:bg-white/[0.03]">
                   <label className="flex items-center gap-4 cursor-pointer w-full h-full">
                      <input 
                        type="checkbox" 
                        name="includeVisuals" 
                        defaultChecked={initialData?.includeVisuals || false}
                        className="w-4 h-4 rounded-none border-white/20 bg-black checked:bg-white checked:text-black focus:ring-0 focus:ring-offset-0 transition-all"
                      />
                      <span className="text-[11px] font-black text-white/80 uppercase tracking-[0.2em] select-none">Add Image Prompts</span>
                   </label>
                </div>
              </div>
            </div>


            <div className="mt-8 md:mt-auto pt-4 md:pt-12 pb-8 md:pb-0">
                <SubmitButton />
                {state?.error && (
                    <p className="mt-6 text-[9px] text-red-500 bg-red-500/5 border border-red-500/10 p-5 rounded-none text-center font-black uppercase tracking-[0.3em]">{state.error}</p>
                )}
            </div>
        </form>
        
        {/* Logo */}
        <div className="hidden md:flex mt-8 opacity-20 hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 border border-white/40 flex items-center justify-center font-display font-bold text-base text-white">S</div>
        </div>
      </div>

      {/* RIGHT SIDE: Content Area */}
      <div className="flex-1 flex flex-col h-[80dvh] md:h-full overflow-hidden bg-black relative z-10 border-t md:border-t-0 border-white/5">
         <div className="h-20 md:h-28 border-b border-white/5 bg-white/[0.01] backdrop-blur-3xl px-4 md:px-8 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4 md:gap-8">
                <div className="flex h-2.5 w-2.5 rounded-none bg-white animate-pulse" />
                <div className="text-[10px] font-display font-bold text-white uppercase tracking-[0.8em] text-gradient">Your Script</div>
            </div>
            <div className="flex items-center gap-3 md:gap-6">
                {currentId && (
                     <button 
                        onClick={handleManualSave}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 md:gap-4 rounded-none border border-white/10 px-6 md:px-10 py-3 md:py-4 text-[9px] font-black uppercase tracking-[0.5em] text-white/70 hover:border-white hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-3 h-3 md:w-4 md:h-4" />}
                        <span className="hidden sm:inline">Save</span>
                    </button>
                )}
                
                <button 
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 md:gap-4 rounded-none bg-white px-6 md:px-10 py-3 md:py-4 text-[9px] font-black uppercase tracking-[0.5em] text-black hover:bg-[#E2E2E2] transition-all active:scale-[0.98]"
                >
                    <Copy className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Copy</span>
                </button>
            </div>
         </div>
         
         <div className="flex-1 p-4 md:p-8 overflow-hidden relative">
             <div className="absolute top-8 left-8 bottom-8 w-[1px] bg-white/[0.05] -z-0 hidden md:block" />
             <div className="absolute top-8 right-8 bottom-8 w-[1px] bg-white/[0.05] -z-0 hidden md:block" />
             
            <div className="relative w-full h-full group">
                <div className="absolute -top-4 left-2 md:left-6 bg-black px-2 md:px-6 text-[8px] font-black text-white/60 uppercase tracking-[0.8em] z-10 transition-colors group-focus-within:text-white">Draft</div>
                <textarea
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Type or generate your script here..."
                    className="w-full h-full resize-none rounded-none border border-white/10 bg-transparent p-4 md:p-8 text-white/90 placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all font-sans text-base md:text-lg tracking-wide leading-[1.8] md:leading-[2] scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent selection:bg-white/20"
                />
            </div>
             
             {!content && !isPending && (
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none opacity-[0.05]">
                    <div className="w-32 h-32 md:w-40 md:h-40 border border-white/20 rotate-45 animate-[spin_20s_linear_infinite] flex items-center justify-center">
                        <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-white rotate-[-45deg]" />
                    </div>
                    <p className="mt-12 md:mt-16 text-sm md:text-base font-display font-bold tracking-[1.5em] uppercase text-gradient">ScriptGo</p>
                </div>
             )}
         </div>
         
         <div className="h-14 border-t border-white/5 bg-white/[0.01] px-4 md:px-8 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.6em] text-white/60 overflow-hidden">
            <div className="flex gap-8 md:gap-16">
                <span className="flex items-center gap-2 md:gap-4">Char <span className="text-white/70">{content?.length || 0}</span></span>
                <span className="flex items-center gap-2 md:gap-4">Words <span className="text-white/70">{content ? content.trim().split(/\s+/).length : 0}</span></span>
            </div>
         </div>
      </div>
    </div>
  )
}
