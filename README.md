# Knowlix — The Open Collaborative Encyclopedia

**Knowlix** is a modern, production-grade, collaborative online encyclopedia platform designed for scholarly rigor, neutral point of view, permanent revision provenance, and community-moderated peer governance.

Built from the ground up for Vercel and hosted PostgreSQL deployments.

---

## 🌟 Core Architecture & Features

* **Scholarly Reading Experience**: Academic typography, responsive layout, auto-generated table of contents, and dark/light modes.
* **Granular Role-Based Governance**:
  * `GUEST`: Public browsing and search.
  * `REGISTERED`: Author drafts, edit permitted articles, join talk discussions, watch articles.
  * `TRUSTED_CONTRIBUTOR`: Edit semi-protected articles, fast-tracked revisions.
  * `REVIEWER`: Peer-review article submissions and certify quality ratings.
  * `MODERATOR`: Resolve vandalism reports, lock discussions, issue blocks, apply article protections.
  * `ADMIN` & `SUPER_ADMIN`: User role assignment, policy amendments, category taxonomy governance.
* **18 Ratified Original Policies**: Independent content standards, NPOV, verifiability, reliable sources, BLP, plagiarism restrictions, civility, and dispute resolution.
* **Structured Article Editor**: Rich text formatting, heading hierarchy, tables, internal `[[links]]`, live content quality checker, and bibliography citation manager.
* **Visual Revision Diffing & Provenance**: Word-level and line-level diffing algorithms (`diff`) with 1-click historical rollback and change summary audits.
* **Talk / Discussion Pages**: Threaded community discussions, resolution marking, quote references, and moderator comment masking.
* **Search Architecture**: Full-text keyword and category searching with instant topic suggestions.
* **SEO Optimized**: Dynamic OpenGraph, Twitter cards, XML sitemaps (`/sitemap.xml`), and robots.txt.
* **Serverless Native**: Edge-safe JWT sessions (`jose` + `bcryptjs`), Prisma ORM singleton connection pooling, abstract cloud media storage.

---

## 🛠 Technology Stack

- **Framework**: Next.js 16 (App Router, Server Actions)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 & Academic Typography Engine
- **Database & ORM**: PostgreSQL with Prisma ORM
- **Authentication**: Stateless JWT with secure HTTP-only cookies & Bcrypt hashing
- **Diff Engine**: `diff` (word & line diff calculation)
- **Icons**: Lucide React

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone <your-repo-url> Knowlix
cd Knowlix
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Ensure `DATABASE_URL` and `AUTH_SECRET` are configured.

### 3. Generate Prisma Client & Push Database Schema
```bash
npx prisma generate
npx prisma db push
```

### 4. Seed Initial Policies, Categories, & Scholarly Accounts
```bash
npm run db:seed
```

### 5. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

Run the automated test suite covering authentication, slug generation, content tone validation, visual diffs, authorization boundaries, and policy completeness:

```bash
npm test
```

---

## 🔑 Demo Scholarly Accounts

Default password for all demo accounts: `Knowlix2026!`

| Username | Role | Primary Function |
| :--- | :--- | :--- |
| `dr_elena_vance` | `SUPER_ADMIN` | Founder, Quantum Physics Fellow, Full System Admin |
| `marcus_aurelius_mod` | `MODERATOR` | Community Governance & Civility Moderator |
| `clara_scholastic` | `REVIEWER` | Linguistics & Epigraphy Peer Reviewer |
| `alex_researcher` | `TRUSTED_CONTRIBUTOR` | Energy Systems Scholar & Verified Contributor |
| `nova_novice` | `REGISTERED` | Registered Student & Curious Contributor |

---

## 🚢 Production Build & Deployment

To verify a production build locally:
```bash
npm run build
npm run start
```

For full Vercel deployment instructions, see [DEPLOYMENT.md](file:///DEPLOYMENT.md).

---

## 📄 License
Knowlix text and contributions are published under Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0). Software is licensed under the MIT License.
