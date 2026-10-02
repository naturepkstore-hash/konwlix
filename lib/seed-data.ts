export interface SeedPolicy {
  title: string;
  slug: string;
  category: string;
  orderIndex: number;
  summary: string;
  content: string;
}

export interface SeedCategory {
  name: string;
  slug: string;
  description: string;
  parentSlug?: string;
}

export interface SeedArticle {
  title: string;
  slug: string;
  summary: string;
  qualityState: 'DRAFT' | 'STUB' | 'DEVELOPING' | 'REVIEWED' | 'VERIFIED';
  status: 'PUBLISHED' | 'UNDER_REVIEW' | 'DRAFT';
  protectionLevel: 'NONE' | 'SEMI_PROTECTED' | 'FULLY_PROTECTED';
  protectionReason?: string;
  categorySlugs: string[];
  content: string;
  references: Array<{
    title: string;
    authors?: string;
    publisher?: string;
    publicationDate?: string;
    url?: string;
    doiOrIsbn?: string;
    citationNotes?: string;
  }>;
  revisions: Array<{
    revisionNumber: number;
    title: string;
    summary: string;
    content: string;
    editSummary: string;
    isMinorEdit: boolean;
    authorUsername: string;
  }>;
  talkMessages: Array<{
    authorUsername: string;
    content: string;
    isResolved?: boolean;
  }>;
}

