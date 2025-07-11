import Link from 'next/link'

import dynamic from 'next/dynamic';
import { Suspense, useState } from 'react';
import { formatDate, getBlogPosts } from 'app/blog/utils'

const ParticlesBackground = dynamic(() => import('app/components/particles').then(mod => ({ default: mod.ParticlesBackground })), {
  ssr: false,
  loading: () => <div className="w-32 h-32 bg-gray-200 animate-pulse rounded-lg" />
});


export function BlogPosts() {
  let allBlogs = getBlogPosts()

  return (
    <div className="space-y-6">
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1
          }
          return 1
        })
        .map((post, index) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block group"
          >
            <article className="p-6 bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-[var(--primary-200)] rounded-lg transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:border-[var(--primary-300)] hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-purple-500/10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-[var(--text-900)] group-hover:text-blue-300 transition-colors duration-200 mb-2">
                    {post.metadata.title}
                  </h2>
                  {post.metadata.summary && (
                    <p className="text-[var(--text-700)] text-sm leading-relaxed line-clamp-2">
                      {post.metadata.summary}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <time
                    className="text-sm text-[var(--text-600)] font-mono bg-[var(--background-200)] px-3 py-1 rounded-full border border-[var(--primary-200)]"
                    dateTime={post.metadata.publishedAt}
                  >
                    {formatDate(post.metadata.publishedAt, false)}
                  </time>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {post.metadata.tags && (
                    <div className="flex gap-2">
                      {post.metadata.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-300 border border-purple-500/20 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[var(--text-600)] text-sm group-hover:text-blue-300 transition-colors duration-200 flex items-center gap-1">
                  read more
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </article>
          </Link>
        ))}

      {allBlogs.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-[var(--text-900)] mb-2">no posts!</h3>
          <p className="text-[var(--text-700)]">check back if ihave made new posts</p>
        </div>
      )}
{/* 
      <Suspense fallback={null}>
        <ParticlesBackground />
      </Suspense> */}
    </div>
  )
}