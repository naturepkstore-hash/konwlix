import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Knowlix database seeding...');

  // 1. Create Default Users
  const passwordHash = await bcrypt.hash('Knowlix2026!', 10);

  const admin = await prisma.user.upsert({
    where: { username: 'dr_elena_vance' },
    update: {},
    create: {
      username: 'dr_elena_vance',
      email: 'elena.vance@knowlix.org',
      passwordHash,
      displayName: 'Dr. Elena Vance',
      bio: 'Senior Quantum Physicist and Lead Research Fellow at the Global Institute of Physics. Founding editor and Super Administrator of Knowlix.',
      role: 'SUPER_ADMIN',
      reputation: 980,
    },
  });

  const moderator = await prisma.user.upsert({
    where: { username: 'marcus_aurelius_mod' },
    update: {},
    create: {
      username: 'marcus_aurelius_mod',
      email: 'marcus.mod@knowlix.org',
      passwordHash,
      displayName: 'Marcus A.',
      bio: 'Community governance moderator and classical history scholar.',
      role: 'MODERATOR',
      reputation: 640,
    },
  });

  const reviewer = await prisma.user.upsert({
    where: { username: 'clara_scholastic' },
    update: {},
    create: {
      username: 'clara_scholastic',
      email: 'clara.scholastic@knowlix.org',
      passwordHash,
      displayName: 'Clara Oswald',
      bio: 'Linguistics & Epigraphy Researcher. Verified peer reviewer.',
      role: 'REVIEWER',
      reputation: 420,
    },
  });

  const trusted = await prisma.user.upsert({
    where: { username: 'alex_researcher' },
    update: {},
    create: {
      username: 'alex_researcher',
      email: 'alex.researcher@knowlix.org',
      passwordHash,
      displayName: 'Alex Chen',
      bio: 'Renewable energy engineer and open-access science advocate.',
      role: 'TRUSTED_CONTRIBUTOR',
      reputation: 215,
    },
  });

  const registered = await prisma.user.upsert({
    where: { username: 'nova_novice' },
    update: {},
    create: {
      username: 'nova_novice',
      email: 'nova@knowlix.org',
      passwordHash,
      displayName: 'Nova Explorer',
      bio: 'Student and curious learner exploring history and science.',
      role: 'REGISTERED',
      reputation: 15,
    },
  });

  console.log('✅ Seeded users (dr_elena_vance, marcus_aurelius_mod, clara_scholastic, alex_researcher, nova_novice)');

  // 2. Create Categories
  const categories = [
    { name: 'Science & Technology', slug: 'science-and-technology', description: 'Empirical sciences, natural phenomena, mathematical foundations, and modern technological innovations.' },
    { name: 'Physics & Quantum Dynamics', slug: 'physics-and-quantum-dynamics', description: 'Theoretical and experimental physics, quantum mechanics, and thermodynamics.', parentSlug: 'science-and-technology' },
    { name: 'Biological Sciences', slug: 'biological-sciences', description: 'Ecology, cellular biology, genetics, and evolutionary systems.', parentSlug: 'science-and-technology' },
    { name: 'Computer Science & AI', slug: 'computer-science-and-ai', description: 'Algorithms, computational theory, machine intelligence, and distributed systems.', parentSlug: 'science-and-technology' },
    { name: 'History & Civilization', slug: 'history-and-civilization', description: 'Chronicles of human societies, ancient empires, trade networks, and cultural transformations.' },
    { name: 'Ancient Civilizations', slug: 'ancient-civilizations', description: 'Archaeology, epigraphy, Bronze Age, and Classical antiquities.', parentSlug: 'history-and-civilization' },
    { name: 'Energy & Sustainability', slug: 'energy-and-sustainability', description: 'Renewable power grids, climate dynamics, and environmental engineering.' },
    { name: 'Earth & Ocean Sciences', slug: 'earth-and-ocean-sciences', description: 'Geology, deep-sea exploration, volcanology, and atmospheric dynamics.' },
  ];

  const catMap = new Map();
  for (const cat of categories) {
    let parentId = null;
    if (cat.parentSlug && catMap.has(cat.parentSlug)) {
      parentId = catMap.get(cat.parentSlug);
    }
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { description: cat.description, parentId },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        parentId,
      },
    });
    catMap.set(cat.slug, created.id);
  }
  console.log('✅ Seeded categories');

  // 3. Create 18 Original Policies
  const policies = [
    { title: 'Neutral Point of View (NPOV)', slug: 'neutral-point-of-view', category: 'Content Standards', orderIndex: 1, summary: 'All encyclopedia articles must represent significant views fairly, proportionately, and without editorial bias.', content: 'Knowlix requires all published articles to be written from an impartial and neutral point of view.' },
    { title: 'Verifiability and Citations', slug: 'verifiability', category: 'Content Standards', orderIndex: 2, summary: 'Readers must be able to verify all statements and figures against reliable, published sources.', content: 'The threshold for inclusion on Knowlix is verifiability, not truth.' },
    { title: 'Reliable Sources Guidelines', slug: 'reliable-sources', category: 'Content Standards', orderIndex: 3, summary: 'Articles should rely on published, third-party sources with a known reputation for fact-checking and accuracy.', content: 'Sources must be peer-reviewed or published by reputable institutions.' },
    { title: 'Notability and Topic Criteria', slug: 'notability', category: 'Content Standards', orderIndex: 4, summary: 'A subject is presumed notable if it has received significant, independent coverage in reliable secondary sources.', content: 'Subjects must have significant third-party scholarly or journalistic coverage.' },
    { title: 'No Original Research (NOR)', slug: 'no-original-research', category: 'Content Standards', orderIndex: 5, summary: 'Knowlix does not publish original theories, unpublished data, or personal syntheses of published material.', content: 'Articles must not contain unpublished hypotheses.' },
    { title: 'Copyright and Attribution Policy', slug: 'copyright-and-attribution', category: 'Legal and Licensing', orderIndex: 6, summary: 'All contributions must respect intellectual property rights and provide accurate attribution.', content: 'Plagiarism is strictly prohibited.' },
    { title: 'Conflict of Interest (COI)', slug: 'conflict-of-interest', category: 'Community Governance', orderIndex: 7, summary: 'Contributors must disclose financial, employment, or personal affiliations that could compromise editorial neutrality.', content: 'Mandatory disclosure for paid or affiliated edits.' },
    { title: 'Promotional Content Restriction', slug: 'promotional-content', category: 'Content Standards', orderIndex: 8, summary: 'Knowlix is an educational encyclopedia and cannot be used as an advertising or public relations platform.', content: 'Marketing copy and peacock buzzwords are banned.' },
    { title: 'Biographies of Living Persons (BLP)', slug: 'biographies-of-living-persons', category: 'Content Standards', orderIndex: 9, summary: 'Living person articles require extreme care, high-quality sourcing, and immediate removal of contentious unverified material.', content: 'Strict protection of privacy and defamatory claim removal.' },
    { title: 'User Conduct and Civility', slug: 'user-conduct', category: 'Community Governance', orderIndex: 10, summary: 'Community members must interact civilly, assume good faith, and refrain from personal attacks.', content: 'Assume good faith and maintain civility.' },
    { title: 'Vandalism Prevention and Enforcement', slug: 'vandalism', category: 'Community Governance', orderIndex: 11, summary: 'Deliberate attempts to deface, misinform, or disrupt the encyclopedia will be promptly reverted and penalized.', content: 'Revert vandalism and file moderation reports.' },
    { title: 'Article Deletion and Archival Policy', slug: 'article-deletion', category: 'Content Standards', orderIndex: 12, summary: 'Transparent multi-stage deletion workflow preserving historical audit trails.', content: 'Clear community nomination and review process for page deletion.' },
    { title: 'Article Protection Protocols', slug: 'article-protection', category: 'Community Governance', orderIndex: 13, summary: 'Administrative controls to safeguard high-risk articles from edit wars and automated vandalism.', content: 'Semi and full protection standards.' },
    { title: 'Dispute Resolution Procedures', slug: 'dispute-resolution', category: 'Community Governance', orderIndex: 14, summary: 'Structured steps to resolve editorial disagreements collaboratively.', content: 'Talk page negotiation, mediation, and administrative arbitration.' },
    { title: 'Editing and Formatting Guidelines', slug: 'editing-guidelines', category: 'Style and Formatting', orderIndex: 15, summary: 'Standards for typography, lead paragraphs, headings, and encyclopedic structure.', content: 'Lead section, chronological/thematic body, references.' },
    { title: 'Discussion and Talk Page Guidelines', slug: 'discussion-guidelines', category: 'Community Governance', orderIndex: 16, summary: 'Rules for collaborative discussion, thread organization, and resolution tracking.', content: 'Constructive article improvement focus.' },
    { title: 'Privacy and Data Protection', slug: 'privacy', category: 'Legal and Licensing', orderIndex: 17, summary: 'How user data, session security, and edit metadata are managed.', content: 'Clear boundary between public contributions and private account data.' },
    { title: 'Anti-Spam and Automated Abuse Prevention', slug: 'spam-policy', category: 'Legal and Licensing', orderIndex: 18, summary: 'Policies concerning bots, mass editing, automated submissions, and link spam.', content: 'Protection against bots and commercial backlink manipulation.' },
  ];

  for (const pol of policies) {
    await prisma.policy.upsert({
      where: { slug: pol.slug },
      update: {
        title: pol.title,
        summary: pol.summary,
        category: pol.category,
        orderIndex: pol.orderIndex,
        currentContent: pol.content,
      },
      create: {
        title: pol.title,
        slug: pol.slug,
        summary: pol.summary,
        category: pol.category,
        orderIndex: pol.orderIndex,
        currentContent: pol.content,
      },
    });
  }
  console.log('✅ Seeded 18 original policies');

  console.log('🌱 Knowlix seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
