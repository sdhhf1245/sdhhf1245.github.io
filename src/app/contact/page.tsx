"use client";
import { motion } from "framer-motion";
import { FaDiscord, FaGithub } from "react-icons/fa6";
import { SiRoblox } from "react-icons/si";

const name = "sdhhf";
const gradient = "text-[var(--foreground)]";

export default function Contact() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 flex rotate-[30deg] scale-[2]">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[80px] sm:w-[140px] overflow-hidden">
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
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <main className="flex min-h-screen w-full flex-col py-8 px-4 sm:py-12 sm:px-8 md:py-16 md:px-16">
          <div className="w-full flex flex-wrap justify-between items-center gap-3 sm:gap-4">
            <a href="/" className={`text-3xl sm:text-4xl md:text-5xl font-bold ${gradient}`}>
              home
            </a>
            <a href="/contact" className={`text-3xl sm:text-4xl md:text-5xl font-bold ${gradient}`}>
              contact
            </a>
            <h1 className={`ml-auto text-3xl sm:text-4xl md:text-5xl font-bold ${gradient}`}>
              {name}
            </h1>
          </div>

          <div className="mt-16 flex flex-col gap-6 sm:gap-8">
            

            <div className="flex flex-col gap-3">
              <div className="flex gap-2 items-center text-4xl sm:text-3xl font-bold">
                <FaDiscord className="text-primary" />
                <a href="https://discord.com/users/1059614915456938084" target="_blank" className="text-primary">
                  sdhhf
                </a>
              </div>

              <div className="flex gap-2 items-center text-4xl sm:text-3xl font-bold">
                <FaGithub className="text-primary" />
                <a href="https://github.com/sdhhf1245" target="_blank" className="text-primary"> 
                  sdhhf1245
                </a>
              </div>

              <div className="flex gap-2 items-center text-4xl sm:text-3xl font-bold">
                <SiRoblox className="text-primary" />
                <a href="https://www.roblox.com/users/2927093836/profile" target="_blank" className="text-primary">
                  sdhhf1245
                </a>
              </div>
            </div>
          </div>
        </main>
      </motion.div>
    </>
  );
}


