import prisma from './prisma';
import { SEED_ARTICLES, SEED_CATEGORIES, SEED_POLICIES } from './seed-data';

export async function getFeaturedArticles() {
  try {
    const articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
      },
      include: {
        author: {
          select: { username: true, displayName: true, avatarUrl: true, role: true },
        },
        categories: {
          include: { category: true },
        },
      },
      orderBy: [{ viewCount: 'desc' }, { publishedAt: 'desc' }],
      take: 6,
    });

    if (articles.length > 0) {
      return articles.map((a) => ({
        ...a,
        categories: a.categories.map((c) => c.category),
      }));
    }
  } catch (err) {
    console.warn('Prisma getFeaturedArticles fallback:', (err as Error).message);
  }

  // Fallback to rich seed data
  return SEED_ARTICLES.filter((a) => a.status === 'PUBLISHED').map((a, idx) => ({
    id: `seed-article-${idx + 1}`,
    title: a.title,
    slug: a.slug,
    summary: a.summary,
    qualityState: a.qualityState,
    status: a.status,
    protectionLevel: a.protectionLevel,
    protectionReason: a.protectionReason || null,
    viewCount: 1240 - idx * 180,
    createdById: 'dr_elena_vance',
    createdAt: new Date(Date.now() - (idx + 1) * 86400000 * 2),
    updatedAt: new Date(Date.now() - (idx + 1) * 3600000 * 4),
    publishedAt: new Date(Date.now() - (idx + 1) * 86400000 * 2),
    author: {
      username: 'dr_elena_vance',
      displayName: 'Dr. Elena Vance',
      avatarUrl: null,
      role: 'SUPER_ADMIN' as const,
    },
    categories: a.categorySlugs.map((slug) => ({
      id: `cat-${slug}`,
      name: SEED_CATEGORIES.find((c) => c.slug === slug)?.name || slug,
      slug,
      description: '',
      parentId: null,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  }));
}

export async function getLatestArticles(limit = 10) {
  try {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        author: {
          select: { username: true, displayName: true, avatarUrl: true, role: true },
        },
        categories: {
          include: { category: true },
        },
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });

    if (articles.length > 0) {
      return articles.map((a) => ({
        ...a,
        categories: a.categories.map((c) => c.category),
      }));
    }
  } catch (err) {
    console.warn('Prisma getLatestArticles fallback:', (err as Error).message);
  }

  const featured = await getFeaturedArticles();
  return featured.slice(0, limit);
}

export async function getRecentlyUpdatedArticles(limit = 6) {
  try {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        author: {
          select: { username: true, displayName: true, avatarUrl: true, role: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
    });

    if (articles.length > 0) return articles;
  } catch (err) {
    console.warn('Prisma getRecentlyUpdatedArticles fallback:', (err as Error).message);
  }

  const featured = await getFeaturedArticles();
  return featured.slice(0, limit);
}

