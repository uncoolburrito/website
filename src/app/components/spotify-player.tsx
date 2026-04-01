"use client";

import { useEffect, useState, useRef } from "react";
import { Disc3 } from "lucide-react";

interface SpotifyData {
    isPlaying: boolean;
    title?: string;
    artist?: string;
    album?: string;
    albumArt?: string;
    spotifyUrl?: string;
    progressMs?: number;
    durationMs?: number;
}

interface SpotifyPlayerProps {
    onPlaybackChange?: (isPlaying: boolean) => void;
}

export default function SpotifyPlayer({ onPlaybackChange }: SpotifyPlayerProps = {}) {
    const [data, setData] = useState<SpotifyData | null>(null);
    const rotationRef = useRef(0);
    const requestRef = useRef<number>(0);
    const lastUpdateRef = useRef<number>(Date.now());
    const progressRef = useRef<number>(0);
    const isAmbientPlayingRef = useRef(false);

    useEffect(() => {
        const handleAmbient = (e: any) => { isAmbientPlayingRef.current = e.detail; };
        window.addEventListener('ambient-audio-state', handleAmbient);
        return () => window.removeEventListener('ambient-audio-state', handleAmbient);
    }, []);

    const fetchNowPlaying = async () => {
        try {
            const startTime = Date.now();
            const res = await fetch("/api/spotify/now-playing", { cache: "no-store" });
            const json: SpotifyData = await res.json();
            const latency = Date.now() - startTime;

            setData((prev) => {
                if (json.isPlaying && json.progressMs !== undefined) {
                    progressRef.current = json.progressMs + latency;
                }
                return json;
            });
            lastUpdateRef.current = Date.now();
        } catch (e) {
            console.error("Failed to fetch Spotify status", e);
        }
    };

    useEffect(() => {
        fetchNowPlaying();
        const interval = setInterval(fetchNowPlaying, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (data) onPlaybackChange?.(data.isPlaying);
    }, [data?.isPlaying, onPlaybackChange]);

    const animate = () => {
        const isSpinning = data?.isPlaying || isAmbientPlayingRef.current;
        
        if (isSpinning) {
            const now = Date.now();
            const delta = now - lastUpdateRef.current;
            lastUpdateRef.current = now;

            // Cap delta to prevent massive jumps when returning to a backgrounded tab
            const cappedDelta = Math.min(delta, 100);

            // Update Rotation (90 deg/sec)
            const degreesPerMs = 90 / 1000;
            rotationRef.current = (rotationRef.current + cappedDelta * degreesPerMs) % 360;

            const el = document.getElementById('spotify-vinyl');
            if (el) el.style.transform = `rotate(${rotationRef.current}deg)`;

            // Update Progress Bar ONLY if actually playing
            if (data?.isPlaying && data.durationMs) {
                progressRef.current += cappedDelta;
                const percentage = Math.min(1, progressRef.current / data.durationMs);
                const radius = 26;
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (percentage * circumference);

                const progEl = document.getElementById('spotify-progress');
                if (progEl) {
                    progEl.style.strokeDashoffset = `${offset}`;
                }
            }
        } else {
            // Keep lastUpdateRef fresh so delta doesn't explode when we start spinning
            lastUpdateRef.current = Date.now();
        }
        
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        lastUpdateRef.current = Date.now();
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            cancelAnimationFrame(requestRef.current);
        };
    }, [data?.isPlaying, data?.durationMs]);

    // Map variables clearly to safely handle the INITIAL LOAD state without returning null
    const isLoading = !data;
    const isPlaying = data?.isPlaying || false;
    const title = data?.title || (isLoading ? "Connecting to Spotify..." : "No recent tracks");
    const artist = data?.artist || (isLoading ? "Please wait" : "Offline");
    const album = data?.album || "";
    const albumArt = data?.albumArt || "";
    const durationMs = data?.durationMs || 0;
    const spotifyUrl = data?.spotifyUrl || "#";

    return (
        <div className="flex flex-col gap-2.5 w-fit">
            <a
                href={spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-4 bg-foreground/5 p-3 pr-6 rounded-[28px] border border-foreground/10 ${isLoading || !isPlaying ? 'opacity-60 grayscale hover:grayscale-0' : 'hover:border-[#1DB954]/50 hover:bg-[#1DB954]/10'} transition-all duration-500 w-full relative overflow-hidden`}
            >
                <div className="relative w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.2)] shrink-0">

                    {/* Progress bar SVG wrapper */}
                    {isPlaying && durationMs > 0 && (
                        <svg width="100%" height="100%" viewBox="0 0 56 56" className="absolute -inset-[4px] w-[56px] h-[56px] z-20 pointer-events-none drop-shadow-md">
                            <circle cx="28" cy="28" r="26" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground/10" />
                            <circle
                                id="spotify-progress"
                                cx="28" cy="28" r="26" fill="none" stroke="#1DB954" strokeWidth="2"
                                className="-rotate-90 origin-center transition-none"
                                strokeDasharray={2 * Math.PI * 26}
                                strokeDashoffset={2 * Math.PI * 26}
                                strokeLinecap="round"
                            />
                        </svg>
                    )}

                    {/* Vinyl Grooves Background */}
                    <div className="absolute inset-0 rounded-full bg-zinc-900" />

                    {albumArt ? (
                        <img
                            id={!isLoading ? "spotify-vinyl" : undefined}
                            src={albumArt}
                            alt="Album art"
                            className="absolute inset-0 w-full h-full object-cover rounded-full transition-transform duration-0"
                            style={{
                                maskImage: 'radial-gradient(circle, transparent 15%, black 16%)',
                                WebkitMaskImage: 'radial-gradient(circle, transparent 15%, black 16%)'
                            }}
                        />
                    ) : (
                        <Disc3 className="w-5 h-5 text-white/50 z-10" />
                    )}
                    {/* Center hole */}
                    <div className="absolute w-2.5 h-2.5 bg-background rounded-full z-10 shadow-inner border border-white/10" />

                    {/* Glossy Vinyl Reflection */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none mix-blend-overlay" />
                </div>

                <div className="flex flex-col max-w-[150px] sm:max-w-[200px] z-10 transition-colors duration-300">
                    <div className="flex items-center gap-2 mb-0.5">
                        {isPlaying ? (
                            <span className="text-[9px] sm:text-[10px] font-bold text-[#1DB954] uppercase tracking-widest flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse" />
                                Live
                            </span>
                        ) : (
                            <span className="text-[9px] sm:text-[10px] font-bold text-foreground/50 uppercase tracking-widest flex items-center gap-1.5">
                                {isLoading ? "Loading" : "Last Played"}
                            </span>
                        )}
                    </div>
                    <span className={`text-sm font-bold text-foreground truncate leading-tight transition-colors ${isPlaying ? 'group-hover:text-[#1DB954]' : ''}`}>{title}</span>
                    <span className="text-xs text-foreground/80 truncate font-medium mt-0.5">{artist}</span>
                    {album && <span className="text-[10px] text-foreground/50 truncate font-medium mt-0.5">{album}</span>}
                </div>
            </a>

            <div id="youtube-listen-button-container" className="flex w-full origin-left transition-all duration-300 empty:hidden" />
        </div >
    );
}
