"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SpotifyPlayer from "./components/spotify-player";

export default function Home() {
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
    <div className="w-full max-w-3xl flex flex-col justify-center min-h-[60vh] gap-16 sm:gap-32 px-5 sm:px-6 py-16 sm:py-32">
      {/* Hero Section */}
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
          Ramiz Rahman
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-foreground/80 font-medium max-w-xl"
        >
          i do things. some main quests, mostly side quests.
        </motion.p>

        <motion.p
          variants={itemVariants}
          className={`text-lg sm:text-xl text-foreground/80 font-medium max-w-xl mt-4 transition-opacity duration-300 ${isPlaying === null ? 'opacity-0' : 'opacity-100'}`}
        >
          {isPlaying ? "what i'm listening to rn" : "i last listened to:"}
        </motion.p>

        <motion.div variants={itemVariants} className="mt-2">
          <SpotifyPlayer onPlaybackChange={setIsPlaying} />
        </motion.div>
      </motion.section>

      {/* Footer Section */}
      <motion.footer
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 pt-12 border-t border-foreground/10"
      >
        <motion.div variants={itemVariants} className="flex gap-2 sm:gap-4 flex-wrap">
          <a href="https://twitter.com/kramizr" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground/60 hover:bg-foreground hover:text-background px-3 py-1.5 rounded-full transition-all duration-300 ease-out hover:scale-105 active:scale-95 flex items-center gap-1">
            Twitter <ArrowUpRight className="w-3 h-3" />
          </a>
          <a href="https://www.linkedin.com/in/ramizr/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground/60 hover:bg-foreground hover:text-background px-3 py-1.5 rounded-full transition-all duration-300 ease-out hover:scale-105 active:scale-95 flex items-center gap-1">
            LinkedIn <ArrowUpRight className="w-3 h-3" />
          </a>
          <a href="https://www.instagram.com/philonoistr/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground/60 hover:bg-foreground hover:text-background px-3 py-1.5 rounded-full transition-all duration-300 ease-out hover:scale-105 active:scale-95 flex items-center gap-1">
            Instagram <ArrowUpRight className="w-3 h-3" />
          </a>
        </motion.div>

        <motion.p variants={itemVariants} className="text-sm text-foreground/40 font-medium tracking-tight">
          © {new Date().getFullYear()} Ramiz Rahman
        </motion.p>
      </motion.footer>
    </div>
  );
}
