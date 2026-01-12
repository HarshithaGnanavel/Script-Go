'use client'

import React, { useState, useActionState } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Loader2, 
  X,
  Layout,
  Type,
  ExternalLink
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { generatePlannerScripts } from './actions'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface Script {
  id: string
  title: string
  content: string
  platform: string
  scheduled_date: string
  tone: string
}

interface PlannerClientProps {
  initialScripts: any[]
  userEmail: string
}

export default function PlannerClient({ initialScripts, userEmail }: PlannerClientProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedScript, setSelectedScript] = useState<Script | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [platform, setPlatform] = useState('YouTube')
  
  const router = useRouter()
  
  const [state, formAction] = useActionState(async (state: any, formData: FormData) => {
    setIsGenerating(true)
    try {
      const result = await generatePlannerScripts(state, formData)
      if (result.success) {
        setIsModalOpen(false)
        router.refresh()
      }
      return result
    } finally {
      setIsGenerating(false)
    }
  }, { error: null, success: false })

  // Calendar Logic
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const totalDays = daysInMonth(year, month)
  const startDay = firstDayOfMonth(year, month)

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const calendarDays = []
  // Padding for start of month
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null)
  }
  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push(i)
  }

  const getScriptsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return initialScripts.filter(s => s.scheduled_date === dateStr)
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="group rounded-full p-2 hover:bg-white/5 border border-white/10 transition-all">
              <ChevronLeft className="h-5 w-5 text-zinc-400 group-hover:text-white" />
            </Link>
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                S
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block">
                ScriptGo <span className="text-indigo-500">Planner</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button 
              onClick={() => setIsModalOpen(true)}
              className="group relative inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 transition-all hover:-translate-y-0.5"
            >
              <Sparkles className="h-4 w-4" />
              Generate Content Plan
            </button>
            <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block" />
            <span className="text-sm text-zinc-400 hidden lg:block">{userEmail}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Calendar Sidebar / Controls */}
          <div className="lg:w-80 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Your <span className="text-indigo-500">Calendar</span></h2>
              <p className="text-zinc-400 leading-relaxed">
                Visualize your content strategy and manage your upcoming scripts across all platforms.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-sm space-y-6">
               <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{monthNames[month]} {year}</h3>
                  <div className="flex gap-1">
                    <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
               </div>
               
               <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={`${d}-${i}`}>{d}</div>)}
               </div>
               
               <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "aspect-square flex items-center justify-center text-sm rounded-lg border transition-all",
                        day ? "border-white/5 hover:border-indigo-500/50 cursor-pointer" : "border-transparent",
                        day && getScriptsForDay(day).length > 0 ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-bold" : "text-zinc-400"
                      )}
                    >
                      {day}
                    </div>
                  ))}
               </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 space-y-4">
               <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Stats</h4>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">{initialScripts.length}</p>
                    <p className="text-xs text-zinc-500">Planned Scripts</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-indigo-400">{initialScripts.filter(s => s.platform === 'YouTube').length}</p>
                    <p className="text-xs text-zinc-500">YouTube</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-12">
            
            {/* 1. Scheduled Content Queue (Days with scripts) */}
            {calendarDays.filter(d => d !== null && getScriptsForDay(d).length > 0).length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-bold">Planned <span className="text-indigo-500">Queue</span></h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                   {calendarDays
                    .filter(d => d !== null && getScriptsForDay(d).length > 0)
                    .map((day) => {
                      const dayScripts = getScriptsForDay(day!);
                      const isToday = new Date().toDateString() === new Date(year, month, day!).toDateString();
                      
                      return (
                        <div 
                          key={`planned-${day}`} 
                          className={cn(
                            "min-h-[160px] rounded-2xl border p-4 transition-all duration-300 bg-zinc-900/40 border-indigo-500/30 shadow-lg shadow-indigo-500/5",
                            isToday && "ring-2 ring-indigo-500 ring-offset-4 ring-offset-black"
                          )}
                        >
                          <div className="flex justify-between items-start mb-4">
                             <div className="flex flex-col">
                               <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-1">
                                 {day} {monthNames[month]}
                               </span>
                               <span className="text-xs font-medium text-zinc-500">
                                 {dayScripts.length} Planned Script{dayScripts.length > 1 ? 's' : ''}
                               </span>
                             </div>
                             {isToday && (
                               <span className="text-[10px] font-bold uppercase bg-indigo-500 text-white px-2 py-0.5 rounded-full">Today</span>
                             )}
                          </div>

                          <div className="space-y-2">
                             {dayScripts.map(script => (
                               <button 
                                 key={script.id}
                                 onClick={() => setSelectedScript(script)}
                                 className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-white/10 transition-all group"
                               >
                                 <div className="flex items-center gap-2 mb-1">
                                    <div className={cn("h-1.5 w-1.5 rounded-full", script.platform === 'LinkedIn' ? "bg-blue-500" : "bg-red-500")} />
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase">{script.platform}</span>
                                 </div>
                                 <h5 className="text-sm font-semibold line-clamp-2 text-zinc-200 group-hover:text-white transition-colors">{script.title}</h5>
                               </button>
                             ))}
                          </div>
                        </div>
                      )
                    })
                   }
                </div>
              </div>
            )}

            {/* 2. Monthly Overview Grid */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <CalendarIcon className="w-6 h-6 text-indigo-500/50" />
                    <h2 className="text-2xl font-bold text-zinc-400">{monthNames[month]} Overview</h2>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                 {calendarDays.filter(d => d !== null).map((day) => {
                   const dayScripts = getScriptsForDay(day!);
                   const isToday = new Date().toDateString() === new Date(year, month, day!).toDateString();
                   
                   return (
                     <div 
                      key={day} 
                      className={cn(
                        "min-h-[160px] rounded-2xl border p-4 transition-all duration-300",
                        isToday ? "border-indigo-500/50 bg-indigo-500/[0.02]" : "border-white/5 bg-zinc-900/10 hover:bg-zinc-900/20",
                        dayScripts.length > 0 ? "opacity-100 ring-1 ring-white/10" : "opacity-40 hover:opacity-100"
                      )}
                     >
                       <div className="flex justify-between items-start mb-4">
                          <span className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                            isToday ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "bg-white/5 text-zinc-400"
                          )}>
                            {day}
                          </span>
                       </div>

                       <div className="space-y-2">
                          {dayScripts.length > 0 ? (
                            dayScripts.map(script => (
                              <button 
                                key={script.id}
                                onClick={() => setSelectedScript(script)}
                                className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-white/10 transition-all group"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  {script.platform === 'LinkedIn' ? (
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                  ) : (
                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                  )}
                                  <span className="text-[10px] font-bold text-zinc-500 uppercase">{script.platform}</span>
                                </div>
                                <h5 className="text-sm font-semibold line-clamp-1 text-zinc-200 group-hover:text-white transition-colors">{script.title}</h5>
                              </button>
                            ))
                          ) : (
                            <div className="flex flex-col items-center justify-center h-24 text-zinc-700 italic text-sm">
                              Free Day
                            </div>
                          )}
                       </div>
                     </div>
                   )
                 })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Script Detail Modal */}
      <AnimatePresence>
        {selectedScript && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedScript(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-zinc-900 z-10">
                <div className="flex items-center gap-4">
                   <div className={cn(
                     "h-10 w-10 rounded-xl flex items-center justify-center",
                     selectedScript.platform === 'LinkedIn' ? "bg-blue-500/10 text-blue-400" : "bg-red-500/10 text-red-400"
                   )}>
                      {selectedScript.platform === 'LinkedIn' ? <Layout className="w-5 h-5" /> : <Type className="w-5 h-5" />}
                   </div>
                   <div>
                    <h3 className="font-bold text-xl">{selectedScript.title}</h3>
                    <p className="text-xs text-zinc-500 font-medium">{selectedScript.scheduled_date} • {selectedScript.tone} Tone</p>
                   </div>
                </div>
                <button onClick={() => setSelectedScript(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-6 h-6 text-zinc-400" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto max-h-[calc(85vh-100px)] custom-scrollbar">
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-zinc-300 leading-relaxed text-base">
                    {selectedScript.content}
                  </pre>
                </div>
              </div>
              <div className="p-4 border-t border-white/5 bg-zinc-900/50 flex justify-end gap-3">
                 <Link href={`/editor?id=${selectedScript.id}`}>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white/10 transition-all">
                      <ExternalLink className="w-4 h-4" />
                      Open in Editor
                    </button>
                 </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Generator Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isGenerating && setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl rounded-[32px] border border-white/10 bg-zinc-950 p-8 sm:p-10 shadow-2xl overflow-hidden group"
            >
              {/* Premium Background Gradation */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-colors duration-700" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-purple-500/20 transition-colors duration-700" />
              
              <div className="flex items-center gap-6 mb-8 relative">
                <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-8 h-8 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Build Content Plan</h3>
                  <p className="text-zinc-400 text-sm">Design your multi-day content strategy in one place.</p>
                </div>
              </div>

              <form action={formAction} className="space-y-6 relative">
                {/* Topic field - Full Width */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Topic / Content Niche</label>
                  <input 
                    name="topic"
                    required
                    placeholder="e.g. AI Automation for Small Business"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all text-white placeholder:text-zinc-600"
                  />
                </div>

                {/* 3-Column Settings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Platform</label>
                    <select 
                      name="platform" 
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 appearance-none cursor-pointer text-white"
                    >
                      <option value="YouTube" className="bg-zinc-900 text-white">YouTube</option>
                      <option value="LinkedIn" className="bg-zinc-900 text-white">LinkedIn</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Duration</label>
                    <select name="days" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 appearance-none cursor-pointer text-white">
                      <option value="7" className="bg-zinc-900 text-white">7 Days Plan</option>
                      <option value="30" className="bg-zinc-900 text-white">30 Days Plan</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Strategy</label>
                    <select name="framework" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 appearance-none cursor-pointer text-white">
                      <option value="AIDA" className="bg-zinc-900 text-white">AIDA Formula</option>
                      <option value="PAS" className="bg-zinc-900 text-white">PAS Formula</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Language</label>
                    <select name="language" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 appearance-none cursor-pointer text-white">
                      <option value="English" className="bg-zinc-900 text-white">English</option>
                      <option value="Tamil" className="bg-zinc-900 text-white">Tamil</option>
                      <option value="Hindi" className="bg-zinc-900 text-white">Hindi</option>
                      <option value="Spanish" className="bg-zinc-900 text-white">Spanish</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Tone</label>
                    <select name="tone" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 appearance-none cursor-pointer text-white">
                      <option value="Professional" className="bg-zinc-900 text-white">Professional</option>
                      <option value="Casual" className="bg-zinc-900 text-white">Casual</option>
                      <option value="Educational" className="bg-zinc-900 text-white">Educational</option>
                      <option value="Witty" className="bg-zinc-900 text-white">Witty</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Start Date</label>
                    <input 
                      type="date"
                      name="startDate"
                      required
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-[11px] outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all [color-scheme:dark] text-white"
                    />
                  </div>
                </div>

                {/* Script Length - Only if YouTube */}
                {platform === 'YouTube' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">YouTube Script Length</label>
                    <select name="length" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 appearance-none cursor-pointer text-white">
                      <option value="Short" className="bg-zinc-900 text-white">Short (~2-3 mins)</option>
                      <option value="Medium" className="bg-zinc-900 text-white">Medium (~5-8 mins)</option>
                      <option value="Long" className="bg-zinc-900 text-white">Long (~10-15 mins)</option>
                    </select>
                  </div>
                )}

                <div className="pt-4 flex items-center gap-4">
                  <button 
                    disabled={isGenerating}
                    type="submit"
                    className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all font-bold text-white shadow-xl shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Architecting your content...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 group-hover/btn:scale-125 transition-transform" />
                        Generate Content Plan
                      </>
                    )}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isGenerating}
                    className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-sm font-semibold text-zinc-400 hover:text-white border border-white/10"
                  >
                    Cancel
                  </button>
                </div>

                {state?.error && (
                  <p className="text-red-400 text-sm mt-4 text-center p-3 bg-red-400/10 rounded-lg border border-red-400/20">
                    {state.error}
                  </p>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
}
