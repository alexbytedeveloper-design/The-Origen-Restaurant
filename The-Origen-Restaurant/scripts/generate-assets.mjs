import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const APP_DIR = path.join(ROOT, "src", "app");

const GOLD = "#C9A227";
const GOLD_SOFT = "#E0C878";
const CREAM = "#F4EDE4";
const MUTED = "#B8A897";
const INK = "#14100D";

const readMenu = async () => {
  const raw = await readFile(path.join(ROOT, "src", "content", "menu.json"), "utf8");
  return JSON.parse(raw);
};

const hash = (value) => {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return Math.abs(result);
};

const escapeXml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const wrap = (text, maxCharacters) => {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxCharacters && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) lines.push(current);
  return lines;
};

const textBlock = (lines, centerY, fontSize, lineHeight, fill, family) => {
  const start = centerY - ((lines.length - 1) * lineHeight) / 2;
  return lines
    .map(
      (line, index) =>
        `<text x="50%" y="${start + index * lineHeight}" text-anchor="middle" font-family="${family}" font-size="${fontSize}" fill="${fill}">${escapeXml(line)}</text>`,
    )
    .join("\n");
};

const serif = "Georgia, 'Times New Roman', serif";
const sans = "Manrope, Arial, Helvetica, sans-serif";

const background = (width, height, seed) => {
  const random = hash(seed);
  const glowX = 0.22 + ((random % 55) / 100);
  const glowY = 0.12 + (((random >> 4) % 32) / 100);
  const archWidth = 0.42 + (((random >> 8) % 8) / 100);

  const archLeft = width * (0.5 - archWidth / 2);
  const archRight = width * (0.5 + archWidth / 2);
  const archRadius = (archRight - archLeft) / 2;

  return `
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#1C1713"/>
        <stop offset="0.55" stop-color="#221C17"/>
        <stop offset="1" stop-color="${INK}"/>
      </linearGradient>
      <radialGradient id="glow" cx="${glowX}" cy="${glowY}" r="0.72">
        <stop offset="0" stop-color="${GOLD}" stop-opacity="0.3"/>
        <stop offset="0.5" stop-color="${GOLD}" stop-opacity="0.08"/>
        <stop offset="1" stop-color="${GOLD}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${GOLD}" stop-opacity="0"/>
        <stop offset="0.5" stop-color="${GOLD}" stop-opacity="0.55"/>
        <stop offset="1" stop-color="${GOLD}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#bg)"/>
    <rect width="${width}" height="${height}" fill="url(#glow)"/>
    <path d="M ${archLeft} ${height * 0.92} V ${height * 0.46} a ${archRadius} ${archRadius} 0 0 1 ${archRadius * 2} 0 V ${height * 0.92}" fill="none" stroke="${GOLD}" stroke-opacity="0.26" stroke-width="1.4"/>
    <path d="M ${archLeft + archRadius * 0.16} ${height * 0.92} V ${height * 0.47} a ${archRadius * 0.84} ${archRadius * 0.84} 0 0 1 ${archRadius * 1.68} 0 V ${height * 0.92}" fill="none" stroke="${GOLD_SOFT}" stroke-opacity="0.14" stroke-width="1"/>
    <line x1="${width * 0.08}" y1="${height * 0.92}" x2="${width * 0.92}" y2="${height * 0.92}" stroke="url(#line)" stroke-width="1"/>
  `;
};

const brandLine = (width, height) =>
  `<text x="50%" y="${height - 28}" text-anchor="middle" font-family="${sans}" font-size="10" letter-spacing="5" fill="${MUTED}">THE ORIGEN · LA HABANA</text>`;

