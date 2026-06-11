#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');

const svgPath = resolve(__dirname, 'og-image.svg');
const outputPath = resolve(PROJECT_ROOT, 'public', 'og-image.png');

const svg = readFileSync(svgPath);

const png = await sharp(svg, { density: 192 })
  .resize(1200, 630, { fit: 'cover' })
  .png({ compressionLevel: 9 })
  .toBuffer();

writeFileSync(outputPath, png);

console.log(`✓ og-image.png generated (${png.length.toLocaleString()} bytes) → public/og-image.png`);
