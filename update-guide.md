# DOLAX 公式サイト 更新マニュアル

> 対象：広報担当者（コーディング知識不要）  
> 最終更新：2026年6月

---

## 目次

1. [サイト更新の全体像](#1-サイト更新の全体像)
2. [年度・スローガン・チーム目標を変更する](#2-年度スローガンチーム目標を変更する)
3. [トップページの数字を変更する](#3-トップページの数字を変更する)
4. [ブログ・ニュース記事を追加する](#4-ブログニュース記事を追加する)
5. [試合日程・試合結果を更新する](#5-試合日程試合結果を更新する)
6. [ロスター（選手名簿）を更新する](#6-ロスター選手名簿を更新する)
7. [選手写真を登録する](#7-選手写真を登録する)
8. [部長・監督のご挨拶を更新する](#8-部長監督のご挨拶を更新する)
9. [スポンサー情報を変更する](#9-スポンサー情報を変更する)
10. [SNSリンク・問い合わせ先を変更する](#10-snsリンク問い合わせ先を変更する)
11. [ローカルでの確認方法](#11-ローカルでの確認方法)
12. [Netlify / CMS管理画面を使う方法（推奨）](#12-netlify--cms管理画面を使う方法推奨)
13. [トラブルシューティング](#13-トラブルシューティング)

---

## 1. サイト更新の全体像

このサイトはすべてのコンテンツデータを `data/` フォルダ内の JSON ファイルで管理しています。

| 更新したい内容 | 編集するファイル |
|---|---|
| シーズン年度・スローガン・チーム目標 | `data/season.json` |
| トップページの数字（チーム情報・スポンサー数値） | `data/stats.json` |
| ブログ記事・ニュース | `data/blog.json` |
| 試合日程・試合結果 | `data/schedule.json` |
| 選手・スタッフ名簿 | `data/players.json` |
| 部長・監督のご挨拶 | `data/staff.json` |
| スポンサー企業情報 | `data/sponsors.json` |
| SNS・メール・住所などサイト共通情報 | `data/site.json` |
| 選手写真・記事画像 | `assets/uploads/` に保存 |

**編集したファイルを GitHub にプッシュすると自動的にサイトが更新されます。**

---

## 2. 年度・スローガン・チーム目標を変更する

### ファイル：`data/season.json`

シーズンが変わったら、このファイルを更新するだけでサイト全体（トップ・About・Roster・Sponsorsページ）に反映されます。

```json
{
  "year":       "2027",
  "slogan":     "RISE",
  "sloganSub":  "— 立ち上がれ。",
  "sloganBody": [
    "スローガン説明の1段落目。",
    "スローガン説明の2段落目。"
  ],
  "goals": ["関西制覇", "POL 獲得"],
  "indexAboutP": "DOLAXは関西制覇とPOL獲得を掲げ、新たな歴史へ挑む。"
}
```

| フィールド | 説明 |
|---|---|
| `year` | シーズン年（例: `"2027"`） |
| `slogan` | チームスローガン（英語・大文字推奨） |
| `sloganSub` | スローガンの和訳・補足（Aboutページに表示） |
| `sloganBody` | Aboutページのスローガン説明文（段落ごとに配列） |
| `goals` | 今季目標（配列。複数OK） |
| `indexAboutP` | トップページAboutセクションの1文 |

**反映先：** トップページのヒーロータグ・シーズンカード / Aboutページのスローガン全体・目標 / Rosterページのタイトル

---

## 3. トップページの数字を変更する

### ファイル：`data/stats.json`

#### チーム情報バー（4つの数字）

```json
"teamStats": [
  { "value": "1部",  "suffix": "",      "label": "関西リーグ所属", "countUp": false },
  { "value": "135",  "suffix": "+",     "label": "部員数",         "countUp": true  },
  { "value": "7",    "suffix": "回",    "label": "関西準優勝",     "countUp": true  },
  { "value": "POL",  "suffix": " 獲得", "label": "今季目標",       "countUp": false }
]
```

- `value`：表示する数値またはテキスト
- `suffix`：数値の後ろに付ける文字（`+`、`回`、`社` など）
- `countUp`：カウントアップアニメーションするか（数字なら `true`、テキストなら `false`）

#### スポンサーセクション数字（4カラム）

```json
"partnerStats": [
  { "prefix": "",   "value": "20",    "suffix": "+",  "label": "年間試合数",     "en": "ANNUAL GAMES"    },
  { "prefix": "約", "value": "1,800", "suffix": "人", "label": "年間来場者数",   "en": "ANNUAL VISITORS" },
  { "prefix": "",   "value": "3,700", "suffix": "+",  "label": "SNSフォロワー",  "en": "FOLLOWERS"       },
  { "prefix": "",   "value": "5",     "suffix": "社", "label": "スポンサー企業", "en": "PARTNERS"        }
]
```

#### スポンサーページの実績数字（3カラム）

```json
"sponsorPageStats": [
  { "value": "20",   "suffix": "+",  "label": "年間試合数",   "en": "ANNUAL GAMES",    "countUp": true },
  { "value": "2000", "suffix": "+",  "label": "年間来場者数", "en": "ANNUAL VISITORS", "countUp": true, "separator": true },
  { "value": "5",    "suffix": "社", "label": "スポンサー企業","en": "PARTNERS",        "countUp": true }
]
```

---

## 4. ブログ・ニュース記事を追加する

### ファイル：`data/blog.json`

記事は `posts` 配列の **先頭** に追加します（新しい順に表示されるため）。

```json
{
  "posts": [
    {
      "slug":      "pre-league-yamamoto",
      "date":      "2026.07.01",
      "category":  "BLOG",
      "title":     "リーグ戦前 決起ブログ — #8 山本 翔大",
      "author":    "山本 翔大",
      "authorEn":  "YAMAMOTO SHOTA",
      "number":    "#8",
      "role":      "Defense",
      "grade":     "4回生",
      "school":    "○○高等学校",
      "excerpt":   "リーグ戦への想いを書きました。",
      "thumbnail": "assets/uploads/blog-yamamoto.jpg",
      "body": [
        "段落1のテキスト。",
        "段落2のテキスト。",
        "段落3のテキスト。"
      ]
    },
    ...既存の記事...
  ]
}
```

### フィールド説明

| フィールド | 必須 | 説明 |
|---|---|---|
| `slug` | ○ | URL に使う ID。**半角英数字とハイフンのみ**。他の記事と重複しないこと |
| `date` | ○ | `YYYY.MM.DD` 形式 |
| `category` | ○ | `BLOG` / `NEWS` / `REPORT` / `GAME` のいずれか |
| `title` | ○ | 記事タイトル |
| `author` | △ | 著者氏名（ブログ以外は空でも可） |
| `authorEn` | △ | 著者氏名ローマ字 |
| `number` | △ | 背番号（例: `#8`） |
| `role` | △ | ポジション |
| `grade` | △ | 学年（例: `4回生`） |
| `school` | △ | 出身校 |
| `excerpt` | ○ | 一覧・TOPに表示する要約文（100〜150文字程度） |
| `thumbnail` | △ | サムネイル画像パス。空でも可 |
| `body` | ○ | 本文を段落ごとの文字列の配列で記述 |

### 注意点

- `slug` は一度公開したら変更しないこと（URLが変わり、外部リンクが切れる）
- `blog-data.js`（`assets/js/` 内）も同じ内容に手動同期が必要（`file://` ローカル確認用）

---

## 5. 試合日程・試合結果を更新する

### ファイル：`data/schedule.json`

#### 試合予定を追加する

```json
{
  "id": "2026-a-osaka-u",
  "year": "2026",
  "team": "a",
  "type": "scheduled",
  "date": "2026.7.18",
  "dayOfWeek": "Sat",
  "time": "14:30 FO",
  "venue": "宝ヶ池球技場",
  "tournament": "",
  "opponent": "大阪大学",
  "homeScore": null,
  "awayScore": null,
  "result": "",
  "instagramUrl": ""
}
```

#### 試合結果に更新する

`type` を `"result"` に変更し、スコアと結果を追記します：

```json
{
  "id": "2026-a-osaka-u",
  "year": "2026",
  "team": "a",
  "type": "result",
  "date": "2026.7.18",
  "dayOfWeek": "Sat",
  "time": "",
  "venue": "宝ヶ池球技場",
  "tournament": "",
  "opponent": "大阪大学",
  "homeScore": 8,
  "awayScore": 4,
  "result": "win",
  "instagramUrl": "https://www.instagram.com/p/XXXXX/"
}
```

### フィールド説明

| フィールド | 説明 |
|---|---|
| `id` | 一意なID（他と重複不可） |
| `year` | シーズン年（例: `"2026"`） |
| `team` | `"a"` / `"b"` / `"c"` |
| `type` | `"scheduled"`（予定）または `"result"`（結果） |
| `date` | `YYYY.M.D` 形式 |
| `dayOfWeek` | `Mon`〜`Sun` |
| `time` | 試合開始時刻（例: `"14:30 FO"`）。未定の場合は `""` |
| `venue` | 会場名。未定の場合は `""` |
| `tournament` | 大会名。なければ `""` |
| `opponent` | 対戦相手 |
| `homeScore` | 自チームの得点。予定時は `null` |
| `awayScore` | 相手チームの得点。予定時は `null` |
| `result` | `"win"` / `"lose"` / `"draw"` / `""` |
| `instagramUrl` | Instagram投稿URL。なければ `""` |

### 新シーズンの切り替え方法

1. `data/schedule.json` の全試合を新シーズンのデータに差し替える
2. `schedule.html` の `currentYear` 変数と年度タブを更新する（`YEARLY UPDATE:` コメントを検索）

---

## 6. ロスター（選手名簿）を更新する

### ファイル：`data/players.json`

#### 選手を追加する

```json
{
  "name": "新入生 太郎",
  "number": "100",
  "grade": 1,
  "section": "player",
  "role": "",
  "photo": ""
}
```

#### スタッフを追加する

```json
{
  "name": "田中 花子",
  "number": null,
  "grade": 2,
  "section": "staff",
  "staffRole": "MG",
  "photo": ""
}
```

### フィールド説明

| フィールド | 説明 |
|---|---|
| `name` | 氏名（スペースは任意） |
| `number` | 背番号の数字のみ。1回生・スタッフは `null` |
| `grade` | 学年（`1` / `2` / `3` / `4`） |
| `section` | `"player"` / `"staff"` / `"coach"` |
| `staffRole` | スタッフ・コーチのみ: `"C"` / `"AS"` / `"MG"` / `"TR"` / `"HC"` / `"AC"` |
| `role` | 選手の役割バッジ（例: `"DF LEADER"`）。通常は `""` |
| `photo` | 写真ファイルパス（例: `"assets/uploads/player-yamamoto.jpg"`）。未登録なら `""` |

### 年度更新時の手順

1. 卒業する4回生のエントリーを削除
2. 残る3・2・1回生の `grade` を +1 する
3. 新1回生を追加する
4. スタッフ・役職バッジも更新する

---

## 7. 選手写真を登録する

1. 写真を `assets/uploads/` フォルダに保存する
   - ファイル名：`player-XXXX.jpg`（例: `player-yamamoto.jpg`）
   - 推奨サイズ：縦長（3:4）、800px × 1067px 程度
   - ファイルサイズ：1MB 以下推奨

2. `data/players.json` の該当選手の `photo` フィールドを更新する：
   ```json
   "photo": "assets/uploads/player-yamamoto.jpg"
   ```

3. GitHub にコミット・プッシュする

---

## 8. 部長・監督のご挨拶を更新する

### ファイル：`data/staff.json`

役職者が変わったとき、または挨拶文を更新するときに編集します。

```json
{
  "messages": [
    {
      "role":     "部長",
      "roleEn":   "DIRECTOR",
      "nameJa":   "氏名 漢字",
      "nameEn":   "NAMAE TARO",
      "photo":    "assets/images/director-xxx.jpg",
      "monogram": "N.T.",
      "body": [
        "ご挨拶の1段落目。",
        "ご挨拶の2段落目。",
        "ご挨拶の3段落目。"
      ]
    },
    {
      "role":     "監督",
      "roleEn":   "HEAD COACH",
      "nameJa":   "氏名 漢字",
      "nameEn":   "NAMAE TARO",
      "photo":    "assets/images/coach-xxx.jpg",
      "monogram": "N.T.",
      "body": [
        "ご挨拶の1段落目。",
        "ご挨拶の2段落目。"
      ]
    }
  ]
}
```

| フィールド | 説明 |
|---|---|
| `role` | 役職名（表示用、日本語） |
| `roleEn` | 役職名（英語） |
| `nameJa` | 氏名（漢字） |
| `nameEn` | 氏名（ローマ字・大文字） |
| `photo` | 顔写真のパス。なければ `""` → イニシャル（`monogram`）が代わりに表示される |
| `monogram` | 写真がない場合に表示するイニシャル（例: `"Y.K."`） |
| `body` | 挨拶文（段落ごとに配列） |

顧問・コーチを追加する場合は、同じ形式のオブジェクトを `messages` 配列に追加してください。

---

## 9. スポンサー情報を変更する

### ファイル：`data/sponsors.json`

掲載許可が取れた企業から追加してください。

```json
{
  "sponsors": [
    {
      "name":    "株式会社サンプル",
      "logo":    "assets/images/sponsors/sample.png",
      "url":     "https://example.com",
      "tier":    "gold",
      "comment": "DOLAXを応援しています。"
    }
  ]
}
```

| フィールド | 説明 |
|---|---|
| `name` | 企業名 |
| `logo` | ロゴ画像のパス（`assets/images/sponsors/` フォルダに保存） |
| `url` | 企業サイトURL |
| `tier` | スポンサーランク（`"gold"` / `"silver"` / `"bronze"` / `"support"`） |
| `comment` | 掲載メッセージ（任意） |

**スポンサーページの数字**（年間試合数・来場者数・スポンサー社数）は `data/stats.json` の `sponsorPageStats` で管理しています（[セクション3](#3-トップページの数字を変更する) を参照）。

---

## 10. SNSリンク・問い合わせ先を変更する

### ファイル：`data/site.json`

```json
{
  "name":         "DOLAX",
  "nameJa":       "同志社大学体育会男子ラクロス部",
  "tagline":      "組織を愛し、社会から愛されるチームへ。",
  "season":       "2027",
  "email":        "新しいアドレス@example.com",
  "instagram":    "https://www.instagram.com/新しいアカウント/",
  "youtube":      "https://www.youtube.com/@新しいチャンネル",
  "address":      "〒000-0000 住所",
  "addressSub":   "同志社大学 京田辺キャンパス",
  "copyrightYear":"2027"
}
```

**反映される箇所：**
- フッターのInstagram・YouTubeリンク
- フッター・Contactページの問い合わせメールアドレス
- スポンサーページの「協賛について相談する」ボタン
- フッターの著作権年表示

**年度が変わったら** `season` と `copyrightYear` も合わせて更新してください。

---

## 11. ローカルでの確認方法

JSON ファイルはサーバーがないと読み込めないため、ダブルクリックで直接 HTML を開いても動きません。

### ターミナルで簡易サーバーを起動する方法

```bash
# プロジェクトフォルダに移動
cd /Users/apple/Desktop/dolax.website

# Node.js がある場合
npx serve .

# Python がある場合
python3 -m http.server 8000
```

起動後、ブラウザで `http://localhost:8000`（または表示されるURL）を開く。

> **Note:** ブログ（blog.html, news.html, index.html）のみ、`file://` でも動作します（blog-data.js フォールバックを使用）。

---

## 12. Netlify / CMS管理画面を使う方法（推奨）

Netlify にデプロイ済みであれば、コードを書かずに管理画面から更新できます。

### 初回セットアップ

1. GitHub にリポジトリを作成し、このフォルダ全体をプッシュ
2. [Netlify](https://netlify.com) でサイトを作成し、GitHub リポジトリを連携
3. `admin/config.yml` の `repo:` を自分のリポジトリ名に変更：
   ```yaml
   backend:
     name: github
     repo: YOUR_USERNAME/YOUR_REPO_NAME
   ```
4. Netlify サイト設定 → Identity → Enable Identity
5. Identity → Registration → Invite only に設定（セキュリティのため）
6. 広報メンバーを招待

### 管理画面の使い方

1. `https://あなたのサイトURL/admin/` にアクセス
2. Netlify Identity でログイン
3. 編集したいコレクション（ブログ / 試合 / ロスター）を選択
4. 編集して「Save」→「Publish」をクリック
5. GitHub に自動コミットされ、Netlify が自動デプロイ

---

## 13. トラブルシューティング

### ロスターや試合が表示されない

- ローカルで直接 HTML を開いていないか確認（`file://` では JSON が読めない）
- `npx serve` で起動して `http://localhost:3000` で開く
- ブラウザの開発者ツール（F12）→ Console タブでエラーを確認

### JSON ファイルの書き方が間違っていると表示が崩れる

- [jsonlint.com](https://jsonlint.com) でJSON形式を検証できる
- よくあるミス：末尾のカンマ、引用符の閉じ忘れ、日本語の全角コロン

### 画像が表示されない

- ファイル名は英数字とハイフン・アンダースコアのみ使用する
- 大文字・小文字を正確に合わせる（`Player.jpg` と `player.jpg` は別ファイル）
- `assets/uploads/` フォルダに正しく保存されているか確認

### 新しいブログ記事がTOPページに表示されない

- `data/blog.json` の `posts` 配列の**先頭**に追加しているか確認
- `slug` が他の記事と重複していないか確認
