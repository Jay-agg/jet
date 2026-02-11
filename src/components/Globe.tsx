"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Globe() {
    const sectionRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const textY = useTransform(scrollYProgress, [0, 0.5], [60, 0]);
    const textOpacity = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);
    const buttonOpacity = useTransform(scrollYProgress, [0.25, 0.45], [0, 1]);
    const buttonY = useTransform(scrollYProgress, [0.25, 0.45], [30, 0]);

    return (
        <section ref={sectionRef} className="relative h-screen w-full overflow-hidden">
            {/* Video background */}
            <video
                src="/globe-loop.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            {/* Dark gradient overlays for blending */}
            <div
                className="absolute inset-0 z-[1] pointer-events-none"
                style={{
                    background: `
            linear-gradient(to bottom, #050505 0%, transparent 30%),
            linear-gradient(to top, rgba(5,5,5,0.7) 0%, transparent 50%),
            radial-gradient(circle at center, transparent 30%, rgba(5,5,5,0.4) 100%)
          `,
                }}
            />

            {/* Content overlay */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
                <motion.h2
                    style={{ y: textY, opacity: textOpacity }}
                    className="text-white text-center font-light"
                    initial={false}
                >
                    <span
                        style={{
                            fontSize: "clamp(2rem, 6vw, 7rem)",
                            letterSpacing: "0.2em",
                            display: "block",
                            textShadow: "0 4px 80px rgba(0,0,0,0.5)",
                        }}
                    >
                        GLOBAL REACH
                    </span>
                </motion.h2>

                <motion.div
                    style={{ opacity: buttonOpacity, y: buttonY }}
                    className="mt-10"
                    initial={false}
                >
                    <a
                        href="#reserve"
                        className="group relative inline-flex items-center gap-3 px-10 py-4 border border-white/20 text-white text-xs tracking-[0.25em] uppercase transition-all duration-500 hover:border-white/60 hover:bg-white/5"
                        style={{ backdropFilter: "blur(8px)" }}
                    >
                        <span>Reserve Your Journey</span>
                        <svg
                            className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                            />
                        </svg>
                    </a>
                </motion.div>

                {/* Footer credits */}
                <div className="absolute bottom-8 text-center">
                    <div className="text-white/20 text-[10px] tracking-[0.3em] uppercase">
                        © 2024 Jesko Jets — All Rights Reserved
                    </div>
                </div>
            </div>
        </section>
    );
}
