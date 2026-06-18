# AdSense Guide Content Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen AdSense review readiness by expanding the existing guide page with useful, original explanations for all 25 tools.

**Architecture:** Keep the site structure simple by reusing the existing `/guide` route. Add a data module for guide copy, then render it from `GuidePage` with SEO metadata and structured content.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, react-helmet-async.

---

### Task 1: Add Guide Content Data

**Files:**
- Create: `modutools-app/src/data/toolGuides.ts`

**Steps:**
1. Define per-tool guide entries keyed by tool id.
2. Include use cases, examples, checklist notes, and related tool ids.
3. Keep copy Korean, practical, and non-spammy.

### Task 2: Expand Guide Page

**Files:**
- Modify: `modutools-app/src/routes/GuidePage.tsx`

**Steps:**
1. Import the guide content data.
2. Update SEO title and description for the 25-tool guide.
3. Replace the short list with category sections and readable guide cards.
4. Add internal links from each guide card to the corresponding tool.

### Task 3: Verify

**Commands:**
- `npm run lint`
- `npm run build`

**Expected:**
- TypeScript completes with no errors.
- Vite build completes and regenerates `sitemap.xml`.
