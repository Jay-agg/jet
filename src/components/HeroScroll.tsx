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

export default function HeroScroll() {
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
    const textOpacity = useTransform(scrollYProgress, [0, 0.15, 0.4], [1, 1, 0]);
    const textY = useTransform(scrollYProgress, [0, 0.4], [0, -60]);

    // Set canvas size based on window
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

    // Draw the first frame once loaded
    useEffect(() => {
        if (!isLoaded || images.length === 0) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = images[0];
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Cover-fit the image
        const scale = Math.max(
            canvas.width / img.naturalWidth,
            canvas.height / img.naturalHeight
        );
        const x = (canvas.width - img.naturalWidth * scale) / 2;
        const y = (canvas.height - img.naturalHeight * scale) / 2;
        ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
    }, [isLoaded, images, canvasSize]);

    // Update canvas on scroll
    useMotionValueEvent(frameIndex, "change", (latest) => {
        if (!isLoaded || images.length === 0) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const index = Math.round(latest);
        const img = images[index];
        if (!img || !img.complete) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const scale = Math.max(
            canvas.width / img.naturalWidth,
            canvas.height / img.naturalHeight
        );
        const x = (canvas.width - img.naturalWidth * scale) / 2;
        const y = (canvas.height - img.naturalHeight * scale) / 2;
        ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
    });

    return (
        <section ref={containerRef} className="relative" style={{ height: "400vh" }}>
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {/* Loading state */}
                {!isLoaded && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]">
                        <div className="mb-6 text-xs tracking-[0.3em] uppercase text-white/40">
                            Loading Experience
                        </div>
                        <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
                            <motion.div
                                className="absolute left-0 top-0 h-full bg-white/60"
                                style={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <div className="mt-3 text-xs text-white/30 tabular-nums">
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

                {/* Overlay text */}
                <motion.div
                    style={{ opacity: textOpacity, y: textY }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
                >
                    <h1
                        className="text-white text-center font-light"
                        style={{
                            fontSize: "clamp(1.5rem, 4vw, 4rem)",
                            letterSpacing: "0.25em",
                            textShadow: "0 2px 40px rgba(0,0,0,0.6)",
                        }}
                    >
                        ELEVATE YOUR HORIZONS
                    </h1>
                    <div
                        className="mt-4 text-white/50 text-xs tracking-[0.2em] uppercase"
                        style={{ textShadow: "0 1px 20px rgba(0,0,0,0.5)" }}
                    >
                        Scroll to explore
                    </div>
                </motion.div>

                {/* Bottom gradient for blending */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-20 pointer-events-none" />
            </div>
        </section>
    );
}
