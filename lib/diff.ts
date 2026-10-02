import * as Diff from 'diff';

export interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
}

export interface DiffResult {
  stats: {
    wordsAdded: number;
    wordsRemoved: number;
    linesAdded: number;
    linesRemoved: number;
  };
  wordDiff: DiffPart[];
  lineDiff: DiffPart[];
}

export function computeRevisionDiff(oldText: string, newText: string): DiffResult {
  const wordDiff = Diff.diffWordsWithSpace(oldText || '', newText || '');
  const lineDiff = Diff.diffLines(oldText || '', newText || '');

  let wordsAdded = 0;
  let wordsRemoved = 0;
  let linesAdded = 0;
  let linesRemoved = 0;

  wordDiff.forEach((part) => {
    const count = part.value.trim().split(/\s+/).filter(Boolean).length;
    if (part.added) wordsAdded += count;
    if (part.removed) wordsRemoved += count;
  });

  lineDiff.forEach((part) => {
    const lines = (part.value.match(/\n/g) || []).length || 1;
    if (part.added) linesAdded += lines;
    if (part.removed) linesRemoved += lines;
  });

  return {
    stats: {
      wordsAdded,
      wordsRemoved,
      linesAdded,
      linesRemoved,
    },
    wordDiff,
    lineDiff,
  };
}
