"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function PlaneFlyUp() {
    const sectionRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    // Plane flies from bottom to top
    const planeY = useTransform(scrollYProgress, [0, 1], ["100%", "-100%"]);
    const planeScale = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0.6, 0.9, 1, 0.9, 0.7]);
    const planeRotate = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -3]);

    // Text fades in as the plane passes center
    const textOpacity = useTransform(scrollYProgress, [0.25, 0.4, 0.6, 0.75], [0, 1, 1, 0]);
    const textY = useTransform(scrollYProgress, [0.25, 0.4, 0.6, 0.75], [40, 0, 0, -40]);

    // Subtle parallax glow
    const glowOpacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 0.4, 0]);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden"
            style={{ height: "200vh" }}
        >
            <div className="sticky top-0 h-screen w-full flex items-center justify-center">
                {/* Ambient glow */}
                <motion.div
                    style={{ opacity: glowOpacity }}
                    className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
                    aria-hidden
                >
                    <div
                        className="w-full h-full rounded-full"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
                        }}
                    />
                </motion.div>

                {/* Plane silhouette — using a frame from the sequence as a static image */}
                <motion.div
                    style={{
                        y: planeY,
                        scale: planeScale,
                        rotate: planeRotate,
                    }}
                    className="absolute z-10"
                >
                    <img
                        src="/sequence-1/ezgif-frame-060.jpg"
                        alt="Jesko Jet"
                        className="w-[70vw] max-w-[800px] h-auto object-contain opacity-90"
                        style={{
                            filter: "brightness(1.1) contrast(1.05)",
                        }}
                    />
                </motion.div>

                {/* Text overlay */}
                <motion.div
                    style={{ opacity: textOpacity, y: textY }}
                    className="relative z-20 text-center pointer-events-none px-6"
                >
                    <h2
                        className="text-white font-light"
                        style={{
                            fontSize: "clamp(1.2rem, 3vw, 3rem)",
                            letterSpacing: "0.2em",
                            textShadow: "0 2px 40px rgba(0,0,0,0.8)",
                        }}
                    >
                        UNCOMPROMISING SPEED.
                    </h2>
                    <h2
                        className="text-white/70 font-extralight mt-2"
                        style={{
                            fontSize: "clamp(1rem, 2.5vw, 2.5rem)",
                            letterSpacing: "0.15em",
                            textShadow: "0 2px 40px rgba(0,0,0,0.8)",
                        }}
                    >
                        UNPARALLELED LUXURY.
                    </h2>
                </motion.div>

                {/* Top and bottom gradients for section blending */}
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#050505] to-transparent z-30 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] to-transparent z-30 pointer-events-none" />
            </div>
        </section>
    );
}