export const SEED_POLICIES: SeedPolicy[] = [
  {
    title: 'Neutral Point of View (NPOV)',
    slug: 'neutral-point-of-view',
    category: 'Content Standards',
    orderIndex: 1,
    summary: 'All encyclopedia articles must represent significant views fairly, proportionately, and without editorial bias.',
    content: `## 1. Principle Overview
Knowlix requires all published articles to be written from an impartial and neutral point of view (NPOV). This means that articles should explain multiple significant perspectives on a subject fairly and with appropriate weight, rather than arguing for a single perspective.

## 2. Core Requirements
- **Tone**: Maintain a detached, matter-of-fact, academic tone. Avoid emotive adjectives, celebratory prose, or polemical declarations.
- **Due Weight**: Represent conflicting viewpoints in proportion to their prominence among credible, published experts in the relevant field.
- **Attribution**: Distinguish between undisputed factual assertions and subjective interpretations by attributing subjective views directly to their sources (e.g., "According to Dr. Aris Thorne...").

## 3. Unacceptable Practices
- Presenting fringe or debunked hypotheses as having equal validity to established scientific consensus.
- Inserting rhetorical questions or conversational asides.
- Cherry-picking citations to manufacture an artificial imbalance.

## 4. Dispute Resolution
When editors disagree on tone or weight, discussions should be conducted on the article's Talk page with references to peer-reviewed literature or authoritative sources.`,
  },
  {
    title: 'Verifiability and Citations',
    slug: 'verifiability',
    category: 'Content Standards',
    orderIndex: 2,
    summary: 'Readers must be able to verify all statements and figures against reliable, published sources.',
    content: `## 1. Principle Overview
The threshold for inclusion on Knowlix is verifiability, not truth. Editors cannot add claims based solely on personal knowledge, memory, or undocumented claims.

## 2. Requirement for Inline Citations
- Any quote, statistic, controversial statement, or historical assertion must be accompanied by an inline citation referencing an authoritative source.
- Citations must include sufficient bibliographic metadata (author, title, publisher, date, DOI/URL) to enable independent verification.

## 3. Burden of Evidence
The burden of evidence lies entirely with the editor who adds or restores material. Uncited or poorly sourced content may be challenged and removed by any editor.`,
  },
  {
    title: 'Reliable Sources Guidelines',
    slug: 'reliable-sources',
    category: 'Content Standards',
    orderIndex: 3,
    summary: 'Articles should rely on published, third-party sources with a known reputation for fact-checking and accuracy.',
    content: `## 1. Hierarchy of Reliability
- **Tier 1 (Highest)**: Peer-reviewed academic journals, university press monographs, and publications from established scientific bodies.
- **Tier 2**: Established mainstream news organizations with professional editorial boards and published correction policies.
- **Tier 3**: Reputable trade publications and specialized industry analyses.

## 2. Unreliable Sources
- Self-published blogs, personal social media accounts, and forum postings.
- Promotional press releases and corporate marketing brochures.
- Open wikis or crowdsourced directories without editorial oversight.`,
  },
  {
    title: 'Notability and Topic Criteria',
    slug: 'notability',
    category: 'Content Standards',
    orderIndex: 4,
    summary: 'A subject is presumed notable if it has received significant, independent coverage in reliable secondary sources.',
    content: `## 1. General Notability Standard
To warrant a standalone article in Knowlix, a subject (person, event, scientific phenomenon, or institution) must have received in-depth treatment from multiple independent, reliable sources.

## 2. What Does Not Qualify
- Routine press coverage, directory listings, or announcements.
- Ephemeral internet memes lacking lasting historical or social impact.
- Self-promotional autobiographies or emerging startups without independent academic or critical coverage.`,
  },
  {
    title: 'No Original Research (NOR)',
    slug: 'no-original-research',
    category: 'Content Standards',
    orderIndex: 5,
    summary: 'Knowlix does not publish original theories, unpublished data, or personal syntheses of published material.',
    content: `## 1. Prohibition on Original Work
Articles must not contain novel analyses, unpublished theories, primary experimental data, or personal deductions made by the author.

## 2. Synthesis of Sources
Do not combine material from multiple sources to reach or imply a conclusion not explicitly stated by any of the cited sources. All analytical conclusions must come directly from cited secondary literature.`,
  },
  {
    title: 'Copyright and Attribution Policy',
    slug: 'copyright-and-attribution',
    category: 'Legal and Licensing',
    orderIndex: 6,
    summary: 'All contributions must respect intellectual property rights and provide accurate attribution.',
    content: `## 1. Zero Tolerance for Plagiarism
Copying verbatim text from copyrighted books, articles, or external websites without license or fair use justification is strictly prohibited and constitutes immediate grounds for revision removal and account restriction.

## 2. Paraphrasing and Synthesis
Contributors must rewrite information in their own words while preserving factual precision and citing the original author.`,
  },
  {
    title: 'Conflict of Interest (COI)',
    slug: 'conflict-of-interest',
    category: 'Community Governance',
    orderIndex: 7,
    summary: 'Contributors must disclose financial, employment, or personal affiliations that could compromise editorial neutrality.',
    content: `## 1. Mandatory Disclosure
If you are paid to edit, represent an organization, or are writing about yourself or a direct competitor, you MUST disclose this relationship on your user profile and the article's Talk page.

## 2. Recommended Workflow
Contributors with a conflict of interest are strongly encouraged to suggest changes on the Talk page rather than editing the main article directly.`,
  },
  {
    title: 'Promotional Content Restriction',
    slug: 'promotional-content',
    category: 'Content Standards',
    orderIndex: 8,
    summary: 'Knowlix is an educational encyclopedia and cannot be used as an advertising or public relations platform.',
    content: `## 1. Prohibited Marketing Language
Articles must not read like promotional press releases, sales pitches, or product reviews. Avoid superlative buzzwords like "leading," "premier," "revolutionary," or "award-winning" unless directly quoting a verifiable independent third-party assessment.

## 2. External Links
External links must only lead to reputable research sources, not commercial landing pages or affiliate marketing campaigns.`,
  },
  {
    title: 'Biographies of Living Persons (BLP)',
    slug: 'biographies-of-living-persons',
    category: 'Content Standards',
    orderIndex: 9,
    summary: 'Living person articles require extreme care, high-quality sourcing, and immediate removal of contentious unverified material.',
    content: `## 1. High Standard of Evidence
Biographical entries regarding living individuals must adhere strictly to verifiability and neutral tone. Contentious material about living persons that is unsourced or poorly sourced must be removed immediately without debate.

## 2. Respect for Privacy
Material relating to the private lives of individuals (family members, medical details, home addresses) that lacks public interest or relevance to their notability must not be included.`,
  },
  {
    title: 'User Conduct and Civility',
    slug: 'user-conduct',
    category: 'Community Governance',
    orderIndex: 10,
    summary: 'Community members must interact civilly, assume good faith, and refrain from personal attacks.',
    content: `## 1. Assume Good Faith
Unless there is clear evidence of vandalism or spam, assume that other editors are trying to improve the encyclopedia.

## 2. Personal Attacks
Insults, harassment, derogatory remarks, and threats are strictly forbidden and will result in temporary or permanent account blocks.`,
  },
  {
    title: 'Vandalism Prevention and Enforcement',
    slug: 'vandalism',
    category: 'Community Governance',
    orderIndex: 11,
    summary: 'Deliberate attempts to deface, misinform, or disrupt the encyclopedia will be promptly reverted and penalized.',
    content: `## 1. Definition of Vandalism
Vandalism includes blanking pages, inserting gibberish or profanity, intentionally introducing false claims, and spamming commercial links.

## 2. Reversion and Reporting
Editors who identify vandalism should use the revision revert tool with a clear edit summary and file a report with moderation.`,
  },
  {
    title: 'Article Deletion and Archival Policy',
    slug: 'article-deletion',
    category: 'Content Standards',
    orderIndex: 12,
    summary: 'Transparent multi-stage deletion workflow preserving historical audit trails.',
    content: `## 1. Criteria for Deletion
Articles may be deleted if they violate copyright, fail notability criteria, constitute pure advertising, or are irreparable hoaxes.

## 2. Deletion Process
- **Nomination**: An editor files a deletion request specifying the policy violation.
- **Discussion Period**: Community members discuss on the talk/review log for at least 7 days.
- **Decision**: A moderator or administrator reviews consensus and executes deletion or archival.`,
  },
  {
    title: 'Article Protection Protocols',
    slug: 'article-protection',
    category: 'Community Governance',
    orderIndex: 13,
    summary: 'Administrative controls to safeguard high-risk articles from edit wars and automated vandalism.',
    content: `## 1. Protection Levels
- **Semi-Protected**: Restricted to registered users with established contribution history (Trusted Contributors).
- **Fully Protected**: Restricted to administrators during active legal, copyright, or severe dispute situations.

## 2. Duration
Article protections should be temporary whenever practical and reviewed periodically.`,
  },
  {
    title: 'Dispute Resolution Procedures',
    slug: 'dispute-resolution',
    category: 'Community Governance',
    orderIndex: 14,
    summary: 'Structured steps to resolve editorial disagreements collaboratively.',
    content: `## 1. Step 1: Article Talk Page
Discuss disagreements politely on the article's Talk page, focusing strictly on sources and policy.

## 2. Step 2: Third-Party Mediation
If two editors cannot agree, request a review from a trusted reviewer or neutral moderator.

## 3. Step 3: Administrative Intervention
Administrators intervene only when behavioral rules or conduct policies are broken.`,
  },
  {
    title: 'Editing and Formatting Guidelines',
    slug: 'editing-guidelines',
    category: 'Style and Formatting',
    orderIndex: 15,
    summary: 'Standards for typography, lead paragraphs, headings, and encyclopedic structure.',
    content: `## 1. Article Structure
1. **Lead Section**: Concise overview defining the subject and establishing its significance.
2. **Body Sections**: Chronological or thematic subsections organized with hierarchical headings (H2, H3).
3. **References Section**: Complete bibliography of cited sources.
4. **Related Topics and Categories**: Navigational links.`,
  },
  {
    title: 'Discussion and Talk Page Guidelines',
    slug: 'discussion-guidelines',
    category: 'Community Governance',
    orderIndex: 16,
    summary: 'Rules for collaborative discussion, thread organization, and resolution tracking.',
    content: `## 1. Purpose of Talk Pages
Talk pages exist solely to discuss improvements to the accompanying article. They must not be used as general chat forums or opinion boards.

## 2. Thread Signatures and Resolving Topics
Keep threads focused on specific sections and mark resolved discussions when consensus is reached.`,
  },
  {
    title: 'Privacy and Data Protection',
    slug: 'privacy',
    category: 'Legal and Licensing',
    orderIndex: 17,
    summary: 'How user data, session security, and edit metadata are managed.',
    content: `## 1. Public Contribution Records
All article edits, revisions, and talk page comments are permanently associated with your public username.

## 2. Private Information
Email addresses, password hashes, and internal moderation logs are strictly encrypted and never shared with third parties.`,
  },
  {
    title: 'Anti-Spam and Automated Abuse Prevention',
    slug: 'spam-policy',
    category: 'Legal and Licensing',
    orderIndex: 18,
    summary: 'Policies concerning bots, mass editing, automated submissions, and link spam.',
    content: `## 1. Automated Scripting
Automated bots and scripts may only operate with prior administrative approval.

## 2. Link Farming
Inserting links intended solely for search engine optimization (SEO) manipulation is prohibited and will trigger immediate automated blacklisting.`,
  },
];

