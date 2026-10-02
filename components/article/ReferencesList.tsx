import React from 'react';
import { ExternalLink, BookText } from 'lucide-react';

export interface ReferenceItem {
  id: string;
  title: string;
  authors?: string | null;
  publisher?: string | null;
  publicationDate?: string | null;
  url?: string | null;
  accessDate?: string | null;
  doiOrIsbn?: string | null;
  citationNotes?: string | null;
  orderIndex: number;
}

export default function ReferencesList({ references }: { references: ReferenceItem[] }) {
  if (!references || references.length === 0) {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
        <p className="font-semibold">Citation Notice</p>
        <p className="mt-0.5">
          This article currently lacks structured bibliography citations. Please assist Knowlix by adding reliable, peer-reviewed sources.
        </p>
      </div>
    );
  }

  return (
    <section id="references" className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-4">
        <BookText className="h-5 w-5 text-blue-900 dark:text-blue-400" />
        <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
          References and Sources
        </h2>
      </div>

      <ol className="space-y-3 text-xs text-slate-700 dark:text-slate-300 list-decimal pl-5">
        {references.map((ref, idx) => (
          <li key={ref.id || idx} id={`ref-${idx + 1}`} className="leading-relaxed pl-1">
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {ref.authors ? `${ref.authors}. ` : ''}
            </span>
            <span className="italic text-slate-800 dark:text-slate-200">
              &ldquo;{ref.title}&rdquo;
            </span>
            {ref.publisher && <span>, {ref.publisher}</span>}
            {ref.publicationDate && <span> ({ref.publicationDate})</span>}
            {ref.doiOrIsbn && <span className="ml-1 text-slate-500 font-mono text-[11px]">&bull; {ref.doiOrIsbn}</span>}
            
            {ref.url && (
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1.5 inline-flex items-center gap-0.5 text-blue-700 hover:text-blue-900 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                <span>[Link]</span>
                <ExternalLink className="h-3 w-3 inline" />
              </a>
            )}

            {ref.citationNotes && (
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                {ref.citationNotes}
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
