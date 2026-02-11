"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const destinations = [
    "New York",
    "London",
    "Dubai",
    "Tokyo",
    "Singapore",
    "Paris",
    "Los Angeles",
    "Sydney",
    "Hong Kong",
    "Milan",
    "São Paulo",
    "Toronto",
    "Zurich",
    "Miami",
    "Monaco",
];

export default function DestinationsMarquee() {
    const sectionRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    // Drive the slot machine with scroll
    const marqueeY = useTransform(
        scrollYProgress,
        [0, 1],
        ["0%", `-${(destinations.length - 4) * 100 / destinations.length}%`]
    );

    return (
        <section
            ref={sectionRef}
            className="relative bg-jesko-beige py-32 md:py-48 overflow-hidden"
        >
            <div className="flex flex-col md:flex-row items-start md:items-center px-8 md:px-20 gap-16 md:gap-24">
                {/* Left text */}
                <div className="w-full md:w-1/2 shrink-0">
                    <p className="text-[10px] font-sans uppercase tracking-[0.35em] text-jesko-charcoal/40 mb-4">
                        Destinations
                    </p>
                    <h2
                        className="font-display text-jesko-charcoal"
                        style={{
                            fontSize: "clamp(2.5rem, 6vw, 6rem)",
                            letterSpacing: "-0.03em",
                            lineHeight: 0.95,
                        }}
                    >
                        Fly
                        <br />
                        Anywhere.
                    </h2>
                    <p className="mt-8 text-jesko-charcoal/50 text-base md:text-lg max-w-sm leading-relaxed font-sans">
                        From coast to coast or continent to continent. Our global network
                        connects you to over 5,000 airports worldwide.
                    </p>

                    {/* Stats row */}
                    <div className="mt-12 flex gap-12">
                        <div>
                            <div className="text-3xl md:text-4xl font-display text-jesko-charcoal tracking-tight">
                                5,000+
                            </div>
                            <div className="text-[10px] tracking-[0.2em] uppercase text-jesko-charcoal/30 mt-1">
                                Airports
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-display text-jesko-charcoal tracking-tight">
                                180+
                            </div>
                            <div className="text-[10px] tracking-[0.2em] uppercase text-jesko-charcoal/30 mt-1">
                                Countries
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Slot machine marquee */}
                <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                    <div
                        className="relative h-[360px] overflow-hidden marquee-track"
                        style={{ width: "100%" }}
                    >
                        <motion.div
                            style={{ y: marqueeY }}
                            className="flex flex-col"
                        >
                            {destinations.map((city, i) => (
                                <div
                                    key={`${city}-${i}`}
                                    className="py-3 border-b border-jesko-charcoal/8 flex items-center justify-between group"
                                >
                                    <span
                                        className="font-display text-jesko-charcoal/80 group-hover:text-jesko-charcoal transition-colors duration-300"
                                        style={{
                                            fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                                            letterSpacing: "-0.01em",
                                        }}
                                    >
                                        {city}
                                    </span>
                                    <svg
                                        className="w-4 h-4 text-jesko-charcoal/20 group-hover:text-jesko-charcoal/50 transition-all duration-300 group-hover:translate-x-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                                        />
                                    </svg>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
