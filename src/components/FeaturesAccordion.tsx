"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const features = [
    {
        id: "pets",
        title: "Pets Welcome",
        text: "Traveling with pets on a private jet means comfort and peace of mind. Our cabins are designed with spacious, climate-controlled environments to keep your companions relaxed at 51,000 feet.",
        img: "/feature-pets.jpg",
    },
    {
        id: "247",
        title: "24/7 Availability",
        text: "Our fleet is ready whenever you are. Day or night, our dedicated concierge team coordinates every detail — from wheels-up to wheels-down — so you never wait.",
        img: "/feature-247.jpg",
    },
    {
        id: "comfort",
        title: "Supreme Comfort",
        text: "Hand-stitched Italian leather, noise-canceling cabin design, and a pressurized interior equivalent to 4,000 feet elevation. Arrive feeling better than when you left.",
        img: "/feature-comfort.jpg",
    },
    {
        id: "dining",
        title: "Gourmet Dining",
        text: "Curated menus from world-class chefs, tailored to your preferences. From champagne pairings to dietary accommodations, every meal is a first-class experience.",
        img: "/feature-dining.jpg",
    },
];

export default function FeaturesAccordion() {
    const [activeFeature, setActiveFeature] = useState(features[0].id);

    const activeImg = features.find((f) => f.id === activeFeature)?.img;

    return (
        <section className="relative w-full bg-jesko-beige text-jesko-charcoal">
            {/* Section header */}
            <div className="px-8 md:px-20 pt-32 pb-12">
                <p className="text-[10px] font-sans uppercase tracking-[0.35em] text-jesko-charcoal/40 mb-3">
                    The Experience
                </p>
                <h2
                    className="font-display text-jesko-charcoal"
                    style={{
                        fontSize: "clamp(2rem, 5vw, 5rem)",
                        letterSpacing: "-0.02em",
                        lineHeight: 1,
                    }}
                >
                    A Better Way to Fly
                </h2>
            </div>

            {/* Split layout */}
            <div className="flex flex-col md:flex-row min-h-screen">
                {/* Left: Accordion */}
                <div className="w-full md:w-1/2 px-8 md:px-20 flex flex-col justify-center py-16 md:py-32">
                    <div className="flex flex-col">
                        {features.map((feature) => (
                            <div
                                key={feature.id}
                                className="border-b border-jesko-charcoal/10 cursor-pointer group"
                                onClick={() => setActiveFeature(feature.id)}
                            >
                                <div className="flex justify-between items-center py-7 transition-opacity duration-300 group-hover:opacity-60">
                                    <h3
                                        className="font-display"
                                        style={{
                                            fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                                            letterSpacing: "-0.01em",
                                        }}
                                    >
                                        {feature.title}
                                    </h3>
                                    <span className="text-2xl text-jesko-charcoal/30 transition-transform duration-300">
                                        {activeFeature === feature.id ? "−" : "+"}
                                    </span>
                                </div>
                                <AnimatePresence initial={false}>
                                    {activeFeature === feature.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <p className="pb-8 text-base md:text-lg text-jesko-charcoal/60 max-w-md leading-relaxed font-sans">
                                                {feature.text}
                                            </p>

                                            {/* Mobile image */}
                                            <div className="md:hidden mb-8 rounded-xl overflow-hidden aspect-[4/3]">
                                                <img
                                                    src={feature.img}
                                                    alt={feature.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Sticky image (desktop only) */}
                <div className="hidden md:block w-1/2 h-screen sticky top-0 p-8 md:p-10">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-jesko-stone/20">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeFeature}
                                src={activeImg}
                                alt=""
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
