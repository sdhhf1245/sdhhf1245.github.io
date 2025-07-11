

import './global.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import { baseUrl } from './sitemap'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const ParticlesBackground = dynamic(
  () =>
    import('app/components/particles').then(mod => ({
      default: mod.ParticlesBackground,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-32 h-32 bg-gray-200 animate-pulse rounded-lg" />
    ),
  }
)

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'sdhhf',
    template: '%s | sdhhf',
  },
  description: "sdhhf 😋",
  creator: 'sdhhf',
  authors: [{ name: 'sdhhf' }],
  applicationName: 'sdhhfWeb',
  keywords: ['Next.js', 'React', 'JavaScript', 'GameHacking', 'sdhhf', 'Roblox', 'Typeracer', 'Monkeytype'],
  openGraph: {
    title: 'sdhhf',
    description: "sdhhf 😋",
    url: baseUrl,
    siteName: 'sdhhf',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};


const cx = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={cx('bg-[var(--background-50)] text-[var(--text-900)]', inter.variable)}
    >
      <head>
        <link rel="preconnect" href="https://va.vercel-scripts.com" />
        <link rel="preconnect" href="https://media.discordapp.net" />
        <link rel="dns-prefetch" href="https://dcdn.dstn.to" />
        <meta property="og:image" content="https://dcdn.dstn.to/avatars/1059614915456938084?size=1024" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1024" />
        <meta property="og:image:height" content="1024" />
        <meta name="theme-color" content="#2c2d30"/>
      </head>
      <body className="antialiased max-w-7xl mx-6 mt-8 lg:mx-auto relative">
        <Suspense fallback={null}>
          {/* <div className="fixed inset-0 -z-10"> */}
            <ParticlesBackground />
          {/* </div> */}
        </Suspense>

        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0 relative z-10">
          <Navbar />
          {children}
          {/* <Footer /> */}
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  )
}
