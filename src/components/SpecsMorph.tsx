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

const specs = [
    { label: "Top Speed", value: "Mach 0.92", unit: "" },
    { label: "Range", value: "7,700", unit: "NM" },
    { label: "Ceiling", value: "51,000", unit: "FT" },
    { label: "Passengers", value: "19", unit: "MAX" },
];

export default function SpecsMorph() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 1920, height: 1080 });
    const { images, isLoaded } = useImagePreloader("sequence-3", FRAME_COUNT);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

    // Spec items stagger in
    const specOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);
    const specY = useTransform(scrollYProgress, [0.15, 0.35], [40, 0]);

    // "Engineered" text
    const titleOpacity = useTransform(scrollYProgress, [0.6, 0.78, 0.95], [0, 1, 0.85]);
    const titleScale = useTransform(scrollYProgress, [0.6, 0.78], [0.92, 1]);

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

    useEffect(() => {
        if (!isLoaded || images.length === 0) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        drawFrame(ctx, images[0], canvas.width, canvas.height);
    }, [isLoaded, images, canvasSize]);

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
            className="relative bg-jesko-dark"
            style={{ height: "400vh" }}
        >
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {/* No top gradient — seamless continuation from sequence-2 in FlyInLuxury */}

                {/* Canvas — sequence-3 begins exactly where sequence-2 left off */}
                <canvas
                    ref={canvasRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    className="absolute inset-0 w-full h-full"
                />

                {/* Specs grid around the canvas */}
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

                {/* Center text */}
                <motion.div
                    style={{ opacity: titleOpacity, scale: titleScale }}
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
