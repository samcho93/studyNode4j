# 🧮 Node4j



| | |
|---|---|
| 사이트 | https://studynode4j.pages.dev/ |
| 학생용 | https://studynode4j.pages.dev/student.html |
| 교사용 | https://studynode4j.pages.dev/teacher.html |
| 엔진 | Python 수업형 (원본 studyMLBasic) |
| 대상 · 수준 | 일반 · 입문 |

## 로컬에서 보기

```bash
python server/serve.py --port 8080
```

Windows 는 `start.bat`, 같은 네트워크의 학생에게는 `start-lan.bat`.

## 배포 (Cloudflare Pages)

```bash
npx wrangler pages deploy . --project-name studynode4j --branch main
```

## 커리큘럼

| # | 챕터 | 교시 |
|---|---|---|
| 01 | 🕸️ 그래프로 세상 보기 | 점과 선: 그래프 데이터 모델 · 왜 그래프 데이터베이스인가 |
| 02 | 🧠 온톨로지와 지식그래프 | 온톨로지: 지식의 설계도 · 트리플과 지식그래프 |
| 03 | 🚀 Neo4j 시작하기 | Neo4j 설치와 Browser 둘러보기 · 그래프 모델링: 온톨로지를 Neo4j 로 |
| 04 | 🔍 Cypher 기초: 만들고 찾기 | CREATE 와 패턴 문법 · MATCH · WHERE · RETURN |
| 05 | 🛠️ Cypher 활용: 고치고 세고 따라가기 | MERGE · SET · DELETE 와 집계 · 경로 탐색과 가변 길이 관계 |
| 06 | 📥 데이터를 지식그래프로 | CSV 를 트리플로: 데이터 정제와 변환 · LOAD CSV · 제약 조건 · 인덱스 |
| 07 | 🐍 Python 으로 지식그래프 다루기와 추론 | neo4j 드라이버와 pandas 연동 · 온톨로지 추론: 숨은 사실 찾기 |
| 08 | 🏆 그래프 분석과 지식그래프 미니 프로젝트 | 그래프 분석과 추천 · 미니 프로젝트: 나만의 지식그래프 |

## 콘텐츠 작성 · 검사

- 형식: `docs/LESSON_GUIDE.md`
- 검사: `node tools/validate.js <id> --jobs 4`

_lectureBuilder 로 생성됨._
