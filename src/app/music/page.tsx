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
        <div className="w-full max-w-3xl flex flex-col min-h-[60vh] gap-16 px-6 py-24 sm:py-32">
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

            {/* Playlists Section via Iframes */}
            <motion.section 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-16"
            >
                {/* Favourites */}
                <motion.div variants={itemVariants} className="flex flex-col gap-6">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">favourites</h2>
                    <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-foreground/10 bg-foreground/5 h-[400px]">
                        <iframe 
                            src="https://open.spotify.com/embed/playlist/3UXShJ6695LXudDV774vFh?utm_source=generator&theme=0" 
                            width="100%" 
                            height="100%" 
                            frameBorder="0" 
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                            loading="lazy"
                            className="bg-transparent"
                        ></iframe>
                    </div>
                </motion.div>

                {/* New Finds */}
                <motion.div variants={itemVariants} className="flex flex-col gap-6">
                    <div className="flex justify-between items-end">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">new finds</h2>
                        <span className="text-sm font-medium text-foreground/50 bg-foreground/5 px-3 py-1.5 rounded-full">
                            recently updated
                        </span>
                    </div>
                    <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-foreground/10 bg-foreground/5 h-[400px]">
                        <iframe 
                            src="https://open.spotify.com/embed/playlist/02AxJ0YCbrQMkmGRzWnjP2?utm_source=generator&theme=0" 
                            width="100%" 
                            height="100%" 
                            frameBorder="0" 
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                            loading="lazy"
                            className="bg-transparent"
                        ></iframe>
                    </div>
                </motion.div>
            </motion.section>
        </div>
    );
}
