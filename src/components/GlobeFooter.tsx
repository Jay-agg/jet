"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const stats = [
    { label: "Flights Completed", value: "5K+" },
    { label: "Happy Clients", value: "1.2K" },
    { label: "Fleet Size", value: "42" },
];

export default function GlobeFooter() {
    const sectionRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const titleY = useTransform(scrollYProgress, [0, 0.5], [80, 0]);
    const titleOpacity = useTransform(scrollYProgress, [0.05, 0.3], [0, 1]);

    return (
        <section
            ref={sectionRef}
            data-theme="dark"
            className="relative h-screen w-full overflow-hidden bg-jesko-dark"
        >
            {/* Top gradient from beige */}
            <div
                className="absolute top-0 left-0 right-0 h-40 z-30 pointer-events-none"
                style={{
                    background: "linear-gradient(to bottom, #EFECE6, transparent)",
                }}
            />

            {/* Video background */}
            <video
                src="/globe-loop.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            {/* Dark overlay */}
            <div
                className="absolute inset-0 z-[1] pointer-events-none"
                style={{
                    background: `
            radial-gradient(circle at center, transparent 20%, rgba(10,10,10,0.6) 100%),
            linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 60%)
          `,
                }}
            />

            {/* Main content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-8">
                <motion.div style={{ y: titleY, opacity: titleOpacity }} className="text-center">
                    <h2
                        className="text-white font-display"
                        style={{
                            fontSize: "clamp(3rem, 8vw, 10rem)",
                            letterSpacing: "-0.02em",
                            lineHeight: 0.9,
                            textShadow: "0 4px 80px rgba(0,0,0,0.3)",
                        }}
                    >
                        Global
                        <br />
                        Reach.
                    </h2>
                </motion.div>

                {/* Draggable stat cards */}
                <div className="mt-16 flex flex-wrap justify-center gap-4 md:gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            drag
                            dragConstraints={{ left: -50, right: 50, top: -30, bottom: 30 }}
                            dragElastic={0.15}
                            whileDrag={{ scale: 1.08, zIndex: 50 }}
                            whileHover={{ scale: 1.03 }}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className="cursor-grab active:cursor-grabbing select-none px-8 py-6 rounded-xl border border-white/10"
                            style={{
                                background: "rgba(255,255,255,0.05)",
                                backdropFilter: "blur(12px)",
                            }}
                        >
                            <div className="text-2xl md:text-3xl font-display text-white tracking-tight">
                                {stat.value}
                            </div>
                            <div className="text-[10px] tracking-[0.25em] uppercase text-white/35 mt-1">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.7 }}
                    className="mt-14"
                >
                    <a
                        href="#reserve"
                        className="group inline-flex items-center gap-3 px-10 py-4 bg-white text-jesko-dark text-xs tracking-[0.2em] uppercase font-medium transition-all duration-500 hover:bg-white/90 hover:gap-5"
                    >
                        <span>Reserve Your Journey</span>
                        <svg
                            className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </a>
                </motion.div>

                {/* Footer credits */}
                <div className="absolute bottom-8 text-center">
                    <div className="text-white/15 text-[10px] tracking-[0.3em] uppercase">
                        © 2024 Jesko Jets — All Rights Reserved
                    </div>
                </div>
            </div>
        </section>
    );
}
