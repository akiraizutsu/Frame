import nunjucks from 'nunjucks';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_DIR = path.resolve(__dirname, '..', '..', 'src', 'templates');

let env: nunjucks.Environment | null = null;

function getEnv(): nunjucks.Environment {
  if (!env) {
    env = new nunjucks.Environment(
      new nunjucks.FileSystemLoader(TEMPLATE_DIR, { noCache: true }),
      { autoescape: true, trimBlocks: true, lstripBlocks: true }
    );
  }
  return env;
}

export function renderTemplate(templateName: string, context: Record<string, unknown>): string {
  return getEnv().render(templateName, context);
}

export function writeOutput(outputDir: string, filename: string, content: string): void {
  fs.mkdirSync(outputDir, { recursive: true });
  const filepath = path.join(outputDir, filename);
  fs.writeFileSync(filepath, content, 'utf-8');
}

export function copyAssets(outputDir: string): void {
  const assetsSource = path.resolve(__dirname, '..', '..', 'assets');
  const assetsDest = path.join(outputDir, 'assets');
  fs.mkdirSync(assetsDest, { recursive: true });

  if (fs.existsSync(assetsSource)) {
    for (const file of fs.readdirSync(assetsSource)) {
      fs.copyFileSync(path.join(assetsSource, file), path.join(assetsDest, file));
    }
  }
}
