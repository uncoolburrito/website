"use client";

import { motion, Variants } from "framer-motion";

const TIMELINE = [
    {
        role: "Director - CodeDay Labs",
        company: "CodeDay",
        date: "Apr 2024 — Present",
        location: "Seattle, Washington, United States",
        description: "Overseeing open-source internship experiences for students who can't participate in traditional internships. Leading projects and mentorship."
    },
    {
        role: "Head of Product",
        company: "EDUDIGM EDUCATION",
        date: "Nov 2023 — Jun 2024",
        location: "",
        description: "Developed strategic product roadmaps and oversaw product launches for STEM education initiatives."
    },
    {
        role: "Research And Development Associate",
        company: "EDUDIGM EDUCATION",
        date: "Aug 2023 — Nov 2023",
        location: "",
        description: "Engaged in R&D projects to improve software development and educational tools."
    },
    {
        role: "Mentor Manager",
        company: "CodeDay",
        date: "Apr 2023 — Aug 2023",
        location: "",
        description: "Guided mentors and helped create a collaborative environment for young technologists and open-source contributors."
    }
];

export default function WorkPage() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
            },
        },
    };

    return (
        <div className="w-full max-w-3xl flex flex-col gap-16 px-6 py-24 sm:py-32">
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col gap-4"
            >
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                    Work Experience
                </h1>
                <p className="text-lg text-foreground/60 font-medium">
                    A timeline of places I've built things.
                </p>
            </motion.section>

            <motion.section
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative mt-8"
            >
                {/* Continuous Timeline Track */}
                <div className="absolute left-[7px] top-2 bottom-4 w-px bg-gradient-to-b from-foreground/50 via-foreground/20 to-transparent" />

                <div className="flex flex-col gap-12 pl-8">
                    {TIMELINE.map((item, idx) => (
                        <motion.article
                            key={idx}
                            variants={itemVariants}
                            className="relative group p-4 -mx-4 rounded-3xl hover:bg-foreground/5 transition-all duration-300"
                        >
                            {/* Timeline Dot */}
                            <div className="absolute -left-[32px] top-[26px] w-[14px] h-[14px] rounded-full bg-background border-2 border-foreground/30 group-hover:border-foreground group-hover:scale-125 transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)] z-10" />

                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-semibold tracking-wider text-foreground/50 uppercase mb-1">{item.date}</span>
                                <h3 className="text-xl md:text-2xl font-bold text-foreground">
                                    {item.role}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <h4 className="text-base font-semibold text-accent">{item.company}</h4>
                                    {item.location && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-foreground/30" />
                                            <span className="text-sm font-medium text-foreground/60">{item.location}</span>
                                        </>
                                    )}
                                </div>
                                <p className="mt-3 text-base text-foreground/70 leading-relaxed max-w-2xl">
                                    {item.description}
                                </p>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </motion.section>
        </div>
    );
}
