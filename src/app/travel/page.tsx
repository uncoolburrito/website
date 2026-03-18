"use client";

import dynamic from "next/dynamic";
import { MoveRight } from "lucide-react";
import { useSpring, motion } from "framer-motion";
import { useEffect, useState } from "react";

// Dynamically import Leaflet map, disable SSR as the library accesses the window object.
const TravelMap = dynamic(() => import("../components/TravelMap"), { 
    ssr: false, 
    loading: () => (
        <div className="w-full h-[500px] md:h-[600px] rounded-3xl bg-foreground/[0.02] border border-foreground/5 animate-pulse flex items-center justify-center text-foreground/50 text-xs tracking-widest uppercase">
            Initializing global satellite...
        </div>
    ) 
});

function AnimatedCounter({ value }: { value: number }) {
    const springValue = useSpring(0, { stiffness: 50, damping: 20 });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        springValue.set(value);
    }, [value, springValue]);

    useEffect(() => {
        return springValue.onChange((latest) => {
            setDisplayValue(Math.floor(latest));
        });
    }, [springValue]);

    return <span>{displayValue}</span>;
}

export default function TravelPage() {
    return (
        <main className="min-h-screen py-16 sm:py-32 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col antialiased">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col mb-12 sm:mb-16"
            >
                <div className="flex items-center gap-2 text-foreground/50 text-xs sm:text-sm font-medium mb-4 uppercase tracking-wider">
                    <MoveRight className="w-4 h-4" />
                    <span>My Journey</span>
                </div>
                <h1 className="text-4xl sm:text-[60px] leading-[1.1] font-bold tracking-tight text-foreground">
                    Countries I've visited<br className="hidden sm:block" /> and places I've loved.
                </h1>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
            >
                <TravelMap />
            </motion.div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4 text-[10px] text-foreground/30 text-center uppercase tracking-widest font-mono px-4"
            >
                *The map of India is as provided by Leaflet's underlying GeoJSON data.
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-16 mb-24"
            >
                <div className="p-8 border border-foreground/10 rounded-3xl bg-foreground/[0.02] flex flex-col items-center justify-center text-center gap-3 hover:bg-foreground/[0.04] transition-colors relative overflow-hidden group">
                    <span className="absolute top-4 right-4 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">🌍</span>
                    <span className="text-5xl md:text-6xl font-black tracking-tighter text-foreground"><AnimatedCounter value={4} /></span>
                    <span className="text-xs uppercase tracking-widest text-foreground/50 font-bold">Countries Visited</span>
                </div>
                <div className="p-8 border border-foreground/10 rounded-3xl bg-foreground/[0.02] flex flex-col items-center justify-center text-center gap-3 hover:bg-foreground/[0.04] transition-colors relative overflow-hidden group">
                    <span className="absolute top-4 right-4 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">📍</span>
                    <span className="text-5xl md:text-6xl font-black tracking-tighter text-foreground"><AnimatedCounter value={8} /></span>
                    <span className="text-xs uppercase tracking-widest text-foreground/50 font-bold">Cities & Places</span>
                </div>
                <div className="p-8 border border-foreground/10 rounded-3xl bg-foreground/[0.02] flex flex-col items-center justify-center text-center gap-3 hover:bg-foreground/[0.04] transition-colors relative overflow-hidden group">
                    <span className="absolute top-4 right-4 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">✨</span>
                    <span className="text-5xl md:text-6xl font-black tracking-tighter text-foreground"><AnimatedCounter value={13} /></span>
                    <span className="text-xs uppercase tracking-widest text-foreground/50 font-bold">Wishlist 2026</span>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="relative p-8 md:p-14 border border-foreground/10 rounded-[2.5rem] bg-foreground/[0.01] overflow-hidden group hover:bg-foreground/[0.02] transition-colors"
            >
                <div className="absolute top-8 left-8 text-[6rem] sm:text-[8rem] text-foreground/5 leading-none font-serif select-none -translate-y-4">"</div>
                <p className="text-lg sm:text-2xl leading-[1.6] text-foreground/80 relative z-10 font-medium tracking-tight">
                    Travel changes you. As you move through this life and this world you change things slightly, you leave marks behind, however small. And in return, life — and travel — leaves marks on you. Most of the time, those marks <span className="opacity-50 line-through">on your body or</span> on your heart — are beautiful. Often, though, they hurt.
                </p>
                <div className="mt-8 text-right text-foreground/50 uppercase tracking-widest text-[10px] sm:text-xs font-bold transition-colors group-hover:text-foreground/80">
                    — Anthony Bourdain
                </div>
            </motion.div>
        </main>
    );
}
