'use client';

import React, { useMemo } from 'react';
import { List } from 'lucide-react';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

export default function TableOfContents({ content }: { content: string }) {
  const headings = useMemo(() => {
    if (!content) return [];
    const lines = content.split('\n');
    const items: TocItem[] = [];

    lines.forEach((line) => {
      const h2Match = line.match(/^##\s+(.+)$/);
      const h3Match = line.match(/^###\s+(.+)$/);

      if (h2Match) {
        const title = h2Match[1].replace(/\*\*/g, '').trim();
        const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        items.push({ id, title, level: 2 });
      } else if (h3Match) {
        const title = h3Match[1].replace(/\*\*/g, '').trim();
        const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        items.push({ id, title, level: 3 });
      }
    });

    return items;
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <nav className="my-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs dark:border-slate-800 dark:bg-slate-900/60 max-w-sm">
      <div className="flex items-center gap-2 font-serif text-sm font-bold text-slate-900 dark:text-white mb-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
        <List className="h-4 w-4 text-blue-700 dark:text-blue-400" />
        <span>Contents</span>
      </div>
      <ol className="space-y-1.5 text-slate-700 dark:text-slate-300">
        {headings.map((h, i) => (
          <li
            key={`${h.id}-${i}`}
            style={{ paddingLeft: h.level === 3 ? '1rem' : '0rem' }}
            className="leading-snug"
          >
            <a
              href={`#${h.id}`}
              className="text-blue-900 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
            >
              <span className="text-slate-400 dark:text-slate-500 mr-1.5">{i + 1}.</span>
              {h.title}
            </a>
          </li>
        ))}
        <li className="pt-1 border-t border-slate-200/60 dark:border-slate-800">
          <a
            href="#references"
            className="text-blue-900 hover:text-blue-700 hover:underline dark:text-blue-400 font-semibold"
          >
            References & Sources
          </a>
        </li>
      </ol>
    </nav>
  );
}
