'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Typewriter Component
const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const characters = text.split("")
  
  return (
    <span className="inline-block">
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.1,
            delay: delay + index * 0.05,
            ease: "easeOut"
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  )
}

export default function LandingPage() {
  return (
    <div className="flex flex-col h-dvh relative font-sans text-white overflow-hidden bg-black selection:bg-[#8b5cf6]/30">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 grid-pattern opacity-[0.6]"></div>
      <div className="fixed top-[-15%] right-[-10%] w-[70vw] h-[70vw] lens-flare pointer-events-none z-0 opacity-80"></div>

      {/* Navigation */}
      <nav className="relative z-50 px-4 md:px-8 pt-12 pb-6 w-full flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-4"
        >
          <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
            <span className="text-black font-display font-bold text-base">S</span>
          </div>
          <span className="font-display text-xl tracking-tight font-semibold uppercase">ScriptGo</span>
        </motion.div>
        
        {/* <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:block"
        >
        </motion.div> */}
      </nav>

      {/* Main Content */}
      <main className="relative z-15 flex-grow flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center">
          
          {/* Animated Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-semibold leading-[1.1] tracking-[0.08em] text-gradient mb-4 overflow-hidden flex flex-col items-center">
            <div className="flex flex-wrap justify-center gap-x-3 md:gap-x-4">
               <TypewriterText text="TRANSFORM YOUR IDEAS" delay={0.5} />
            </div>
            <div className="flex flex-wrap justify-center gap-x-3 md:gap-x-4">
               <TypewriterText text="INTO VIRAL SCRIPTS" delay={2.5} />
            </div>
            
            {/* Catchy Sub-quote */}
            <motion.div 
               initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
               animate={{ opacity: 0.6, y: 0, filter: 'blur(0px)' }}
               transition={{ delay: 4.5, duration: 1.2, ease: "easeOut" }}
               className="italic mt-6 md:mt-8 opacity-60 text-gradient mb-2 text-2xl md:text-4xl font-light tracking-widest"
            >
               INSTANTLY.
            </motion.div>
          </h1>

          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4, duration: 1.5 }}
            className="max-w-2xl mx-auto text-xs md:text-lg text-white/50 font-medium mb-2 leading-[1.8] tracking-widest uppercase"
          >
            High-performance script generation for the digital elite. <br className="hidden md:block"/>
            LinkedIn • Instagram • YouTube
          </motion.p>
        </div>
      </main>

      {/* Footer / CTA */}
      <footer className="relative z-10 pb-20 flex flex-col items-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 4.5, duration: 0.8 }}
        >
          <Link 
            href="/login" 
            className="group relative bg-white text-black px-12 md:px-16 py-6 md:py-7 rounded-none font-bold text-[10px] md:text-[11px] uppercase tracking-[0.4em] md:tracking-[0.5em] transition-all hover:bg-silver active:scale-95 cta-glow-pulse inline-block cursor-pointer"
          >
              Enter the Future of Content
          </Link>
        </motion.div>

        {/* <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 0.15 }}
           transition={{ delay: 5.2, duration: 1 }}
           className="mt-16 flex gap-8 md:gap-16 text-[9px] font-medium tracking-[0.4em] md:tracking-[0.6em] uppercase"
        >
          <a href="#" className="hover:text-white hover:opacity-100 transition-all">LinkedIn</a>
          <a href="#" className="hover:text-white hover:opacity-100 transition-all">Instagram</a>
          <a href="#" className="hover:text-white hover:opacity-100 transition-all">YouTube</a>
        </motion.div> */}
      </footer>
    </div>
  )
}
