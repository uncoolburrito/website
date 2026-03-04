"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import SpotifyPlayer from "../components/spotify-player";

export default function MusicPage() {
    const [isPlaying, setIsPlaying] = useState<boolean | null>(null);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
            },
        },
    };

    return (
        <div className="w-full max-w-3xl flex flex-col min-h-[60vh] gap-12 px-6 py-24 sm:py-32">
            <motion.section
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-6"
            >
                <motion.h1
                    variants={itemVariants}
                    className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground"
                >
                    music
                </motion.h1>
                <motion.p
                    variants={itemVariants}
                    className={`text-lg sm:text-xl text-foreground/80 font-medium max-w-xl transition-opacity duration-300 ${isPlaying === null ? 'opacity-0' : 'opacity-100'}`}
                >
                    {isPlaying ? "what i'm listening to rn" : "i last listened to:"}
                </motion.p>

                <motion.div variants={itemVariants} className="mt-2">
                    <SpotifyPlayer onPlaybackChange={setIsPlaying} />
                </motion.div>
            </motion.section>
        </div>
    );
}
