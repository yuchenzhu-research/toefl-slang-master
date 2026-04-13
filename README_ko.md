# SPARK

> **아카데믹 영어(TOEFL)와 진짜 미국 영어(Slang)의 장벽을 허물다.**
> 『이코노미스트』 같은 자료를 200% 활용하세요. 점수뿐만 아니라 원어민 같은 표현력도 얻을 수 있습니다.

[English](README.md) | [简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Español](README_es.md) | [Français](README_fr.md) | [Deutsch](README_de.md)

---

## ✨ 핵심 기능

| 상황 | 고민 | 해결책 |
| :--- | :--- | :--- |
| **TOEFL 준비** | "gonna"가 격식 없다는 건 아는데 뭘로 바꿔야 할지 모름 | **Dictionary Pro**: 원클릭으로 아카데믹하게 변환 |
| **원서 읽기** | 긴 문장은 해석되지만 직접 쓰지는 못함 | **Content Parser**: 읽기 자료에서 문장 템플릿 추출 |
| **라이팅 점수** | 20점과 26점의 차이를 모름 | **TOEFL Coach**: 디테일한 에세이 진단과 교정 |

---

## 🎯 핵심 모듈

### 1. Dictionary Pro
표현의 문체 변환에 초점을 맞춤. 구어체를 스탠다드 아카데믹 영어로 변환.
*   **어휘 업그레이드**: 기초적인 단어를 세련된 학문적 표현으로 대체.
*   **문맥 분석**: 작성 중인 특정 문맥에 맞춰 단어의 의미를 정확히 파악.
*   **아카데믹 매칭**: 비격식 표현과 학술적 표현 간의 일대일 매핑 제공.

### 2. TOEFL Coach
아카데믹한 논리와 구조 진단에 집중한 라이팅 리뷰.
*   **공식 기준**: ETS 기준에 따른 모의 채점 및 피드백 제공.
*   **취약 표현 추출**: 에세이 내의 비격식적인 표현을 자동 감지.

### 3. Content Parser
해외 기사나 학습 자료의 깊이 있는 내용 분석.
*   **핵심 소재 추출**: 가치 있는 문법, 문장 템플릿, 문화적 배경 파악.
*   **구조화된 노트**: PDF/MD/TXT 파일을 분석하여 학습 유닛 생성.

---

## 🚀 빠른 시작

### 설치

```bash
# 의존성 설치
npm install

# 글로벌 CLI 명령어 등록
npm link

# 로컬 환경 초기화 (.env)
spark init
```

### 핵심 Pipeline

```bash
# Workflow 1: 아티클에서 새로운 표현 추출 및 학습 카드 생성
spark pipeline:input --file article.pdf

# Workflow 2: 작성한 글에서 부족한 표현을 진단 후 업그레이드 카드 생성
spark pipeline:output --text "This is a big improvement."
```

---

## 🧪 실험적 확장 기능

`spark x` 커맨드로 공개되는 기능:
- **SRS 반복 학습** (`spark x review`)
- **데일리 챌린지** (`spark x daily`)
- **의미망 클러스터링** (`spark x cluster`)
- **원어민 TTS 오디오** (`spark x speak`)
- **명령어 REPL** (`spark x repl`)

---

## 🧭 거버넌스 문서

프로젝트 거버넌스와 유지보수를 확인하려면 먼저 아래 문서를 읽으세요.

- `CONSTITUTION.md`: 프로젝트 정체성, 불변 조건, 아키텍처 가드레일, 품질 게이트를 정의하는 최고 거버넌스 문서.
- `AGENTS.md`: 읽기 순서, 실행 흐름, 검증 기준선, 문서 동기화 규율을 정의하는 공유 cross-agent 핸드북.
- `MANUAL.md`: 저장소 구조, 운영 체크리스트, 알려진 제한 사항을 정리한 유지보수자 안내서.

---

## 💂 보안 및 프라이버시

**API 전용 모드**: 중앙 서버 없음. API 키와 모든 학습 데이터는 사용자 로컬에만 저장됩니다.
