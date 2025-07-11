

import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { formatDate, getBlogPosts } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'
import Link from 'next/link'
import dynamic from 'next/dynamic';
import { Suspense, useState } from 'react';

const ParticlesBackground = dynamic(() => import('app/components/particles').then(mod => ({ default: mod.ParticlesBackground })), {
  ssr: false,
  loading: () => <div className="w-32 h-32 bg-gray-200 animate-pulse rounded-lg" />
});

export async function generateStaticParams() {
  let posts = getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export function generateMetadata({ params }) {
  let post = getBlogPosts().find((post) => post.slug === params.slug)
  if (!post) {
    return
  }
  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata
  let ogImage = image || null
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default function Blog({ params }) {
  let post = getBlogPosts().find((post) => post.slug === params.slug)
  if (!post) {
    notFound()
  }

  return (
    <div className="flex justify-center items-start min-h-screen pt-8">
      <div className="max-w-4xl w-full px-4">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.metadata.title,
              datePublished: post.metadata.publishedAt,
              dateModified: post.metadata.publishedAt,
              description: post.metadata.summary,
              image: post.metadata.image ? `${baseUrl}${post.metadata.image}` : null,
              url: `${baseUrl}/blog/${post.slug}`,
              author: {
                '@type': 'Person',
                name: 'sdhhf',
              },
            }),
          }}
        />

        {/* Back to blog link */}
        <div className="mb-8">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-[var(--text-600)] hover:text-blue-300 transition-colors duration-200 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            back to blog
          </Link>
        </div>

        <article className="relative z-10 p-8 lg:p-12 tracking-tight bg-[var(--background-100)]/20 backdrop-blur-[6px] border border-[var(--primary-200)] rounded-xl text-[var(--text-900)] transform hover:border-[var(--primary-300)] transition-all duration-300 hover:shadow-2xl">
          {/* Header section */}
          <header className="mb-12 pb-8 border-b border-[var(--primary-200)]">
            <h1 className="font-bold text-3xl lg:text-4xl xl:text-5xl mb-6 tracking-tighter text-[var(--text-900)] leading-tight">
              {post.metadata.title}
            </h1>
            
            {post.metadata.summary && (
              <p className="text-lg lg:text-xl text-[var(--text-700)] leading-relaxed mb-6 font-medium">
                {post.metadata.summary}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <time 
                  className="text-sm text-[var(--text-600)] font-mono bg-[var(--background-200)] px-3 py-1 rounded-full border border-[var(--primary-200)]"
                  dateTime={post.metadata.publishedAt}
                >
                  {formatDate(post.metadata.publishedAt)}
                </time>
              </div>
              
              {post.metadata.tags && (
                <div className="flex flex-wrap gap-2">
                  {post.metadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-300 border border-purple-500/20 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none
            prose-headings:text-[var(--text-900)] 
            prose-headings:font-bold 
            prose-headings:tracking-tight
            prose-h1:text-3xl
            prose-h2:text-2xl 
            prose-h3:text-xl
            prose-p:text-[var(--text-800)] 
            prose-p:leading-relaxed
            prose-p:text-base
            prose-a:text-blue-400 
            prose-a:no-underline 
            hover:prose-a:text-blue-300
            prose-a:transition-colors
            prose-strong:text-[var(--text-900)]
            prose-code:text-purple-300
            prose-code:bg-[var(--background-200)]
            prose-code:px-2
            prose-code:py-1
            prose-code:rounded
            prose-code:border
            prose-code:border-[var(--primary-200)]
            prose-pre:bg-[var(--background-200)]
            prose-pre:border
            prose-pre:border-[var(--primary-200)]
            prose-pre:rounded-lg
            prose-blockquote:border-l-4
            prose-blockquote:border-blue-500
            prose-blockquote:bg-blue-500/5
            prose-blockquote:text-[var(--text-800)]
            prose-ul:text-[var(--text-800)]
            prose-ol:text-[var(--text-800)]
            prose-li:text-[var(--text-800)]
            prose-table:text-[var(--text-800)]
            prose-th:text-[var(--text-900)]
            prose-th:bg-[var(--background-200)]
            prose-td:border-[var(--primary-200)]
            prose-th:border-[var(--primary-200)]
          ">
            <CustomMDX source={post.content} />
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-[var(--primary-200)]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-[var(--text-600)]">
                thanks for reading! 
              </div>
              <Link 
                href="/blog"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-300 border border-blue-500/20 rounded-lg hover:from-blue-500/20 hover:to-purple-500/20 hover:border-blue-500/30 transition-all duration-200 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                more posts
              </Link>
            </div>
          </footer>
        </article>
      </div>
      {/* <Suspense fallback={null}>
        <ParticlesBackground />
      </Suspense> */}
    </div>
  )
}