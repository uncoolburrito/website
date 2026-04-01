"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import SpotifyPlayer from "../components/spotify-player";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface Track {
    id: string;
    title: string;
    artist: string;
    album: string;
    albumArt: string;
    spotifyUrl: string;
    addedAt: string;
}

export default function MusicPage() {
    const [isPlaying, setIsPlaying] = useState<boolean | null>(null);
    const [favourites, setFavourites] = useState<Track[]>([]);
    const [newFinds, setNewFinds] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const res = await fetch('/api/spotify/playlists');
                if (res.ok) {
                    const data = await res.json();
                    setFavourites(data.favourites || []);
                    setNewFinds(data.newFinds || []);
                }
            } catch (error) {
                console.error("Error fetching playlists", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlaylists();
    }, []);

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

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
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

            {/* Playlists Section */}
            {!loading && (favourites.length > 0 || newFinds.length > 0) && (
                <motion.section 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col gap-16"
                >
                    {/* Favourites */}
                    {favourites.length > 0 && (
                        <motion.div variants={itemVariants} className="flex flex-col gap-6">
                            <h2 className="text-2xl font-bold tracking-tight text-foreground">favourites</h2>
                            <div className="flex flex-col gap-4">
                                {favourites.map((track) => (
                                    <a 
                                        key={track.id} 
                                        href={track.spotifyUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-4 p-4 rounded-xl hover:bg-foreground/5 transition-all duration-300 border border-transparent hover:border-foreground/10"
                                    >
                                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                                            {track.albumArt ? (
                                                <Image src={track.albumArt} alt={track.album} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-foreground/10" />
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-center gap-1 flex-1 min-w-0">
                                            <p className="font-medium text-foreground group-hover:text-foreground/80 transition-colors flex items-center gap-2 truncate">
                                                <span className="truncate">{track.title}</span>
                                                <ArrowUpRight className="w-4 h-4 shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                            </p>
                                            <p className="text-sm text-foreground/60 truncate">{track.artist}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* New Finds */}
                    {newFinds.length > 0 && (
                        <motion.div variants={itemVariants} className="flex flex-col gap-6">
                            <h2 className="text-2xl font-bold tracking-tight text-foreground">new finds</h2>
                            <div className="flex flex-col gap-4">
                                {newFinds.map((track) => (
                                    <a 
                                        key={track.id} 
                                        href={track.spotifyUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl hover:bg-foreground/5 transition-all duration-300 border border-transparent hover:border-foreground/10"
                                    >
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                                                {track.albumArt ? (
                                                    <Image src={track.albumArt} alt={track.album} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-foreground/10" />
                                                )}
                                            </div>
                                            <div className="flex flex-col justify-center gap-1 flex-1 min-w-0">
                                                <p className="font-medium text-foreground group-hover:text-foreground/80 transition-colors flex items-center gap-2 truncate">
                                                    <span className="truncate">{track.title}</span>
                                                </p>
                                                <p className="text-sm text-foreground/60 truncate">{track.artist}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="sm:shrink-0 flex items-center border-t sm:border-t-0 border-foreground/10 pt-3 sm:pt-0 sm:pl-4 mt-2 sm:mt-0">
                                            <span className="text-xs font-medium text-foreground/50 bg-foreground/5 px-2.5 py-1 rounded-full whitespace-nowrap">
                                                Added {formatDate(track.addedAt)}
                                            </span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </motion.section>
            )}
        </div>
    );
}
