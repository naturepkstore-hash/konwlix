import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getCurrentUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: {
    default: 'Knowlix — The Open Collaborative Encyclopedia',
    template: '%s — Knowlix Encyclopedia',
  },
  description:
    'Knowlix is a peer-reviewed, open-access collaborative online encyclopedia dedicated to verified research, neutral point of view, and permanent revision provenance.',
  keywords: [
    'encyclopedia',
    'open knowledge',
    'academic research',
    'collaborative editing',
    'peer-reviewed articles',
    'verifiable sources',
  ],
  authors: [{ name: 'Knowlix Knowledge Foundation' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://knowlix.org'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Knowlix Encyclopedia',
    title: 'Knowlix — The Open Collaborative Encyclopedia',
    description: 'Explore peer-reviewed and verified knowledge across science, history, and humanities.',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[#fbfbf9] text-slate-900 antialiased dark:bg-[#090d16] dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100">
        <Navbar currentUser={currentUser} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
