# BrandFrame — Brand Strategy Document Generator

ブランド戦略の入力情報から、構造あるブランド文書を生成するCLIツールです。

## 目的

- ブランド戦略入力 → 構造化されたHTML文書を自動生成
- クリエイティブの属人化を減らしつつ、ブランドごとの違いを残す
- 「雰囲気だけのブランディング資料」ではなく、「判断材料として使えるブランド文書」を作る

## 生成される成果物

| ファイル | 内容 |
|---------|------|
| `dist/brand-story.html` | ブランドの存在理由・主張・制約・リスク・透明性を構造的に記述した文書 |
| `dist/brand-guidelines.html` | 人格・言葉・造形原理・情報の見せ方を定義したガイドライン文書 |
| `dist/assets/style.css` | 共通スタイルシート |

## 想定ユースケース

- 新規ブランド立ち上げ時の戦略文書整理
- 既存ブランドのリブランディング時の言語化
- チーム間でブランド方針を共有するための基盤資料作成
- ブランドコンサルティングの成果物フォーマットとして

## クイックスタート

```bash
# 依存インストール
npm install

# サンプルデータで生成
npm run build

# 特定の入力ファイルを指定して生成
npm run build -- --input=./my-brand.json

# 出力先を変更
npm run build -- --input=./my-brand.json --output=./output
```

## 入力データの書き方

JSON または YAML で記述します。以下は必須・推奨項目の一覧です。

### 必須項目

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `brand_name` | string | ブランド名（唯一の必須項目） |

### 推奨項目

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `category` | string | 業種・カテゴリ |
| `audience` | string | 対象者の定義 |
| `audience_before_state` | string | 対象者の現在の状態 |
| `audience_after_state` | string | ブランドが実現する到達点 |
| `purpose_block` | string | ブランドの存在理由 |
| `claims[]` | array | 主張の配列（後述） |
| `personality` | string | ブランドの人格特性 |
| `tone_of_voice` | string | 言葉の温度・距離感 |
| `verbal_rules[]` | string[] | メッセージングルール |
| `typography_rationale` | string | 書体選定の理由 |
| `color_rationale` | string | 色彩設計の理由 |
| `transparency_commitments[]` | string[] | 透明性のコミットメント |
| `disclosure_items[]` | string[] | 開示事項 |
| `cta` | string | 行動提案 |

### 追加項目

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `site_structure[]` | string[] | サイト構成 |
| `brand_keywords[]` | string[] | ブランドキーワード |
| `visual_keywords[]` | string[] | ビジュアルキーワード |
| `logo_direction_candidates[]` | string[] | ロゴ方向性の候補 |
| `logo_donts[]` | string[] | ロゴ禁止事項 |
| `optional_case_examples[]` | string[] | 事例 |
| `optional_references[]` | string[] | 参考文献 |

### claims の構造

```json
{
  "title": "主張のタイトル",
  "claim": "主張の内容",
  "proof_type": "FACT",
  "evidence": "根拠・出典",
  "comparison_resistance": "比較に対する耐性"
}
```

## proof_type の説明

主張を構造化するためのラベルです。自動推定は行いません。

| ラベル | 意味 | 使いどころ |
|--------|------|-----------|
| `FACT` | 検証可能な事実 | 数値・データ・測定結果に基づく主張 |
| `CONSTRAINT` | 意図的な制約 | やらないこと・やめたこと・構造的に排除していること |
| `TRADE_OFF` | トレードオフ | 得るものと引き換えに失うもの・限界 |
| `TIME_AXIS` | 時間軸 | 過去→現在→未来の変化・ロードマップ |
| `TESTIMONY` | 証言 | ユーザーの声・第三者の評価 |

## ディレクトリ構成

```
/
├── README.md
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts              # CLI エントリーポイント
│   ├── lib/
│   │   ├── types.ts           # 型定義
│   │   ├── normalizeInput.ts  # 入力の正規化・欠損検出
│   │   ├── buildStoryModel.ts # ストーリー文書のビューモデル構築
│   │   ├── buildGuidelineModel.ts # ガイドライン文書のビューモデル構築
│   │   └── render.ts          # テンプレートレンダリング
│   └── templates/
│       ├── brand-story.njk    # ブランドストーリーテンプレート
│       └── brand-guidelines.njk # ガイドラインテンプレート
├── assets/
│   └── style.css              # 共通CSS
├── example-data/
│   └── sample-brand.json      # サンプル入力データ
└── dist/                      # 生成出力先
```

## GitHub Pages で公開する手順

1. リポジトリの Settings → Pages を開く
2. Source を「Deploy from a branch」に設定
3. Branch を `main`、フォルダを `/dist` に設定
4. `npm run build` を実行して `dist/` を生成・コミット
5. push すると GitHub Pages でホスティングされる

## 他ブランドへ転用する方法

1. `example-data/sample-brand.json` をコピーして編集する
2. `brand_name` と各項目を自社ブランドの内容に書き換える
3. `npm run build -- --input=./my-brand.json` を実行する
4. `dist/` 内のHTMLを確認し、必要に応じて入力データを調整する

テンプレートはブランド固有の内容を持たないため、入力データを変えるだけで異なるブランドの文書が生成されます。

## 設計思想

### システムが担うこと

- 入力データの正規化と欠損検出
- proof_type に基づく主張の分類・構造化表示
- 一貫したデザインシステムでの文書レンダリング
- 章ごとの目的の明示

### 人間が担うこと

- 主張の内容と品質
- proof_type の正しい付与
- 欠損を埋めるかどうかの判断
- ブランドの戦略的判断

### テンプレートの方針

- 主張・証明・制約・比較・リスク・CTA を混同しない
- CTAは「お願い」ではなく、論理的帰結としての行動提案
- 競合比較は誹謗ではなく、構造差として示す
- リスクやトレードオフを隠さない
- 「雰囲気が良い」ではなく「判断しやすい」ことを目指す

## 制約事項

- **これはブランド戦略入力から文書を生成するツール**であり、事実調査ツールではありません。入力データの正確性は利用者の責任です。
- **ロゴ画像の自動生成は行いません。** ロゴの方向性・概念・禁止事項のテキスト記述のみを扱います。
- **法務・医療・移民・金融等の分野**では、生成された文書の正確性を別途専門家が検証する必要があります。
- proof_type の自動推定は行いません。欠損は欠損として表示されます。
- 最低限 `brand_name` のみで動作しますが、高品質な出力には全項目の入力が推奨されます。

## 今後の拡張余地

- PDF出力対応（Puppeteer / Playwright）
- YAML入力のバリデーション強化
- ダークモードトグルボタンの組み込み
- i18n対応（英語テンプレートの追加）
- ブランドカラー（hue値）の入力対応
- インタラクティブなWebフォームからの入力
- CI/CDパイプラインでの自動生成

## ライセンス

MIT
