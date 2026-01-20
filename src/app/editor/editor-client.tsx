'use client'

import { useState, useEffect, useRef, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { generateScript, saveScript } from './actions'
import Link from 'next/link'
import { ArrowLeft, Copy, Save, Loader2, Sparkles, Image as ImageIcon, Zap, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

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
          <span>Syncing...</span>
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
          <span>Execute Protocol</span>
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
  const [showVisuals, setShowVisuals] = useState(false)
  
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

  const extractVisuals = (text: string) => {
    // Robust regex to handle escaping from LLM like \[IMAGE\_PROMPT: ... \]
    const regex = /(?:\\?\[)IMAGE(?:\\?\_)PROMPT:\s*(.*?)(?:\\?\])/g;
    const prompts = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      prompts.push(match[1]);
    }
    return prompts;
  };

  const visuals = extractVisuals(content);

  return (
    <div className="flex h-screen flex-col bg-black md:flex-row overflow-hidden relative font-sans text-white selection:bg-white/20">
      {/* Background Elements - Absolute Sync with Landing Page */}
      <div className="fixed inset-0 pointer-events-none z-0 grid-pattern opacity-[0.4]"></div>
      <div className="fixed top-[-15%] right-[-10%] w-[50vw] h-[50vw] lens-flare pointer-events-none z-0 opacity-40"></div>

      {/* LEFT SIDE: Cockpit Sidebar */}
      <div className="w-full md:w-[400px] lg:w-[480px] border-r border-white/5 bg-black/50 backdrop-blur-3xl p-12 flex flex-col h-full overflow-y-auto z-10 scrollbar-hide">
        <div className="mb-20 flex items-start gap-10">
          <Link href="/dashboard" className="group rounded-none p-4 border border-white/10 hover:border-white transition-all bg-white/[0.02]">
            <ArrowLeft className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
          </Link>
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-semibold tracking-[0.1em] uppercase text-gradient leading-none">Editor</h1>
            <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.5em]">Module_01</span>
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
              <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.6em] px-1">Network Protocol</label>
              <div className="relative group">
                  <select
                  name="platform"
                  defaultValue={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="flex h-16 w-full items-center justify-between rounded-none border border-white/10 bg-white/[0.01] px-6 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white focus:outline-none focus:border-white/40 transition-all appearance-none cursor-pointer"
                  >
                  <option value="LinkedIn" className="bg-zinc-950 text-white">LinkedIn Intel</option>
                  <option value="Instagram" className="bg-zinc-950 text-white">Instagram Burst</option>
                  <option value="YouTube" className="bg-zinc-950 text-white">YouTube Stream</option>
                  </select>
                  <div className="absolute right-6 top-6 pointer-events-none text-white/20 transition-colors">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                  </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.6em] px-1">Content Vector</label>
              <input
                name="topic"
                required
                defaultValue={initialData?.title || ''}
                placeholder="DEFINE TOPIC..."
                className="flex h-16 w-full rounded-none border border-white/10 bg-white/[0.01] px-6 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/10"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.6em] px-1">Target Persona</label>
              <input
                name="audience"
                required
                defaultValue={initialData?.audience || ''}
                placeholder="ID PERSONA..."
                className="flex h-16 w-full rounded-none border border-white/10 bg-white/[0.01] px-6 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.6em] px-1">Vibe</label>
                 <div className="relative group">
                    <select
                    name="tone"
                    defaultValue={initialData?.tone || 'Professional'}
                    className="flex h-16 w-full items-center justify-between rounded-none border border-white/10 bg-white/[0.01] px-6 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white focus:outline-none focus:border-white/40 transition-all appearance-none cursor-pointer"
                    >
                    <option value="Professional" className="bg-zinc-950 text-white">PRO</option>
                    <option value="Funny" className="bg-zinc-950 text-white">SHARP</option>
                    <option value="Casual" className="bg-zinc-950 text-white">CHILL</option>
                    <option value="Educational" className="bg-zinc-950 text-white">DEEP</option>
                    </select>
                    <div className="absolute right-6 top-6 pointer-events-none text-white/20 transition-colors">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.6em] px-1">Locale</label>
                 <div className="relative group">
                    <select
                    name="language"
                    defaultValue={initialData?.language || 'English'}
                    className="flex h-16 w-full items-center justify-between rounded-none border border-white/10 bg-white/[0.01] px-6 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white focus:outline-none focus:border-white/40 transition-all appearance-none cursor-pointer"
                    >
                    <option value="English" className="bg-zinc-950 text-white">EN</option>
                    <option value="Tamil" className="bg-zinc-950 text-white">TM</option>
                    <option value="Hindi" className="bg-zinc-950 text-white">HI</option>
                    <option value="Spanish" className="bg-zinc-950 text-white">ES</option>
                    </select>
                    <div className="absolute right-6 top-6 pointer-events-none text-white/20 transition-colors">
                         <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
              </div>
            </div>

            {(platform === 'Instagram' || platform === 'LinkedIn') && (
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.6em] px-1">Visual Array</label>
                 <div className="flex h-16 w-full items-center gap-6 rounded-none border border-white/10 bg-white/[0.01] px-6 py-2 transition-all">
                      <div className="relative flex items-center">
                        <input 
                            type="checkbox" 
                            name="includeVisuals" 
                            id="includeVisuals"
                            defaultChecked
                            className="peer h-6 w-6 cursor-pointer appearance-none rounded-none border border-white/20 bg-transparent checked:border-white transition-all focus:ring-0" 
                        />
                         <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-opacity" viewBox="0 0 14 14" fill="none">
                            <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                         </svg>
                      </div>
                      <label htmlFor="includeVisuals" className="text-[10px] text-white/90 font-black uppercase tracking-[0.5em] cursor-pointer select-none">
                          Render Visual Scenes
                      </label>
                </div>
              </div>
            )}
          </div>

            <div className="mt-auto pt-12">
                <SubmitButton />
                {state?.error && (
                    <p className="mt-6 text-[9px] text-red-500 bg-red-500/5 border border-red-500/10 p-5 rounded-none text-center font-black uppercase tracking-[0.3em]">{state.error}</p>
                )}
            </div>
        </form>
        
        {/* Subtle Branding Bottom Sidebar */}
        <div className="mt-12 opacity-20 hover:opacity-100 transition-opacity">
            <div className="w-10 h-10 border border-white/40 flex items-center justify-center font-display font-bold text-lg">S</div>
        </div>
      </div>

      {/* RIGHT SIDE: Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-black relative z-10">
         <div className="h-28 border-b border-white/5 bg-white/[0.01] backdrop-blur-3xl px-8 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-8">
                <div className="flex h-2.5 w-2.5 rounded-none bg-white animate-pulse" />
                <div className="text-[10px] font-display font-bold text-white uppercase tracking-[0.8em] text-gradient">Workspace_</div>
            </div>
            <div className="flex items-center gap-6">
                <AnimatePresence mode="wait">
                {visuals.length > 0 && (
                    <motion.button 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={() => setShowVisuals(!showVisuals)}
                        className={`inline-flex items-center gap-4 rounded-none border px-10 py-4 text-[9px] font-black uppercase tracking-[0.5em] transition-all ${showVisuals ? 'bg-white text-black border-white' : 'bg-transparent text-white/70 border-white/10 hover:border-white hover:text-white'}`}
                    >
                        <ImageIcon className="w-4 h-4" />
                        {showVisuals ? 'Terminal' : `Storyboard (${visuals.length})`}
                    </motion.button>
                )}
                </AnimatePresence>
                
                {currentId && (
                     <button 
                        onClick={handleManualSave}
                        disabled={isSaving}
                        className="inline-flex items-center gap-4 rounded-none border border-white/10 px-10 py-4 text-[9px] font-black uppercase tracking-[0.5em] text-white/70 hover:border-white hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />}
                        Commit
                    </button>
                )}
                
                <button 
                    onClick={handleCopy}
                    className="inline-flex items-center gap-4 rounded-none bg-white px-10 py-4 text-[9px] font-black uppercase tracking-[0.5em] text-black hover:bg-[#E2E2E2] transition-all active:scale-[0.98]"
                >
                    <Copy className="w-4 h-4" />
                    Archive
                </button>
            </div>
         </div>
         
         <div className="flex-1 p-8 overflow-hidden relative">
             <div className="absolute top-8 left-8 bottom-8 w-[1px] bg-white/[0.05] -z-0" />
             <div className="absolute top-8 right-8 bottom-8 w-[1px] bg-white/[0.05] -z-0" />
             
             {showVisuals ? (
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full h-full overflow-y-auto pr-8 scrollbar-hide"
                 >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-20">
                        {visuals.map((prompt, idx) => (
                            <div key={idx} className="group relative space-y-8 rounded-none border border-white/5 bg-white/[0.01] p-10 transition-all hover:border-white/10">
                                <div className="aspect-[4/5] w-full rounded-none overflow-hidden bg-zinc-900/50 relative border border-white/5 shadow-2xl">
                                    <img 
                                        src={`https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=1080&height=1350&seed=${idx + 1337}&model=flux`}
                                        alt={`Neural Render ${idx + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                    <div className="absolute inset-x-0 bottom-0 p-10">
                                        <div className="flex items-center justify-between">
                                            <span className="bg-white text-black px-6 py-2 text-[8px] font-black uppercase tracking-[0.5em]">Scene_0{idx + 1}</span>
                                            <div className="h-1.5 w-1.5 bg-white animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-[8px] font-black text-white/60 uppercase tracking-[0.5em]">Composition Logic</div>
                                    <p className="text-[12px] text-white/70 uppercase tracking-[0.2em] leading-relaxed font-medium transition-colors group-hover:text-white">{prompt}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                 </motion.div>
             ) : (
                <div className="relative w-full h-full group">
                    <div className="absolute -top-4 left-6 bg-black px-6 text-[8px] font-black text-white/60 uppercase tracking-[0.8em] z-10 transition-colors group-focus-within:text-white">Terminal_Input</div>
                    <textarea
                        value={content}
                        onChange={handleContentChange}
                        placeholder="SYSTEM READY. AWAITING INPUT VECTORS..."
                        className="w-full h-full resize-none rounded-none border border-white/10 bg-transparent p-8 text-white/90 placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all font-sans text-lg tracking-wide leading-[2] scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent selection:bg-white/20"
                    />
                </div>
             )}
             
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
                <span className="flex items-center gap-4">B_Index <span className="text-white/70">{content?.length || 0}</span></span>
                <span className="flex items-center gap-4">V_Count <span className="text-white/70">{content ? content.trim().split(/\s+/).length : 0}</span></span>
                {visuals.length > 0 && <span className="flex items-center gap-4 text-white">S_Board <span className="text-white animate-pulse">{visuals.length}</span></span>}
            </div>
            <div className="flex items-center gap-4">
                Core: <span className="text-white/80">PLATINUM_V2_CORE</span>
            </div>
         </div>
      </div>
    </div>
  )
}
