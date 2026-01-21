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
  ExternalLink,
  Target,
  BarChart3,
  Clock
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
  
  const [state, formAction, isPendingState] = useActionState(async (state: any, formData: FormData) => {
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
      <div className="min-h-dvh bg-black text-white font-sans selection:bg-white/20 relative overflow-hidden">
        {/* Background Elements - Absolute Sync with Landing Page */}
        <div className="fixed inset-0 pointer-events-none z-0 grid-pattern opacity-[0.4]"></div>
        <div className="fixed top-[-15%] right-[-10%] w-[60vw] h-[60vw] lens-flare pointer-events-none z-0 opacity-40"></div>

        {/* Premium Header */}
        <header className="relative z-50 w-full border-b border-white/5 bg-black/40 backdrop-blur-3xl sticky top-0">
          <div className="max-w-[1400px] mx-auto flex h-20 md:h-24 items-center justify-between px-4 md:px-8">
            <div className="flex items-center gap-6 md:gap-8">
              <Link href="/dashboard" className="group rounded-none p-3 border border-white/10 hover:border-white transition-all bg-white/[0.02]">
                <ChevronLeft className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
              </Link>
              <div className="flex items-center gap-3 md:gap-4 group cursor-pointer">
                <div className="h-8 w-8 md:h-9 md:w-9 bg-white rounded-none flex items-center justify-center font-display font-bold text-black text-base md:text-lg hover:scale-105 transition-transform">
                  S
                </div>
                <span className="font-display text-lg md:text-2xl tracking-[0.15em] font-semibold uppercase text-gradient">
                  Content Planner
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 md:gap-6">
               <button 
                onClick={() => setIsModalOpen(true)}
                className="group relative bg-white text-black px-6 md:px-8 py-3 md:py-4 rounded-none font-bold text-[10px] md:text-[11px] uppercase tracking-[0.4em] transition-all hover:bg-silver active:scale-95 cta-glow-pulse flex items-center gap-3"
              >
                <Target className="h-3 md:h-4 w-3 md:w-4" />
                <span className="hidden md:inline">Create Plan</span>
              </button>
              <div className="hidden lg:flex flex-col items-end border-l border-white/10 pl-6 h-8 justify-center">
                  <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/50">Workspace</span>
                  <span className="text-[10px] text-white/90 font-bold tracking-widest">{userEmail}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* Calendar Sidebar */}
            <div className="lg:w-80 space-y-8 md:space-y-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-4 px-4 py-2 border border-white/10 bg-white/[0.02] mb-2">
                  <div className="h-1.5 w-1.5 rounded-none bg-white animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.6em] text-white/70">Calendar</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-white uppercase">Schedule</h2>
              </div>

              <div className="p-6 md:p-8 rounded-none border border-white/10 bg-white/[0.01] backdrop-blur-sm space-y-8 relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-1 h-0 bg-white group-hover:h-full transition-all duration-700" />
                 <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-lg text-white uppercase tracking-widest">{monthNames[month]} <span className="text-white/40">{year}</span></h3>
                    <div className="flex gap-2">
                      <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-none transition-all border border-white/5 hover:border-white/20">
                        <ChevronLeft className="w-4 h-4 text-white/70" />
                      </button>
                      <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-none transition-all border border-white/5 hover:border-white/20">
                        <ChevronRight className="w-4 h-4 text-white/70" />
                      </button>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-7 gap-2 text-center text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={`${d}-${i}`}>{d}</div>)}
                 </div>
                 
                 <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "aspect-square flex items-center justify-center text-[10px] rounded-none border transition-all duration-300 font-bold",
                          day ? "border-white/5 hover:border-white/40 cursor-pointer hover:bg-white/5" : "border-transparent",
                          day && getScriptsForDay(day).length > 0 
                              ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
                              : "text-white/40"
                        )}
                      >
                        {day}
                      </div>
                    ))}
                 </div>
              </div>

              <div className="rounded-none border border-white/10 bg-white/[0.01] p-6 md:p-8 space-y-6 relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-1 h-0 bg-white group-hover:h-full transition-all duration-700 delay-100" />
                 <h4 className="text-[9px] font-black uppercase tracking-[0.5em] text-white/50">Metrics</h4>
                 <div className="grid grid-cols-1 gap-6">
                    <div className="flex justify-between items-center group/stat">
                      <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Planned Scripts</p>
                      <p className="text-2xl font-display font-bold text-white group-hover/stat:text-gradient transition-all">{initialScripts.length}</p>
                    </div>
                    <div className="h-px w-full bg-white/5" />
                    <div className="flex justify-between items-center group/stat">
                      <div className="flex items-center gap-2">
                          <BarChart3 className="w-3 h-3 text-white/70" />
                          <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Rate</p>
                      </div>
                      <p className="text-2xl font-display font-bold text-white">100%</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 space-y-16 md:space-y-20">
              
              {/* Scheduled Content Queue */}
              {calendarDays.filter(d => d !== null && getScriptsForDay(d).length > 0).length > 0 && (
                <div className="space-y-8 md:space-y-10">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 border-b border-white/5 pb-8">
                     <div className="h-10 w-10 md:h-12 md:w-12 bg-white flex items-center justify-center">
                        <Clock className="w-5 h-5 md:w-6 md:h-6 text-black" />
                     </div>
                     <div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-white uppercase mb-2">Upcoming <span className="text-white/40">Scripts</span></h2>
                        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Your Content Pipeline</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                     {calendarDays
                      .filter(d => d !== null && getScriptsForDay(d).length > 0)
                      .map((day) => {
                        const dayScripts = getScriptsForDay(day!);
                        const isToday = new Date().toDateString() === new Date(year, month, day!).toDateString();
                        
                        return (
                          <div 
                            key={`planned-${day}`} 
                            className={cn(
                              "min-h-[180px] rounded-none border p-6 md:p-8 transition-all duration-500 bg-white/[0.01] border-white/10 relative overflow-hidden group hover:-translate-y-1 hover:border-white/30",
                              isToday && "border-white/40 bg-white/[0.03]"
                            )}
                          >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-150 transition-transform duration-1000 rotate-12">
                               <Sparkles className="w-24 h-24 text-white" />
                            </div>
                            <div className="absolute top-0 left-0 w-1 h-0 bg-white group-hover:h-full transition-all duration-500" />

                            <div className="flex justify-between items-start mb-8 relative">
                               <div className="flex flex-col">
                                 <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/50 mb-2">
                                   {day} {monthNames[month].slice(0,3)}
                                 </span>
                                 <span className="text-xs font-bold text-white uppercase tracking-widest">
                                   {dayScripts.length} Script{dayScripts.length > 1 ? 's' : ''}
                                 </span>
                               </div>
                               {isToday && (
                                 <span className="text-[8px] font-black uppercase bg-white text-black px-3 py-1 tracking-[0.2em]">Today</span>
                               )}
                            </div>

                            <div className="space-y-3 relative">
                               {dayScripts.map(script => (
                                 <button 
                                   key={script.id}
                                   onClick={() => setSelectedScript(script)}
                                   className="w-full text-left p-4 rounded-none bg-white/[0.02] border border-white/5 hover:border-white hover:bg-white text-white hover:text-black transition-all group/asset"
                                 >
                                   <div className="flex items-center gap-3 mb-2">
                                      <div className={cn("h-1 w-1", script.platform === 'LinkedIn' ? "bg-blue-500" : "bg-red-500")} />
                                      <span className="text-[8px] font-black text-white/40 group-hover/asset:text-black/60 uppercase tracking-[0.3em] transition-colors">{script.platform}</span>
                                   </div>
                                   <h5 className="text-[11px] font-bold line-clamp-1 uppercase tracking-wider">{script.title}</h5>
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

              {/* Monthly Overview Grid */}
              <div className="space-y-8 md:space-y-10">
                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                   <div className="flex items-center gap-6 md:gap-8">
                      <div className="h-10 w-10 md:h-12 md:w-12 border border-white/10 flex items-center justify-center">
                        <CalendarIcon className="w-5 h-5 md:w-6 md:h-6 text-white/70" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight uppercase text-white mb-2">{monthNames[month]} <span className="text-white/40">Overview</span></h2>
                         <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Full Month View</p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                   {calendarDays.filter(d => d !== null).map((day) => {
                     const dayScripts = getScriptsForDay(day!);
                     const isToday = new Date().toDateString() === new Date(year, month, day!).toDateString();
                     
                     return (
                       <div 
                        key={day} 
                        className={cn(
                          "min-h-[160px] rounded-none border p-6 transition-all duration-500 group relative",
                          isToday ? "border-white bg-white/[0.05]" : "border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/20",
                          dayScripts.length > 0 ? "opacity-100" : "opacity-40 hover:opacity-100"
                        )}
                       >
                         {/* Corner accents */}
                         <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-white transition-colors" />
                         <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-white transition-colors" />

                         <div className="flex justify-between items-start mb-6">
                            <span className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-none text-xs font-bold transition-all border",
                              isToday ? "bg-white text-black border-white" : "bg-transparent text-white/50 border-white/10 group-hover:border-white/30"
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
                                  className="w-full text-left p-3 rounded-none bg-white/[0.03] border border-white/5 hover:border-white hover:bg-white text-white hover:text-black transition-all group/sub"
                                >
                                  <div className="flex items-center gap-3 mb-1.5">
                                    <div className={cn("h-1 w-1", script.platform === 'LinkedIn' ? "bg-blue-500" : "bg-red-500")} />
                                    <span className="text-[8px] font-black text-white/40 group-hover/sub:text-black/50 uppercase tracking-[0.2em] transition-colors">{script.platform}</span>
                                  </div>
                                  <h5 className="text-[10px] font-bold line-clamp-1 uppercase tracking-wide opacity-80 group-hover/sub:opacity-100">{script.title}</h5>
                                </button>
                              ))
                            ) : (
                              <div className="flex flex-col items-center justify-center h-20 text-white/20 font-bold uppercase tracking-[0.3em] text-[8px]">
                                Empty
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedScript(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-3xl max-h-[90dvh] overflow-hidden rounded-none border border-white/20 bg-black shadow-2xl flex flex-col"
              >
                <div className="p-8 md:p-10 border-b border-white/10 flex items-center justify-between sticky top-0 bg-black z-10">
                  <div className="flex items-center gap-6 md:gap-8">
                     <div className="h-12 w-12 md:h-14 md:w-14 rounded-none flex items-center justify-center border border-white/20 bg-white/[0.05]">
                        {selectedScript.platform === 'LinkedIn' ? <Layout className="w-5 h-5 md:w-6 md:h-6 text-white" /> : <Type className="w-5 h-5 md:w-6 md:h-6 text-white" />}
                     </div>
                     <div className="space-y-1">
                      <div className="flex items-center gap-4">
                          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">{selectedScript.scheduled_date}</span>
                          <span className="h-0.5 w-0.5 bg-white/50" />
                          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">{selectedScript.tone} Tone</span>
                      </div>
                      <h3 className="font-display font-bold text-xl md:text-2xl tracking-wide text-white uppercase">{selectedScript.title}</h3>
                     </div>
                  </div>
                  <button onClick={() => setSelectedScript(null)} className="p-3 hover:bg-white hover:text-black text-white/60 rounded-none transition-all border border-transparent hover:border-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar bg-black relative">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <pre className="whitespace-pre-wrap font-sans text-white/80 leading-[2] text-sm md:text-base border-l-2 border-white/10 pl-8 ml-2">
                      {selectedScript.content}
                  </pre>
                </div>
                
                <div className="p-8 border-t border-white/10 bg-white/[0.02] flex justify-end gap-5">
                   <Link href={`/editor?id=${selectedScript.id}`}>
                      <button className="flex items-center gap-4 px-10 py-5 rounded-none bg-white text-black font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:bg-silver transition-all active:scale-95 group">
                        <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-transform" />
                        Open Editor
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
                className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-4xl rounded-none border border-white/10 bg-black p-8 md:p-14 shadow-2xl overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/[0.02] blur-[150px] rounded-full -z-10 pointer-events-none" />
                
                <div className="flex items-center gap-8 mb-12 relative border-b border-white/5 pb-8">
                  <div className="h-16 w-16 rounded-none bg-white flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    <Sparkles className="w-8 h-8 text-black" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-display font-bold tracking-tight text-white uppercase">Plan Generator</h3>
                    <p className="text-white/40 font-bold text-[10px] uppercase tracking-[0.4em]">Create a multi-day script plan</p>
                  </div>
                </div>

                <form action={formAction} className="space-y-10 relative">
                  <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-[0.5em] text-white/50 ml-1">Topic</label>
                    <input 
                      name="topic"
                      required
                      placeholder="e.g. B2B Sales Strategies for Startups"
                      className="w-full bg-transparent border border-white/20 rounded-none px-6 py-5 outline-none focus:border-white focus:bg-white/[0.02] transition-all text-white placeholder:text-white/20 font-medium text-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-[0.5em] text-white/50 ml-1">Platform</label>
                      <div className="relative group">
                        <select 
                          name="platform" 
                          onChange={(e) => setPlatform(e.target.value)}
                          className="w-full bg-transparent border border-white/10 rounded-none px-6 py-4 outline-none focus:border-white appearance-none cursor-pointer text-white font-medium text-sm hover:border-white/40 transition-all"
                        >
                          <option value="YouTube" className="bg-black text-white font-sans">YouTube</option>
                          <option value="LinkedIn" className="bg-black text-white font-sans">LinkedIn</option>
                        </select>
                        <div className="absolute right-6 top-5 pointer-events-none text-white/40"><ChevronRight className="w-3 h-3 rotate-90" /></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-[0.5em] text-white/50 ml-1">Duration</label>
                      <div className="relative group">
                          <select name="days" className="w-full bg-transparent border border-white/10 rounded-none px-6 py-4 outline-none focus:border-white appearance-none cursor-pointer text-white font-medium text-sm hover:border-white/40 transition-all">
                            <option value="7" className="bg-black text-white font-sans">7-Day Sprint</option>
                            <option value="30" className="bg-black text-white font-sans">30-Day Strategy</option>
                          </select>
                          <div className="absolute right-6 top-5 pointer-events-none text-white/40"><ChevronRight className="w-3 h-3 rotate-90" /></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-[0.5em] text-white/50 ml-1">Strategy</label>
                      <div className="relative group">
                          <select name="framework" className="w-full bg-transparent border border-white/10 rounded-none px-6 py-4 outline-none focus:border-white appearance-none cursor-pointer text-white font-medium text-sm hover:border-white/40 transition-all">
                            <option value="AIDA" className="bg-black text-white font-sans">AIDA Framework</option>
                            <option value="PAS" className="bg-black text-white font-sans">PAS Framework</option>
                          </select>
                          <div className="absolute right-6 top-5 pointer-events-none text-white/40"><ChevronRight className="w-3 h-3 rotate-90" /></div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-[0.5em] text-white/50 ml-1">Language</label>
                      <div className="relative group">
                          <select name="language" className="w-full bg-transparent border border-white/10 rounded-none px-6 py-4 outline-none focus:border-white appearance-none cursor-pointer text-white font-medium text-sm hover:border-white/40 transition-all">
                            <option value="English" className="bg-black text-white font-sans">English</option>
                            <option value="Tamil" className="bg-black text-white font-sans">Tamil</option>
                            <option value="Tanglish" className="bg-black text-white font-sans">Tanglish</option>
                            <option value="Hindi" className="bg-black text-white font-sans">Hindi</option>
                            <option value="Hinglish" className="bg-black text-white font-sans">Hinglish</option>
                            <option value="Spanish" className="bg-black text-white font-sans">Spanish</option>
                          </select>
                          <div className="absolute right-6 top-5 pointer-events-none text-white/40"><ChevronRight className="w-3 h-3 rotate-90" /></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-[0.5em] text-white/50 ml-1">Tone</label>
                      <div className="relative group">
                          <select name="tone" className="w-full bg-transparent border border-white/10 rounded-none px-6 py-4 outline-none focus:border-white appearance-none cursor-pointer text-white font-medium text-sm hover:border-white/40 transition-all">
                            <option value="Professional" className="bg-black text-white font-sans">Professional</option>
                            <option value="Casual" className="bg-black text-white font-sans">Casual</option>
                            <option value="Educational" className="bg-black text-white font-sans">Educational</option>
                            <option value="Witty" className="bg-black text-white font-sans">Witty</option>
                          </select>
                          <div className="absolute right-6 top-5 pointer-events-none text-white/40"><ChevronRight className="w-3 h-3 rotate-90" /></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-[0.5em] text-white/50 ml-1">Start Date</label>
                      <input 
                        type="date"
                        name="startDate"
                        required
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="w-full bg-transparent border border-white/10 rounded-none px-6 py-[15px] outline-none focus:border-white transition-all [color-scheme:dark] text-white font-medium text-sm hover:border-white/40"
                      />
                    </div>
                  </div>

                  {platform === 'YouTube' && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                      <label className="text-[9px] font-black uppercase tracking-[0.5em] text-white/50 ml-1">Video Length</label>
                      <div className="relative group">
                          <select name="length" className="w-full md:w-1/3 bg-transparent border border-white/10 rounded-none px-6 py-4 outline-none focus:border-white appearance-none cursor-pointer text-white font-medium text-sm hover:border-white/40 transition-all">
                            <option value="Short" className="bg-black text-white font-sans">Short (~3m)</option>
                            <option value="Medium" className="bg-black text-white font-sans">Medium (~8m)</option>
                            <option value="Long" className="bg-black text-white font-sans">Long (~15m)</option>
                          </select>
                          <div className="absolute left-[calc(33%-2rem)] top-5 pointer-events-none text-white/40"><ChevronRight className="w-3 h-3 rotate-90" /></div>
                      </div>
                    </div>
                  )}

                  <div className="pt-8 flex flex-col sm:flex-row items-center gap-6 border-t border-white/5 mt-8">
                    <button 
                      disabled={isGenerating}
                      type="submit"
                      className="w-full sm:flex-1 py-5 rounded-none bg-white hover:bg-silver transition-all font-black text-black shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 group/btn relative overflow-hidden uppercase tracking-[0.4em] text-xs"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                          Generate Plan
                        </>
                      )}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      disabled={isGenerating}
                      className="w-full sm:w-auto px-12 py-5 rounded-none bg-transparent hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-[0.4em] text-white/50 hover:text-white border border-white/10 hover:border-white"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.02);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 0px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
          }
          .scrollbar-hide::-webkit-scrollbar {
              display: none;
          }
        `}</style>
      </div>
  )
}
