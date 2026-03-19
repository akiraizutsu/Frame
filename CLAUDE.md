# Frame — Brand Strategy Builder

ブランド戦略の入力情報から、構造化されたブランドストーリーとガイドラインのHTML文書を生成するシステム。
LLMを使わず、構造化された入力 → 決定論的な変換 → 再現性のある出力を実現する。

## 2台Mac並行開発ルール

このプロジェクトは2台のMacで並行開発する（同時作業なし、コミット受け渡し方式）。

### 作業開始時

```bash
cd ~/projects/BrandFrame
git pull origin main
npm install          # package.json が更新されていた場合
npm run build:ts     # TypeScript をコンパイル
```

### 作業終了時

```bash
git add <変更ファイル>
git commit -m "変更内容の説明"
git push origin main
```

### 初回セットアップ（2台目）

ディレクトリ丸ごとHDDコピー（`.env`、`node_modules` 含む）。以降は `git pull / push` で同期。

### コミットルール

- `.env`、認証JSON、秘密鍵は**絶対にコミットしない**
- `dist/` はビルド生成物なのでコミットしない
- `dist-build/` はTSコンパイル出力なのでコミットしない
- `node_modules/` はコミットしない
- コミット前に `git status` で機密ファイルが含まれていないか確認する

## ディレクトリ構成

```
/
├── CLAUDE.md                  # このファイル（プロジェクト設計情報）
├── README.md                  # GitHub公開用README
├── package.json               # 依存管理・npm scripts
├── tsconfig.json              # TypeScript設定
├── .gitignore                 # Git除外設定
├── .claude/
│   └── launch.json            # Claude Code用サーバー起動設定
│
├── src/                       # TypeScriptソース
│   ├── index.ts               # CLI エントリーポイント（--input で生成）
│   ├── server.ts              # Webサーバー（ウィザード + API）
│   ├── lib/
│   │   ├── types.ts           # 全型定義（BrandInput, ThemeConfig, StoryModel, GuidelineModel）
│   │   ├── normalizeInput.ts  # 入力の正規化・欠損検出・警告生成
│   │   ├── resolveTheme.ts    # テーマ自動選定（8プロファイル × 正規表現マッチ）
│   │   ├── generateLogo.ts    # SVGロゴ候補生成（Monogram/Geometric/Wordmark）
│   │   ├── buildStoryModel.ts # 正規化入力 → ストーリー文書ビューモデル変換
│   │   ├── buildGuidelineModel.ts # 正規化入力 → ガイドライン文書ビューモデル変換
│   │   └── render.ts          # Nunjucksテンプレートレンダリング + ファイル出力
│   └── templates/
│       ├── brand-story.njk    # ブランドストーリーHTMLテンプレート
│       └── brand-guidelines.njk # ガイドラインHTMLテンプレート
│
├── wizard/
│   └── index.html             # 9ステップ入力ウィザード（フロントエンドのみ）
│
├── assets/
│   └── style.css              # 生成HTML用の共通CSS
│
├── example-data/
│   └── sample-brand.json      # サンプル入力データ（Soilworks）
│
├── dist/                      # 生成出力先（gitignore対象）
├── dist-build/                # TSコンパイル出力（gitignore対象）
└── node_modules/              # npm依存（gitignore対象）
```

## 環境セットアップ

### 必須

- Node.js >= 18
- npm

### インストール

```bash
npm install
```

### .env（現時点では不要）

このプロジェクトは外部API不要でローカル完結する。
将来LLM統合する場合に `.env` が必要になる可能性がある。

```
# .env（必要になった場合のテンプレート）
PORT=3456
```

## サーバー起動

```bash
# TypeScript コンパイル
npm run build:ts

# ウィザードサーバー起動
node dist-build/server.js
# → http://localhost:3456        ウィザード
# → http://localhost:3456/?test  テストデータ自動入力

# CLI生成（サーバー不要）
node dist-build/index.js --input=./example-data/sample-brand.json
```

## データパイプライン

```
入力JSON/YAML
  ↓
normalizeInput.ts   → 正規化 + 欠損警告
  ↓
resolveTheme.ts     → テーマ自動選定（フォント + カラー）
  ↓
buildStoryModel.ts  → ストーリー用ビューモデル
buildGuidelineModel.ts + generateLogo.ts → ガイドライン用ビューモデル + SVGロゴ
  ↓
render.ts + Nunjucks → HTML生成
  ↓
dist/brand-story.html
dist/brand-guidelines.html
dist/assets/style.css
```

### テーマ選定の仕組み（resolveTheme.ts）

入力テキスト（category + keywords + personality + tone）を結合し、8つのプロファイル（Tech, Creative, Education, Healthcare, Finance, Food, Nature, Community）の正規表現でスコアリング。最もマッチしたプロファイルのフォント・カラーを採用。同じ入力からは常に同じ結果。

## 新機能追加の手順

### テーマプロファイルを追加する場合

1. `src/lib/resolveTheme.ts` の `PROFILES` 配列に新しいプロファイルを追加
2. `signals` に正規表現、`fontHeading/fontBody/fontMono` にGoogle Fontsのフォント名を設定
3. `npm run build:ts` でコンパイル

### 入力フィールドを追加する場合

1. `src/lib/types.ts` の `BrandInput` に新フィールドを追加
2. `src/lib/normalizeInput.ts` で正規化処理を追加
3. 必要に応じて `StoryModel` または `GuidelineModel` にフィールドを追加
4. `buildStoryModel.ts` or `buildGuidelineModel.ts` でマッピングを追加
5. テンプレート（`.njk`）で表示ロジックを追加
6. `wizard/index.html` にウィザードステップの入力UIを追加

### テンプレートを修正する場合

1. `src/templates/*.njk` を編集
2. Nunjucks構文。変数は `{{ m.field_name }}`、条件分岐は `{% if m.field | length > 0 %}`
3. CSSは `assets/style.css` + Tailwind CDN
4. コンパイル不要（テンプレートは実行時に読み込まれる）

## テスト

```bash
# テストデータで動作確認
http://localhost:3456/?test
# → 全フィールドにEdTech（Classi）のデータが自動入力される
# → 「次へ」を9回押して「生成する」で動作確認
```

## コミット時の機密チェック

```bash
# コミット前に必ず確認
git status
git diff --cached --name-only | grep -E '\.(env|pem|key)$|credentials|service-account'
# ↑ 何も出力されなければOK
```
