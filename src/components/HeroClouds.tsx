"use client";

import { useRef, useEffect, useState } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useMotionValueEvent,
} from "framer-motion";
import { useImagePreloader } from "@/hooks/useImagePreloader";

const FRAME_COUNT = 120;

export default function HeroClouds() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 1920, height: 1080 });
    const { images, isLoaded, progress } = useImagePreloader(
        "sequence-1",
        FRAME_COUNT
    );

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const frameIndex = useTransform(
        scrollYProgress,
        [0, 1],
        [0, FRAME_COUNT - 1]
    );

    // Hero text animations
    const titleOpacity = useTransform(scrollYProgress, [0, 0.08, 0.35], [1, 1, 0]);
    const titleY = useTransform(scrollYProgress, [0, 0.35], [0, -50]);
    const subtitleOpacity = useTransform(scrollYProgress, [0.02, 0.1, 0.4], [0, 1, 0]);
    const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.05, 0.15], [1, 1, 0]);

    useEffect(() => {
        const updateSize = () => {
            setCanvasSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    // Draw cover-fit utility
    const drawFrame = (
        ctx: CanvasRenderingContext2D,
        img: HTMLImageElement,
        w: number,
        h: number
    ) => {
        const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
        const x = (w - img.naturalWidth * scale) / 2;
        const y = (h - img.naturalHeight * scale) / 2;
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
    };

    // Initial frame
    useEffect(() => {
        if (!isLoaded || images.length === 0) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        drawFrame(ctx, images[0], canvas.width, canvas.height);
    }, [isLoaded, images, canvasSize]);

    // Scroll-driven frame update
    useMotionValueEvent(frameIndex, "change", (latest) => {
        if (!isLoaded || images.length === 0) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const index = Math.round(latest);
        const img = images[index];
        if (!img || !img.complete) return;
        drawFrame(ctx, img, canvas.width, canvas.height);
    });

    return (
        <section
            ref={containerRef}
            data-theme="dark"
            className="relative"
            style={{ height: "400vh" }}
        >
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {/* Loading screen */}
                {!isLoaded && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-jesko-dark">
                        <div className="text-[10px] tracking-[0.4em] uppercase text-white/30 mb-6">
                            Jesko Jets
                        </div>
                        <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
                            <motion.div
                                className="absolute left-0 top-0 h-full bg-white/50"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="mt-3 text-[10px] text-white/20 tabular-nums">
                            {progress}%
                        </div>
                    </div>
                )}

                {/* Canvas */}
                <canvas
                    ref={canvasRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    className="absolute inset-0 w-full h-full"
                />

                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />

                {/* Hero typography */}
                <motion.div
                    style={{ opacity: titleOpacity, y: titleY }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-6"
                >
                    <h1
                        className="text-white text-center font-display font-light"
                        style={{
                            fontSize: "clamp(2.5rem, 7vw, 8rem)",
                            letterSpacing: "0.06em",
                            lineHeight: 0.95,
                            textShadow: "0 4px 80px rgba(0,0,0,0.3)",
                        }}
                    >
                        JESKO
                    </h1>
                    <motion.p
                        style={{ opacity: subtitleOpacity }}
                        className="mt-6 text-white/60 text-center"
                    >
                        <span
                            className="text-[11px] tracking-[0.35em] uppercase"
                            style={{ textShadow: "0 2px 30px rgba(0,0,0,0.4)" }}
                        >
                            Private Aviation — Redefined
                        </span>
                    </motion.p>
                </motion.div>

                {/* Scroll hint */}
                <motion.div
                    style={{ opacity: scrollHintOpacity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
                >
                    <span className="text-white/40 text-[9px] tracking-[0.3em] uppercase">
                        Scroll
                    </span>
                    <motion.div
                        className="w-[1px] h-8 bg-white/20"
                        animate={{ scaleY: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                </motion.div>

                {/* Bottom gradient to beige */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-16 z-20 pointer-events-none"
                    style={{
                        background: "linear-gradient(to top, rgba(239,236,230,0.5), transparent)",
                    }}
                />
            </div>
        </section>
    );
}
