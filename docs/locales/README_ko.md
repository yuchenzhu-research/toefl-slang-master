# SPARK

> **학술적인 영어(TOEFL)와 실제 미국식 영어(Slang) 사이의 장벽을 허물다.**
> 리딩 자료의 가치를 극대화하세요: 점수 향상과 원어민 같은 표현력을 동시에 잡으세요.

[English](../../README.md) | [简体中文](../../README_zh-CN.md) | [繁體中文](../../README_zh-TW.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Español](README_es.md) | [Français](README_fr.md) | [Deutsch](README_de.md)

---

## ✨ 핵심 기능

| 시나리오 | 문제점 | 해결책 |
| :--- | :--- | :--- |
| **TOEFL 준비** | "gonna"가 너무 비격식적이라는 건 알지만, 학술적인 대안은? | **Dictionary Pro**: 클릭 한 번으로 학술적 어조 전환 |
| **고급 리딩** | <이코노미스트>는 이해하지만 그 스타일을 복제할 수 없음 | **Content Parser**: 재사용 가능한 문장 템플릿 및 문화적 맥락 추출 |
| **작성 시 부족함** | 낮은 정밀도의 단어가 점수를 깎아먹음 | **TOEFL Coach**: 공식 ETS 기준에 따른 정밀 진단 |

---

## 🎯 모듈

### 1. Dictionary Pro
구어체나 모호한 영어를 표준 학술 스타일로 변환하는 데 특화되어 있습니다.
*   **어휘 업그레이드**: 낮은 정밀도의 단어를 정교한 학술적 대안으로 교체합니다.
*   **맥락 분석**: 특정 쓰기 맥락에 따라 용어의 모호성을 해소합니다.
*   **학술적 정렬**: 비격식 표현과 학술적 대응어 사이의 직접 매핑을 제공합니다.

### 2. TOEFL Coach
학술적 논리 및 구조적 진단에 집중하여 고득점 작문을 돕습니다.
*   **ETS 기준**: 시뮬레이션된 채점 및 진단 피드백을 제공합니다.
*   **취약 표현 추출**: 작문 내 비격식 언어를 자동으로 식별하고 표시합니다.
*   **구조 최적화**: 분석적 전환어 및 복문 구조 사용을 제안합니다.

### 3. Content Parser
고품질 외신(PDF/MD/TXT)을 분석하여 구조화된 학습 노트를 추출합니다.
*   **스니펫 추출**: 학습할 가치가 가장 높은 표현을 자동으로 식별합니다.
*   **문화적 배경**: 관용구와 슬랭을 문화적 뿌리와 연결합니다.
*   **표준화된 노트**: 포맷된 마크다운 및 JSON 산출물을 출력합니다.
*   **표현 루프**: 후속 모듈에서 즉시 사용할 수 있는 표현 후보를 자동 출력합니다.

---

## 🎬 Studio 가이드 모드

SPARK Studio 터미널을 직접 실행합니다:

```bash
spark studio
```

Studio는 현재 **대화형 TUI (Terminal UI)**로 작동합니다. 단어나 표현을 입력하면 Dictionary Pro가 실시간으로 검색합니다. `Ctrl+C`로 종료합니다.

```bash
spark studio --dry-run   # API 호출 없이 레이아웃 미리보기 실행
```

> [!NOTE]
> 전체 가이드 파이프라인 (파일 선택 → 분석 미리보기 → 후보 검토 → 카드 생성)은
> **작업 중 (WIP)** 입니다. 현재 TUI는 Dictionary Pro 검색 기능에 집중하고 있습니다.
> `/coach` 및 `/content` 통합은 향후 릴리스에서 추가될 예정입니다.

## 🖥️ 프론트엔드용 백엔드 API

Google Antigravity와 같은 외부 프론트엔드를 위해 로컬 백엔드 API를 실행합니다:

```bash
spark web --port 4173
```

