'use client'

import { useState } from 'react'
import { Youtube, Linkedin, Sparkles, X, Copy, Calendar, Mail, Check, CheckSquare, Square, Trash2, ChevronRight, Terminal, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { sendSelectedScripts, deleteMultipleScripts } from './actions'

interface Script {
  id: string
  title: string
  content: string
  platform: 'YouTube' | 'LinkedIn' | 'Instagram'
  tone: string
  created_at: string
}

export default function ScriptGrid({ scripts }: { scripts: Script[] }) {
  const [selectedScript, setSelectedScript] = useState<Script | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isSending, setIsSending] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [message, setMessage] = useState('')
  
  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content)
  }

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === scripts.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(scripts.map(s => s.id))
    }
  }

  const handleSendSelected = async () => {
    if (selectedIds.length === 0) return
    setIsSending(true)
    const res = await sendSelectedScripts(selectedIds)
    setIsSending(false)
    if (res.success) {
      setMessage(`ARCHIVED ${selectedIds.length} SCRIPTS`)
      setSelectedIds([])
      setTimeout(() => setMessage(''), 5000)
    } else {
      setMessage(`ERROR: ${res.error}`)
      setTimeout(() => setMessage(''), 5000)
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return
    if (!confirm(`PURGE ${selectedIds.length} VECTORS? THIS ACTION IS IRREVERSIBLE.`)) return
    
    setIsDeleting(true)
    const res = await deleteMultipleScripts(selectedIds)
    setIsDeleting(false)
    
    if (res.success) {
      setMessage(`PURGED ${selectedIds.length} ASSETS`)
      setSelectedIds([])
      setTimeout(() => setMessage(''), 5000)
    } else {
      setMessage(`ERROR: ${res.error}`)
      setTimeout(() => setMessage(''), 5000)
    }
  }

  return (
    <div className="relative z-10">
      {/* Management Console Bar */}
      <div className="mb-20 flex flex-col lg:flex-row items-center justify-between gap-12 bg-black/40 p-12 rounded-none border border-white/5 backdrop-blur-3xl relative">
        <div className="absolute top-0 left-12 h-0.5 w-24 bg-white/20" />
        
        <div className="flex items-center gap-12">
            <button 
                onClick={toggleSelectAll}
                className="flex items-center gap-4 px-8 py-4 rounded-none bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 transition-all text-[10px] font-black uppercase tracking-[0.5em] text-white/90 hover:text-white"
            >
                {selectedIds.length === scripts.length ? <CheckSquare className="w-4 h-4 text-white" /> : <Square className="w-4 h-4" />}
                {selectedIds.length === scripts.length ? 'Reset All' : 'Batch Select'}
            </button>
            <div className="h-12 w-px bg-white/10 hidden sm:block" />
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/60 mb-2">Status_</span>
                <span className="text-[12px] font-bold text-white uppercase tracking-[0.3em]">
                    <span className="text-white text-xl mr-4">{selectedIds.length.toString().padStart(2, '0')}</span> NODES READY
                </span>
            </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8">
            <AnimatePresence>
            {message && (
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] font-bold text-white bg-white/5 px-8 py-4 border border-white/10 uppercase tracking-[0.5em]"
                >
                    {message}
                </motion.div>
            )}
            </AnimatePresence>
            
            <div className="flex items-center gap-6">
                <button
                    onClick={handleSendSelected}
                    disabled={selectedIds.length === 0 || isSending || isDeleting}
                    className="flex items-center gap-5 px-12 py-5 h-16 bg-white text-black text-[11px] font-black uppercase tracking-[0.5em] disabled:opacity-20 transition-all active:scale-[0.98] shadow-2xl hover:bg-silver"
                >
                    {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                    {isSending ? 'Syncing...' : 'Archive Batch'}
                </button>

                <button
                    onClick={handleDeleteSelected}
                    disabled={selectedIds.length === 0 || isSending || isDeleting}
                    className="flex items-center justify-center h-16 w-16 border border-white/10 text-white/30 hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-500 disabled:opacity-20 transition-all"
                >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
            </div>
        </div>
      </div>

      {/* Grid - Sharp and Systemic */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pb-32">
        {scripts.map((script) => (
          <motion.div
            layoutId={script.id}
            key={script.id}
            className={`group h-[320px] rounded-none border p-12 cursor-pointer relative overflow-hidden flex flex-col transition-all duration-500 
                ${selectedIds.includes(script.id) ? 'border-white bg-white/5' : 'border-white/10 bg-white/[0.01] hover:border-white/30'}
                ${selectedScript?.id === script.id ? 'opacity-0' : 'opacity-100'}
            `}
            onClick={() => setSelectedScript(script)}
          >
            {/* Selection Trigger */}
            <div 
                onClick={(e) => toggleSelect(script.id, e)}
                className={`absolute top-12 left-12 z-10 h-6 w-6 rounded-none border flex items-center justify-center transition-all ${selectedIds.includes(script.id) ? 'bg-white border-white text-black' : 'bg-transparent border-white/20 text-transparent hover:border-white'}`}
            >
                <Check className="w-4 h-4 stroke-[3px]" />
            </div>

            <div className="absolute top-12 right-12 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-x-3 group-hover:translate-x-0">
                <Sparkles className="h-5 w-5 text-white/40" />
            </div>

            <div className="mt-12 mb-10 flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/60">{script.platform} // 0x{script.id.slice(0, 4)}</span>
                </div>
                <h3 className="line-clamp-2 text-2xl font-display font-medium text-white leading-[1.2] group-hover:text-gradient transition-all tracking-wide">
                    {script.title || "NULL_ASSET"}
                </h3>
            </div>

            <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <div className="h-8 w-1 bg-white/10 group-hover:bg-white transition-all" />
                    <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.5em]">{script.tone || 'NEUTRAL'}</span>
                </div>
                <div className="h-10 w-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-white/20 transition-all">
                    <ChevronRight className="w-4 h-4 text-white/60" />
                </div>
            </div>
            
            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/[0.02] to-transparent h-px top-1/2 group-hover:animate-scanline" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedScript && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedScript(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
            />
            
            <motion.div
              layoutId={selectedScript.id}
              className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-none border border-white/10 bg-black shadow-2xl flex flex-col"
            >
              {/* Terminal Header */}
              <div className="px-10 py-10 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-10">
                    <div className="h-14 w-14 rounded-none border border-white/10 flex items-center justify-center bg-white/[0.02]">
                        {selectedScript.platform === 'YouTube' ? (
                            <Youtube className="w-6 h-6 text-white" />
                        ) : selectedScript.platform === 'LinkedIn' ? (
                            <Linkedin className="w-6 h-6 text-white" />
                        ) : (
                            <Sparkles className="w-6 h-6 text-white" />
                        )}
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-4">
                            <span className="text-[9px] font-black text-white/70 uppercase tracking-[0.6em]">{selectedScript.platform} COMMAND</span>
                            <div className="h-1 w-1 bg-white animate-pulse" />
                            <span className="text-[9px] font-black text-white/70 uppercase tracking-[0.6em]">{selectedScript.tone}</span>
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-display font-semibold text-white tracking-[0.05em] uppercase">{selectedScript.title}</h2>
                    </div>
                </div>
                <button 
                  onClick={() => setSelectedScript(null)}
                  className="h-14 w-14 rounded-none border border-white/10 hover:border-white flex items-center justify-center text-white/40 hover:text-white transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Terminal Text Area */}
              <div className="flex-1 overflow-y-auto p-12 lg:p-16 scrollbar-thin scrollbar-thumb-white/5 custom-scrollbar bg-black">
                  <div className="relative group">
                    <div className="absolute -top-3 left-10 bg-black px-4 text-[8px] font-black text-white/60 uppercase tracking-[0.8em] z-10 transition-colors group-focus-within:text-white">Active Vector_</div>
                    <div className="w-full rounded-none border border-white/10 bg-transparent p-12 text-white/90 font-sans text-xl tracking-wide leading-[2] whitespace-pre-wrap min-h-[400px]">
                        {selectedScript.content}
                    </div>
                  </div>
              </div>

              {/* Management Footer */}
              <div className="px-10 py-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 bg-white/[0.01]">
                <div className="flex gap-6 w-full md:w-auto">
                  <button 
                    onClick={async () => {
                      const res = await sendSelectedScripts([selectedScript.id])
                      if (res.success) setMessage('ARCHIVED SUCCESSFUL')
                    }}
                    className="flex-1 md:flex-none flex items-center justify-center gap-4 rounded-none bg-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-black hover:bg-silver transition-all shadow-xl active:scale-[0.98]"
                  >
                    <Mail className="h-4 w-4" />
                    Archive Output
                  </button>
                  <Link href={`/editor?id=${selectedScript.id}`} className="flex-1 md:flex-none">
                    <button 
                        className="w-full flex items-center justify-center gap-4 rounded-none border border-white/10 px-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-white/90 hover:border-white hover:text-white hover:bg-white/5 transition-all"
                    >
                        Re-Execute
                    </button>
                  </Link>
                </div>
                <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] flex items-center gap-4">
                    <Terminal className="w-3 h-3" />
                    Node_ID: {selectedScript.id}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
