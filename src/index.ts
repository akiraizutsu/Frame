import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { normalizeInput } from './lib/normalizeInput.js';
import { buildStoryModel } from './lib/buildStoryModel.js';
import { buildGuidelineModel } from './lib/buildGuidelineModel.js';
import { renderTemplate, writeOutput, copyAssets } from './lib/render.js';
import { resolveTheme } from './lib/resolveTheme.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

function parseArgs(): { inputPath: string; outputDir: string } {
  const args = process.argv.slice(2);
  let inputPath = '';
  let outputDir = path.join(PROJECT_ROOT, 'dist');

  for (const arg of args) {
    if (arg.startsWith('--input=')) {
      inputPath = arg.slice('--input='.length);
    } else if (arg.startsWith('--output=')) {
      outputDir = arg.slice('--output='.length);
    }
  }

  if (!inputPath) {
    inputPath = path.join(PROJECT_ROOT, 'example-data', 'sample-brand.json');
    console.log(`No --input specified. Using default: ${inputPath}`);
  }

  inputPath = path.resolve(inputPath);
  outputDir = path.resolve(outputDir);

  return { inputPath, outputDir };
}

function loadInput(filePath: string): unknown {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Input file not found: ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.json') {
    return JSON.parse(raw);
  } else if (ext === '.yml' || ext === '.yaml') {
    return yaml.load(raw);
  } else {
    throw new Error(`Unsupported file format: ${ext}. Use .json or .yml/.yaml`);
  }
}

function main(): void {
  const { inputPath, outputDir } = parseArgs();

  console.log(`\n📄 Input:  ${inputPath}`);
  console.log(`📁 Output: ${outputDir}\n`);

  const rawInput = loadInput(inputPath);
  const { data, warnings } = normalizeInput(rawInput);

  if (warnings.length > 0) {
    console.log(`⚠️  ${warnings.length} warning(s):`);
    for (const w of warnings) {
      console.log(`   - ${w.field}: ${w.message}`);
    }
    console.log('');
  }

  const theme = resolveTheme(
    data.category, data.brand_keywords, data.visual_keywords,
    data.personality, data.tone_of_voice,
  );
  console.log(`🎨 Theme: ${theme.hueName} (hue:${theme.hue}) — ${theme.fontHeading} + ${theme.fontBody}\n`);

  const storyModel = buildStoryModel(data, theme);
  const guidelineModel = buildGuidelineModel(data, theme);

  const storyHtml = renderTemplate('brand-story.njk', { m: storyModel });
  const guidelineHtml = renderTemplate('brand-guidelines.njk', { m: guidelineModel });

  writeOutput(outputDir, 'brand-story.html', storyHtml);
  writeOutput(outputDir, 'brand-guidelines.html', guidelineHtml);
  copyAssets(outputDir);

  console.log(`✅ Generated:`);
  console.log(`   - ${path.join(outputDir, 'brand-story.html')}`);
  console.log(`   - ${path.join(outputDir, 'brand-guidelines.html')}`);
  console.log(`   - ${path.join(outputDir, 'assets/')}`);
  console.log('');
}

main();
