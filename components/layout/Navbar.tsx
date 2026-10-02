'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Search,
  Shuffle,
  Shield,
  User as UserIcon,
  Bell,
  Bookmark,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  PlusCircle,
} from 'lucide-react';
import { Role } from '@prisma/client';
import { getRoleBadgeColor, hasRole } from '@/lib/roles';

interface NavbarProps {
  currentUser?: {
    id: string;
    username: string;
    displayName?: string | null;
    avatarUrl?: string | null;
    role: Role;
    reputation: number;
  } | null;
}

export default function Navbar({ currentUser }: NavbarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial dark mode from document
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark') || 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleRandomArticle = async () => {
    router.push('/random');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      {/* Academic Top Strip */}
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-1 text-xs text-slate-500 dark:border-slate-800/60 dark:bg-slate-950/60 dark:text-slate-400">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-serif italic tracking-wide">
              Knowlix &bull; The Open Collaborative Encyclopedia
            </span>
            <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
            <span className="hidden md:inline">Peer-Reviewed &bull; Neutral Point of View &bull; Permanent Revisions</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/policies" className="hover:text-slate-800 dark:hover:text-slate-200">
              Community Policies
            </Link>
            <Link href="/about" className="hover:text-slate-800 dark:hover:text-slate-200">
              About Knowlix
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-900 text-white shadow-sm transition-transform group-hover:scale-105 dark:bg-blue-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                KNOWLIX
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 -mt-1 font-sans font-semibold">
                Open Encyclopedia
              </span>
            </div>
          </Link>

          {/* Primary Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Link
              href="/categories"
              className="rounded-md px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Categories
            </Link>
            <button
              onClick={handleRandomArticle}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Shuffle className="h-3.5 w-3.5 text-slate-500" />
              <span>Random</span>
            </button>
            <Link
              href="/policies"
              className="rounded-md px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Policies
            </Link>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search Knowlix articles, concepts, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-slate-300 bg-slate-50 py-1.5 pl-10 pr-4 text-sm text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:bg-slate-900"
            />
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Create Article Button */}
          <Link
            href="/create"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-blue-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>New Article</span>
          </Link>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* User Profile / Auth State */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1 pr-2.5 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-800 text-xs font-bold text-white uppercase">
                  {currentUser.username.slice(0, 2)}
                </div>
                <span className="hidden sm:inline text-xs font-medium text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                  {currentUser.displayName || currentUser.username}
                </span>
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="border-b border-slate-100 px-4 py-2.5 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      {currentUser.displayName || currentUser.username}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">@{currentUser.username}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold border ${getRoleBadgeColor(currentUser.role)}`}>
                        {currentUser.role.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-500">Rep: {currentUser.reputation}</span>
                    </div>
                  </div>

                  <Link
                    href={`/user/${currentUser.username}`}
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                    <span>Public Profile</span>
                  </Link>
                  <Link
                    href="/watchlist"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Bookmark className="h-3.5 w-3.5 text-slate-400" />
                    <span>My Watchlist</span>
                  </Link>
                  <Link
                    href="/notifications"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Bell className="h-3.5 w-3.5 text-slate-400" />
                    <span>Notifications</span>
                  </Link>

                  {hasRole(currentUser.role, 'REVIEWER') && (
                    <Link
                      href="/admin"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2 border-t border-slate-100 px-4 py-2 text-xs font-semibold text-blue-800 hover:bg-blue-50 dark:border-slate-800 dark:text-blue-400 dark:hover:bg-slate-800"
                    >
                      <Shield className="h-3.5 w-3.5 text-blue-600" />
                      <span>Admin & Moderation</span>
                    </Link>
                  )}

                  <div className="border-t border-slate-100 dark:border-slate-800">
                    <form action="/api/auth/logout" method="POST">
                      <button
                        type="submit"
                        className="flex w-full items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/login"
                className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
              >
                Join
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden rounded-md p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
          <form onSubmit={handleSearchSubmit} className="mb-4 relative w-full">
            <input
              type="text"
              placeholder="Search Knowlix articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-slate-50 py-2 pl-10 pr-4 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          </form>

          <div className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Link
              href="/categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Browse Categories
            </Link>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleRandomArticle();
              }}
              className="flex items-center gap-2 rounded-md p-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Shuffle className="h-4 w-4" />
              <span>Random Article</span>
            </button>
            <Link
              href="/create"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-md p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-slate-800"
            >
              + Create Article
            </Link>
            <Link
              href="/policies"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Community Policies
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              About & Governance
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
