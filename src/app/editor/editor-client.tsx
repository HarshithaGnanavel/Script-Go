'use client'

import { useState, useEffect, useRef, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { generateScript, saveScript } from './actions' // We'll add saveScript logic inside client or import
import Link from 'next/link'
import { ArrowLeft, Copy, Save, Loader2, Sparkles } from 'lucide-react'
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
      className="flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Generate Script
        </>
      )}
    </button>
  )
}

export default function EditorClient({ initialData }: { initialData: any }) {
  const [state, dispatch, isPending] = useActionState(generateScript, initialState)
  const [content, setContent] = useState(initialData?.content || '')
  const [currentId, setCurrentId] = useState(initialData?.id || '')
  const [isSaving, setIsSaving] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    if (initialData) {
        setContent(initialData.content || '')
        setCurrentId(initialData.id || '')
    }
  }, [initialData])

  useEffect(() => {
    if (state?.success && state?.content) {
      setContent(state.content)
      if (state.id) {
          setCurrentId(state.id)
          // Update URL without reload if it's a new script
          if (!currentId && state.id) { // Use currentId to check if it WAS a new script
              window.history.pushState(null, '', `/editor?id=${state.id}`)
          }
      }
    }
  }, [state, currentId])

  const handleCopy = async () => {
    if (!content) return
    await navigator.clipboard.writeText(content)
    // Could add toast here
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
    <div className="flex h-screen flex-col bg-background md:flex-row overflow-hidden">
      {/* LEFT SIDE: Input Form */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r border-border bg-card p-6 flex flex-col h-full overflow-y-auto z-10 shadow-xl">
        <div className="mb-6 flex items-center gap-2">
          <Link href="/dashboard" className="rounded-full p-2 hover:bg-zinc-800 transition-colors">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </Link>
          <h1 className="text-xl font-bold">Script Editor</h1>
        </div>

        <form action={dispatch} className="flex-1 flex flex-col gap-6">
            <input type="hidden" name="id" value={currentId} />
            
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Platform
            </label>
            <div className="relative">
                <select
                name="platform"
                defaultValue={initialData?.platform || 'LinkedIn'}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                >
                <option value="LinkedIn">LinkedIn</option>
                <option value="YouTube">YouTube</option>
                </select>
                <div className="absolute right-3 top-2.5 pointer-events-none">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Topic
            </label>
            <input
              name="topic"
              required
              defaultValue={initialData?.title || ''}
              placeholder="e.g. How to get a job in AI"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Tone
            </label>
             <div className="relative">
                <select
                name="tone"
                defaultValue={initialData?.tone || 'Professional'}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                >
                <option value="Professional">Professional</option>
                <option value="Funny">Funny</option>
                <option value="Casual">Casual</option>
                <option value="Educational">Educational</option>
                </select>
                <div className="absolute right-3 top-2.5 pointer-events-none">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>
          </div>

            <div className="mt-auto pt-6">
                <SubmitButton />
                {state?.error && (
                    <p className="mt-2 text-xs text-red-400 text-center">{state.error}</p>
                )}
            </div>
        </form>
      </div>

      {/* RIGHT SIDE: Output Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950/50">
         <div className="border-b border-border bg-card/30 p-4 flex items-center justify-between">
            <div className="text-sm font-medium text-muted-foreground">Generated Output</div>
            <div className="flex items-center gap-2">
                {currentId && (
                     <button 
                        onClick={handleManualSave}
                        disabled={isSaving}
                        className="inline-flex items-center gap-1.5 rounded-md bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-700 transition-colors disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-3 h-3 animate-spin"/> : <Save className="w-3 h-3" />}
                        Save Changes
                    </button>
                )}
                <button 
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-zinc-900 hover:bg-zinc-200 transition-colors"
                >
                    <Copy className="w-3 h-3" />
                    Copy
                </button>
            </div>
         </div>
         <div className="flex-1 p-6 overflow-hidden">
             <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Your generated script will appear here..."
                className="w-full h-full resize-none rounded-lg border-2 border-dashed border-zinc-800 bg-transparent p-4 text-zinc-100 placeholder:text-zinc-700 focus:border-indigo-500/50 focus:outline-none focus:ring-0 font-mono text-sm leading-relaxed"
             />
         </div>
      </div>
    </div>
  )
}
