<div align="center">
  <h1 align="center">🌿 Digital Garden</h1>
  <p align="center">
    <strong>Bibliotheca Vitae</strong>
  </p>
  <p align="center">
    <em>人生の断片をキュレートするデジタルの聖域</em>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-708090?style=flat-square" alt="Platform" />
    <img src="https://img.shields.io/badge/framework-Next.js%2016-000000?style=flat-square&logo=next.js" alt="Framework" />
    <img src="https://img.shields.io/badge/built%20with-Tailwind%20CSS%20v4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/animation-Framer%20Motion-E10098?style=flat-square&logo=framer" alt="Framer Motion" />
    <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
  </p>

  <p align="center">
    <strong>
      <a href="../README.md">English</a> | 
      <a href="../README_zh-CN.md">简体中文</a> | 
      <a href="README_zh-TW.md">繁体中文</a> | 
      <a href="README_la.md">Latin</a> | 
      日本語 | 
      <a href="README_ko.md">한국어</a> | 
      <a href="README_es.md">Español</a>
    </strong>
  </p>
</div>
<br/>

**Bibliotheca Vitae** は単なるブログの概念を超越しています。それは15世紀の写本美学と21世紀の工学が融合するデジタルガーデンであり、無味乾燥なデータを、キュレートされた人生の物語へと昇華させます。

リポジトリ構成とディレクトリ規約は [docs/PROJECT-STRUCTURE.md](../docs/PROJECT-STRUCTURE.md) にまとめています。

## 🏛️ ビジョン：生ける物語

情報が断片化された現代において、コンテクストこそが魂です。従来のデータベースが歴史を表の行として扱うのに対し、Bibliotheca Vitaeはすべての記録を **Moment in Time** として捉えます。それは、物理法則に導かれ、深く知覚されるべき視覚的かつテキスト的な器です。

*   **没入感**：物理ベースのインタラクティブなモーションが、デジタルオブジェクトに真の重みと存在感を与えます。
*   **美学**：Inter と Playfair Display の組み合わせが、温かみのあるミュージアム調のミニマリズムを形作ります。
*   **キュレーター体験**：私たちはフォームをキャンバスに置き換えます。

## ✨ コア機能

### 🖼️ ギャラリー The Gallery
Appleの美学にインスパイアされたスティッキーな横スクロール。ユーザーは歴史の大河を渡るように閲覧でき、各カードは繊細なパララックス効果を伴います。

### 📖 物語体験 The Narrative Experience
エントリをクリックすると、シームレスなオーバーレイが開きます。そこで **Moment in Time** を探索し、関わる **Figure** を知覚し、その瞬間に属する **The Narrative** を読むことができます。

### 🖋️ 瞬間追記エディタ Append Moment Editor
このプロジェクトの核心は、ビジュアルファーストなエディタです。
1.  **ビジュアルアンカー**：画像をアップロードして、エントリの背景を定めます。
2.  **インプレース編集**：タイトル、人物、キーワード、時刻、物語を1つの流れの中で編集できます。
3.  **下書きとアーカイブ更新**：新規エントリは公開前にローカル自動保存され、デスクトップでは個人エントリを再度開いて編集できます。

## 🛠️ 技術スタック

共有された **Web + Tauri デスクトップアプリ** 構成：

-   **Core**: Next.js 16 App Router, React 19, TypeScript
-   **Motion**: Framer Motion, Lenis
-   **Visual**: Tailwind CSS v4, Lucide Icons
-   **グラフィック**: React Three Fiber / Drei WebGL Particle System
-   **Desktop**: Tauri 2

## 💾 データ保存とクロスプラットフォーム対応

### 🖥️ デスクトップ Web（Windows / macOS / Linux）
- 推奨モード: ローカルフォルダを接続し、各エントリをディスク上の `.json` ファイルとして直接保存
- デスクトップ Web の機能: **閲覧、作成、編集、エクスポート、インポート**
- フォルダモードでは、アーカイブを自分で確認・バックアップ・同期できます
- フォルダアクセスが使えない場合は、互換モードとしてブラウザ内ローカル保存にフォールバックします
- 完全オフライン動作 - サーバー保存は不要

### 🪟 デスクトップアプリ（Tauri）
- ネイティブなファイルシステムアクセスで同じアーカイブモデルを利用
- エントリはディスク上の Bibliotheca Vitae ローカルアーカイブフォルダに保存
- 完全オフラインのデスクトップ運用に最適

### 📱 モバイル（iOS / Android）
- **閲覧 + ローカル下書き**: 現在の端末/ブラウザ内でアーカイブを見たり、テキスト・メタデータ・画像の下書きを残したりできます
- モバイル下書きはその端末のブラウザ内だけに保存されるため、正式なアーカイブ化ではなくクイックキャプチャ向けです
- 接続済みフォルダへの保存、インポート/エクスポート、完全なアーカイブ管理はデスクトップ向けです
- 完全なアーカイブ運用には、デスクトップブラウザまたはデスクトップアプリを使用してください

## � ダウンロードとインストール

macOS および Windows 向けのビルド済みデスクトップアプリは [GitHub Releases](https://github.com/yuchenzhu-research/Digital-Garden/releases) からダウンロードできます。

Linux はデスクトップ **Web** プラットフォームとしてサポートされています。Linux 向けデスクトップアプリの自動リリースはまだ確認されていません。詳細は [docs/RELEASE.md](../docs/RELEASE.md) を参照してください。

### 🍎 macOS ユーザー
現在の MVP リリースは Apple 開発者証明書なしで GitHub Actions により構築されているため、macOS のゲートキーパーが「アプリが破損しています」と表示する場合があります。
**解決方法：**
1. `.dmg` アプリケーションを `/Applications` フォルダにドラッグします。
2. ターミナルで次のコマンドを実行して隔離フラグを解除します：
```bash
xattr -cr "/Applications/Bibliotheca Vitae.app"
```
3. これでアプリを通常通り開くことができます。

### 🪟 Windows ユーザー
Windows SmartScreen が `.exe` を認識できないアプリとして警告する場合があります。**「詳細情報」** をクリックし、**「実行」** を選択してください。

## �🚀 クイックスタート

1.  リポジトリをクローンします。
2.  依存関係をインストール：`npm install`
3.  ベースラインを検証：`npm run lint && npm run test`
4.  Web 開発サーバーを起動：`npm run dev`
5.  `http://localhost:4321` を開く
6.  デスクトップシェルを試す場合：`npm run app:dev`
7.  Web 本番ビルドを作る場合：`npm run build`

詳細なエンジニアリングガイドライン：[docs/ENGINEERING-GUARDRAILS.md](../docs/ENGINEERING-GUARDRAILS.md) · [docs/TESTING-CI.md](../docs/TESTING-CI.md) · [docs/RELEASE.md](../docs/RELEASE.md)

---
*Est. MMXXVI · Bibliotheca Vitae · Ars Longa, Vita Brevis.*
