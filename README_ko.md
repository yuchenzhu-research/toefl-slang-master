# TOEFL Slang Master

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

### 2. TOEFL Coach
아카데믹한 논리와 구조 진단에 집중한 라이팅 리뷰.

### 3. Content Parser
해외 기사나 학습 자료의 깊이 있는 내용 분석.

---

## 🚀 빠른 시작

### 설치

```bash
npm install
npm link
tsm init   # API 키 설정 (OpenAI, Gemini, Anthropic 등 지원)
tsm doctor # 환경 진단
```

### 핵심 Pipeline

```bash
# Workflow 1: 아티클에서 새로운 표현 추출 및 학습 카드 생성
tsm pipeline:input --file article.pdf

# Workflow 2: 작성한 글에서 부족한 표현을 진단 후 업그레이드 카드 생성
tsm pipeline:output --text "This is a big improvement."
```

---

## 🧪 실험적 확장 기능

`tsm x` 커맨드로 제공:
- **SRS 반복 학습** (`tsm x review`)
- **데일리 챌린지** (`tsm x daily`)
- **의미망 클러스터링** (`tsm x cluster`)
- **원어민 TTS 오디오** (`tsm x speak`)

---

## 💂 보안 및 프라이버시

**API 전용 모드**: 중앙 서버 없음. API 키와 데이터는 사용자 로컬에만 저장됩니다.

---

## 📄 라이선스

MIT License.
