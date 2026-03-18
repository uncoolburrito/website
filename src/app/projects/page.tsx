"use client";

import { motion } from "framer-motion";
import { MoveRight, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
    return (
        <main className="min-h-screen py-16 sm:py-32 w-full max-w-4xl mx-auto px-5 sm:px-6 flex flex-col antialiased">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col mb-16"
            >
                <div className="flex items-center gap-2 text-foreground/50 text-sm font-medium mb-4 uppercase tracking-wider">
                    <MoveRight className="w-4 h-4" />
                    <span>Projects</span>
                </div>
                <h1 className="text-4xl sm:text-[60px] leading-[1.1] font-bold tracking-tight text-foreground">
                    Stuff I've Built.
                </h1>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="group relative p-8 md:p-10 border border-foreground/10 rounded-[2.5rem] bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-all duration-500 overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-4 group-hover:translate-y-0 text-foreground/20">
                    <ExternalLink className="w-8 h-8" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-5">
                    Quasar Visualizer
                </h2>
                
                <div className="flex flex-wrap gap-2 mb-8">
                    <span className="px-4 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 text-xs font-mono tracking-wide text-foreground/70">Web Audio API</span>
                    <span className="px-4 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 text-xs font-mono tracking-wide text-foreground/70">Canvas</span>
                    <span className="px-4 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 text-xs font-mono tracking-wide text-foreground/70">Three.js</span>
                    <span className="px-4 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 text-xs font-mono tracking-wide text-foreground/70">FFT</span>
                </div>

                <div className="space-y-4 text-foreground/80 leading-[1.8] text-[17px] mb-10 max-w-2xl">
                    <p>
                        I was really bored one night so I built a browser-based, real-time music visualizer. 
                        You can upload a song and watch the visualizer dynamically react to the bass, melody, 
                        and high frequencies: terrain breathes with bass, elements flow with mids, and light 
                        shimmers with highs, so it genuinely feels like you can see the music.
                    </p>
                    
                    <div className="bg-background/50 border border-foreground/10 rounded-3xl p-6 sm:p-8 mt-8">
                        <h3 className="font-bold tracking-tight text-xl text-foreground mb-4 flex items-center gap-3">
                            <span className="text-2xl">✌️</span> How it works
                        </h3>
                        <ol className="list-decimal list-inside space-y-3 font-medium text-foreground/70">
                            <li>Open the site</li>
                            <li>Upload an audio file</li>
                            <li>Press play</li>
                            <li>Switch between modes (Landscape / Calm)</li>
                            <li>Watch the environment respond in real time</li>
                        </ol>
                    </div>
                </div>

                <Link 
                    href="https://quasar.ramiz.studio" 
                    target="_blank"
                    className="inline-flex items-center gap-3 font-bold text-background bg-foreground hover:scale-105 active:scale-95 transition-transform duration-300 px-8 py-4 rounded-full"
                >
                    Launch Visualizer <ExternalLink className="w-4 h-4" />
                </Link>
            </motion.div>
        </main>
    );
}
