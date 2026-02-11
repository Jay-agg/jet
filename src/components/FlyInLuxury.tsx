"use client";

import { useRef, useEffect, useState } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useMotionValueEvent,
} from "framer-motion";
import { useImagePreloader } from "@/hooks/useImagePreloader";

const FRAMES_PER_SEQ = 120;
const TOTAL_FRAMES = FRAMES_PER_SEQ * 2; // sequence-2 + sequence-3

export default function FlyInLuxury() {
    const containerRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 1920, height: 1080 });

    // Preload both sequences
    const { images: seq2Images, isLoaded: seq2Loaded } = useImagePreloader(
        "sequence-2",
        FRAMES_PER_SEQ
    );
    const { images: seq3Images, isLoaded: seq3Loaded } = useImagePreloader(
        "sequence-3",
        FRAMES_PER_SEQ
    );

    const allLoaded = seq2Loaded && seq3Loaded;

    // Combined image array: seq2 frames then seq3 frames
    const allImages = [...seq2Images, ...seq3Images];

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Map scroll → combined frame index across both sequences
    const frameIndex = useTransform(
        scrollYProgress,
        [0, 1],
        [0, TOTAL_FRAMES - 1]
    );

    // === Text animations ===

    // "Fly in / Luxury" text: visible in the first half, moves up and out
    const flyTextOpacity = useTransform(
        scrollYProgress,
        [0, 0.06, 0.35, 0.48],
        [0, 1, 1, 0]
    );
    const flyTextY = useTransform(scrollYProgress, [0, 0.48], [40, -120]);

    const subTextOpacity = useTransform(
        scrollYProgress,
        [0.08, 0.18, 0.35, 0.45],
        [0, 1, 1, 0]
    );

    // "Engineered for Perfection": fades in during the second half (sequence-3)
    const engTextOpacity = useTransform(
        scrollYProgress,
        [0.58, 0.72, 0.9, 0.98],
        [0, 1, 1, 0.8]
    );
    const engTextScale = useTransform(scrollYProgress, [0.58, 0.72], [0.92, 1]);

    // Specs grid — appears mid-sequence-3
    const specOpacity = useTransform(scrollYProgress, [0.62, 0.75], [0, 1]);
    const specY = useTransform(scrollYProgress, [0.62, 0.75], [30, 0]);

    // Canvas sizing
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

    // Cover-fit draw
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
        ctx.drawImage(
            img,
            x,
            y,
            img.naturalWidth * scale,
            img.naturalHeight * scale
        );
    };

    // Draw first frame once loaded
    useEffect(() => {
        if (!allLoaded || allImages.length === 0) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        drawFrame(ctx, allImages[0], canvas.width, canvas.height);
    }, [allLoaded, allImages.length, canvasSize]);

    // Scroll-driven frame update
    useMotionValueEvent(frameIndex, "change", (latest) => {
        if (!allLoaded || allImages.length === 0) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const index = Math.min(Math.round(latest), allImages.length - 1);
        const img = allImages[index];
        if (!img || !img.complete) return;
        drawFrame(ctx, img, canvas.width, canvas.height);
    });

    const specs = [
        { label: "Top Speed", value: "Mach 0.92", unit: "" },
        { label: "Range", value: "7,700", unit: "NM" },
        { label: "Ceiling", value: "51,000", unit: "FT" },
        { label: "Passengers", value: "19", unit: "MAX" },
    ];

    return (
        <section
            ref={containerRef}
            data-theme="dark"
            className="relative"
            style={{ height: "800vh" }}
        >
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {/* Top gradient blending from beige */}
                <div
                    className="absolute top-0 left-0 right-0 h-32 z-30 pointer-events-none"
                    style={{
                        background: "linear-gradient(to bottom, #EFECE6, transparent)",
                    }}
                />

                {/* Canvas — plays sequence-2 then sequence-3 seamlessly */}
                <canvas
                    ref={canvasRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    className="absolute inset-0 w-full h-full"
                />

                {/* Slight overlay for text contrast */}
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />

                {/* === "Fly in / Luxury" text — scrolls up and out === */}
                <motion.div
                    style={{ opacity: flyTextOpacity, y: flyTextY }}
                    className="absolute inset-0 z-10 flex items-center pointer-events-none"
                >
                    {/* Left: "Fly in" */}
                    <div className="absolute left-6 md:left-16 lg:left-20">
                        <h2
                            className="font-display text-white leading-[0.85]"
                            style={{
                                fontSize: "clamp(3rem, 12vw, 14rem)",
                                letterSpacing: "-0.03em",
                                textShadow: "0 4px 60px rgba(0,0,0,0.3)",
                            }}
                        >
                            Fly in
                        </h2>
                        <motion.p
                            style={{ opacity: subTextOpacity }}
                            className="mt-4 text-white/60 text-sm md:text-lg font-sans max-w-[16rem] leading-relaxed"
                        >
                            Luxury that moves with you.
                            <br />
                            <span className="text-white/35">Every detail, perfected.</span>
                        </motion.p>
                    </div>

                    {/* Right: "Luxury" */}
                    <div className="absolute right-6 md:right-16 lg:right-20 text-right">
                        <h2
                            className="font-display text-white leading-[0.85]"
                            style={{
                                fontSize: "clamp(3rem, 12vw, 14rem)",
                                letterSpacing: "-0.03em",
                                textShadow: "0 4px 60px rgba(0,0,0,0.3)",
                            }}
                        >
                            Luxury
                        </h2>
                    </div>
                </motion.div>

                {/* === "Engineered for Perfection" — fades in during sequence-3 === */}
                <motion.div
                    style={{ opacity: engTextOpacity, scale: engTextScale }}
                    className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
                >
                    <h2
                        className="text-white/90 font-display text-center"
                        style={{
                            fontSize: "clamp(1.5rem, 4vw, 4.5rem)",
                            letterSpacing: "0.2em",
                            textShadow: "0 4px 80px rgba(0,0,0,0.5)",
                        }}
                    >
                        ENGINEERED FOR PERFECTION
                    </h2>
                </motion.div>

                {/* === Specs grid — appears during sequence-3 === */}
                <motion.div
                    style={{ opacity: specOpacity, y: specY }}
                    className="absolute inset-0 z-10 pointer-events-none"
                >
                    <div className="h-full w-full flex items-end pb-16 px-8 md:px-16">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
                            {specs.map((spec, i) => (
                                <motion.div
                                    key={spec.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.6 }}
                                    viewport={{ once: true }}
                                    className="text-center md:text-left"
                                >
                                    <div className="text-white/30 text-[10px] tracking-[0.3em] uppercase mb-2">
                                        {spec.label}
                                    </div>
                                    <div className="text-white text-2xl md:text-3xl font-display tracking-tight">
                                        {spec.value}
                                        {spec.unit && (
                                            <span className="text-white/40 text-sm ml-1.5 tracking-wider">
                                                {spec.unit}
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Bottom gradient to beige */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-40 z-20 pointer-events-none"
                    style={{
                        background: "linear-gradient(to top, #EFECE6, transparent)",
                    }}
                />
            </div>
        </section>
    );
}
