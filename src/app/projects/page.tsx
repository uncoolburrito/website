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
                    stuff I've Built.
                </h1>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="group relative p-8 md:p-10 border border-foreground/10 rounded-[2.5rem] bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-all duration-500 overflow-hidden"
            >
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-5">
                    quasar
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


                </div>

                <Link
                    href="https://quasar.ramiz.studio"
                    target="_blank"
                    className="inline-flex items-center gap-2 font-medium text-foreground/80 hover:bg-foreground hover:text-background border border-foreground/20 hover:border-transparent transition-all duration-300 ease-out hover:scale-[1.02] active:scale-95 px-6 py-3 rounded-full text-sm"
                >
                    try it out <ExternalLink className="w-4 h-4" />
                </Link>
            </motion.div>
        </main>
    );
}
