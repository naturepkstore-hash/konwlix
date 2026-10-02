export interface ValidationIssue {
  type: 'error' | 'warning' | 'tip';
  field: string;
  message: string;
}

const PROMOTIONAL_KEYWORDS = [
  'best-in-class',
  'world-leading',
  'revolutionary',
  'breakthrough',
  'industry-leading',
  'game-changing',
  'cutting-edge',
  'award-winning',
  'unrivaled',
  'unmatched',
  'groundbreaking',
  'state-of-the-art',
  'pioneering',
  'prestigious',
  'superior',
  'flawless',
];

export function validateArticleContent(
  title: string,
  summary: string,
  content: string,
  referencesCount: number
): { isValid: boolean; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];

  // Title checks
  if (!title || title.trim().length < 3) {
    issues.push({
      type: 'error',
      field: 'title',
      message: 'Article title must be at least 3 characters long.',
    });
  }

  if (title.length > 150) {
    issues.push({
      type: 'error',
      field: 'title',
      message: 'Article title cannot exceed 150 characters.',
    });
  }

  // Summary checks
  if (!summary || summary.trim().length < 20) {
    issues.push({
      type: 'error',
      field: 'summary',
      message: 'Summary lead paragraph must be at least 20 characters.',
    });
  }

  // Content length check
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount < 30) {
    issues.push({
      type: 'error',
      field: 'content',
      message: 'Article content must be at least 30 words for a basic stub.',
    });
  }

  // Reference requirements
  if (referencesCount === 0 && wordCount > 100) {
    issues.push({
      type: 'warning',
      field: 'references',
      message: 'Articles over 100 words require at least one verifiable source or reference.',
    });
  }

  // Promotional language detector
  const lowerContent = `${title} ${summary} ${content}`.toLowerCase();
  const matchedBuzzwords = PROMOTIONAL_KEYWORDS.filter((word) =>
    lowerContent.includes(word.toLowerCase())
  );

  if (matchedBuzzwords.length > 0) {
    issues.push({
      type: 'warning',
      field: 'tone',
      message: `Potentially promotional or peacock terminology detected: "${matchedBuzzwords.slice(0, 3).join('", "')}". Ensure writing remains neutral, factual, and backed by independent citations.`,
    });
  }

  // External link count check
  const urlMatches = content.match(/https?:\/\/[^\s<>"{}|\\^`]+/gi) || [];
  if (urlMatches.length > 15) {
    issues.push({
      type: 'warning',
      field: 'links',
      message: 'High quantity of raw URLs found in content. Move external links into the structured References section.',
    });
  }

  const hasErrors = issues.some((i) => i.type === 'error');
  return {
    isValid: !hasErrors,
    issues,
  };
}