export const SEED_CATEGORIES: SeedCategory[] = [
  {
    name: 'Science & Technology',
    slug: 'science-and-technology',
    description: 'Empirical sciences, natural phenomena, mathematical foundations, and modern technological innovations.',
  },
  {
    name: 'Physics & Quantum Dynamics',
    slug: 'physics-and-quantum-dynamics',
    description: 'Theoretical and experimental physics, quantum mechanics, and thermodynamics.',
    parentSlug: 'science-and-technology',
  },
  {
    name: 'Biological Sciences',
    slug: 'biological-sciences',
    description: 'Ecology, cellular biology, genetics, and evolutionary systems.',
    parentSlug: 'science-and-technology',
  },
  {
    name: 'Computer Science & AI',
    slug: 'computer-science-and-ai',
    description: 'Algorithms, computational theory, machine intelligence, and distributed systems.',
    parentSlug: 'science-and-technology',
  },
  {
    name: 'History & Civilization',
    slug: 'history-and-civilization',
    description: 'Chronicles of human societies, ancient empires, trade networks, and cultural transformations.',
  },
  {
    name: 'Ancient Civilizations',
    slug: 'ancient-civilizations',
    description: 'Archaeology, epigraphy, Bronze Age, and Classical antiquities.',
    parentSlug: 'history-and-civilization',
  },
  {
    name: 'Energy & Sustainability',
    slug: 'energy-and-sustainability',
    description: 'Renewable power grids, climate dynamics, and environmental engineering.',
  },
  {
    name: 'Earth & Ocean Sciences',
    slug: 'earth-and-ocean-sciences',
    description: 'Geology, deep-sea exploration, volcanology, and atmospheric dynamics.',
  },
];

