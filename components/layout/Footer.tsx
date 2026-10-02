import React from 'react';
import Link from 'next/link';
import { BookOpen, ShieldCheck, Scale, Globe, FileText, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900 text-white dark:bg-blue-600">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                KNOWLIX
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400 max-w-sm">
              An independent, peer-reviewed collaborative knowledge platform dedicated to high-verifiability, neutral point of view, permanent revision provenance, and community-moderated academic synthesis.
            </p>
            <div className="mt-4 flex items-center gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Vercel Serverless Ready
              </span>
              <span className="flex items-center gap-1 text-blue-700 dark:text-blue-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                PostgreSQL Normalized Schema
              </span>
            </div>
          </div>

          {/* Browse Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Explore Knowledge
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/categories" className="hover:text-blue-700 dark:hover:text-blue-400">
                  All Disciplines
                </Link>
              </li>
              <li>
                <Link href="/category/science-and-technology" className="hover:text-blue-700 dark:hover:text-blue-400">
                  Science & Technology
                </Link>
              </li>
              <li>
                <Link href="/category/history-and-civilization" className="hover:text-blue-700 dark:hover:text-blue-400">
                  History & Civilization
                </Link>
              </li>
              <li>
                <Link href="/category/energy-and-sustainability" className="hover:text-blue-700 dark:hover:text-blue-400">
                  Energy & Sustainability
                </Link>
              </li>
              <li>
                <Link href="/random" className="hover:text-blue-700 dark:hover:text-blue-400">
                  Random Article
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Policies */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Governance & Policies
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/policies/neutral-point-of-view" className="hover:text-blue-700 dark:hover:text-blue-400">
                  Neutral Point of View
                </Link>
              </li>
              <li>
                <Link href="/policies/verifiability" className="hover:text-blue-700 dark:hover:text-blue-400">
                  Verifiability & Citations
                </Link>
              </li>
              <li>
                <Link href="/policies/reliable-sources" className="hover:text-blue-700 dark:hover:text-blue-400">
                  Reliable Sources
                </Link>
              </li>
              <li>
                <Link href="/policies/no-original-research" className="hover:text-blue-700 dark:hover:text-blue-400">
                  No Original Research
                </Link>
              </li>
              <li>
                <Link href="/policies" className="hover:text-blue-700 dark:hover:text-blue-400 font-medium text-blue-900 dark:text-blue-400">
                  View All 18 Policies &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Project & Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Platform & Legal
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-blue-700 dark:hover:text-blue-400">
                  About Knowlix
                </Link>
              </li>
              <li>
                <Link href="/policies/copyright-and-attribution" className="hover:text-blue-700 dark:hover:text-blue-400">
                  Copyright & Attribution
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-blue-700 dark:hover:text-blue-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/dispute-resolution" className="hover:text-blue-700 dark:hover:text-blue-400">
                  Dispute Resolution
                </Link>
              </li>
              <li>
                <Link href="/create" className="hover:text-blue-700 dark:hover:text-blue-400">
                  Contribute New Article
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Knowlix Open Encyclopedia. All original content licensed under CC BY-SA 4.0. Text must be cited and attributed.
          </p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <Scale className="h-3.5 w-3.5" />
              Community Governed
            </span>
            <span className="flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" />
              Global Access
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
