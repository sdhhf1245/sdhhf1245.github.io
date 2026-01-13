import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});
const baseUrl = "https://sdhhf1245.github.io/"
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
  keywords: ['Next.js', 'React', 'JavaScript', 'sdhhf', 'Roblox', 'Typeracer', 'Monkeytype'],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
