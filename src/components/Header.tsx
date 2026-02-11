"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export default function Header() {
    const [isDark, setIsDark] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const { scrollY } = useScroll();

    // Track scroll for background opacity
    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 60);
    });

    // Observe sections to toggle between light/dark text
    useEffect(() => {
        const darkSections = document.querySelectorAll("[data-theme='dark']");
        const observer = new IntersectionObserver(
            (entries) => {
                // If any dark section is intersecting significantly, use light text
                const anyDarkVisible = entries.some(
                    (e) => e.isIntersecting && e.intersectionRatio > 0.3
                );
                setIsDark(anyDarkVisible);
            },
            {
                rootMargin: "-40% 0px -55% 0px",
                threshold: [0, 0.3, 0.5, 1],
            }
        );

        darkSections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    const textColor = isDark ? "text-white" : "text-jesko-charcoal";

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-[100] transition-colors duration-700`}
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 transition-all duration-500"
                style={{
                    background: isScrolled
                        ? isDark
                            ? "rgba(10,10,10,0.6)"
                            : "rgba(239,236,230,0.7)"
                        : "transparent",
                    backdropFilter: isScrolled ? "blur(16px) saturate(1.2)" : "none",
                }}
            />

            <nav className="relative flex items-center justify-between px-8 md:px-12 py-5">
                {/* Logo */}
                <div className={`font-display text-sm tracking-[0.35em] uppercase transition-colors duration-700 ${textColor}`}>
                    Jesko Jets
                </div>

                {/* Nav Items */}
                <div className="hidden md:flex items-center gap-10">
                    {["Fleet", "Experience", "Routes", "About"].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className={`text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:opacity-60 ${textColor}`}
                        >
                            {item}
                        </a>
                    ))}
                </div>

                {/* CTA */}
                <a
                    href="#reserve"
                    className={`text-[11px] tracking-[0.2em] uppercase px-6 py-2.5 border transition-all duration-500 hover:bg-white/10 ${isDark
                            ? "border-white/25 text-white"
                            : "border-jesko-charcoal/20 text-jesko-charcoal hover:bg-jesko-charcoal/5"
                        }`}
                >
                    Book Now
                </a>
            </nav>
        </motion.header>
    );
}