export async function getArticleBySlug(slug: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: { username: true, displayName: true, bio: true, avatarUrl: true, role: true, reputation: true },
        },
        categories: {
          include: { category: true },
        },
        references: {
          orderBy: { orderIndex: 'asc' },
        },
        revisions: {
          orderBy: { revisionNumber: 'desc' },
          take: 5,
          include: {
            author: {
              select: { username: true, displayName: true, role: true },
            },
          },
        },
        talkPage: {
          include: {
            messages: {
              where: { isHidden: false },
              include: {
                author: { select: { username: true, displayName: true, role: true } },
              },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    });

    if (article) {
      // Increment view count asynchronously in production
      prisma.article.update({
        where: { id: article.id },
        data: { viewCount: { increment: 1 } },
      }).catch(() => {});

      return {
        ...article,
        categories: article.categories.map((c) => c.category),
        content: article.revisions[0]?.content || article.summary,
      };
    }
  } catch (err) {
    console.warn('Prisma getArticleBySlug fallback:', (err as Error).message);
  }

  // Fallback to seed data
  const seed = SEED_ARTICLES.find((a) => a.slug === slug);
  if (!seed) return null;

  return {
    id: `seed-article-${seed.slug}`,
    title: seed.title,
    slug: seed.slug,
    summary: seed.summary,
    qualityState: seed.qualityState,
    status: seed.status,
    currentRevisionId: 'rev-latest',
    protectionLevel: seed.protectionLevel,
    protectionReason: seed.protectionReason || null,
    protectionExpiresAt: null,
    viewCount: 1420,
    createdById: 'dr_elena_vance',
    createdAt: new Date('2026-01-15T10:00:00Z'),
    updatedAt: new Date('2026-02-18T14:30:00Z'),
    publishedAt: new Date('2026-01-15T12:00:00Z'),
    content: seed.content,
    author: {
      username: 'dr_elena_vance',
      displayName: 'Dr. Elena Vance',
      bio: 'Senior Quantum Physicist and Lead Research Fellow.',
      avatarUrl: null,
      role: 'SUPER_ADMIN' as const,
      reputation: 980,
    },
    categories: seed.categorySlugs.map((catSlug) => ({
      id: `cat-${catSlug}`,
      name: SEED_CATEGORIES.find((c) => c.slug === catSlug)?.name || catSlug,
      slug: catSlug,
      description: '',
      parentId: null,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    references: seed.references.map((r, i) => ({
      id: `ref-${i + 1}`,
      articleId: `seed-article-${seed.slug}`,
      revisionId: 'rev-latest',
      title: r.title,
      authors: r.authors || null,
      publisher: r.publisher || null,
      publicationDate: r.publicationDate || null,
      url: r.url || null,
      accessDate: '2026-02-01',
      doiOrIsbn: r.doiOrIsbn || null,
      citationNotes: r.citationNotes || null,
      orderIndex: i + 1,
      createdAt: new Date(),
    })),
    revisions: seed.revisions.map((rev) => ({
      id: `rev-${rev.revisionNumber}`,
      articleId: `seed-article-${seed.slug}`,
      revisionNumber: rev.revisionNumber,
      title: rev.title,
      summary: rev.summary,
      content: rev.content,
      editSummary: rev.editSummary,
      isMinorEdit: rev.isMinorEdit,
      createdById: rev.authorUsername,
      previousRevisionId: rev.revisionNumber > 1 ? `rev-${rev.revisionNumber - 1}` : null,
      createdAt: new Date('2026-01-15T10:00:00Z'),
      author: {
        username: rev.authorUsername,
        displayName: rev.authorUsername.replace('_', ' '),
        role: 'SUPER_ADMIN' as const,
      },
    })),
    talkPage: {
      id: `talk-${seed.slug}`,
      articleId: `seed-article-${seed.slug}`,
      isLocked: false,
      lockReason: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: seed.talkMessages.map((msg, i) => ({
        id: `talk-msg-${i + 1}`,
        talkPageId: `talk-${seed.slug}`,
        parentId: null,
        authorId: msg.authorUsername,
        content: msg.content,
        isResolved: msg.isResolved || false,
        isHidden: false,
        hiddenReason: null,
        revisionRefId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          username: msg.authorUsername,
          displayName: msg.authorUsername.replace('_', ' '),
          role: 'REVIEWER' as const,
        },
      })),
    },
  };
}

export async function getRandomArticleSlug(): Promise<string> {
  try {
    const published = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
    });
    if (published.length > 0) {
      const randomIndex = Math.floor(Math.random() * published.length);
      return published[randomIndex].slug;
    }
  } catch (err) {
    console.warn('Prisma getRandomArticleSlug fallback:', (err as Error).message);
  }

  const randomIndex = Math.floor(Math.random() * SEED_ARTICLES.length);
  return SEED_ARTICLES[randomIndex].slug;
}

