"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface SpotifyData {
    isPlaying: boolean;
    title?: string;
    artist?: string;
    progressMs?: number;
    durationMs?: number;
}

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

export default function YouTubeAmbientEngine() {
    const [targetNode, setTargetNode] = useState<HTMLElement | null>(null);
    const [spotifyData, setSpotifyData] = useState<SpotifyData | null>(null);
    const [videoId, setVideoId] = useState<string | null>(null);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [hasError, setHasError] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastTrackSearched = useRef<string | null>(null);

    // Sync portal node continuously so it handles routes seamlessly
    useEffect(() => {
        const portalInterval = setInterval(() => {
            const node = document.getElementById("youtube-listen-button-container");
            setTargetNode((current) => current !== node ? node : current);
        }, 500);
        return () => clearInterval(portalInterval);
    }, []);

    // Poll Spotify API
    useEffect(() => {
        const fetchNowPlaying = async () => {
            try {
                const startTime = Date.now();
                const res = await fetch("/api/spotify/now-playing", { cache: "no-store" });
                if (!res.ok) return;
                const data: SpotifyData = await res.json();
                const latency = Date.now() - startTime;

                setSpotifyData((prev) => {
                    // Compensate for network latency so expectedTime is spot-on
                    if (data.isPlaying && data.progressMs !== undefined) {
                        data.progressMs += latency;
                    }

                    // Fetch YouTube video even if offline, based on the last played song
                    if (data.title && data.artist) {
                        const trackKey = `${data.title}-${data.artist}`;
                        if (lastTrackSearched.current !== trackKey) {
                            lastTrackSearched.current = trackKey;
                            fetchYouTubeVideo(data.title, data.artist);
                        }
                    }
                    return data;
                });
            } catch (e) {
                console.error("Failed to fetch Spotify status", e);
            }
        };

        fetchNowPlaying();
        intervalRef.current = setInterval(fetchNowPlaying, 5000); // 5 sec background polling minimum
        return () => clearInterval(intervalRef.current!);
    }, []);

    const fetchYouTubeVideo = async (title: string, artist: string) => {
        try {
            setHasError(false);
            const res = await fetch(`/api/youtube/search?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`);
            if (!res.ok) throw new Error("API Failure");
            const data = await res.json();
            if (data.videoId) {
                setVideoId(data.videoId);
            } else {
                setHasError(true);
            }
        } catch (e) {
            console.error("YouTube search failed", e);
            setHasError(true);
        }
    };

    // Load YouTube IFrame API
    useEffect(() => {
        if (!document.getElementById("youtube-iframe-script")) {
            const tag = document.createElement("script");
            tag.id = "youtube-iframe-script";
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);
        }

        window.onYouTubeIframeAPIReady = () => {
            setIsReady(true);
        };

        if (window.YT && window.YT.Player) {
            setIsReady(true);
        }
    }, []);

    // Sync YouTube Player
    useEffect(() => {
        if (!isReady || !videoId || !containerRef.current) return;

        if (!playerRef.current) {
            // First boot - inject native div so React doesn't crash tracking the iframe
            const ytDiv = document.createElement('div');
            ytDiv.id = "youtube-ambient-player";
            containerRef.current.innerHTML = "";
            containerRef.current.appendChild(ytDiv);

            playerRef.current = new window.YT.Player(ytDiv, {
                height: "200",
                width: "200",
                videoId: videoId,
                playerVars: {
                    autoplay: 1, // Start streaming the frame buffer immediately silently
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    modestbranding: 1,
                    playsinline: 1,
                    enablejsapi: 1
                },
                events: {
                    onReady: (event: any) => {
                        event.target.mute();

                        if (spotifyData?.isPlaying) {
                            event.target.playVideo(); // Force start in background
                            if (spotifyData?.progressMs) {
                                event.target.seekTo(spotifyData.progressMs / 1000, true);
                            }
                        } else {
                            // If offline but they want to listen, do not advance the buffer far
                            event.target.pauseVideo();
                        }

                        if (isPlayingAudio) {
                            event.target.unMute();
                            event.target.setVolume(60);
                        }
                    }
                },
            });
        } else {
            // Cleanly transition active video
            if (typeof playerRef.current.loadVideoById === "function") {
                playerRef.current.loadVideoById(videoId);
                playerRef.current.mute(); // Strict muted by default

                if (spotifyData?.isPlaying) {
                    playerRef.current.playVideo();
                    if (spotifyData?.progressMs) {
                        playerRef.current.seekTo(spotifyData.progressMs / 1000, true);
                    }
                } else {
                    if (!isPlayingAudio) {
                        playerRef.current.pauseVideo();
                        playerRef.current.seekTo(0, true);
                    }
                }

                if (isPlayingAudio) {
                    // Crossfade
                    playerRef.current.setVolume(0);
                    playerRef.current.unMute();
                    fadeVolume(60, 500);
                }
            }
        }
    }, [videoId, isReady]);

    // Handle Play/Pause + Drift Correction
    useEffect(() => {
        if (!playerRef.current || typeof playerRef.current.playVideo !== 'function') return;

        if (spotifyData?.isPlaying) {
            // Ensure it's playing dynamically
            playerRef.current.playVideo();

            // Auto-correct timestamp drift safely
            const currentYtTime = playerRef.current.getCurrentTime();
            const expectedTime = Math.max(0, (spotifyData.progressMs || 0) / 1000);

            // If drift is >3s, seek immediately
            if (Math.abs(currentYtTime - expectedTime) > 3) {
                playerRef.current.seekTo(expectedTime, true);
            }
        } else {
            // If offline, only pause if the listener is NOT actively playing it
            if (!isPlayingAudio && typeof playerRef.current.pauseVideo === 'function') {
                playerRef.current.pauseVideo();
            }
        }
    }, [spotifyData, isPlayingAudio]); // Observe isPlayingAudio to lock drift correction

    const fadeVolume = (target: number, duration: number) => {
        if (!playerRef.current || typeof playerRef.current.getVolume !== 'function') return;
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

        let currentVol = playerRef.current.getVolume() || 0;
        const steps = 20;
        const stepTime = duration / steps;
        const volumeStep = (target - currentVol) / steps;

        fadeIntervalRef.current = setInterval(() => {
            currentVol += volumeStep;
            if ((volumeStep > 0 && currentVol >= target) || (volumeStep < 0 && currentVol <= target)) {
                currentVol = target;
                clearInterval(fadeIntervalRef.current!);
            }
            playerRef.current.setVolume(currentVol);
        }, stepTime);
    };

    const toggleListen = () => {
        if (!playerRef.current || typeof playerRef.current.unMute !== 'function') return;

        if (isPlayingAudio) {
            // Fade out
            fadeVolume(0, 500);
            setTimeout(() => {
                if (playerRef.current && typeof playerRef.current.mute === 'function') {
                    playerRef.current.mute();
                }

                // If offline, pausing should completely stop the video since no auto-sync is needed
                if (!spotifyData?.isPlaying && typeof playerRef.current.pauseVideo === 'function') {
                    playerRef.current.pauseVideo();
                }

                setIsPlayingAudio(false);
                window.dispatchEvent(new CustomEvent('ambient-audio-state', { detail: false }));
            }, 500); // Mute after fade
        } else {
            // Fade in and correct drift completely
            playerRef.current.unMute();
            playerRef.current.setVolume(0);
            playerRef.current.playVideo();

            if (spotifyData?.isPlaying && spotifyData?.progressMs) {
                playerRef.current.seekTo(spotifyData.progressMs / 1000, true);
            } else if (!spotifyData?.isPlaying) {
                // If the track is over or paused locally, loop it back to start when listening offline
                const state = playerRef.current.getPlayerState();
                if (state === 0 || playerRef.current.getCurrentTime() === 0) {
                    playerRef.current.seekTo(0, true);
                }
            }

            fadeVolume(60, 500);
            setIsPlayingAudio(true);
            window.dispatchEvent(new CustomEvent('ambient-audio-state', { detail: true }));
        }
    };

    if (!spotifyData && !videoId) return null;

    const renderButton = (isInline: boolean) => (
        <motion.button
            initial={{ opacity: 0, y: isInline ? 5 : 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isInline ? 5 : 15, scale: 0.95 }}
            onClick={toggleListen}
            className={`${isInline ? 'relative w-full justify-center' : 'fixed bottom-8 right-8 z-[100] w-auto justify-start'} flex items-center gap-2 px-5 py-2 rounded-full border transition-all duration-300 shadow-sm backdrop-blur-md text-sm font-semibold active:scale-95
        ${isPlayingAudio
                    ? 'bg-[#1DB954]/10 border-[#1DB954]/50 text-[#1DB954] shadow-[0_0_15px_rgba(29,185,84,0.1)]'
                    : 'bg-background/40 border-foreground/10 text-foreground/80 hover:bg-foreground/5 hover:border-foreground/30 hover:scale-[1.03]'
                }`}
        >
            {isPlayingAudio ? (
                <>
                    <div className="flex items-center gap-1 h-3 mx-0.5">
                        <motion.span animate={{ height: [3, 10, 3] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-0.5 bg-[#1DB954] rounded-full" />
                        <motion.span animate={{ height: [7, 2, 7] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-[#1DB954] rounded-full" />
                        <motion.span animate={{ height: [2, 9, 2] }} transition={{ repeat: Infinity, duration: 0.9 }} className="w-0.5 bg-[#1DB954] rounded-full" />
                    </div>
                    Listening
                </>
            ) : (
                <>
                    <span className="text-[14px] leading-none translate-y-[-1px]">🎵</span> {spotifyData?.isPlaying ? 'Listen Along' : 'Listen to last played'}
                </>
            )}
        </motion.button>
    );

    return (
        <>
            <div ref={containerRef} className="fixed top-0 left-0 w-[200px] h-[200px] opacity-0 pointer-events-none -z-50 overflow-hidden" />

            {spotifyData && !hasError && videoId && (
                targetNode
                    ? createPortal(<AnimatePresence>{renderButton(true)}</AnimatePresence>, targetNode)
                    : <AnimatePresence>{renderButton(false)}</AnimatePresence>
            )}
        </>
    );
}
