"use client";
import { motion } from "framer-motion";
import { MoveLeft } from "lucide-react";
import Link from "next/link";

export default function WIPPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-6 w-full antialiased">
            <Link href="/" className="absolute top-8 left-8 sm:top-12 sm:left-12 flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors font-medium text-sm">
                <MoveLeft className="w-4 h-4" />
                back
            </Link>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="flex flex-col items-center gap-5 text-center"
            >
                <div className="text-foreground/30 font-mono text-xs uppercase tracking-[0.2em] bg-foreground/5 px-4 py-1.5 rounded-full border border-foreground/10">Under Construction</div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground/80">
                    Work In Progress
                </h1>
                <p className="text-foreground/50 max-w-sm mt-1 text-base leading-relaxed">
                    Check back soon. I'm currently busy typing code furiously into my terminal.
                </p>
            </motion.div>
        </main>
    );
}
