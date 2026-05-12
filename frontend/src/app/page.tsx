"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MoveRight, Activity, BookOpen, Layers, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_TEXT = 
  "The university's draconian policies regarding dormitory curfews have sparked widespread backlash among the student body, many of whom argue that such archaic rules are incompatible with modern academic life. Therefore, the administration must reconsider its stance because a strict approach may ultimately suppress student engagement.";

export default function Home() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("http://127.0.0.1:4173/api/style/economist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 flex flex-col md:flex-row overflow-hidden selection:bg-indigo-500/30">
      
      {/* 极简导航 */}
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
          <BookOpen className="w-5 h-5 text-indigo-600 cursor-pointer" />
          <Layers className="w-5 h-5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors" />
        </div>
        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" />
      </motion.nav>

      {/* 左侧：输入与阅读区 */}
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 h-screen overflow-y-auto p-8 md:p-24 lg:p-32 relative"
      >
        <div className="max-w-3xl mx-auto relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8 border border-indigo-100 dark:border-indigo-500/20">
            <Sparkles className="w-4 h-4" />
            <span>The Economist Style Engine</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif tracking-tight font-medium mb-12 leading-[1.1]">
            Evaluate Your Academic Prose
          </h1>

          <div className="relative group">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-64 p-6 text-xl md:text-2xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-serif bg-white dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm transition-all"
              placeholder="Paste your essay here..."
            />
            
            <div className="absolute bottom-6 right-6">
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || !text.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 px-6 h-12"
              >
                {isAnalyzing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Activity className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <>
                    Analyze <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.main>

      {/* 右侧：分析仪表盘 */}
      <AnimatePresence>
        {analysis && (
          <motion.aside
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="w-full md:w-[450px] lg:w-[500px] h-screen fixed right-0 bg-white dark:bg-[#111] border-l border-zinc-200 dark:border-zinc-800 overflow-y-auto shadow-2xl z-30 flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-zinc-100 dark:border-zinc-800/50 sticky top-0 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md z-10 flex justify-between items-start">
              <div>
                <h2 className="text-sm font-mono tracking-widest uppercase text-zinc-400 mb-2">Style Report</h2>
                <div className="text-3xl font-serif font-medium">{analysis.title}</div>
              </div>
              <button 
                onClick={() => setAnalysis(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <MoveRight className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            <div className="p-8 space-y-10">
              {/* Overall Score */}
              <div>
                <div className="flex items-end gap-4 mb-4">
                  <div className={`text-6xl font-light tracking-tighter ${analysis.overallScore > 70 ? 'text-emerald-500' : analysis.overallScore > 40 ? 'text-amber-500' : 'text-rose-500'}`}>
                    {analysis.overallScore}
                  </div>
                  <div className="text-zinc-400 font-mono text-sm pb-2">/ 100</div>
                </div>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {analysis.summary}
                </p>
              </div>

              {/* Metrics */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-6">Metrics Breakdown</h3>
                <div className="space-y-6">
                  {analysis.metrics?.map((metric: any) => (
                    <div key={metric.id} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{metric.label}</span>
                        <span className="text-xs font-mono text-zinc-500">{metric.score}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: \`\${metric.score}%\` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={\`h-full rounded-full \${metric.score > 70 ? 'bg-emerald-500' : metric.score > 40 ? 'bg-amber-500' : 'bg-rose-500'}\`}
                        />
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-tight pt-1">{metric.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              {analysis.suggestions?.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-4">Actionable Suggestions</h3>
                  <div className="space-y-3">
                    {analysis.suggestions.map((sug: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80">
                        <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">{sug.issue}</div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">{sug.action}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
