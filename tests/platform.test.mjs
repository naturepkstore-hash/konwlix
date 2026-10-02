import assert from 'node:assert';
import bcrypt from 'bcryptjs';
import * as Diff from 'diff';
import { slugify, isValidSlug } from '../lib/slugify.ts';
import { validateArticleContent } from '../lib/content-validator.ts';
import { computeRevisionDiff } from '../lib/diff.ts';
import { hasRole, canCreateArticle, canEditArticle, canProtectArticle, canBlockUser } from '../lib/roles.ts';
import { SEED_POLICIES, SEED_ARTICLES, SEED_CATEGORIES } from '../lib/seed-data.ts';

console.log('🧪 Starting Knowlix Test Suite...\n');

// 1. Password Hashing & Auth Verification
console.log('Test 1: Authentication & Password Hashing');
const password = 'KnowlixSecure2026!';
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);
const isMatch = await bcrypt.compare(password, hash);
const isWrongMatch = await bcrypt.compare('WrongPassword!', hash);
assert.strictEqual(isMatch, true, 'Correct password should verify');
assert.strictEqual(isWrongMatch, false, 'Incorrect password should fail');
console.log('✅ Password hashing & verification passed');

// 2. Slugify & URL Generation
console.log('\nTest 2: Slugify & URL Generation');
const testTitle1 = 'Quantum Computing & Superposition Dynamics';
const slug1 = slugify(testTitle1);
assert.strictEqual(slug1, 'quantum-computing-and-superposition-dynamics');
assert.strictEqual(isValidSlug(slug1), true, 'Generated slug should be valid');

const testTitle2 = 'Photosynthesis: Bioenergetic Pathways in C3 & C4 Plants!';
const slug2 = slugify(testTitle2);
assert.strictEqual(slug2, 'photosynthesis-bioenergetic-pathways-in-c3-and-c4-plants');
assert.strictEqual(isValidSlug(slug2), true);
console.log('✅ Slugify and URL validator passed');

// 3. Content Validation & Tone Checking
console.log('\nTest 3: Encyclopedic Content & Tone Validation');
// Empty content
const invalidTest = validateArticleContent('', '', '', 0);
assert.strictEqual(invalidTest.isValid, false, 'Empty content must fail validation');

// Promotional language warning
const promoContent = 'This is an award-winning revolutionary breakthrough in quantum computing that is world-leading and unmatched in its cutting-edge design.';
const promoTest = validateArticleContent(
  'Quantum Device',
  'A summary describing this revolutionary breakthrough in device architecture.',
  promoContent,
  1
);
const hasToneWarning = promoTest.issues.some((i) => i.field === 'tone' && i.type === 'warning');
assert.strictEqual(hasToneWarning, true, 'Peacock terms must trigger tone warnings');

// Valid academic content
const validTest = validateArticleContent(
  'Thermodynamics of Superconductors',
  'Superconductivity is a set of physical properties observed in certain materials where electrical resistance vanishes completely.',
  '## 1. BCS Theory\n\nThe Bardeen-Cooper-Schrieffer (BCS) theory explains superconductivity at temperatures approaching absolute zero through the formation of electron Cooper pairs mediated by phonon lattice interactions in the crystal structure of the metallic element.',
  1
);
assert.strictEqual(validTest.isValid, true, 'Valid academic content must pass');
console.log('✅ Content validator and neutral tone checker passed');

// 4. Visual Revision Diffing Engine
console.log('\nTest 4: Revision Diffing & Provenance Engine');
const oldRev = 'Quantum computers use superconducting circuits to manipulate qubits.';
const newRev = 'Quantum computers use superconducting Josephson junctions and trapped ions to manipulate entangled qubits.';
const diff = computeRevisionDiff(oldRev, newRev);
assert(diff.stats.wordsAdded > 0, 'Words added should be tracked');
assert(diff.wordDiff.some((part) => part.added && part.value.includes('Josephson')), 'Added tokens detected');
console.log('✅ Revision diffing engine passed');

// 5. Role-Based Authorization Tests
console.log('\nTest 5: Role-Based Authorization & Boundaries');
assert.strictEqual(hasRole('SUPER_ADMIN', 'ADMIN'), true, 'SUPER_ADMIN satisfies ADMIN role');
assert.strictEqual(hasRole('REGISTERED', 'MODERATOR'), false, 'REGISTERED cannot act as MODERATOR');
assert.strictEqual(canCreateArticle({ id: 'u1', role: 'REGISTERED', reputation: 10 }), true);
assert.strictEqual(canProtectArticle({ id: 'u2', role: 'MODERATOR', reputation: 100 }), true);
assert.strictEqual(canProtectArticle({ id: 'u3', role: 'REGISTERED', reputation: 100 }), false);

// Protection boundary
assert.strictEqual(
  canEditArticle({ id: 'u4', role: 'REGISTERED', reputation: 10 }, 'FULLY_PROTECTED'),
  false,
  'Registered user cannot edit fully protected page'
);
assert.strictEqual(
  canEditArticle({ id: 'u5', role: 'ADMIN', reputation: 500 }, 'FULLY_PROTECTED'),
  true,
  'Admin can edit fully protected page'
);

// Blocked user restriction
assert.strictEqual(
  canCreateArticle({ id: 'u6', role: 'REGISTERED', reputation: 10, isBlocked: true, blockScope: 'ALL' }),
  false,
  'Blocked user cannot create articles'
);
console.log('✅ Role-based authorization and security boundaries passed');

// 6. Policy Completeness (All 18 policies present)
console.log('\nTest 6: Governance Policies Verification');
assert.strictEqual(SEED_POLICIES.length, 18, 'Exactly 18 original policies must be defined');
const policySlugs = new Set(SEED_POLICIES.map((p) => p.slug));
assert(policySlugs.has('neutral-point-of-view'), 'Neutral Point of View policy present');
assert(policySlugs.has('verifiability'), 'Verifiability policy present');
assert(policySlugs.has('reliable-sources'), 'Reliable Sources policy present');
assert(policySlugs.has('no-original-research'), 'No Original Research policy present');
assert(policySlugs.has('biographies-of-living-persons'), 'BLP policy present');
assert(policySlugs.has('vandalism'), 'Vandalism policy present');
console.log('✅ All 18 original policies validated');

// 7. Seed Articles Structure & References Integrity
console.log('\nTest 7: Article & Citation Integrity');
assert(SEED_ARTICLES.length >= 5, 'Seed articles present');
for (const art of SEED_ARTICLES) {
  assert(art.references.length > 0, `Article "${art.title}" must have references`);
  assert(art.revisions.length > 0, `Article "${art.title}" must have revisions`);
}
console.log('✅ Seed articles and reference structures verified');

console.log('\n🎉 ALL 7 TEST SUITES PASSED CLEANLY WITH ZERO FAILURES!\n');
