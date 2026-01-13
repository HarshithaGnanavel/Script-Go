'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  ChevronRight, 
  ArrowUpRight, 
  Play, 
  User, 
  ShieldCheck,
  Cpu,
  Zap,
  Layers,
  Search
} from 'lucide-react'

// Dynamic node component for the background effect
const FloatingNode = ({ name, value, x, y, icon: Icon, delay = 0 }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ 
      opacity: [0.4, 0.7, 0.4],
      y: [0, -10, 0],
      scale: [1, 1.05, 1]
    }}
    transition={{ 
      duration: 5, 
      repeat: Infinity,
      delay: delay 
    }}
    style={{ left: x, top: y }}
    className="absolute flex items-center gap-4 group cursor-default"
  >
    <div className="relative">
      <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md group-hover:border-indigo-500/50 transition-colors">
        <Icon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
      </div>
      {/* Connecting line simulation */}
      <div className="absolute top-1/2 left-full w-20 h-px bg-gradient-to-r from-white/10 to-transparent -translate-y-1/2" />
    </div>
    <div className="flex flex-col">
      <span className="text-[11px] font-bold text-zinc-300 tracking-tight flex items-center gap-1">
        <div className="w-1 h-1 rounded-full bg-indigo-500" />
        {name}
      </span>
      <span className="text-[10px] font-medium text-zinc-600 tracking-tighter">{value}</span>
    </div>
  </motion.div>
)

export default function LandingPage() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        {/* Central Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-indigo-600/10 blur-[180px] rounded-full opacity-60" />
        
        {/* Floating Light Streaks */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-40 bg-gradient-to-t from-indigo-500/40 to-transparent" />
        <div className="absolute bottom-0 left-[48%] -translate-x-1/2 w-[1px] h-24 bg-gradient-to-t from-indigo-500/20 to-transparent" />
        <div className="absolute bottom-0 left-[52%] -translate-x-1/2 w-[1px] h-32 bg-gradient-to-t from-indigo-500/20 to-transparent" />

        {/* Nodes based on the design image */}
        <FloatingNode name="AIDA Engine" value="20.945" x="12%" y="30%" icon={Cpu} delay={0} />
        <FloatingNode name="PAS Framework" value="19.346" x="8%" y="70%" icon={Layers} delay={1} />
        <FloatingNode name="Neural Logic" value="2.945" x="80%" y="35%" icon={Zap} delay={2} />
        <FloatingNode name="Semantic Map" value="440" x="82%" y="72%" icon={Search} delay={1.5} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-8 w-full z-50 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center bg-black/20 backdrop-blur-md px-8 py-4 rounded-full border border-white/5">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-lg shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
              S
            </div>
            <span className="text-xl font-bold tracking-tight text-white transition-colors">ScriptGo</span>
          </Link>

          {/* Right Action */}
          <Link href="/login" className="flex items-center gap-3 text-xs font-bold tracking-tight text-zinc-400 hover:text-white transition-colors group">
             <User className="w-4 h-4 group-hover:text-indigo-400 transition-colors" />
             Create Account
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-20 min-h-screen px-6">
        

        {/* Main Heading */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="text-center max-w-5xl"
        >
          <h1 className="text-6xl md:text-9xl font-black leading-[0.9] tracking-tighter mb-12">
            <span className="text-white block">One-click for</span>
            <span className="text-zinc-500">Content Mastery</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-16 leading-relaxed font-medium">
            Dive into the creator ecosystem, where innovative AI intelligence meets strategic creative expertise.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center mb-32"
        >
          <Link href="/login" className="px-12 py-5 rounded-full bg-white text-black text-xs font-black shadow-2xl shadow-white/10 hover:shadow-white/20 hover:scale-105 active:scale-95 transition-all">
             Begin Experience
          </Link>
        </motion.div>

      </main>

      {/* Minimal Footer */}
      <footer className="absolute bottom-12 w-full px-6 flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity">
         <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">© 2026 ScriptGo Studio</div>
         <div className="flex gap-8">
            <a href="#" className="text-[10px] font-bold text-zinc-600 hover:text-white uppercase tracking-widest transition-colors">Terminus</a>
            <a href="#" className="text-[10px] font-bold text-zinc-600 hover:text-white uppercase tracking-widest transition-colors">Secretum</a>
         </div>
      </footer>
    </div>
  )
}
