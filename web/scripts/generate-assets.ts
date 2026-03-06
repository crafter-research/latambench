import sharp from "sharp";
import { writeFileSync } from "fs";
import { join } from "path";

const PUBLIC = join(import.meta.dir, "../public");

// Brand tokens
const VOID = "#080808";
const WHITE = "#F8F8F8";
const YELLOW = "#F8BB2D";
const SILVER = "#C8C4BE";
const ANNOTATION = "#6B6560";

// Crafter Station icon mark path (yellow C symbol)
const CRAFTER_ICON = `M34.77 13.67C32.72 12.23 29.21 10.55 26.9 9.88C21.68 8.28 17.56 9.18 14.83 10.13C9.52 11.98 6.18 14.42 3.19 18.89C-1.52 25.79 -0.84 36.99 4.9 43.3C6.18 44.82 6.87 44.57 11.83 40.95C12 40.78 11.32 39.68 10.29 38.42C7.98 35.56 6.61 30.34 7.3 27.39C9.52 18.13 20.91 13.16 28.27 18.21C29.89 19.31 35.03 23.85 39.65 28.32C46.58 34.88 48.64 36.4 50.35 36.23C52.06 36.06 52.66 35.47 52.83 33.62C53.09 31.6 52.32 30.42 48.38 26.88C45.73 24.44 43.59 22.25 43.59 21.83C43.59 21.5 45.39 20.06 47.61 18.72C61.99 9.71 77.48 27.64 65.5 39.43C63.96 40.95 61.22 42.55 59.42 43.05C57.37 43.56 47.87 43.98 36.06 43.98C13.97 43.98 12.77 44.23 6.95 49.37C-0.49 56.02 -2.2 67.38 3.02 75.64C9.78 86.41 24.33 89.11 34.6 81.45L38.37 78.58L42.73 81.45C49.84 86.16 55.57 87.09 62.5 84.81C76.37 80.18 81.51 62.84 72.52 51.22C71.49 49.96 70.98 49.87 69.61 50.54C65.41 52.9 65.5 52.73 67.98 57.79C69.87 61.66 70.21 63.17 69.78 66.12C68.58 73.53 62.93 78.5 55.74 78.5C50.18 78.5 48.38 77.4 38.11 67.55C32.72 62.5 27.75 58.29 27.07 58.29C25.78 58.29 23.05 60.9 23.05 62.16C23.05 62.5 25.36 65.2 28.27 68.06L33.49 73.19L30.41 75.55C19.54 83.72 4.04 73.95 7.64 61.15C8.75 57.28 12.69 52.99 16.45 51.64C17.91 51.05 26.9 50.71 39.05 50.71C61.39 50.71 64.05 50.29 69.18 45.91C84.5 33.12 75.6 9.03 55.57 9.12C49.75 9.12 46.58 10.3 41.19 14.25L38.45 16.28L34.77 13.67Z`;

function makeGrid(w: number, h: number, step = 60, opacity = 0.04): string {
  return `<pattern id="g" width="${step}" height="${step}" patternUnits="userSpaceOnUse">
      <path d="M ${step} 0 L 0 0 0 ${step}" fill="none" stroke="${WHITE}" stroke-width="0.5" opacity="${opacity}"/>
    </pattern>
    <rect width="${w}" height="${h}" fill="url(#g)"/>`;
}

function makeSpiral(cx: number, cy: number, scale: number, opacity = 0.06): string {
  const r1 = 50 * scale, r2 = 100 * scale, r3 = 180 * scale, r4 = 280 * scale;
  return `
    <circle cx="${cx}" cy="${cy}" r="${r1}" stroke="${WHITE}" stroke-width="0.6" fill="none" opacity="${opacity}"/>
    <circle cx="${cx}" cy="${cy}" r="${r2}" stroke="${WHITE}" stroke-width="0.6" fill="none" opacity="${opacity * 0.85}"/>
    <circle cx="${cx}" cy="${cy}" r="${r3}" stroke="${WHITE}" stroke-width="0.6" fill="none" opacity="${opacity * 0.7}"/>
    <circle cx="${cx}" cy="${cy}" r="${r4}" stroke="${WHITE}" stroke-width="0.6" fill="none" opacity="${opacity * 0.5}"/>`;
}