export const SEED_ARTICLES: SeedArticle[] = [
  {
    title: 'Quantum Computing and Superposition Dynamics',
    slug: 'quantum-computing-and-superposition-dynamics',
    summary: 'Quantum computing is a multidisciplinary field comprising aspects of computer science, physics, and mathematics that utilizes quantum mechanical principles to solve complex problems exponentially faster than classical computers.',
    qualityState: 'VERIFIED',
    status: 'PUBLISHED',
    protectionLevel: 'NONE',
    categorySlugs: ['computer-science-and-ai', 'physics-and-quantum-dynamics'],
    content: `## 1. Fundamental Principles

Quantum computing departs fundamentally from classical Von Neumann computational architecture. While classical systems encode discrete data in binary digits (bits) evaluated strictly as either 0 or 1, quantum computational architectures leverage quantum bits (**qubits**).

A qubit exists in a linear superposition of orthogonal basis states $|0\\rangle$ and $|1\\rangle$:

$$|\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle$$

where $\\alpha$ and $\\beta$ are complex probability amplitudes satisfying the normalization constraint $|\\alpha|^2 + |\\beta|^2 = 1$.

## 2. Quantum Entanglement and Interference

### 2.1 Entanglement
When pairs or groups of qubits interact in specific configurations, their quantum states become inseparable regardless of spatial distance. This phenomenon, known as quantum entanglement, enables correlated state spaces whose dimensionality scales exponentially as $2^n$ with the number of qubits $n$.

### 2.2 Quantum Interference
Quantum algorithms utilize constructive interference to amplify the probability amplitudes of correct computational trajectories while inducing destructive interference to diminish non-optimal solutions.

## 3. Physical Qubit Implementations

Multiple distinct physical substrates are currently deployed in experimental and commercial quantum systems:

* **Superconducting Transmon Qubits**: Josephson junction-based circuits operating at cryogenic temperatures (~15 millikelvin).
* **Trapped Ion Systems**: Individual ionized atoms suspended in electromagnetic Paul traps and manipulated via focused laser beams.
* **Neutral Atom Arrays**: Optical tweezers capturing uncharged Rydberg atoms in reconfigurable geometric arrays.
* **Photonic Circuits**: Waveguides guiding single photons with measurement-based state generation.

## 4. Algorithmic Complexity and Quantum Supremacy

Key quantum algorithms have demonstrated super-polynomial speedups over optimal classical algorithms:

1. **Shor's Algorithm (1994)**: Computes prime factorization of an integer $N$ in polynomial time $\\mathcal{O}((\\log N)^3)$, threatening RSA cryptographic foundations.
2. **Grover's Algorithm (1996)**: Performs unstructured database searches in $\\mathcal{O}(\\sqrt{N})$ iterations, providing quadratic speedup.
3. **Quantum Phase Estimation (QPE)**: Central subroutine for Hamiltonian simulation in molecular chemistry and materials design.

## 5. Noise and Error Correction

Contemporary quantum devices reside in the Noisy Intermediate-Scale Quantum (NISQ) era. High gate error rates and brief decoherence times prevent arbitrary algorithmic depth. Scalable fault-tolerant quantum computation requires quantum error-correcting codes, notably the **Surface Code**, which typically requires thousands of physical qubits to sustain a single fault-tolerant logical qubit.`,
    references: [
      {
        title: 'Quantum Computation and Quantum Information',
        authors: 'Nielsen, Michael A.; Chuang, Isaac L.',
        publisher: 'Cambridge University Press',
        publicationDate: '2010',
        doiOrIsbn: 'ISBN 978-1107002173',
        url: 'https://doi.org/10.1017/CBO9780511976667',
        citationNotes: 'Standard foundational textbook on qubit state evolution and quantum logic gates.',
      },
      {
        title: 'Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer',
        authors: 'Shor, Peter W.',
        publisher: 'SIAM Journal on Computing',
        publicationDate: '1997',
        doiOrIsbn: 'doi:10.1137/S0097539795293172',
        url: 'https://doi.org/10.1137/S0097539795293172',
        citationNotes: 'Original publication demonstrating polynomial complexity for integer factorization.',
      },
      {
        title: 'Fault-tolerant quantum computation with surface codes',
        authors: 'Fowler, Austin G.; Mariantoni, Matteo; Martinis, John M.; Cleland, Andrew N.',
        publisher: 'Physical Review A',
        publicationDate: '2012',
        doiOrIsbn: 'doi:10.1103/PhysRevA.86.032324',
        url: 'https://doi.org/10.1103/PhysRevA.86.032324',
        citationNotes: 'Comprehensive analysis of threshold theorems for 2D planar surface codes.',
      },
    ],
    revisions: [
      {
        revisionNumber: 1,
        title: 'Quantum Computing and Superposition Dynamics',
        summary: 'Initial stub outlining basic definitions of qubits and quantum computing.',
        content: 'Quantum computing is a computational paradigm utilizing qubits rather than classical bits.',
        editSummary: 'Initial article creation',
        isMinorEdit: false,
        authorUsername: 'dr_elena_vance',
      },
      {
        revisionNumber: 2,
        title: 'Quantum Computing and Superposition Dynamics',
        summary: 'Quantum computing is a multidisciplinary field utilizing quantum mechanical principles to solve complex problems exponentially faster than classical computers.',
        content: `## 1. Fundamental Principles\n\nQuantum computing departs fundamentally from classical computational architecture by utilizing qubits capable of superposition.\n\n## 2. Physical Qubits\n\nSystems use Superconducting and Trapped Ion architectures.`,
        editSummary: 'Expanded physical qubit architectures and mathematical foundations',
        isMinorEdit: false,
        authorUsername: 'alex_researcher',
      },
    ],
    talkMessages: [
      {
        authorUsername: 'clara_scholastic',
        content: 'Should we expand on topological qubits (Majorana zero modes) in section 3?',
        isResolved: false,
      },
      {
        authorUsername: 'dr_elena_vance',
        content: 'Agreed. Once peer-reviewed experimental verification of non-Abelian braiding is established, we can add a subsection on topological approaches.',
        isResolved: true,
      },
    ],
  },
  {
    title: 'The Ancient Silk Road: Trans-Eurasian Exchange Networks',
    slug: 'the-ancient-silk-road-trans-eurasian-exchange-networks',
    summary: 'The Silk Road was an expansive network of overland and maritime trade routes spanning Eurasia from the Han Dynasty in China through Central Asia to the Mediterranean basin.',
    qualityState: 'REVIEWED',
    status: 'PUBLISHED',
    protectionLevel: 'NONE',
    categorySlugs: ['history-and-civilization', 'ancient-civilizations'],
    content: `## 1. Historical Geography and Origins

The **Silk Road** was not a single monolithic highway, but an evolving network of overland caravan trails and maritime corridors that linked East Asia, Central Asia, South Asia, the Middle East, and Mediterranean Europe.

Formally opened during the Han dynasty (206 BCE – 220 CE) following the diplomatic missions of imperial envoy **Zhang Qian** (c. 138–126 BCE), the routes facilitated economic commerce as well as cultural, scientific, and biological transmission across continents.

## 2. Key Commodities and Economic Exchange

While Chinese silk was the hallmark luxury commodity in Roman and Persian markets, trade involved a vast array of high-value goods:

* **From East to West**: Raw and woven silk, porcelain, paper, lacquerware, tea, and gunpowder.
* **From Central and West Asia to East**: Horses (notably the "heavenly horses" of Fergana), glassware, alfalfa, grapes, frankincense, lapis lazuli, and wool textiles.

## 3. Cultural and Religious Transmission

### 3.1 Spread of Buddhism
Central Asian oasis cities such as Dunhuang, Khotan, and Kucha served as vital monastic and translation hubs where Sanskrit and Prakrit Buddhist texts were translated into Chinese and Sogdian.

### 3.2 Sogdian Merchants
The Sogdians, an Iranian people originating from the Zarafshan river valley (modern Uzbekistan and Tajikistan), operated as the principal commercial intermediaries along the trans-continental routes, establishing merchant colonies along the Hexi Corridor.

## 4. Decline and Transformation

The overland trade network experienced decline during the late 14th and 15th centuries due to several interrelated factors:

1. Political fragmentation following the collapse of the Mongol Empire (Pax Mongolica).
2. The rise of maritime trade routes pioneered by Portuguese, Spanish, and Dutch navigators during the Age of Exploration.
3. Lower shipping costs and higher volume capacities of oceanic vessels compared to desert caravans.`,
    references: [
      {
        title: 'The Silk Road: A New History',
        authors: 'Hansen, Valerie',
        publisher: 'Oxford University Press',
        publicationDate: '2012',
        doiOrIsbn: 'ISBN 978-0195159318',
        url: 'https://global.oup.com/academic/product/the-silk-road-9780195159318',
        citationNotes: 'Detailed archival analysis of contracts and manuscripts discovered in Turfan and Dunhuang.',
      },
      {
        title: 'The Silk Roads: A New History of the World',
        authors: 'Frankopan, Peter',
        publisher: 'Bloomsbury Publishing',
        publicationDate: '2015',
        doiOrIsbn: 'ISBN 978-1408839973',
        url: 'https://www.bloomsbury.com/uk/silk-roads-9781408839973/',
        citationNotes: 'Comprehensive global historical perspective on Eurasian trade corridors.',
      },
    ],
    revisions: [
      {
        revisionNumber: 1,
        title: 'The Ancient Silk Road: Trans-Eurasian Exchange Networks',
        summary: 'Historical overview of ancient Eurasian trade networks.',
        content: 'The Silk Road was an overland trade route linking ancient China with the Mediterranean world.',
        editSummary: 'Initial publication',
        isMinorEdit: false,
        authorUsername: 'clara_scholastic',
      },
    ],
    talkMessages: [],
  },
  {
    title: 'Photosynthesis and Cellular Respiration Cycles',
    slug: 'photosynthesis-and-cellular-respiration-cycles',
    summary: 'Photosynthesis and cellular respiration form the dual bioenergetic pathways that sustain terrestrial and aquatic life through the cycling of carbon, water, and adenosine triphosphate (ATP).',
    qualityState: 'VERIFIED',
    status: 'PUBLISHED',
    protectionLevel: 'NONE',
    categorySlugs: ['biological-sciences', 'science-and-technology'],
    content: `## 1. Bioenergetic Thermodynamics

All living organisms require continuous energy inputs to counter biological entropy. In the biosphere, energy transformation occurs primarily through two reciprocal biochemical pathways: **Photosynthesis** (an endergonic, anabolic process) and **Cellular Respiration** (an exergonic, catabolic process).

## 2. Photosynthesis Mechanisms

Photosynthesis in oxygenic phototrophs (plants, algae, cyanobacteria) converts electromagnetic radiation into chemical bond energy:

$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{photons} \\rightarrow \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$

### 2.1 Light-Dependent Reactions
Occurring across the thylakoid membranes of chloroplasts, photon absorption by Photosystems II and I initiates photolysis of water, establishing a proton motive force across the thylakoid lumen that drives ATP synthase and produces NADPH.

### 2.2 Light-Independent Reactions (Calvin-Benson Cycle)
In the stroma, the enzyme **RuBisCO** (Ribulose-1,5-bisphosphate carboxylase-oxygenase) fixes atmospheric $\\text{CO}_2$ into 3-phosphoglycerate, which is subsequently reduced to glyceraldehyde 3-phosphate (G3P).

## 3. Cellular Respiration and ATP Generation

Aerobic respiration oxidizes organic substrates in four sequential stages:

1. **Glycolysis** (Cytosol): Anaerobic breakdown of glucose into 2 pyruvate molecules yielding net 2 ATP and 2 NADH.
2. **Pyruvate Decarboxylation** (Mitochondrial Matrix): Conversion of pyruvate into Acetyl-CoA.
3. **Citric Acid Cycle / Krebs Cycle**: Cyclic oxidation producing GTP/ATP, NADH, and $\\text{FADH}_2$.
4. **Oxidative Phosphorylation**: High-energy electrons flow through Complexes I–IV of the inner mitochondrial membrane, driving chemiosmotic ATP synthesis (generating ~30–32 ATP per glucose).`,
    references: [
      {
        title: 'Molecular Biology of the Cell (6th ed.)',
        authors: 'Alberts, Bruce; Johnson, Alexander; Lewis, Julian; et al.',
        publisher: 'Garland Science',
        publicationDate: '2014',
        doiOrIsbn: 'ISBN 978-0815344322',
        citationNotes: 'Authoritative description of electron transport chains and chemiosmotic coupling.',
      },
    ],
    revisions: [
      {
        revisionNumber: 1,
        title: 'Photosynthesis and Cellular Respiration Cycles',
        summary: 'Core bioenergetics of plant and animal energy transformations.',
        content: 'Photosynthesis and cellular respiration are complementary metabolic processes.',
        editSummary: 'Created biochemical overview',
        isMinorEdit: false,
        authorUsername: 'dr_elena_vance',
      },
    ],
    talkMessages: [],
  },
  {
    title: 'Evolution of Human Writing Systems and Epigraphy',
    slug: 'evolution-of-human-writing-systems-and-epigraphy',
    summary: 'Writing systems represent symbolic technologies developed across multiple independent ancient civilizations to record spoken language in enduring physical media.',
    qualityState: 'DEVELOPING',
    status: 'PUBLISHED',
    protectionLevel: 'NONE',
    categorySlugs: ['history-and-civilization', 'ancient-civilizations'],
    content: `## 1. Independent Inventions of Writing

Linguistic archaeology recognizes at least four pristine, independent inventions of writing in human history:

* **Mesopotamian Cuneiform** (c. 3400–3200 BCE): Originating in Sumerian Uruk as accounting clay tokens that developed into wedge-shaped stylus impressions.
* **Egyptian Hieroglyphs** (c. 3250 BCE): Emerged during the Naqada III period, incorporating logographic and phonetic consonantal values.
* **Chinese Oracle Bone Script** (c. 1200 BCE): Divinatory inscriptions on turtle plastrons and ox scapulae during the Shang Dynasty at Anyang.
* **Mesoamerican Glyph Systems** (c. 600–300 BCE): Olmec and Zapotec scripts culminating in the fully logosyllabic Classic Maya script.

## 2. Structural Classification of Writing Systems

Typologically, writing systems are categorized by the linguistic units encoded:

1. **Logographic**: Graphemes represent morphemes or entire words (e.g., Hanzi, Sumerian logograms).
2. **Syllabic**: Graphemes represent phonetic syllables (e.g., Japanese Kana, Linear B, Cherokee syllabary).
3. **Abjad**: Graphemes represent consonant phonemes only; vowels are inferred or indicated with diacritics (e.g., Phoenician, Arabic, Hebrew).
4. **Abugida / Alphasyllabary**: Consonant units carry an inherent vowel that can be modified by diacritic marks (e.g., Devanagari, Ge'ez).
5. **Alphabet**: Discrete graphemes represent individual phonemes for both consonants and vowels (e.g., Greek, Latin, Cyrillic).`,
    references: [
      {
        title: 'A History of Writing',
        authors: 'Fischer, Steven Roger',
        publisher: 'Reaktion Books',
        publicationDate: '2001',
        doiOrIsbn: 'ISBN 978-1861891013',
        citationNotes: 'Comprehensive comparative overview of global script emergence.',
      },
    ],
    revisions: [
      {
        revisionNumber: 1,
        title: 'Evolution of Human Writing Systems and Epigraphy',
        summary: 'Overview of ancient scripts and linguistic classification.',
        content: 'Writing is a system of graphic marks representing language units.',
        editSummary: 'Initial draft',
        isMinorEdit: false,
        authorUsername: 'alex_researcher',
      },
    ],
    talkMessages: [],
  },
  {
    title: 'Renewable Energy Transitions in Modern Grid Architecture',
    slug: 'renewable-energy-transitions-in-modern-grid-architecture',
    summary: 'The technological and economic transformation of electrical grids from centralized fossil generation toward high-penetration variable renewable energy (VRE) systems.',
    qualityState: 'REVIEWED',
    status: 'PUBLISHED',
    protectionLevel: 'NONE',
    categorySlugs: ['energy-and-sustainability', 'science-and-technology'],
    content: `## 1. Grid Integration Dynamics

Integrating high penetrations of Variable Renewable Energy (VRE)—predominantly solar photovoltaics (PV) and wind turbines—requires restructuring traditional grid operations designed around synchronous baseload generation.

## 2. System Inertia and Frequency Stability

Conventional thermal and hydroelectric turbines provide physical rotational inertia that naturally dampens rapid grid frequency deviations. Inverter-based resources (IBRs) decouple mechanical rotation from the grid, necessitating:

* **Grid-Forming Inverters (GFM)**: Power electronics algorithms that emulate voltage sources and provide synthetic inertia.
* **Synchronous Condensers**: De-energized spinning turbines connected for reactive power and mechanical inertia support.

## 3. Long-Duration Energy Storage (LDES)

To manage multi-day intermittency and seasonal variations, grid architectures utilize diverse storage technologies:

* **Lithium-Ion Battery Energy Storage Systems (BESS)**: 2–6 hour duration for fast frequency regulation and peak shaving.
* **Pumped Hydroelectric Storage (PHS)**: High capacity, providing over 90% of global operational energy storage volume.
* **Flow Batteries (Vanadium Redox)**: Scalable 8–16 hour duration with minimal electrolyte degradation.
* **Thermal and Hydrogen Storage**: Multi-day and seasonal chemical storage vectors.`,
    references: [
      {
        title: 'Variable Renewable Energy Integration and Power System Flexibility',
        authors: 'International Energy Agency (IEA)',
        publisher: 'IEA Publications',
        publicationDate: '2021',
        url: 'https://www.iea.org/reports/renewables-2021',
        citationNotes: 'Analysis of operational flexibility metrics across global transmission operators.',
      },
    ],
    revisions: [
      {
        revisionNumber: 1,
        title: 'Renewable Energy Transitions in Modern Grid Architecture',
        summary: 'Analysis of high-penetration renewable grid integration challenges.',
        content: 'Modern power grids are integrating wind and solar at scale.',
        editSummary: 'Draft creation',
        isMinorEdit: false,
        authorUsername: 'dr_elena_vance',
      },
    ],
    talkMessages: [],
  },
  {
    title: 'Deep Sea Hydrothermal Vents and Extremophile Ecosystems',
    slug: 'deep-sea-hydrothermal-vents-and-extremophile-ecosystems',
    summary: 'Deep-sea hydrothermal vents are fissures on the seabed that discharge geothermally heated mineral-rich fluids, supporting dense chemosynthetic ecosystems independent of sunlight.',
    qualityState: 'VERIFIED',
    status: 'PUBLISHED',
    protectionLevel: 'NONE',
    categorySlugs: ['earth-and-ocean-sciences', 'biological-sciences'],
    content: `## 1. Geological Discovery and Hydrothermal Mechanics

First discovered in 1977 near the Galápagos Rift by oceanographers aboard the research submersible *Alvin*, hydrothermal vents form along volcanically active divergent tectonic boundaries, mid-ocean ridges, and island arcs.

Cold ocean water ($\sim 2^\circ\\text{C}$) percolates down through oceanic crust fractures, where magmatic heat superheats the fluid up to $400^\circ\\text{C}$ without boiling due to extreme hydrostatic pressure ($\sim 250\\text{ atmospheres}$). The acidic fluid leaches metals (iron, copper, zinc) and hydrogen sulfide ($\\text{H}_2\\text{S}$) before discharging back into the ocean, creating "black smoker" and "white smoker" chimney deposits.

## 2. Chemosynthesis and Trophic Hierarchy

Unlike virtually all surface ecosystems powered by solar photosynthesis, hydrothermal vent communities are fundamentally powered by **chemosynthesis**:

$$\\text{CO}_2 + \\text{H}_2\\text{S} + \\text{O}_2 + \\text{H}_2\\text{O} \\rightarrow [\\text{CH}_2\\text{O}]_n + \\text{H}_2\\text{SO}_4$$

Chemolithoautotrophic bacteria and archaea oxidize reduced inorganic compounds (such as hydrogen sulfide and methane) to synthesize organic matter.

## 3. Endemic Extremophile Fauna

Vent ecosystems feature extraordinary specialized organisms adapted to high pressure, toxic sulfide concentrations, and extreme thermal gradients:

* **Riftia pachyptila (Giant Tube Worms)**: Lack a mouth and digestive tract, instead hosting trillions of endosymbiotic sulfide-oxidizing bacteria in a specialized organ known as a *trophosome*.
* **Alvinella pompejana (Pompeii Worm)**: Capable of withstanding fluid temperatures up to $80^\circ\\text{C}$, making it one of the most heat-tolerant animals known.
* **Rimicaris exoculata (Hydrothermal Vent Shrimp)**: Possess specialized dorsal photoreceptors capable of detecting faint geothermal infrared emissions from hot vent chimneys.`,
    references: [
      {
        title: 'The Ecology of Deep-Sea Hydrothermal Vents',
        authors: 'Van Dover, Cindy Lee',
        publisher: 'Princeton University Press',
        publicationDate: '2000',
        doiOrIsbn: 'ISBN 978-0691049298',
        citationNotes: 'Comprehensive ecological review of global hydrothermal vent biogeography.',
      },
    ],
    revisions: [
      {
        revisionNumber: 1,
        title: 'Deep Sea Hydrothermal Vents and Extremophile Ecosystems',
        summary: 'Ecological and geological mechanisms of hydrothermal vent chemosynthesis.',
        content: 'Hydrothermal vents support chemosynthetic life in the abyssal ocean.',
        editSummary: 'Initial article release',
        isMinorEdit: false,
        authorUsername: 'dr_elena_vance',
      },
    ],
    talkMessages: [],
  },
];
