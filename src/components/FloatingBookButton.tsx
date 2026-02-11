"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingBookButton() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[90]"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
            <motion.a
                href="#reserve"
                className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-jesko-charcoal text-white shadow-lg shadow-black/20 cursor-pointer overflow-hidden"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Plane icon */}
                <svg
                    className="w-5 h-5 md:w-6 md:h-6 rotate-[-45deg]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                </svg>

                {/* Pulse ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border border-jesko-charcoal/30"
                    animate={{
                        scale: [1, 1.5, 1.5],
                        opacity: [0.4, 0, 0],
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeOut",
                    }}
                />
            </motion.a>

            {/* Tooltip */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, x: 10, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.9 }}
                        className="absolute right-full top-1/2 -translate-y-1/2 mr-3 whitespace-nowrap px-4 py-2 bg-jesko-charcoal text-white text-[10px] tracking-[0.2em] uppercase rounded-md shadow-lg"
                    >
                        Book a Flight
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