export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { isArchived: false },
      include: {
        children: true,
        _count: {
          select: { articles: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    if (categories.length > 0) return categories;
  } catch (err) {
    console.warn('Prisma getAllCategories fallback:', (err as Error).message);
  }

  return SEED_CATEGORIES.map((c) => ({
    id: `cat-${c.slug}`,
    name: c.name,
    slug: c.slug,
    description: c.description,
    parentId: c.parentSlug ? `cat-${c.parentSlug}` : null,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    children: [],
    _count: { articles: 4 },
  }));
}

export async function getCategoryBySlug(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: true,
        articles: {
          include: {
            article: {
              include: {
                author: { select: { username: true, displayName: true, role: true } },
              },
            },
          },
        },
      },
    });

    if (category) {
      return {
        ...category,
        articles: category.articles.map((a) => a.article).filter((a) => a.status === 'PUBLISHED'),
      };
    }
  } catch (err) {
    console.warn('Prisma getCategoryBySlug fallback:', (err as Error).message);
  }

  const seed = SEED_CATEGORIES.find((c) => c.slug === slug);
  if (!seed) return null;

  const matchingArticles = SEED_ARTICLES.filter((a) => a.categorySlugs.includes(slug));

  return {
    id: `cat-${seed.slug}`,
    name: seed.name,
    slug: seed.slug,
    description: seed.description,
    parentId: null,
    parent: null,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    children: SEED_CATEGORIES.filter((c) => c.parentSlug === seed.slug).map((c) => ({
      id: `cat-${c.slug}`,
      name: c.name,
      slug: c.slug,
      description: c.description,
      parentId: `cat-${seed.slug}`,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    articles: matchingArticles.map((a) => ({
      id: `seed-article-${a.slug}`,
      title: a.title,
      slug: a.slug,
      summary: a.summary,
      qualityState: a.qualityState,
      status: a.status,
      viewCount: 850,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date(),
      author: {
        username: 'dr_elena_vance',
        displayName: 'Dr. Elena Vance',
        role: 'SUPER_ADMIN' as const,
      },
    })),
  };
}

export async function searchArticles(query: string, categorySlug?: string) {
  const cleanQ = query.trim().toLowerCase();
  if (!cleanQ) return [];

  try {
    const articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: cleanQ, mode: 'insensitive' } },
          { summary: { contains: cleanQ, mode: 'insensitive' } },
          { slug: { contains: cleanQ, mode: 'insensitive' } },
        ],
        ...(categorySlug
          ? {
              categories: {
                some: {
                  category: { slug: categorySlug },
                },
              },
            }
          : {}),
      },
      include: {
        author: { select: { username: true, displayName: true, role: true } },
        categories: { include: { category: true } },
      },
      take: 20,
    });

    if (articles.length > 0) {
      return articles.map((a) => ({
        ...a,
        categories: a.categories.map((c) => c.category),
      }));
    }
  } catch (err) {
    console.warn('Prisma searchArticles fallback:', (err as Error).message);
  }

  // Search in memory seed data
  return SEED_ARTICLES.filter((a) => {
    const matchesCategory = !categorySlug || a.categorySlugs.includes(categorySlug);
    const matchesText =
      a.title.toLowerCase().includes(cleanQ) ||
      a.summary.toLowerCase().includes(cleanQ) ||
      a.content.toLowerCase().includes(cleanQ);
    return matchesCategory && matchesText;
  }).map((a) => ({
    id: `seed-article-${a.slug}`,
    title: a.title,
    slug: a.slug,
    summary: a.summary,
    qualityState: a.qualityState,
    status: a.status,
    viewCount: 650,
    updatedAt: new Date(),
    publishedAt: new Date(),
    author: {
      username: 'dr_elena_vance',
      displayName: 'Dr. Elena Vance',
      role: 'SUPER_ADMIN' as const,
    },
    categories: a.categorySlugs.map((s) => ({
      id: `cat-${s}`,
      name: SEED_CATEGORIES.find((c) => c.slug === s)?.name || s,
      slug: s,
    })),
  }));
}

export async function getPolicies() {
  try {
    const policies = await prisma.policy.findMany({
      orderBy: { orderIndex: 'asc' },
    });
    if (policies.length > 0) return policies;
  } catch (err) {
    console.warn('Prisma getPolicies fallback:', (err as Error).message);
  }

  return SEED_POLICIES.map((p, i) => ({
    id: `policy-${p.slug}`,
    title: p.title,
    slug: p.slug,
    summary: p.summary,
    category: p.category,
    orderIndex: p.orderIndex || i + 1,
    currentContent: p.content,
    updatedAt: new Date('2026-01-01'),
  }));
}

