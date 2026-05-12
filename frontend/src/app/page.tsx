"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, MoveRight, Layers, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// 模拟的占位数据，后续对接后端
const SAMPLE_TEXT = [
  { id: 1, text: "The university's ", isHighlight: false },
  { id: 2, text: "draconian", isHighlight: true, type: "slang", meaning: "very strict or severe" },
  { id: 3, text: " policies regarding dormitory curfews have sparked widespread ", isHighlight: false },
  { id: 4, text: "backlash", isHighlight: true, type: "style", meaning: "strong negative reaction" },
  { id: 5, text: " among the student body, many of whom argue that such ", isHighlight: false },
  { id: 6, text: "archaic", isHighlight: true, type: "slang", meaning: "very old or old-fashioned" },
  { id: 7, text: " rules are incompatible with modern academic life.", isHighlight: false },
];

export default function Home() {
  const [activeToken, setActiveToken] = useState<any>(null);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 flex flex-col md:flex-row overflow-hidden selection:bg-indigo-500/30">
      
      {/* 导航/侧边栏 (极简) */}
      <motion.nav 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full md:w-20 md:h-screen border-r border-zinc-200 dark:border-zinc-800 flex flex-row md:flex-col items-center justify-between py-6 px-4 bg-white dark:bg-[#0a0a0a] z-20"
      >
        <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20 text-white font-bold tracking-tighter">
          T.
        </div>
        <div className="flex md:flex-col gap-6">
          <BookOpen className="w-5 h-5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors" />
          <Layers className="w-5 h-5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors" />
        </div>
        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" />
      </motion.nav>

      {/* 左侧：沉浸式阅读区 */}
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 h-screen overflow-y-auto p-8 md:p-24 lg:p-32 relative"
      >
        <div className="max-w-3xl mx-auto relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8 border border-indigo-100 dark:border-indigo-500/20">
            <Sparkles className="w-4 h-4" />
            <span>The Economist Style Reading</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif tracking-tight font-medium mb-12 leading-[1.1]">
            Campus Life & Academic Policies
          </h1>

          <div className="text-xl md:text-2xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-serif">
            {SAMPLE_TEXT.map((token, idx) => {
              if (token.isHighlight) {
                return (
                  <motion.span
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveToken(token)}
                    className={`inline-block mx-1 px-1.5 rounded-md cursor-pointer transition-colors duration-300
                      ${activeToken?.id === token.id 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/60'
                      }`}
                  >
                    {token.text}
                  </motion.span>
                );
              }
              return <span key={idx}>{token.text}</span>;
            })}
          </div>
        </div>
      </motion.main>

      {/* 右侧：智能分析悬浮窗 (Godly Vibe) */}
      <AnimatePresence>
        {activeToken && (
          <motion.aside
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full md:w-[400px] h-auto md:h-screen fixed md:sticky bottom-0 right-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-2xl border-l border-zinc-200 dark:border-zinc-800 p-8 shadow-2xl flex flex-col z-30"
          >
            <div className="flex items-center justify-between mb-8">
              <span className="text-xs font-mono tracking-widest uppercase text-zinc-400">Analysis Panel</span>
              <button 
                onClick={() => setActiveToken(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <MoveRight className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              </button>
            </div>

            <div className="flex-1">
              <motion.h2 
                key={activeToken.text}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-serif font-medium mb-4"
              >
                {activeToken.text}
              </motion.h2>

              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                  <div className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-2">Definition</div>
                  <div className="text-zinc-800 dark:text-zinc-200">{activeToken.meaning}</div>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
                  <div className="text-xs uppercase tracking-wider text-indigo-500 font-semibold mb-2">Economist Style</div>
                  <div className="text-indigo-900 dark:text-indigo-200 text-sm leading-relaxed">
                    This word elevates the register from common plain English (e.g., "very strict") to a more authoritative, journalistic tone commonly found in high-end publications.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800">
              <Button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 h-12 rounded-xl flex items-center justify-center gap-2 group transition-all">
                Add to Flashcards
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
