# Next Boards

このリポジトリは、Next.js、Tailwind CSS、MongoDB、NextAuth.js を使った掲示板です。  
LINE でログインすることができ、ユーザー登録、ログイン、名前の変更ができます。  
スレッドを作成することができ、タグ付け、パブリックスレッド、プライベートスレッドがあります。  

## 機能

- ユーザー登録 ([LINEログイン](https://next-auth.js.org/providers/line))
- ログイン
- 名前の変更
- データベース ([MongoDB](https://cloud.mongodb.com))
  - スレッド作成
    - タグ付け
    - パブリックスレッド
    - プライベートスレッド
  - スレッド一覧
  - レス送信

## デモ

| ホーム画面 | 設定画面 |
| -------- | ------- |
| <img src="./images/homeScreen.png" width="200" /> | <img src="./images/settingScreen.jpg" width="200" /> |

| スレッド作成画面 | スレッド |
| ------------- | ------- |
| <img src="./images/createThreadScreen.jpg" width="200" /> | <img src="./images/threadScreen.jpg" width="200" /> |

## セットアップ手順

### Vercelにデプロイ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/HRTK92/next-boards&project-name=next-boards&repository-name=next-boards&demo-title=next-boards&demo-description=Next.jsで作られた掲示板&demo-url=https://precedent.dev&env=DATABASE_URL,SECRET,LINE_CLIENT_ID,LINE_CLIENT_SECRET,NEXTAUTH_URL,NEXT_PUBLIC_SITE_NAME&envDescription=詳しい情報はこちらから:&envLink=https://github.com/HRTK92/next-boards#env%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%81%AE%E8%A8%AD%E5%AE%9A)

### git clone

```bash
git clone https://github.com/HRTK92/next-boards.git
cd next-boards
```

### .envファイルの設定

.envファイルには以下の情報を記載する必要があります。

- `DATABASE_URL`: MongoDBのデータベースURL
- `SECRET`: NextAuth.js用のシークレット
- `LINE_CLIENT_ID`: LINEのクライアントID
- `LINE_CLIENT_SECRET`: LINEのクライアントシークレット
- `NEXTAUTH_URL`: NextAuth.jsのURL
- `NEXT_PUBLIC_SITE_NAME`: サイト名

#### LINEログインのセットアップ

以下の手順に従って、LINEログインを設定することができます。

1. LINE Developersサイトでアカウントを作成する。
2. LINEログインを作成する。
3. クライアントIDとクライアントシークレットを取得する。
4. .envファイルに上記の情報を記載する。

### 開発用サーバーの起動

```bash
yarn dev
```