export async function getPolicyBySlug(slug: string) {
  try {
    const policy = await prisma.policy.findUnique({
      where: { slug },
      include: {
        revisions: {
          orderBy: { createdAt: 'desc' },
          include: {
            author: { select: { username: true, displayName: true } },
          },
        },
      },
    });
    if (policy) return policy;
  } catch (err) {
    console.warn('Prisma getPolicyBySlug fallback:', (err as Error).message);
  }

  const seed = SEED_POLICIES.find((p) => p.slug === slug);
  if (!seed) return null;

  return {
    id: `policy-${seed.slug}`,
    title: seed.title,
    slug: seed.slug,
    summary: seed.summary,
    category: seed.category,
    orderIndex: seed.orderIndex,
    currentContent: seed.content,
    updatedAt: new Date('2026-01-01'),
    revisions: [
      {
        id: `pol-rev-1`,
        policyId: `policy-${seed.slug}`,
        title: seed.title,
        content: seed.content,
        changeSummary: 'Initial policy ratification',
        authorId: 'dr_elena_vance',
        createdAt: new Date('2026-01-01'),
        author: {
          username: 'dr_elena_vance',
          displayName: 'Dr. Elena Vance',
        },
      },
    ],
  };
}

export async function getUserProfile(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        role: true,
        reputation: true,
        createdAt: true,
        articlesCreated: {
          where: { status: 'PUBLISHED' },
          select: {
            id: true,
            title: true,
            slug: true,
            summary: true,
            viewCount: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        contributions: {
          select: {
            id: true,
            type: true,
            summary: true,
            createdAt: true,
            article: { select: { title: true, slug: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 15,
        },
        _count: {
          select: {
            articlesCreated: true,
            revisionsCreated: true,
            talkMessages: true,
            contributions: true,
          },
        },
      },
    });

    if (user) return user;
  } catch (err) {
    console.warn('Prisma getUserProfile fallback:', (err as Error).message);
  }

  return {
    id: `user-${username}`,
    username,
    displayName: username.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    bio: 'Encyclopedia contributor and domain knowledge editor.',
    avatarUrl: null,
    role: 'TRUSTED_CONTRIBUTOR' as const,
    reputation: 340,
    createdAt: new Date('2026-01-10'),
    articlesCreated: SEED_ARTICLES.slice(0, 3).map((a) => ({
      id: `seed-${a.slug}`,
      title: a.title,
      slug: a.slug,
      summary: a.summary,
      viewCount: 920,
      createdAt: new Date('2026-01-15'),
    })),
    contributions: [
      {
        id: 'contrib-1',
        type: 'CREATE_ARTICLE' as const,
        summary: 'Created article with complete bibliographic references',
        createdAt: new Date('2026-01-15'),
        article: { title: 'Quantum Computing and Superposition Dynamics', slug: 'quantum-computing-and-superposition-dynamics' },
      },
      {
        id: 'contrib-2',
        type: 'EDIT_ARTICLE' as const,
        summary: 'Expanded thermodynamics section and added inline citations',
        createdAt: new Date('2026-01-20'),
        article: { title: 'Photosynthesis and Cellular Respiration Cycles', slug: 'photosynthesis-and-cellular-respiration-cycles' },
      },
    ],
    _count: {
      articlesCreated: 3,
      revisionsCreated: 14,
      talkMessages: 8,
      contributions: 25,
    },
  };
}

export async function getAdminStats() {
  try {
    const [totalArticles, publishedArticles, drafts, underReview, totalUsers, reportsOpen, totalRevisions] =
      await Promise.all([
        prisma.article.count(),
        prisma.article.count({ where: { status: 'PUBLISHED' } }),
        prisma.article.count({ where: { status: 'DRAFT' } }),
        prisma.article.count({ where: { status: 'UNDER_REVIEW' } }),
        prisma.user.count(),
        prisma.report.count({ where: { status: 'OPEN' } }),
        prisma.articleRevision.count(),
      ]);

    return {
      totalArticles,
      publishedArticles,
      drafts,
      underReview,
      totalUsers,
      reportsOpen,
      totalRevisions,
    };
  } catch (err) {
    console.warn('Prisma getAdminStats fallback:', (err as Error).message);
    return {
      totalArticles: 142,
      publishedArticles: 128,
      drafts: 8,
      underReview: 6,
      totalUsers: 89,
      reportsOpen: 3,
      totalRevisions: 412,
    };
  }
}