현재 백엔드 엔드포인트:

- `GET /api/health`
- `POST /api/dict/lookup` — 슬랭/레지스터 정보 및 학술적 정렬을 반환하는 Dictionary Pro API. 기본값은 `dryRun: true`입니다.
- `POST /api/style/economist` — 결정론적 이코노미스트 스타일 기능 분석.

## 🧠 Economist 스타일 분석

SPARK에는 이코노미스트와 같은 분석적 산문을 위한 첫 번째 스타일 엔진이 포함되어 있습니다:

```bash
spark style --text "Although markets may adapt, regulation can distort incentives."
```

이것은 **특징 분석**이며, 아직 전체 코퍼스로 훈련된 모방 엔진은 아닙니다. 문장 리듬, 전환점, 인과 논리, 헤징, 경제/정책 어휘, 압축된 구두점 등을 점수화합니다.

---

## 🚀 빠른 시작

### 설치

```bash
# 의존성 설치
npm install

# 전역 CLI 명령 등록
npm link

# 로컬 환경 초기화 (.env)
spark init
```

### 핵심 파이프라인

```bash
# 워크플로우 1: 기사에서 표현을 추출하여 플래시카드 생성
spark x pipeline:input --file article.pdf

# 워크플로우 2: 작문을 진단하고 Dictionary Pro용 업그레이드 카드 생성
spark x pipeline:output --text "This is a big improvement."

# API 호출 없이 파이프라인 미리보기
spark x pipeline:input --file article.md --dry-run
spark x pipeline:output --text "I think technology is good." --dry-run
```

### 개별 명령

```bash
# 직접 사전 검색
spark dict "a big deal"

# 독립형 쓰기 진단
spark coach --file ./essay.txt --json

# 독립형 콘텐츠 추출 (AI 호출 없음)
spark content --file article.pdf --extract-only
```

### Provider 라우팅

`--provider`는 액세스 게이트웨이/런타임을 의미하며, `--model`은 호스팅된 모델 ID를 의미합니다.

```bash
# MiniMax 공식 직결 엔드포인트
spark dict "gonna" --provider minimax

# SiliconFlow에서 호스팅되는 MiniMax
spark dict "gonna" --provider siliconflow-minimax
```

---

## 🧪 실험적 확장 기능

`spark x` 네임스페이스를 통해 접근 가능한 특수 기능:

- **SRS 복습** (`spark x review`): SM2 알고리즘 기반 플래시카드 암기 테스트.
- **일일 챌린지** (`spark x daily`): 저장된 카드 뱅크에서 무작위 3장 퀵 테스트.
- **의미론적 클러스터링** (`spark x cluster`): 그래프 알고리즘을 사용한 유의어 관계 자동 맵핑.
- **네이티브 TTS** (`spark x speak`): 시스템 엔진을 통한 저장된 표현 발음.
- **REPL 모드** (`spark x repl`)：고효율 터미널 대화 루프.

---

## 🧭 거버넌스 문서

프로젝트 거버넌스 및 유지 관리에 대해서는 다음 문서를 먼저 확인하세요:

- `CONSTITUTION.md`: 프로젝트 정체성, 불변성, 아키텍처 가드레일 및 품질 게이트를 정의하는 최상위 거버넌스 문서.
- `AGENTS.md`: 읽기 순서, 실행 워크플로우, 검증 베이스라인 및 문서 동기화 원칙을 정의하는 공유 cross-agent 핸드북.
- `MANUAL.md`: 저장소 구조, 운영 체크리스트 및 알려진 제한 사항을 기록한 유지 관리자 핸드북.

---

## 💂 보안 및 개인정보 보호

**API 전용 모드**: 이 프로젝트는 중앙 서버 없이 작동합니다. 귀하의 API 키(OpenAI, Gemini, Anthropic, SiliconFlow)와 학습 데이터는 전적으로 귀하의 로컬 머신에 남아 있습니다.
