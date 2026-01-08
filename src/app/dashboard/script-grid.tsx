'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Youtube, Linkedin, Trash2, Edit, X, Calendar, FileText } from 'lucide-react'
import { deleteScript } from './actions'

type Script = {
  id: string
  title: string
  content: string | null
  platform: string
  tone: string
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scripts.map((script) => (
          <div
            key={script.id}
            onClick={() => setSelectedScript(script)}
            className="group relative rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 shadow-sm transition-all hover:border-indigo-500/50 hover:shadow-md hover:shadow-indigo-500/10 h-full flex flex-col cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                script.platform === 'YouTube'
                  ? 'bg-red-500/10 text-red-500 ring-red-500/20'
                  : 'bg-blue-500/10 text-blue-500 ring-blue-500/20'
              }`}>
                {script.platform === 'YouTube' ? <Youtube className="w-3 h-3" /> : <Linkedin className="w-3 h-3" />}
                {script.platform}
              </span>
              <span className="text-xs text-zinc-500">
                {new Date(script.created_at).toLocaleDateString()}
              </span>
            </div>
            <h3 className="font-semibold leading-tight line-clamp-1 group-hover:text-indigo-400 transition-colors mb-2 text-zinc-100">
              {script.title}
            </h3>
            <p className="text-sm text-zinc-400 line-clamp-3">
              {script.content || "No content generated yet."}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedScript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedScript(null)}
          />
          
          <div className="relative w-full max-w-2xl transform overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-6 text-left shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-lg ${
                    selectedScript.platform === 'YouTube' 
                        ? 'bg-red-500/10 text-red-500' 
                        : 'bg-blue-500/10 text-blue-500'
                 }`}>
                    {selectedScript.platform === 'YouTube' ? <Youtube className="w-5 h-5" /> : <Linkedin className="w-5 h-5" />}
                 </div>
                 <div>
                    <h2 className="text-lg font-semibold text-zinc-100">{selectedScript.title}</h2>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(selectedScript.created_at)}
                        <span>•</span>
                        <span className="capitalize">{selectedScript.tone} Tone</span>
                    </div>
                 </div>
              </div>
              <button
                onClick={() => setSelectedScript(null)}
                className="rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-8">
               <div className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                   <FileText className="w-4 h-4" />
                   Script Content
               </div>
               <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 max-h-[60vh] overflow-y-auto font-mono text-sm text-zinc-300 whitespace-pre-wrap">
                   {selectedScript.content || "No content available."}
               </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
               <button
                onClick={() => handleDelete(selectedScript.id)}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-md bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/20 disabled:opacity-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              
              <Link
                href={`/editor?id=${selectedScript.id}`}
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
              >
                <Edit className="w-4 h-4" />
                Open Editor
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
