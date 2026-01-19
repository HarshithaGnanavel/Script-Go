'use client'

import { useState } from 'react'
import { Youtube, Linkedin, Sparkles, X, Copy, Calendar, Mail, Check, CheckSquare, Square, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { sendSelectedScripts, deleteMultipleScripts } from './actions'

export default function ScriptGrid({ scripts }: { scripts: any[] }) {
  const [selectedScript, setSelectedScript] = useState<any>(null)
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
      setMessage(`Successfully sent ${selectedIds.length} script(s)!`)
      setSelectedIds([])
      setTimeout(() => setMessage(''), 5000)
    } else {
      setMessage(`Error: ${res.error}`)
      setTimeout(() => setMessage(''), 5000)
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} scripts? This action cannot be undone.`)) return
    
    setIsDeleting(true)
    const res = await deleteMultipleScripts(selectedIds)
    setIsDeleting(false)
    
    if (res.success) {
      setMessage(`Deleted ${selectedIds.length} script(s).`)
      setSelectedIds([])
      setTimeout(() => setMessage(''), 5000)
    } else {
      setMessage(`Error: ${res.error}`)
      setTimeout(() => setMessage(''), 5000)
    }
  }

  return (
    <>
      <div className="mb-8 flex flex-col lg:flex-row items-center justify-between gap-6 bg-zinc-950/40 p-6 lg:px-10 rounded-[2.5rem] border border-white/5 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-8">
            <button 
                onClick={toggleSelectAll}
                className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm font-bold text-zinc-300 hover:text-white"
            >
                {selectedIds.length === scripts.length ? <CheckSquare className="w-5 h-5 text-indigo-500" /> : <Square className="w-5 h-5" />}
                {selectedIds.length === scripts.length ? 'Deselect All' : 'Select All'}
            </button>
            <div className="h-8 w-px bg-white/10 hidden sm:block" />
            <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest text-zinc-600 mb-0.5">Selection</span>
                <span className="text-sm font-bold text-zinc-400">
                    <span className="text-white text-base">{selectedIds.length}</span> items selected
                </span>
            </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
            {message && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-5 py-2.5 rounded-2xl border border-indigo-500/20 mr-2"
                >
                    {message}
                </motion.div>
            )}
            
            <div className="flex items-center gap-3">
                <button
                    onClick={handleSendSelected}
                    disabled={selectedIds.length === 0 || isSending || isDeleting}
                    className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-indigo-600 text-white text-sm font-bold shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 group"
                >
                    {isSending ? <Sparkles className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                    {isSending ? 'Sending...' : 'Email Selected'}
                </button>

                <button
                    onClick={handleDeleteSelected}
                    disabled={selectedIds.length === 0 || isSending || isDeleting}
                    className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 text-sm font-bold hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 group"
                >
                    {isDeleting ? <Sparkles className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {scripts.map((script) => (
          <motion.div
            layoutId={script.id}
            key={script.id}
            whileHover={{ y: -8 }}
            className={`group premium-card rounded-[2.5rem] p-8 cursor-pointer relative overflow-hidden flex flex-col min-h-[220px] transition-all duration-300 ${selectedIds.includes(script.id) ? 'ring-2 ring-indigo-500 bg-indigo-500/5 border-indigo-500/20' : ''}`}
            onClick={() => setSelectedScript(script)}
          >
            {/* Selection Checkbox */}
            <div 
                onClick={(e) => toggleSelect(script.id, e)}
                className={`absolute top-6 left-6 z-10 h-6 w-6 rounded-lg border flex items-center justify-center transition-all ${selectedIds.includes(script.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-black/40 border-white/10 text-transparent hover:border-indigo-500'}`}
            >
                <Check className="w-4 h-4 stroke-[3px]" />
            </div>

            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-indigo-400" />
                </div>
            </div>

            <div className="mb-6 pt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-900 border border-white/5 mb-4 group-hover:border-indigo-500/30 transition-colors">
                    {script.platform === 'YouTube' ? (
                        <Youtube className="w-3.5 h-3.5 text-red-500" />
                    ) : (
                        <Linkedin className="w-3.5 h-3.5 text-blue-500" />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{script.platform}</span>
                </div>
                <h3 className="line-clamp-2 text-xl font-bold text-white leading-snug group-hover:text-indigo-400 transition-colors">
                    {script.title || "Untitled Script"}
                </h3>
            </div>

            <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-indigo-400">{script.tone?.charAt(0)}</span>
                    </div>
                    <span className="text-xs font-bold text-zinc-500">{script.tone || 'Professional'}</span>
                </div>
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                    {new Date(script.created_at).toLocaleDateString()}
                </span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedScript && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedScript(null)}
              className="absolute inset-0 bg-[#020617]/95 backdrop-blur-2xl"
            />
            
            <motion.div
              layoutId={selectedScript.id}
              className="relative w-full max-w-5xl max-h-[85vh] overflow-hidden rounded-[3rem] border border-white/5 bg-zinc-950 shadow-[0_0_100px_rgba(99,102,241,0.05)] premium-card flex flex-col"
            >
              {/* Header */}
              <div className="p-8 lg:p-12 border-b border-white/5 flex items-center justify-between bg-zinc-950/50">
                <div className="flex items-center gap-8">
                    <div className="h-16 w-16 rounded-[1.5rem] bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center">
                        {selectedScript.platform === 'YouTube' ? (
                            <Youtube className="w-8 h-8 text-red-500" />
                        ) : (
                            <Linkedin className="w-8 h-8 text-blue-500" />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{selectedScript.platform}</span>
                            <div className="h-1 w-1 rounded-full bg-zinc-800" />
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{selectedScript.tone}</span>
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">{selectedScript.title}</h2>
                    </div>
                </div>
                <button 
                  onClick={() => setSelectedScript(null)}
                  className="h-12 w-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 transition-all border border-white/5"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-8 lg:p-12 scrollbar-thin scrollbar-thumb-indigo-500/10 custom-scrollbar">
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-zinc-300 leading-[1.8] text-lg bg-black/40 p-10 rounded-[2rem] border border-white/5">
                    {selectedScript.content}
                  </pre>
                </div>
              </div>

              {/* Footer */}
              <div className="p-8 lg:p-10 border-t border-white/5 flex items-center justify-between bg-zinc-950/50">
                <div className="flex gap-4">
                  <button 
                    onClick={async () => {
                      const res = await sendSelectedScripts([selectedScript.id])
                      if (res.success) setMessage('Script sent to email!')
                    }}
                    className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
                  >
                    <Mail className="h-4 w-4" />
                    Send to Email (Single)
                  </button>
                  <Link href={`/editor?id=${selectedScript.id}`}>
                    <button 
                        className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-8 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-all active:scale-95"
                    >
                        Refine in Editor
                    </button>
                  </Link>
                </div>
                <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">
                    System ID: {selectedScript.id.slice(0,8)}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