const dishSvg = (dish, categoryName, index) => {
  const width = 800;
  const height = 600;
  const name = dish.name.es;
  const maxCharacters = name.length > 38 ? 24 : 27;
  const lines = wrap(name, maxCharacters).slice(0, 3);
  const longest = Math.max(...lines.map((line) => line.length));
  const fontSize = Math.max(28, Math.min(44, Math.round(640 / (longest * 0.54))));
  const seed = dish.id;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      ${background(width, height, seed)}
      <ellipse cx="${width / 2}" cy="${height * 0.55}" rx="${width * 0.27}" ry="${height * 0.17}" fill="${CREAM}" opacity="0.025"/>
      <ellipse cx="${width / 2}" cy="${height * 0.55}" rx="${width * 0.27}" ry="${height * 0.17}" fill="none" stroke="${GOLD}" stroke-opacity="0.16"/>
      <text x="50%" y="86" text-anchor="middle" font-family="${sans}" font-size="12" letter-spacing="5" fill="${GOLD}">${escapeXml(categoryName.toUpperCase())}</text>
      <text x="50%" y="120" text-anchor="middle" font-family="${sans}" font-size="10" letter-spacing="3" fill="${MUTED}">N° ${String(index + 1).padStart(3, "0")}</text>
      ${textBlock(lines, height * 0.52, fontSize, fontSize * 1.2, CREAM, serif)}
      <path d="M ${width / 2 - 9} ${height * 0.8} l 9 9 l 9 -9 l -9 -9 z" fill="none" stroke="${GOLD}" stroke-opacity="0.6"/>
      ${brandLine(width, height)}
    </svg>
  `;
};

const featureSvg = ({ label, lines, subtitle, seed, width = 1400, height = 1050 }) => `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    ${background(width, height, seed)}
    <ellipse cx="${width / 2}" cy="${height * 0.54}" rx="${width * 0.3}" ry="${height * 0.18}" fill="${CREAM}" opacity="0.028"/>
    <ellipse cx="${width / 2}" cy="${height * 0.54}" rx="${width * 0.3}" ry="${height * 0.18}" fill="none" stroke="${GOLD}" stroke-opacity="0.18"/>
    <text x="50%" y="${height * 0.18}" text-anchor="middle" font-family="${sans}" font-size="14" letter-spacing="6" fill="${GOLD}">${escapeXml(label)}</text>
    ${textBlock(lines, height * 0.5, Math.round(width * 0.045), Math.round(width * 0.055), CREAM, serif)}
    <text x="50%" y="${height * 0.68}" text-anchor="middle" font-family="${sans}" font-size="13" letter-spacing="4" fill="${MUTED}">${escapeXml(subtitle)}</text>
    <path d="M ${width / 2 - 10} ${height * 0.77} l 10 10 l 10 -10 l -10 -10 z" fill="none" stroke="${GOLD}" stroke-opacity="0.6"/>
    ${brandLine(width, height)}
  </svg>
`;

const gallerySvg = ({ number, seed, width, height }) => `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    ${background(width, height, seed)}
    <text x="50%" y="${height * 0.55}" text-anchor="middle" font-family="${serif}" font-size="${Math.round(width * 0.24)}" fill="${CREAM}" opacity="0.12">${number}</text>
    <text x="50%" y="${height * 0.72}" text-anchor="middle" font-family="${sans}" font-size="12" letter-spacing="6" fill="${GOLD}">THE ORIGEN</text>
    <text x="50%" y="${height * 0.77}" text-anchor="middle" font-family="${sans}" font-size="10" letter-spacing="4" fill="${MUTED}">LA HABANA · ESTD 2025</text>
    <path d="M ${width / 2 - 8} ${height * 0.85} l 8 8 l 8 -8 l -8 -8 z" fill="none" stroke="${GOLD}" stroke-opacity="0.6"/>
  </svg>
`;

const ogSvg = (locale) => {
  const width = 1200;
  const height = 630;
  const isSpanish = locale === "es";
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      ${background(width, height, `og-${locale}`)}
      <text x="80" y="232" font-family="${serif}" font-size="96" fill="${CREAM}">The Origen</text>
      <text x="82" y="292" font-family="${sans}" font-size="16" letter-spacing="6" fill="${GOLD}">${isSpanish ? "COCINA CUBANA DE AUTOR" : "CUBAN FINE DINING"}</text>
      <text x="82" y="340" font-family="${sans}" font-size="15" letter-spacing="2" fill="${MUTED}">${isSpanish ? "Vedado · La Habana" : "Vedado · Havana"}</text>
      <line x1="82" y1="392" x2="470" y2="392" stroke="url(#line)"/>
      <text x="82" y="446" font-family="${sans}" font-size="16" fill="${CREAM}" opacity="0.86">${isSpanish ? "Reservas por WhatsApp" : "Book on WhatsApp"}</text>
      <text x="82" y="476" font-family="${sans}" font-size="14" fill="${MUTED}">${isSpanish ? "Te confirmamos hoy" : "Confirmed the same day"}</text>
      <g transform="translate(920 315)">
        <path d="M -120 150 V -10 a 120 120 0 0 1 240 0 V 150" fill="none" stroke="${GOLD}" stroke-opacity="0.45" stroke-width="1.6"/>
        <path d="M -92 150 V -2 a 92 92 0 0 1 184 0 V 150" fill="none" stroke="${GOLD_SOFT}" stroke-opacity="0.22" stroke-width="1"/>
        <text x="0" y="90" text-anchor="middle" font-family="${serif}" font-size="96" fill="${GOLD}">O</text>
      </g>
      <text x="1120" y="570" text-anchor="end" font-family="${sans}" font-size="11" letter-spacing="4" fill="${MUTED}">THE ORIGEN · LA HABANA</text>
    </svg>
  `;
};

