'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Table as TableIcon,
  Link as LinkIcon,
  BookPlus,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle2,
  Save,
  Info,
  Trash2,
} from 'lucide-react';
import { createArticleAction, editArticleAction } from '@/server/article-actions';
import { validateArticleContent } from '@/lib/content-validator';
import { slugify } from '@/lib/slugify';

export interface ReferenceInput {
  title: string;
  authors?: string;
  publisher?: string;
  publicationDate?: string;
  url?: string;
  doiOrIsbn?: string;
  citationNotes?: string;
}

interface ArticleEditorProps {
  mode: 'create' | 'edit';
  articleId?: string;
  initialData?: {
    title: string;
    slug?: string;
    summary: string;
    content: string;
    categoryIds?: string[];
    references?: ReferenceInput[];
  };
  categories?: Array<{ id: string; name: string }>;
}

export default function ArticleEditor({
  mode,
  articleId,
  initialData,
  categories = [],
}: ArticleEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [editSummary, setEditSummary] = useState('');
  const [isMinorEdit, setIsMinorEdit] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData?.categoryIds || []
  );
  const [references, setReferences] = useState<ReferenceInput[]>(
    initialData?.references || []
  );

  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [newRef, setNewRef] = useState<ReferenceInput>({
    title: '',
    authors: '',
    publisher: '',
    publicationDate: '',
    url: '',
    doiOrIsbn: '',
    citationNotes: '',
  });
  const [isAddingRef, setIsAddingRef] = useState(false);

  // Content validation
  const validation = validateArticleContent(title, summary, content, references.length);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (mode === 'create' && (!slug || slug === slugify(title))) {
      setSlug(slugify(val));
    }
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('article-content-input') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'text';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  const insertTable = () => {
    const tableTemplate = `\n| Column 1 | Column 2 | Column 3 |\n| :--- | :--- | :--- |\n| Data A | Data B | Data C |\n| Data D | Data E | Data F |\n`;
    setContent((prev) => prev + tableTemplate);
  };

  const handleAddReference = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRef.title.trim()) return;
    setReferences((prev) => [...prev, newRef]);
    setNewRef({
      title: '',
      authors: '',
      publisher: '',
      publicationDate: '',
      url: '',
      doiOrIsbn: '',
      citationNotes: '',
    });
    setIsAddingRef(false);
  };

  const handleRemoveReference = (idx: number) => {
    setReferences((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('content', content);
    formData.append('editSummary', editSummary || (mode === 'create' ? 'Initial article creation' : 'Article content update'));
    formData.append('isMinorEdit', isMinorEdit ? 'true' : 'false');
    formData.append('references', JSON.stringify(references));

    if (mode === 'create') {
      formData.append('slug', slug);
      selectedCategories.forEach((cid) => formData.append('categoryIds', cid));
      const res = await createArticleAction(formData);
      setIsSubmitting(false);

      if (res.error) {
        setErrorMessage(res.error);
      } else if (res.slug) {
        router.push(`/article/${res.slug}`);
      }
    } else {
      formData.append('articleId', articleId || '');
      const res = await editArticleAction(formData);
      setIsSubmitting(false);

      if (res.error) {
        setErrorMessage(res.error);
      } else if (res.slug) {
        router.push(`/article/${res.slug}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 p-4 text-xs text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Meta Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Article Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. Thermodynamics of Black Holes"
            className="w-full rounded-md border border-slate-300 bg-slate-50 px-3.5 py-2 text-base font-serif font-bold text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {mode === 'create' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                URL Slug (/article/...)
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="thermodynamics-of-black-holes"
                className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 font-mono focus:border-blue-700 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Assign Category
              </label>
              <select
                multiple
                value={selectedCategories}
                onChange={(e) =>
                  setSelectedCategories(
                    Array.from(e.target.selectedOptions, (option) => option.value)
                  )
                }
                className="w-full rounded-md border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white h-20"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Lead Paragraph Summary <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Concise overview sentence defining the subject and establishing encyclopedic notability..."
            className="w-full rounded-md border border-slate-300 bg-slate-50 p-3 text-xs text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Main Content & Editor Toolbar */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Editor Toolbar */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-2 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => insertFormatting('**', '**')}
              title="Bold"
              className="rounded p-1.5 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('*', '*')}
              title="Italic"
              className="rounded p-1.5 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Italic className="h-4 w-4" />
            </button>
            <span className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />
            <button
              type="button"
              onClick={() => insertFormatting('## ')}
              title="Heading 2"
              className="rounded p-1.5 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Heading2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('### ')}
              title="Heading 3"
              className="rounded p-1.5 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Heading3 className="h-4 w-4" />
            </button>
            <span className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />
            <button
              type="button"
              onClick={() => insertFormatting('> ')}
              title="Blockquote"
              className="rounded p-1.5 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Quote className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('* ')}
              title="Bullet List"
              className="rounded p-1.5 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('1. ')}
              title="Numbered List"
              className="rounded p-1.5 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ListOrdered className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={insertTable}
              title="Insert Table"
              className="rounded p-1.5 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <TableIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('[', '](/article/slug-name)')}
              title="Internal Link"
              className="rounded p-1.5 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <LinkIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 rounded-md bg-slate-200 p-0.5 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium ${
                activeTab === 'write'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium ${
                activeTab === 'preview'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview</span>
            </button>
          </div>
        </div>

        {/* Editor Body */}
        <div className="p-4">
          {activeTab === 'write' ? (
            <textarea
              id="article-content-input"
              required
              rows={16}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write comprehensive article sections using Markdown syntax (## Section Title, paragraphs, lists, citations)..."
              className="w-full font-mono text-sm leading-relaxed text-slate-900 focus:outline-none dark:bg-slate-900 dark:text-slate-100 resize-y"
            />
          ) : (
            <div className="encyclopedia-prose min-h-[380px] p-2 bg-slate-50/50 rounded dark:bg-slate-950/40">
              <h1 className="font-serif text-2xl font-bold">{title || 'Untitled Article'}</h1>
              <p className="italic text-slate-600 dark:text-slate-400">{summary || 'No summary entered.'}</p>
              <div className="whitespace-pre-wrap mt-4">{content || 'No content entered.'}</div>
            </div>
          )}
        </div>
      </div>

      {/* Bibliography & Citations Manager */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookPlus className="h-4 w-4 text-blue-900 dark:text-blue-400" />
              <span>Bibliography & Sources ({references.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Reliable academic publications, books, and verified third-party references.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddingRef(!isAddingRef)}
            className="rounded-md border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {isAddingRef ? 'Close Reference Form' : '+ Add Citation'}
          </button>
        </div>

        {/* Existing references */}
        {references.length > 0 && (
          <ul className="mt-3 space-y-2 text-xs">
            {references.map((ref, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">[{idx + 1}] </span>
                  <span className="font-medium">{ref.authors ? `${ref.authors}: ` : ''}</span>
                  <span className="italic">&ldquo;{ref.title}&rdquo;</span>
                  {ref.publisher && <span> ({ref.publisher})</span>}
                  {ref.doiOrIsbn && <span className="ml-1 text-slate-500 font-mono text-[10px]">&bull; {ref.doiOrIsbn}</span>}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveReference(idx)}
                  className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Add Reference Form */}
        {isAddingRef && (
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50/40 p-4 dark:border-blue-900/50 dark:bg-blue-950/20 space-y-3 text-xs">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Source Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newRef.title}
                  onChange={(e) => setNewRef({ ...newRef, title: e.target.value })}
                  placeholder="e.g. Principles of Quantum Thermodynamics"
                  className="w-full rounded border border-slate-300 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Authors / Researchers
                </label>
                <input
                  type="text"
                  value={newRef.authors}
                  onChange={(e) => setNewRef({ ...newRef, authors: e.target.value })}
                  placeholder="e.g. Thorne, A. and Hawking, S."
                  className="w-full rounded border border-slate-300 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Publisher / Journal
                </label>
                <input
                  type="text"
                  value={newRef.publisher}
                  onChange={(e) => setNewRef({ ...newRef, publisher: e.target.value })}
                  placeholder="Oxford University Press"
                  className="w-full rounded border border-slate-300 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Publication Year
                </label>
                <input
                  type="text"
                  value={newRef.publicationDate}
                  onChange={(e) => setNewRef({ ...newRef, publicationDate: e.target.value })}
                  placeholder="2024"
                  className="w-full rounded border border-slate-300 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  DOI / ISBN
                </label>
                <input
                  type="text"
                  value={newRef.doiOrIsbn}
                  onChange={(e) => setNewRef({ ...newRef, doiOrIsbn: e.target.value })}
                  placeholder="doi:10.1038/s41586-..."
                  className="w-full rounded border border-slate-300 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Source URL (if web-accessible)
              </label>
              <input
                type="url"
                value={newRef.url}
                onChange={(e) => setNewRef({ ...newRef, url: e.target.value })}
                placeholder="https://..."
                className="w-full rounded border border-slate-300 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingRef(false)}
                className="rounded border border-slate-300 px-3 py-1 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddReference}
                className="rounded bg-blue-900 px-4 py-1 font-semibold text-white hover:bg-blue-800 dark:bg-blue-600"
              >
                Add Source
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quality & Neutrality Feedback Card */}
      {validation.issues.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs dark:border-slate-800 dark:bg-slate-900/80 space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
            <Info className="h-4 w-4 text-blue-700 dark:text-blue-400" />
            <span>Encyclopedia Quality Guidance</span>
          </div>
          <ul className="space-y-1 text-slate-600 dark:text-slate-400 pl-5 list-disc">
            {validation.issues.map((issue, idx) => (
              <li
                key={idx}
                className={
                  issue.type === 'error'
                    ? 'text-red-700 font-medium dark:text-red-400'
                    : 'text-amber-700 dark:text-amber-400'
                }
              >
                {issue.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Edit Summary and Submission Strip */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Edit Summary <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={editSummary}
            onChange={(e) => setEditSummary(e.target.value)}
            placeholder="Briefly describe what you changed (e.g., 'Added section on experimental verification', 'Fixed typo in formula')..."
            className="w-full rounded-md border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isMinorEdit"
            checked={isMinorEdit}
            onChange={(e) => setIsMinorEdit(e.target.checked)}
            className="rounded border-slate-300 text-blue-900 focus:ring-blue-700"
          />
          <label htmlFor="isMinorEdit" className="text-xs text-slate-700 dark:text-slate-300">
            This is a minor edit (formatting, spelling, or citation cleanup)
          </label>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Discard
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !validation.isValid}
            className="inline-flex items-center gap-2 rounded-md bg-blue-900 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-800 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <Save className="h-4 w-4" />
            <span>{isSubmitting ? 'Publishing Revision...' : mode === 'create' ? 'Publish Article' : 'Save New Revision'}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
