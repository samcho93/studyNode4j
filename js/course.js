/* Node4j — 강좌 설정
 * lectureBuilder 가 docs/curriculum.json 으로 생성합니다. (직접 고치면 다음 생성 때 덮어씀)
 * 각 차시는 lessons/<id>.js 에서 PY_COURSE.addChapter({...}) 로 등록합니다.
 */
window.PY_COURSE = {
  "title": "Node4j",
  "shortTitle": "Node4j",
  "subtitle": "",
  "icon": "🧮",
  "intro": "점과 선으로 세상을 표현하는 <b>그래프 데이터베이스 Neo4j</b>를 처음부터 배우는 입문 강좌입니다. <b>온톨로지</b>로 개념과 관계를 설계하고, <b>Cypher</b> 질의로 <b>지식그래프</b>를 만들고 탐색하며, 마지막에는 Python으로 Neo4j를 다뤄 추천 · 질의응답 미니 프로젝트까지 완성합니다. 브라우저 Python으로 그래프의 원리를 직접 실행해 보고, Neo4j 코드는 무료 클라우드(AuraDB Free)에서 따라 합니다.",
  "footer": "Node4j",
  "teacherPass": "samcho93",
  "github": {
    "user": "samcho93",
    "repo": "studyNode4j",
    "branch": "main"
  },
  "pathway": [],
  "parts": [
    {
      "id": 1,
      "title": "Part 1. 그래프와 온톨로지 이해하기",
      "desc": "표 대신 점과 선으로 생각하기 — 그래프 모델과 온톨로지 · 지식그래프의 기본 개념"
    },
    {
      "id": 2,
      "title": "Part 2. Neo4j와 Cypher 익히기",
      "desc": "Neo4j 를 설치하고 Cypher 로 노드와 관계를 만들고 · 찾고 · 고치는 법"
    },
    {
      "id": 3,
      "title": "Part 3. 지식그래프 만들고 활용하기",
      "desc": "데이터를 지식그래프로 옮기고, Python 으로 질의 · 추론 · 분석 · 추천까지"
    }
  ],
  "order": [
    {
      "id": "ch01",
      "no": "01",
      "part": 1,
      "title": "그래프로 세상 보기",
      "icon": "🕸️"
    },
    {
      "id": "ch02",
      "no": "02",
      "part": 1,
      "title": "온톨로지와 지식그래프",
      "icon": "🧠"
    },
    {
      "id": "ch03",
      "no": "03",
      "part": 2,
      "title": "Neo4j 시작하기",
      "icon": "🚀"
    },
    {
      "id": "ch04",
      "no": "04",
      "part": 2,
      "title": "Cypher 기초: 만들고 찾기",
      "icon": "🔍"
    },
    {
      "id": "ch05",
      "no": "05",
      "part": 2,
      "title": "Cypher 활용: 고치고 세고 따라가기",
      "icon": "🛠️"
    },
    {
      "id": "ch06",
      "no": "06",
      "part": 3,
      "title": "데이터를 지식그래프로",
      "icon": "📥"
    },
    {
      "id": "ch07",
      "no": "07",
      "part": 3,
      "title": "Python 으로 지식그래프 다루기와 추론",
      "icon": "🐍"
    },
    {
      "id": "ch08",
      "no": "08",
      "part": 3,
      "title": "그래프 분석과 지식그래프 미니 프로젝트",
      "icon": "🏆"
    }
  ],
  "chapters": {},
  "addChapter": function (ch) { this.chapters[ch.id] = ch; }
};
