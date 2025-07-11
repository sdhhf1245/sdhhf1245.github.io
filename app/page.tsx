"use client";
import { BlogPosts } from 'app/components/posts';
import dynamic from 'next/dynamic';
import { Suspense, useState } from 'react';

import { IoLogoJavascript } from "react-icons/io";
import { RiNextjsFill, RiReactjsLine, RiNodejsLine, RiTailwindCssFill } from "react-icons/ri";
import { PiHandWavingFill } from "react-icons/pi";
import { BiLogoTypescript } from "react-icons/bi";

import { SiLua } from "react-icons/si";
import Link from 'next/link';

const Lanyard = dynamic(() => import('app/components/lanyard'), {
  ssr: false,
  loading: () => <div className="w-32 h-32 bg-gray-200 animate-pulse rounded-lg" />
});

const ParticlesBackground = dynamic(() => import('app/components/particles').then(mod => ({ default: mod.ParticlesBackground })), {
  ssr: false,
  loading: () => <div className="w-32 h-32 bg-gray-200 animate-pulse rounded-lg" />
});

export default function Page() {
  const [entered, set] = useState(false);
  const [clicking, setClicking] = useState(false);

  const enter = () => {
    setClicking(true);

    setTimeout(() => {
      set(true);
    }, 500);
  };

  const content = (
    <div className="flex flex-col lg:flex-row justify-center items-center gap-8 max-w-none mx-auto">
      <div className="flex items-center">
        <Suspense fallback={<div className="w-32 h-32 bg-[var(--background-800)] animate-pulse rounded-lg" />}>
          <Lanyard />
        </Suspense>
      </div>

      <div className="relative group h-full flex items-center">
       <section className="relative z-10 p-8 max-w-2xl lg:max-w-3xl tracking-tight bg-[var(--background-100)]/20 backdrop-blur-[6px] border border-[var(--primary-200)] rounded-xl text-[var(--text-900)] transform hover:scale-105 hover:border-[var(--primary-300)] transition-all duration-300 hover:shadow-2xl">

          <h1 className="mb-8 text-4xl lg:text-5xl font-bold tracking-tighter flex items-center align-middle gap-2">
            sdhhf. <PiHandWavingFill />
          </h1>
          <p className="mb-6 text-lg text-[var(--text-700)] leading-relaxed">
            {`greetings! my name is sdhhf and i am an amateur software developer; i enjoy learning new things and building small projects. i started to learn programming out of curiosity, and it has become a passion for me.`}
          </p>

          <div className="mb-8">
            <h2 className="font-semibold mb-3 text-[var(--text-900)]">skills</h2>
            <div className="flex flex-wrap gap-3">
              {[
                {
                  name: 'JavaScript',
                  icon: IoLogoJavascript,
                  color: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                },
                {
                  name: 'Node.js',
                  icon: RiNodejsLine,
                  color: 'bg-green-500/20 text-green-300 border border-green-500/30'
                },
                {
                  name: 'Lua',
                  icon: SiLua,
                  color: 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                },
              ].map((skill) => {
                const Icon = skill.icon;
                return (
                  <span
                    key={skill.name}
                    className={`px-4 py-2 rounded-full text-sm font-medium transform hover:scale-110 transition-all duration-200 cursor-pointer flex items-center gap-2 ${skill.color}`}
                  >
                    <Icon className="text-lg" />
                    {skill.name}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
                <h3 className="font-semibold mb-2 text-purple-300 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  main project
                </h3>
                <Link
                  href="/blog/bites"
                  className="text-sm text-[var(--text-700)] hover:text-blue-300 transition-colors cursor-pointer"
                >
                  a fully fledged casino in a discord bot
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  return (
    <>
      <div className={`transition-opacity duration-500 ${entered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {content}
      </div>

      {!entered && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[var(--background-100)] cursor-pointer transition-opacity duration-500 ${clicking ? 'opacity-0' : 'opacity-100'}`} onClick={enter}>
          <div className={`text-center transform transition-all duration-300 hover:scale-105 ${clicking ? 'animate-ping' : ''}`}>
            <h1 className="text-6xl lg:text-8xl font-bold mb-6 text-[var(--text-900)] tracking-tighter">
              sdhhf.
            </h1>
            <p className="text-xl lg:text-2xl text-[var(--text-700)] mb-8 animate-pulse">
              enter...
            </p>
          </div>
        </div>
      )}

      <Suspense fallback={null}>
        <ParticlesBackground />
      </Suspense>
    </>
  );
}