const appleIconSvg = () => `
  <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
    <rect width="180" height="180" rx="40" fill="${INK}"/>
    <path d="M 36 150 V 82 a 54 54 0 0 1 108 0 V 150" fill="none" stroke="${GOLD}" stroke-width="4" opacity="0.75"/>
    <path d="M 56 150 V 86 a 34 34 0 0 1 68 0 V 150" fill="none" stroke="${GOLD_SOFT}" stroke-width="2" opacity="0.45"/>
    <text x="90" y="128" text-anchor="middle" font-family="${serif}" font-size="70" fill="${CREAM}">O</text>
  </svg>
`;

const writeAsset = async (svg, relativePath, format = "webp", quality = 80) => {
  const output = path.join(PUBLIC_DIR, relativePath);
  await mkdir(path.dirname(output), { recursive: true });
  const pipeline = sharp(Buffer.from(svg));
  if (format === "jpeg") {
    await pipeline.jpeg({ quality, mozjpeg: true }).toFile(output);
  } else {
    await pipeline.webp({ quality, effort: 4 }).toFile(output);
  }
  return output;
};

const main = async () => {
  const menu = await readMenu();
  const dishes = menu.categories.flatMap((category) =>
    category.sections.flatMap((section) =>
      section.dishes
        .filter((dish) => typeof dish.image === "string")
        .map((dish) => ({ dish, categoryName: category.name.es })),
    ),
  );

  console.log(`Generating ${dishes.length} dish placeholders…`);
  for (const [index, entry] of dishes.entries()) {
    const svg = dishSvg(entry.dish, entry.categoryName, index);
    await writeAsset(svg, entry.dish.image.replace(/^\//, ""), "webp", 78);
  }

  const signature = dishes.find((entry) => entry.dish.id === "el-consentido-origen");
  const signatureName = signature ? signature.dish.name.es : "El Consentido Origen";
  const signatureLines = wrap(signatureName, 22);

  await writeAsset(
    featureSvg({
      label: "PLATO INSIGNIA",
      lines: signatureLines,
      subtitle: "THE ORIGEN · LA HABANA",
      seed: "hero-signature",
      width: 1400,
      height: 1050,
    }),
    "images/hero-signature.webp",
    "webp",
    82,
  );

  await writeAsset(
    featureSvg({
      label: "LA CASA",
      lines: ["The Origen", "Vedado · La Habana"],
      subtitle: "COCINA CUBANA DE AUTOR · ESTD 2025",
      seed: "story-room",
      width: 1200,
      height: 900,
    }),
    "images/story-room.webp",
    "webp",
    82,
  );

  const gallery = [
    { number: "01", width: 1200, height: 900 },
    { number: "02", width: 900, height: 1200 },
    { number: "03", width: 1200, height: 900 },
    { number: "04", width: 900, height: 1200 },
    { number: "05", width: 1200, height: 900 },
    { number: "06", width: 1200, height: 900 },
    { number: "07", width: 900, height: 1200 },
    { number: "08", width: 1200, height: 900 },
    { number: "09", width: 900, height: 1200 },
  ];

  for (const [index, item] of gallery.entries()) {
    await writeAsset(
      gallerySvg({ number: item.number, seed: `gallery-${item.number}`, width: item.width, height: item.height }),
      `images/gallery-${String(index + 1).padStart(2, "0")}.webp`,
      "webp",
      78,
    );
  }

  await writeAsset(ogSvg("es"), "og/es.jpg", "jpeg", 84);
  await writeAsset(ogSvg("en"), "og/en.jpg", "jpeg", 84);

  const appleOutput = path.join(APP_DIR, "apple-icon.png");
  await sharp(Buffer.from(appleIconSvg())).png().toFile(appleOutput);

  console.log("Assets ready.");
};

await main();
