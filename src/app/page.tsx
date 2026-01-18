"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import Lanyard from "./Lanyard";
import Lastfm from "./fm";

export default function Home() {
  const name = "sdhhf";
  const [type] = useState(() => Math.floor(Math.random() * 2));
  const gradient = "text-[var(--foreground)]";

  return (
    <>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        onAnimationComplete={(definition) => {
          if (
            typeof definition === "object" &&
            definition &&
            "opacity" in definition &&
            definition.opacity === 0
          ) {
            const el = document.getElementById("intro");
            if (el) el.style.display = "none";
          }
        }}
        id="intro"
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      >
        <h1
          className={`flex text-4xl sm:text-6xl md:text-8xl font-bold font-sans ${gradient} p-4 sm:p-8`}
        >
          {type === 0 ? (
            name.split("").map((l, i) => (
              <motion.span
                key={i}
                initial={{ y: 50, opacity: 0, filter: "blur(10px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{
                  delay: i * 0.1,
                  type: "spring",
                  bounce: 0.4,
                  duration: 1,
                }}
              >
                {l}
              </motion.span>
            ))
          ) : (
            <motion.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
            >
              {name}
            </motion.span>
          )}
        </h1>
      </motion.div>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 flex rotate-[30deg] scale-[2]">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[80px] sm:w-[140px] overflow-hidden"
            >
              <div
                className="flex flex-col text-3xl sm:text-5xl font-bold opacity-[0.07] select-none whitespace-nowrap"
                style={{
                  animation: `scroll-${i % 2 === 0 ? "up" : "down"} ${15 + (i % 5)}s linear infinite`,
                }}
              >
                {Array.from({ length: 100 }).map((_, j) => (
                  <div key={j}>{name}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <motion.div
        className="flex min-h-screen font-sans z-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <main className="flex min-h-screen w-full flex-col py-8 px-4 sm:py-12 sm:px-8 md:py-16 md:px-16">
          <div className="w-full flex flex-wrap justify-between items-center gap-3 sm:gap-4">
            <a
              href="/"
              className={`text-2xl sm:text-3xl md:text-4xl font-bold ${gradient}`}
            >
              home
            </a>
            <a
	      href="/contact"
              className={`text-2xl sm:text-3xl md:text-4xl font-bold ${gradient}`}
            >
              contact
            </a>
            <h1
              className={`ml-auto text-2xl sm:text-3xl md:text-4xl font-bold ${gradient}`}
            >
              {name}
            </h1>
          </div>
          <div className="z-[100] pt-[16px] sm:pt-[20px] md:pt-[24px] flex flex-col gap-2">
            <Lanyard />
	    <Lastfm />
          </div>
        </main>
      </motion.div>
    </>
  );
}
