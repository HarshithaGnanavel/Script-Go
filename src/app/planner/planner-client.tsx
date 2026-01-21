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
    <div className="min-h-screen bg-[#020617] text-foreground font-sans selection:bg-indigo-500/20">
      {/* Professional Header */}
      <header className="border-b border-white/5 bg-zinc-950/40 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto flex h-20 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="group rounded-2xl p-3 bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all">
              <ChevronLeft className="h-5 w-5 text-zinc-200 group-hover:text-indigo-400 transition-colors" />
            </Link>
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                S
              </div>
              <span className="font-bold text-2xl tracking-tight hidden sm:block text-white">
                Content Planner
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <button 
              onClick={() => setIsModalOpen(true)}
              className="group relative inline-flex items-center gap-3 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all hover:-translate-y-1 active:scale-95"
            >
              <Target className="h-4 w-4" />
              Create Plan
            </button>
            <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block" />
            <div className="hidden lg:flex flex-col items-end">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Active Workspace</span>
                <span className="text-xs text-zinc-100 font-medium">{userEmail}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Calendar Sidebar */}
          <div className="lg:w-80 space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Content Calendar</span>
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-white">Your <span className="text-brand">Schedule</span></h2>
            </div>

            <div className="p-8 rounded-[2rem] border border-white/5 bg-zinc-950/40 backdrop-blur-xl space-y-8 premium-card shadow-2xl">
               <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xl text-white">{monthNames[month]} <span className="text-zinc-300 font-medium">{year}</span></h3>
                  <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2.5 hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/5">
                      <ChevronLeft className="w-5 h-5 text-zinc-200" />
                    </button>
                    <button onClick={nextMonth} className="p-2.5 hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/5">
                      <ChevronRight className="w-5 h-5 text-zinc-200" />
                    </button>
                  </div>
               </div>
               
               <div className="grid grid-cols-7 gap-2 text-center text-[9px] font-bold text-zinc-300 uppercase tracking-widest">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={`${d}-${i}`}>{d}</div>)}
               </div>
               
               <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "aspect-square flex items-center justify-center text-xs rounded-xl border transition-all duration-300",
                        day ? "border-white/5 hover:border-indigo-500/30 cursor-pointer" : "border-transparent",
                        day && getScriptsForDay(day).length > 0 
                            ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-400 font-bold shadow-lg shadow-indigo-500/5 hover:scale-110" 
                            : "text-zinc-600 font-medium"
                      )}
                    >
                      {day}
                    </div>
                  ))}
               </div>
            </div>

            <div className="rounded-[2rem] border border-white/5 bg-zinc-950/40 p-8 space-y-6 premium-card">
               <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-300">Performance Metrics</h4>
               <div className="grid grid-cols-1 gap-6">
                  <div className="flex justify-between items-center group">
                    <p className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Planned Scripts</p>
                    <p className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors">{initialScripts.length}</p>
                  </div>
                  <div className="h-px w-full bg-white/5" />
                  <div className="flex justify-between items-center group">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
                        <p className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Success Rate</p>
                    </div>
                    <p className="text-2xl font-black text-indigo-500">100%</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-20">
            
            {/* Scheduled Content Queue */}
            {calendarDays.filter(d => d !== null && getScriptsForDay(d).length > 0).length > 0 && (
              <div className="space-y-10">
                <div className="flex items-center gap-6">
                  <div className="h-12 w-12 rounded-[1.25rem] bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-xl shadow-indigo-500/5">
                    <Clock className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-white uppercase">Upcoming <span className="text-brand">Scripts</span></h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/20 to-transparent" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                   {calendarDays
                    .filter(d => d !== null && getScriptsForDay(d).length > 0)
                    .map((day) => {
                      const dayScripts = getScriptsForDay(day!);
                      const isToday = new Date().toDateString() === new Date(year, month, day!).toDateString();
                      
                      return (
                        <div 
                          key={`planned-${day}`} 
                          className={cn(
                            "min-h-[180px] rounded-[2.5rem] border p-8 transition-all duration-500 bg-zinc-950/50 border-white/5 shadow-2xl relative overflow-hidden group hover:-translate-y-2",
                            isToday && "ring-2 ring-indigo-600 ring-offset-4 ring-offset-black bg-indigo-600/[0.03]"
                          )}
                        >
                          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-150 transition-transform duration-1000">
                             <Sparkles className="w-24 h-24 text-indigo-400" />
                          </div>

                          <div className="flex justify-between items-start mb-8 relative">
                             <div className="flex flex-col">
                               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-2">
                                 {day} {monthNames[month].slice(0,3)} {year}
                               </span>
                               <span className="text-xs font-bold text-zinc-100 uppercase tracking-widest">
                                 {dayScripts.length} Script{dayScripts.length > 1 ? 's' : ''}
                               </span>
                             </div>
                             {isToday && (
                               <span className="text-[10px] font-bold uppercase bg-indigo-600 text-white px-3 py-1 rounded-full shadow-lg shadow-indigo-600/20">Today</span>
                             )}
                          </div>

                          <div className="space-y-4 relative">
                             {dayScripts.map(script => (
                               <button 
                                 key={script.id}
                                 onClick={() => setSelectedScript(script)}
                                 className="w-full text-left p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group/asset"
                               >
                                 <div className="flex items-center gap-3 mb-2">
                                    <div className={cn("h-1.5 w-1.5 rounded-full", script.platform === 'LinkedIn' ? "bg-blue-500" : "bg-red-500")} />
                                    <span className="text-[9px] font-bold text-zinc-400 group-hover/asset:text-zinc-300 uppercase tracking-widest transition-colors">{script.platform}</span>
                                 </div>
                                 <h5 className="text-sm font-bold line-clamp-2 text-zinc-200 group-hover/asset:text-white transition-colors leading-relaxed">{script.title}</h5>
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
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-6">
                    <CalendarIcon className="w-8 h-8 text-zinc-600" />
                    <h2 className="text-3xl font-bold tracking-tight uppercase text-zinc-200">{monthNames[month]} Overview</h2>
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
                        "min-h-[180px] rounded-[2.5rem] border p-6 transition-all duration-500 premium-card group",
                        isToday ? "border-indigo-500/40 bg-indigo-500/[0.02] shadow-[0_0_30px_rgba(99,102,241,0.05)]" : "border-white/5 bg-zinc-950/20 hover:bg-zinc-950/40",
                        dayScripts.length > 0 ? "opacity-100 ring-1 ring-indigo-500/10" : "opacity-30 hover:opacity-100"
                      )}
                     >
                       <div className="flex justify-between items-start mb-6">
                          <span className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold transition-all group-hover:scale-110",
                            isToday ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/30" : "bg-white/5 text-zinc-500"
                          )}>
                            {day}
                          </span>
                       </div>

                       <div className="space-y-3">
                          {dayScripts.length > 0 ? (
                            dayScripts.map(script => (
                              <button 
                                key={script.id}
                                onClick={() => setSelectedScript(script)}
                                className="w-full text-left p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group/sub"
                              >
                                <div className="flex items-center gap-3 mb-1.5">
                                  {script.platform === 'LinkedIn' ? (
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                  ) : (
                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                  )}
                                  <span className="text-[9px] font-bold text-zinc-600 group-hover/sub:text-zinc-500 uppercase tracking-widest transition-colors">{script.platform}</span>
                                </div>
                                <h5 className="text-xs font-bold line-clamp-1 text-zinc-500 group-hover/sub:text-white transition-colors">{script.title}</h5>
                              </button>
                            ))
                          ) : (
                            <div className="flex flex-col items-center justify-center h-24 text-zinc-600 font-bold uppercase tracking-[0.3em] text-[10px]">
                              Open Slot
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
              className="absolute inset-0 bg-[#020617]/95 backdrop-blur-3xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-[3rem] border border-white/5 bg-zinc-950 shadow-[0_0_100px_rgba(99,102,241,0.05)] premium-card"
            >
              <div className="p-10 border-b border-white/5 flex items-center justify-between sticky top-0 bg-zinc-950/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-6">
                   <div className={cn(
                     "h-14 w-14 rounded-2xl flex items-center justify-center border",
                     selectedScript.platform === 'LinkedIn' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                   )}>
                      {selectedScript.platform === 'LinkedIn' ? <Layout className="w-6 h-6" /> : <Type className="w-6 h-6" />}
                   </div>
                   <div className="space-y-2">
                    <h3 className="font-bold text-2xl tracking-tight text-white">{selectedScript.title}</h3>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">{selectedScript.scheduled_date}</span>
                        <span className="h-1 w-1 rounded-full bg-zinc-600" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">{selectedScript.tone} Tone</span>
                    </div>
                   </div>
                </div>
                <button onClick={() => setSelectedScript(null)} className="p-3 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5">
                  <X className="w-7 h-7 text-zinc-600" />
                </button>
              </div>
              <div className="p-10 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
                <pre className="whitespace-pre-wrap font-sans text-zinc-300 leading-[1.8] text-base bg-black/40 p-10 rounded-[2rem] border border-white/5 shadow-inner">
                    {selectedScript.content}
                </pre>
              </div>
              <div className="p-8 border-t border-white/5 bg-zinc-950/50 flex justify-end gap-5">
                 <Link href={`/editor?id=${selectedScript.id}`}>
                    <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 group">
                      <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      View in Editor
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
              className="absolute inset-0 bg-[#020617]/95 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-4xl rounded-[3rem] border border-white/5 bg-zinc-950 p-10 sm:p-14 shadow-2xl overflow-hidden group premium-card"
            >
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full -z-10 pointer-events-none" />
              
              <div className="flex items-center gap-8 mb-12 relative">
                <div className="h-16 w-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center shrink-0 border border-indigo-600/20 shadow-lg">
                  <Sparkles className="w-9 h-9 text-indigo-500" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold tracking-tight text-white uppercase">Plan Generator</h3>
                  <p className="text-zinc-300 font-bold text-xs uppercase tracking-widest">Create a multi-day script plan</p>
                </div>
              </div>

              <form action={formAction} className="space-y-10 relative">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 ml-1">Topic</label>
                  <input 
                    name="topic"
                    required
                    placeholder="e.g. B2B Sales Strategies for Startups"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-5 outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-zinc-700 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Platform</label>
                    <select 
                      name="platform" 
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-5 outline-none focus:border-indigo-500/50 appearance-none cursor-pointer text-white font-medium"
                    >
                      <option value="YouTube" className="bg-zinc-900 text-white font-sans">YouTube</option>
                      <option value="LinkedIn" className="bg-zinc-900 text-white font-sans">LinkedIn</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Days to Plan</label>
                    <select name="days" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-5 outline-none focus:border-indigo-500/50 appearance-none cursor-pointer text-white font-medium">
                      <option value="7" className="bg-zinc-900 text-white font-sans">7-Day Sprint</option>
                      <option value="30" className="bg-zinc-900 text-white font-sans">30-Day Strategy</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Strategy</label>
                    <select name="framework" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-5 outline-none focus:border-indigo-500/50 appearance-none cursor-pointer text-white font-medium">
                      <option value="AIDA" className="bg-zinc-900 text-white font-sans">AIDA Framework</option>
                      <option value="PAS" className="bg-zinc-900 text-white font-sans">PAS Framework</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Language</label>
                    <select name="language" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-5 outline-none focus:border-indigo-500/50 appearance-none cursor-pointer text-white font-medium">
                      <option value="English" className="bg-zinc-900 text-white font-sans">English</option>
                      <option value="Tamil" className="bg-zinc-900 text-white font-sans">Tamil</option>
                      <option value="Hindi" className="bg-zinc-900 text-white font-sans">Hindi</option>
                      <option value="Spanish" className="bg-zinc-900 text-white font-sans">Spanish</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Tone</label>
                    <select name="tone" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-5 outline-none focus:border-indigo-500/50 appearance-none cursor-pointer text-white font-medium">
                      <option value="Professional" className="bg-zinc-900 text-white font-sans">Professional</option>
                      <option value="Casual" className="bg-zinc-900 text-white font-sans">Casual</option>
                      <option value="Educational" className="bg-zinc-900 text-white font-sans">Educational</option>
                      <option value="Witty" className="bg-zinc-900 text-white font-sans">Witty</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Start Date</label>
                    <input 
                      type="date"
                      name="startDate"
                      required
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-[17px] outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all [color-scheme:dark] text-white font-medium"
                    />
                  </div>
                </div>

                {platform === 'YouTube' && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Average Duration</label>
                    <select name="length" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-5 outline-none focus:border-indigo-500/50 appearance-none cursor-pointer text-white font-medium">
                      <option value="Short" className="bg-zinc-900 text-white font-sans">Short (~3m)</option>
                      <option value="Medium" className="bg-zinc-900 text-white font-sans">Medium (~8m)</option>
                      <option value="Long" className="bg-zinc-900 text-white font-sans">Long (~15m)</option>
                    </select>
                  </div>
                )}

                <div className="pt-8 flex flex-col sm:flex-row items-center gap-6">
                  <button 
                    disabled={isGenerating}
                    type="submit"
                    className="w-full sm:flex-1 py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 transition-all font-bold text-white shadow-xl shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group/btn relative overflow-hidden uppercase tracking-widest text-sm"
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating Plan...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 group-hover/btn:scale-125 transition-transform" />
                        Generate Plan
                      </>
                    )}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isGenerating}
                    className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white border border-white/5"
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
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.2);
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}</style>
    </div>
  )
}
