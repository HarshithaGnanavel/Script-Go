'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Youtube, Linkedin, Trash2, Edit, X, Calendar, FileText, Copy } from 'lucide-react'
import { deleteScript } from './actions'

type Script = {
  id: string
  title: string
  content: string | null
  platform: string
  tone: string
  language?: string
  framework?: string
  length?: string
  created_at: string
  user_id: string
}

export default function ScriptGrid({ scripts }: { scripts: Script[] }) {
  const [selectedScript, setSelectedScript] = useState<Script | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this script?')) return

    setIsDeleting(true)
    const result = await deleteScript(id)
    setIsDeleting(false)

    if (result.success) {
      setSelectedScript(null)
    } else {
      alert('Failed to delete script')
    }
  }

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {scripts.map((script) => (
          <div
            key={script.id}
            onClick={() => setSelectedScript(script)}
            className="group glass border border-white/5 hover:border-indigo-500/50 p-6 rounded-2xl shadow-xl transition-all hover:-translate-y-1 cursor-pointer flex flex-col h-full relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center justify-between mb-4 relative">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                script.platform === 'YouTube'
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>
                {script.platform === 'YouTube' ? <Youtube className="w-3 h-3" /> : <Linkedin className="w-3 h-3" />}
                {script.platform}
              </span>
              <span className="text-[11px] font-medium text-zinc-500">
                {new Date(script.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h3 className="font-bold text-lg text-white mb-3 line-clamp-1 group-hover:text-indigo-400 transition-colors relative">
              {script.title}
            </h3>
            <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed relative flex-1">
              {script.content || "No content generated yet."}
            </p>
            
            <div className="mt-6 flex items-center gap-2 relative">
                <div className="h-1 w-1 rounded-full bg-indigo-500/50" />
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">{script.tone} Tone</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedScript && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300"
            onClick={() => setSelectedScript(null)}
          />
          
          <div className="relative w-full max-w-3xl transform overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl transition-all animate-in zoom-in-95 fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-4">
                 <div className={`p-3 rounded-2xl ${
                    selectedScript.platform === 'YouTube' 
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                        : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                 }`}>
                    {selectedScript.platform === 'YouTube' ? <Youtube className="w-6 h-6" /> : <Linkedin className="w-6 h-6" />}
                 </div>
                 <div className="space-y-1">
                    <h2 className="text-xl font-bold text-white leading-tight">{selectedScript.title}</h2>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-zinc-400 font-medium">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(selectedScript.created_at)}
                        </div>
                        <span className="h-1 w-1 rounded-full bg-zinc-700" />
                        <span className="capitalize">{selectedScript.tone} Tone</span>
                        {selectedScript.language && (
                           <>
                               <span className="h-1 w-1 rounded-full bg-zinc-700" />
                               <span>{selectedScript.language}</span>
                           </>
                        )}
                        {selectedScript.framework && (
                           <>
                               <span className="h-1 w-1 rounded-full bg-zinc-700" />
                               <span className="bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20">{selectedScript.framework}</span>
                           </>
                        )}
                    </div>
                 </div>
              </div>
              <button
                onClick={() => setSelectedScript(null)}
                className="absolute top-6 right-6 sm:relative sm:top-0 sm:right-0 p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 pb-4">
               <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
                   <FileText className="w-4 h-4 text-indigo-500" />
                   Generated Script
               </div>
               <div className="relative group/content">
                    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
                    <div className="rounded-2xl border border-white/5 bg-black/40 p-6 max-h-[50vh] overflow-y-auto font-mono text-sm text-zinc-300 leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                        <pre className="whitespace-pre-wrap font-sans">
                            {selectedScript.content || "No content available."}
                        </pre>
                    </div>
                    <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
               </div>
            </div>

            <div className="flex items-center justify-between gap-4 p-8 pt-4">
                <button
                    onClick={() => handleDelete(selectedScript.id)}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-500/5 px-5 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10 border border-red-500/10 transition-all disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
                
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            if (selectedScript.content) {
                                navigator.clipboard.writeText(selectedScript.content)
                                // show toast
                            }
                        }}
                        className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all"
                    >
                        <Copy className="w-5 h-5" />
                    </button>
                    <Link
                        href={`/editor?id=${selectedScript.id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
                    >
                        <Edit className="w-4 h-4" />
                        Edit Script
                    </Link>
                </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
