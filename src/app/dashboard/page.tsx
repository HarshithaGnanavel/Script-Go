import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, LogOut } from 'lucide-react'
import ScriptGrid from './script-grid'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
      redirect('/login')
  }

  const { data: scripts } = await supabase
    .from('scripts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const signOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
             <div className="h-8 w-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">S</div>
             <span className="font-bold text-xl tracking-tight">ScriptGo</span>
          </div>
          <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:inline-block">{user.email}</span>
               <form action={signOut}>
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 hover:bg-zinc-800 px-3 py-1.5 rounded-md">
                    <LogOut className="w-4 h-4" />
                    Sign out
                </button>
               </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Your Scripts</h1>
            <p className="text-muted-foreground mt-1">Manage and organize your generated content.</p>
          </div>
           <Link href="/editor">
            <button className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95 shadow-indigo-500/20">
              <Plus className="h-4 w-4" />
              New Script
            </button>
          </Link>
        </div>

        {!scripts || scripts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800 p-12 text-center bg-card/30">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 mb-4">
                <Plus className="h-6 w-6 text-zinc-400" />
            </div>
            <h3 className="text-lg font-medium">No scripts yet</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              Get started by creating your first AI-generated script for YouTube or LinkedIn.
            </p>
             <Link href="/editor" className="mt-4">
                <span className="text-indigo-500 hover:text-indigo-400 text-sm font-medium">Create your first script &rarr;</span>
             </Link>
          </div>
        ) : (
          <ScriptGrid scripts={scripts} />
        )}
      </main>
    </div>
  )
}
