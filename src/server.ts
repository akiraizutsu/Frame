import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeInput } from './lib/normalizeInput.js';
import { buildStoryModel } from './lib/buildStoryModel.js';
import { buildGuidelineModel } from './lib/buildGuidelineModel.js';
import { renderTemplate, writeOutput, copyAssets } from './lib/render.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const PORT = parseInt(process.env.PORT || '3456', 10);

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function serveStaticFile(res: http.ServerResponse, filePath: string): void {
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const content = fs.readFileSync(filePath);
  res.writeHead(200, { 'Content-Type': contentType });
  res.end(content);
}

function handleGenerate(req: http.IncomingMessage, res: http.ServerResponse): void {
  let body = '';
  req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
  req.on('end', () => {
    try {
      const rawInput = JSON.parse(body);
      const { data, warnings } = normalizeInput(rawInput);

      const outputDir = path.join(PROJECT_ROOT, 'dist');

      const storyModel = buildStoryModel(data);
      const guidelineModel = buildGuidelineModel(data);

      const storyHtml = renderTemplate('brand-story.njk', { m: storyModel });
      const guidelineHtml = renderTemplate('brand-guidelines.njk', { m: guidelineModel });

      writeOutput(outputDir, 'brand-story.html', storyHtml);
      writeOutput(outputDir, 'brand-guidelines.html', guidelineHtml);
      copyAssets(outputDir);

      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify({
        success: true,
        warnings,
        files: [
          '/dist/brand-story.html',
          '/dist/brand-guidelines.html',
        ],
      }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: false,
        error: (err as Error).message,
      }));
    }
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  // API: generate
  if (req.method === 'POST' && pathname === '/api/generate') {
    handleGenerate(req, res);
    return;
  }

  // Wizard root
  if (pathname === '/' || pathname === '/wizard' || pathname === '/wizard/') {
    serveStaticFile(res, path.join(PROJECT_ROOT, 'wizard', 'index.html'));
    return;
  }

  // Serve wizard assets
  if (pathname.startsWith('/wizard/')) {
    serveStaticFile(res, path.join(PROJECT_ROOT, pathname.slice(1)));
    return;
  }

  // Serve dist files
  if (pathname.startsWith('/dist/')) {
    serveStaticFile(res, path.join(PROJECT_ROOT, pathname.slice(1)));
    return;
  }

  // Serve assets
  if (pathname.startsWith('/assets/')) {
    serveStaticFile(res, path.join(PROJECT_ROOT, 'dist', pathname.slice(1)));
    return;
  }

  // Fallback: try dist
  const distFile = path.join(PROJECT_ROOT, 'dist', pathname.slice(1));
  if (fs.existsSync(distFile)) {
    serveStaticFile(res, distFile);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`\n🚀 BrandFrame Wizard running at http://localhost:${PORT}\n`);
  console.log(`   Wizard:     http://localhost:${PORT}/`);
  console.log(`   Story:      http://localhost:${PORT}/dist/brand-story.html`);
  console.log(`   Guidelines: http://localhost:${PORT}/dist/brand-guidelines.html`);
  console.log('');
});
