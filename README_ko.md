<div align="center">
  <h1 align="center">🌿 Digital Garden</h1>
  <p align="center">
    <strong>Bibliotheca Vitae</strong>
  </p>
  <p align="center">
    <em>삶의 조각들을 큐레이팅하는 디지털 성소</em>
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
      <a href="README.md">English</a> | 
      <a href="README_zh-CN.md">简体中文</a> | 
      <a href="README_zh-TW.md">繁体中文</a> | 
      <a href="README_la.md">Latin</a> | 
      <a href="README_ja.md">日本語</a> | 
      한국어 | 
      <a href="README_es.md">Español</a>
    </strong>
  </p>
</div>
<br/>

**Bibliotheca Vitae**는 단순한 블로그를 초월합니다. 이곳은 15세기 필사본의 미학과 21세기 공학이 만나는 디지털 정원이며, 평범한 데이터를 큐레이팅된 삶의 서사로 승화시킵니다.

저장소 구조와 디렉터리 규칙은 [docs/PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md)에서 확인할 수 있습니다.

## 🏛️ 비전: 살아있는 서사

파편화된 정보의 시대에 맥락은 곧 영혼입니다. 전통적인 데이터베이스가 역사를 표의 행으로 취급한다면, Bibliotheca Vitae는 모든 기록을 **Moment in Time**으로 봅니다. 이는 물리 법칙에 의해 인도되며 깊이 있게 지각되어야 할 시각적, 텍스트적 그릇입니다.

*   **몰입감**: 물리학 기반의 인터랙티브 모션이 디지털 객체에 진정한 무게와 존재감을 부여합니다.
*   **미학**: Cinzel과 EB Garamond 같은 고전 타이포그래피가 현대적 미니멀리즘과 만나 박물관 수준의 독서 경험을 창조합니다.
*   **큐레이터 경험**: 우리는 입력 양식을 캔버스로 대체합니다.

## ✨ 핵심 기능

### 🖼️ 갤러리 The Gallery
Apple 스타일의 스티키 가로 스크롤을 통해 사용자는 역사의 긴 강을 가로지를 수 있습니다. 각 아카이브 카드에는 섬세한 시차 효과가 적용되어 있습니다.

### 📖 서사적 경험 The Narrative Experience
항목을 클릭하면 매끄러운 오버레이가 열립니다. 사용자는 **Moment in Time**을 탐험하고, 관련된 **Figure**를 인지하며, 그 순간에 속한 **The Narrative**를 읽을 수 있습니다.

### 🖋️ 순간 추가 에디터 Append Moment Editor
이 프로젝트의 핵심은 비주얼 우선 에디터입니다.
1.  **시각적 앵커**: 사진을 캔버스에 직접 드래그하여 배경으로 삼습니다.
2.  **즉석 편집**: 페이지에서 직접 타이핑하세요. 제목, 인물, 서사가 실제로 표시될 바로 그 위치에서 편집됩니다.
3.  **듀얼 모드 파티클**: Alet 스타일의 입자 해체 효과가 통합되어 **Linear** 선형 및 **Random** 무작위 시각 모드를 지원합니다.

## 🛠️ 기술 스택

미래의 네이티브 포팅을 대비한 **SPA** 아키텍처:

-   **Core**: Next.js 16 App Router, React 19, TypeScript
-   **Motion**: Framer Motion, GSAP, React Lenis Smooth Scroll
-   **그래픽**: React Three Fiber / Drei WebGL Particle System

## 💾 데이터 저장 및 크로스 플랫폼 지원

### 🖥️ 데스크톱 웹 (Windows / macOS / Linux)
- 권장 모드: 로컬 폴더를 연결해 각 항목을 디스크의 `.json` 파일로 직접 저장
- 전체 기능: **검색, 생성, 편집, 내보내기 및 가져오기**
- 폴더 모드에서는 아카이브를 파일 형태로 직접 확인하고, 백업하고, 스스로 동기화할 수 있습니다
- 폴더 접근을 사용할 수 없으면 앱은 호환 모드로 브라우저 로컬 저장소에 폴백합니다
- 완전히 오프라인 작동 - 서버 저장 불필요

### 📱 모바일 (iOS / Android)
- **탐색 + 로컬 초안**: 현재 기기/브라우저에서 아카이브를 보고 초안을 남길 수 있습니다
- 모바일 초안은 해당 기기의 브라우저 로컬 저장소에만 남으므로, 최종 아카이빙보다 빠른 기록에 적합합니다
- 연결된 폴더로 게시하기, 가져오기/내보내기, 전체 아카이브 관리는 데스크톱 워크플로우로 유지됩니다
- 전체 아카이브 워크플로우는 데스크톱 브라우저나 데스크톱 앱에서 사용하세요

## 🚀 빠른 시작

1.  저장소 클론.
2.  의존성 설치: `npm install`
3.  개발 서버 시작: `npm run dev`
4.  방문: `https://bibliotheca-vitae.vercel.app` 또는 `http://localhost:4321`.

---
*Est. MMXXVI · Bibliotheca Vitae · Ars Longa, Vita Brevis.*
