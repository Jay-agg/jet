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

export default function PlaneMorph() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 1920, height: 1080 });
    const { images, isLoaded } = useImagePreloader("sequence-2", FRAME_COUNT);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const frameIndex = useTransform(
        scrollYProgress,
        [0, 1],
        [0, FRAME_COUNT - 1]
    );

    // Text appears when the morph completes (last ~25% of the sequence)
    const textOpacity = useTransform(scrollYProgress, [0.65, 0.8, 0.95], [0, 1, 0.8]);
    const textY = useTransform(scrollYProgress, [0.65, 0.8], [30, 0]);
    const textScale = useTransform(scrollYProgress, [0.65, 0.8], [0.95, 1]);

    // Set canvas size
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

    // Draw initial frame
    useEffect(() => {
        if (!isLoaded || images.length === 0) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = images[0];
        ctx.clearRect(0, 0, canvas.width, canvas.height);

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
                {/* Top gradient blend */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#050505] to-transparent z-20 pointer-events-none" />

                {/* Canvas */}
                <canvas
                    ref={canvasRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    className="absolute inset-0 w-full h-full"
                />

                {/* Text overlay */}
                <motion.div
                    style={{ opacity: textOpacity, y: textY, scale: textScale }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
                >
                    <h2
                        className="text-white text-center font-light"
                        style={{
                            fontSize: "clamp(1.3rem, 3.5vw, 3.5rem)",
                            letterSpacing: "0.25em",
                            textShadow: "0 4px 60px rgba(0,0,0,0.7)",
                        }}
                    >
                        ENGINEERED FOR PERFECTION
                    </h2>
                    <div className="mt-6 w-16 h-[1px] bg-white/30" />
                </motion.div>

                {/* Bottom gradient blend */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-20 pointer-events-none" />
            </div>
        </section>
    );
}
