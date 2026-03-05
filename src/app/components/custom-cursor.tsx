"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

function HandIcon() {
    return (
        <svg
            width="18" height="18" viewBox="0 0 24 24" fill="currentColor"
            xmlns="http://www.w3.org/2000/svg" className="text-foreground -rotate-12 drop-shadow-sm"
        >
            <path d="M10.5 4.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5.5h.5c.83 0 1.5.67 1.5 1.5v.5h.5c.83 0 1.5.67 1.5 1.5v.5h.5c.83 0 1.5.67 1.5 1.5v4.5c0 2.21-1.79 4-4 4h-3.5c-2.21 0-4-1.79-4-4V12.75l-1.92-1.92c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l3 3A1 1 0 0 0 10.5 13v-8.5v0Z" />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-foreground"
        >
            <path
                d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
                fill="currentColor"
            />
        </svg>
    );
}

export default function CustomCursor() {
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { stiffness: 300, damping: 25, mass: 0.3 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    useEffect(() => {
        setMounted(true);
        if (window.matchMedia("(any-pointer: coarse)").matches) {
            setIsMobile(true);
            return;
        }

        const defaultCursorElements = ["A", "BUTTON", "INPUT", "TEXTAREA", "SELECT", "LABEL"];
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);

            const target = e.target as HTMLElement;
            if (target && target.tagName && typeof target.closest === 'function') {
                setIsHovering(defaultCursorElements.includes(target.tagName) || !!target.closest('a') || !!target.closest('button'));
            }
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key.toLowerCase() === 'c') {
                setIsDisabled(prev => {
                    const next = !prev;
                    if (next) {
                        document.body.classList.add('default-cursor');
                    } else {
                        document.body.classList.remove('default-cursor');
                    }
                    return next;
                });
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseleave", handleMouseLeave);
        window.addEventListener("mouseenter", handleMouseEnter);
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("mouseenter", handleMouseEnter);
            window.removeEventListener("keydown", handleKeyDown);
            document.body.classList.remove('default-cursor');
        };
    }, [mouseX, mouseY, isVisible]);

    if (!mounted || isMobile) return null;

    return (
        <>
            <div className={`fixed bottom-6 left-6 z-50 px-3 py-1.5 rounded-full transition-all duration-300 text-sm font-medium shadow-xl pointer-events-none select-none flex items-center gap-1.5 ${isDisabled ? 'bg-background text-foreground border border-foreground/10' : 'bg-foreground text-background'}`}>
                Press <kbd className={`font-mono text-xs px-1.5 py-0.5 rounded-md ${isDisabled ? 'bg-foreground/10' : 'bg-background/20'}`}>Ctrl+C</kbd> to {isDisabled ? 'enable' : 'disable'} custom cursor
            </div>

            {!isDisabled && isVisible && (
                <motion.div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        x: smoothX,
                        y: smoothY,
                        pointerEvents: "none",
                        zIndex: 9999,
                        translateX: "-50%",
                        translateY: "-50%"
                    }}
                >
                    <motion.div
                        animate={{
                            scale: isHovering ? 1.5 : 1,
                            opacity: isVisible ? 1 : 0
                        }}
                        transition={{
                            type: "spring", stiffness: 300, damping: 25, mass: 0.3
                        }}
                        className="flex items-center justify-center rounded-full transition-all duration-300 w-10 h-10 bg-foreground/5 backdrop-blur-[2px] backdrop-saturate-[120%] border border-foreground/10 shadow-[inset_1px_1px_1px_rgba(255,90,90,0.1),inset_-1px_-1px_1px_rgba(90,90,255,0.1),inset_0_1px_3px_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.1)] text-foreground"
                    >
                        <motion.div
                            animate={{ scale: isHovering ? 0.8 : 1 }}
                            className="flex justify-center items-center w-full h-full relative"
                        >
                            <div className={`absolute transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                                <HandIcon />
                            </div>
                            <div className={`absolute transition-opacity duration-200 ${isHovering ? 'opacity-0' : 'opacity-100'}`}>
                                <ArrowIcon />
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </>
    );
}
