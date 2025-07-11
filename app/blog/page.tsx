import { BlogPosts } from 'app/components/posts'
import dynamic from 'next/dynamic';
import { Suspense, useState } from 'react';

const ParticlesBackground = dynamic(() => import('app/components/particles').then(mod => ({ default: mod.ParticlesBackground })), {
  ssr: false,
  loading: () => <div className="w-32 h-32 bg-gray-200 animate-pulse rounded-lg" />
});


export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
}

export default function Page() {
  return (
    <>
      {/* <Suspense fallback={null}>
        <ParticlesBackground />
      </Suspense> */}
      <div className="flex justify-center items-start min-h-screen">
        <section className="relative z-10 p-8 max-w-4xl w-full tracking-tight bg-[var(--background-100)]/20 backdrop-blur-[6px] border border-[var(--primary-200)] rounded-xl text-[var(--text-900)] transform hover:scale-[1.02] hover:border-[var(--primary-300)] transition-all duration-300 hover:shadow-2xl">
          <h1 className="font-bold text-4xl lg:text-5xl mb-8 tracking-tighter text-[var(--text-900)] flex items-center gap-3">
            blog
          </h1>
          <p className="mb-8 text-lg text-[var(--text-700)] leading-relaxed">
            thoughts, tutorials, showcases, and random blobs about software dev and life
          </p>
          <BlogPosts />
        </section>
      </div>
    </>
  )
}