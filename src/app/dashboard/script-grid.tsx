'use client'

import { useState } from 'react'
import { Youtube, Linkedin, Sparkles, X, Copy, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function ScriptGrid({ scripts }: { scripts: any[] }) {
  const [selectedScript, setSelectedScript] = useState<any>(null)
  
  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {scripts.map((script) => (
          <motion.div
            layoutId={script.id}
            key={script.id}
            whileHover={{ y: -8 }}
            className="group premium-card rounded-[2.5rem] p-8 cursor-pointer relative overflow-hidden flex flex-col min-h-[220px]"
            onClick={() => setSelectedScript(script)}
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-indigo-400" />
                </div>
            </div>

            <div className="mb-6">
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
                    onClick={() => handleCopy(selectedScript.content)}
                    className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
                  >
                    <Copy className="h-4 w-4" />
                    Copy to Clipboard
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
