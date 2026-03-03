"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Header() {
    const [currentTheme, setCurrentTheme] = useState("theme5");
    const [mounted, setMounted] = useState(false);
    const [beyondOpen, setBeyondOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Exact themes from reference
    const themes = [
        { id: 'theme1', name: 'Theme 1', bgColor: '#9E2B25', borderColor: '#FFF8F0' },
        { id: 'theme2', name: 'Theme 2', bgColor: '#FFCB05', borderColor: '#00274C' },
        { id: 'theme3', name: 'Theme 3', bgColor: '#0F0F0E', borderColor: '#F196E5' },
        { id: 'theme4', name: 'Theme 4', bgColor: '#FFEFF5', borderColor: '#1F7CFF' },
        { id: 'theme5', name: 'Theme 5', bgColor: '#0C0C0C', borderColor: '#eeeeee' }
    ];

    useEffect(() => {
        setMounted(true);
        const theme = localStorage.getItem("theme") || "theme5";
        setCurrentTheme(theme);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setBeyondOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleThemeChange = (themeId: string) => {
        setCurrentTheme(themeId);
        localStorage.setItem("theme", themeId);
        document.documentElement.setAttribute("data-theme", themeId);
    };

    const linkClass = "text-sm font-medium text-foreground/80 hover:bg-foreground hover:text-background px-3 py-1.5 rounded-full transition-all duration-300 ease-out hover:scale-105 active:scale-95 inline-block cursor-pointer";

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl mx-auto px-6 py-8 flex justify-between items-center z-50 relative"
        >
            <nav className="flex items-center gap-2 sm:gap-4 z-10 w-full sm:w-auto">
                <Link href="/" className={linkClass}>
                    home
                </Link>
                <Link href="/work" className={linkClass}>
                    work
                </Link>
                <Link href="/blogs" className={linkClass}>
                    blogs
                </Link>

                <div
                    className="relative"
                    ref={dropdownRef}
                    onMouseEnter={() => setBeyondOpen(true)}
                    onMouseLeave={() => setBeyondOpen(false)}
                >
                    <button className="text-sm font-medium text-foreground/80 hover:bg-foreground hover:text-background pl-3 pr-2.5 py-1.5 rounded-full transition-all duration-300 ease-out hover:scale-105 active:scale-95 flex items-center gap-1 cursor-pointer">
                        beyond
                        <ChevronDown className={`w-[14px] h-[14px] transition-transform duration-300 opacity-60 ${beyondOpen ? '-rotate-180' : 'rotate-0'}`} />
                    </button>

                    <AnimatePresence>
                        {beyondOpen && (
                            <div className="absolute top-full left-0 pt-2 z-50">
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-40 bg-background/90 backdrop-blur-xl border border-foreground/10 rounded-2xl p-2 flex flex-col shadow-xl overflow-hidden"
                                >
                                    <Link href="/music" onClick={() => setBeyondOpen(false)} className="text-sm font-medium text-foreground/80 hover:bg-foreground hover:text-background px-3 py-2 rounded-xl transition-colors">music</Link>
                                    <Link href="/travel" onClick={() => setBeyondOpen(false)} className="text-sm font-medium text-foreground/80 hover:bg-foreground hover:text-background px-3 py-2 rounded-xl transition-colors">travel</Link>
                                    <Link href="/timeline" onClick={() => setBeyondOpen(false)} className="text-sm font-medium text-foreground/80 hover:bg-foreground hover:text-background px-3 py-2 rounded-xl transition-colors">life timeline</Link>
                                    <Link href="/side-quests" onClick={() => setBeyondOpen(false)} className="text-sm font-medium text-foreground/80 hover:bg-foreground hover:text-background px-3 py-2 rounded-xl transition-colors">side quests</Link>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>

            <div className="flex justify-end items-center gap-1 w-auto lg:w-32 z-10">
                {mounted && themes.map((theme) => (
                    <button
                        key={theme.id}
                        onClick={() => handleThemeChange(theme.id)}
                        title={theme.name}
                        className="relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-[250ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:bg-foreground/15 hover:scale-[1.3] hover:shadow-md active:scale-90 group"
                    >
                        <span
                            className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${currentTheme === theme.id ? 'scale-110 opacity-100 shadow-sm border-foreground/50' : 'opacity-50 group-hover:opacity-100 border-foreground/5 group-hover:border-foreground/30'}`}
                            style={{
                                backgroundColor: theme.bgColor,
                            }}
                        />
                    </button>
                ))}
            </div>
            {/* Mobile simplified theme swither placeholder to keep flex spacing intact if needed */}
        </motion.header>
    );
}
