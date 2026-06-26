#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');

const SITE_URL = (process.env.SITE_URL || 'https://modutools.kr').replace(/\/$/, '');
const TODAY = new Date().toISOString().slice(0, 10);

const staticRoutes = ['/', '/guide', '/about', '/terms', '/privacy'];

const articleRoutes = [
  '/guide/vat-filing-checklist',
  '/guide/freelancer-33-refund',
  '/guide/supply-price-vs-vat',
  '/guide/margin-basics',
  '/guide/quote-writing-guide',
  '/guide/qr-code-basics',
  '/guide/wifi-qr-guide',
  '/guide/business-card-qr',
  '/guide/qr-design-tips',
  '/guide/photo-to-pdf-guide',
  '/guide/pdf-merge-split',
  '/guide/personal-info-masking',
  '/guide/image-compress-guide',
  '/guide/youtube-thumbnail-tips',
  '/guide/blog-cover-guide',
  '/guide/store-main-image-guide',
  '/guide/instagram-image-guide',
  '/guide/remove-duplicates-guide',
  '/guide/phone-number-format',
  '/guide/csv-korean-broken',
  '/guide/merge-split-excel',
];

const categoryRoutes = ['/business', '/qr', '/submit', '/thumbnail', '/image', '/excel'];

const toolRoutes = [
  '/business/vat-calculator',
  '/business/supply-price',
  '/business/freelancer-tax',
  '/business/quote-split',
  '/business/margin-calculator',
  '/qr/url-qr',
  '/qr/wifi-qr',
  '/qr/vcard-qr',
  '/qr/qr-design',
  '/qr/qr-reader',
  '/submit/photo-to-pdf',
  '/submit/pdf-merge',
  '/submit/pdf-extract',
  '/submit/pdf-mask',
  '/submit/image-compress',
  '/thumbnail/youtube-thumbnail',
  '/thumbnail/blog-cover',
  '/thumbnail/store-main-image',
  '/thumbnail/instagram-image',
  '/thumbnail/text-on-image',
  '/image/compress',
  '/image/resize',
  '/image/id-photo',
  '/image/jpg-converter',
  '/image/crop-padding',
  '/excel/remove-duplicates',
  '/excel/merge-excel',
  '/excel/phone-cleaner',
  '/excel/csv-encoding-fix',
  '/excel/split-by-column',
];

function priorityFor(path) {
  if (path === '/') return '1.0';
  if (path.split('/').filter(Boolean).length === 1) return '0.8';
  return '0.7';
}

function changefreqFor(path) {
  if (path === '/') return 'weekly';
  if (['/about', '/terms', '/privacy'].includes(path)) return 'monthly';
  return 'weekly';
}

const allRoutes = [
  ...staticRoutes,
  ...articleRoutes,
  ...categoryRoutes,
  ...toolRoutes,
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (path) => `  <url>
    <loc>${SITE_URL}${path === '/' ? '' : path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreqFor(path)}</changefreq>
    <priority>${priorityFor(path)}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

const outputDir = resolve(PROJECT_ROOT, 'public');
mkdirSync(outputDir, { recursive: true });
const outputPath = resolve(outputDir, 'sitemap.xml');
writeFileSync(outputPath, xml, 'utf8');

console.log(
  `✓ sitemap.xml generated (${allRoutes.length} URLs, base: ${SITE_URL})`,
);