// ─────────────────────────────────────────────
// OG IMAGE — 1200×630
// ─────────────────────────────────────────────
const ogSvg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>${makeGrid(1200, 630, 60, 1)}</defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="${VOID}"/>

  <!-- Grid -->
  ${makeGrid(1200, 630, 60, 1)}

  <!-- Spiral decoration — top right -->
  ${makeSpiral(1080, 120, 1.4, 0.07)}

  <!-- Hairline cross — top right -->
  <line x1="980" y1="0" x2="980" y2="630" stroke="${WHITE}" stroke-width="0.4" opacity="0.04"/>
  <line x1="0" y1="160" x2="1200" y2="160" stroke="${WHITE}" stroke-width="0.4" opacity="0.04"/>

  <!-- Left accent line -->
  <line x1="80" y1="0" x2="80" y2="630" stroke="${WHITE}" stroke-width="0.5" opacity="0.08"/>

  <!-- Crafter icon mark -->
  <g transform="translate(80, 220) scale(0.65)">
    <path d="${CRAFTER_ICON}" fill="${YELLOW}"/>
  </g>

  <!-- LATAMBENCH wordmark -->
  <text
    x="80" y="400"
    font-family="'Space Grotesk', 'Inter', Arial, sans-serif"
    font-size="96"
    font-weight="300"
    letter-spacing="8"
    fill="${WHITE}"
    text-anchor="start"
  >LATAMBENCH</text>

  <!-- Tagline -->
  <text
    x="80" y="448"
    font-family="'JetBrains Mono', 'Courier New', monospace"
    font-size="16"
    letter-spacing="3"
    fill="${ANNOTATION}"
    text-anchor="start"
  >GENERATION-FIRST BENCHMARK · LATIN AMERICAN SPANISH</text>

  <!-- Bottom label -->
  <text
    x="80" y="570"
    font-family="'JetBrains Mono', 'Courier New', monospace"
    font-size="13"
    letter-spacing="2"
    fill="${ANNOTATION}"
    text-anchor="start"
  >A CRAFTER RESEARCH LAB · LATAMBENCH.ORG</text>

  <!-- Bottom hairline -->
  <line x1="80" y1="550" x2="1120" y2="550" stroke="${WHITE}" stroke-width="0.5" opacity="0.08"/>
</svg>`;

// ─────────────────────────────────────────────
// OG TWITTER — 1200×600
// ─────────────────────────────────────────────
const twitterSvg = `<svg width="1200" height="600" viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg">
  <defs>${makeGrid(1200, 600, 60, 1)}</defs>

  <rect width="1200" height="600" fill="${VOID}"/>
  ${makeGrid(1200, 600, 60, 1)}
  ${makeSpiral(1080, 100, 1.3, 0.07)}

  <line x1="80" y1="0" x2="80" y2="600" stroke="${WHITE}" stroke-width="0.5" opacity="0.08"/>

  <g transform="translate(80, 200) scale(0.65)">
    <path d="${CRAFTER_ICON}" fill="${YELLOW}"/>
  </g>

  <text x="80" y="370" font-family="'Space Grotesk', Arial, sans-serif" font-size="88" font-weight="300" letter-spacing="8" fill="${WHITE}">LATAMBENCH</text>
  <text x="80" y="416" font-family="'JetBrains Mono', monospace" font-size="15" letter-spacing="3" fill="${ANNOTATION}">GENERATION-FIRST BENCHMARK · LATIN AMERICAN SPANISH</text>
  <line x1="80" y1="520" x2="1120" y2="520" stroke="${WHITE}" stroke-width="0.5" opacity="0.08"/>
  <text x="80" y="542" font-family="'JetBrains Mono', monospace" font-size="13" letter-spacing="2" fill="${ANNOTATION}">A CRAFTER RESEARCH LAB · LATAMBENCH.ORG</text>
</svg>`;

// ─────────────────────────────────────────────
// FAVICON SVG — uses Crafter yellow icon
// ─────────────────────────────────────────────
const faviconSvg = `<svg width="32" height="32" viewBox="0 0 85 96" xmlns="http://www.w3.org/2000/svg">
  <rect width="85" height="96" rx="8" fill="${VOID}"/>
  <path d="${CRAFTER_ICON}" fill="${YELLOW}"/>
</svg>`;

// ─────────────────────────────────────────────
// Generate files
// ─────────────────────────────────────────────
async function run() {
  console.log("Generating OG image (1200×630)…");
  await sharp(Buffer.from(ogSvg))
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(join(PUBLIC, "og.png"));
  console.log("  ✓ public/og.png");

  console.log("Generating Twitter OG (1200×600)…");
  await sharp(Buffer.from(twitterSvg))
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(join(PUBLIC, "og-twitter.png"));
  console.log("  ✓ public/og-twitter.png");

  console.log("Generating favicon…");
  const favicon32 = await sharp(Buffer.from(faviconSvg)).resize(32, 32).png().toBuffer();
  const favicon16 = await sharp(Buffer.from(faviconSvg)).resize(16, 16).png().toBuffer();

  // Write favicon.svg (modern browsers prefer SVG)
  writeFileSync(join(PUBLIC, "favicon.svg"), faviconSvg);
  console.log("  ✓ public/favicon.svg");

  // Write 32px PNG as favicon.ico fallback
  await sharp(favicon32).toFile(join(PUBLIC, "favicon-32.png"));
  await sharp(favicon16).toFile(join(PUBLIC, "favicon-16.png"));
  console.log("  ✓ public/favicon-32.png, favicon-16.png");

  console.log("\nAll assets generated.");
}

run().catch(console.error);
