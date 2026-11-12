/* 01차시 그래프로 세상 보기 */
(function () {
  const ARROW = (id) => `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fill-arrow"/></marker></defs>`;

  /* 그림 1-1. 생활 속 그래프 세 가지 */
  const FIG_LIFE = `<svg viewBox="0 0 720 270" role="img" aria-label="지하철 노선도, SNS 친구 관계, 가계도를 모두 점과 선으로 나타낸 그림">
  ${ARROW('c01a1')}
  <rect x="10" y="10" width="220" height="250" rx="14" class="card-bg"/>
  <rect x="250" y="10" width="220" height="250" rx="14" class="card-bg"/>
  <rect x="490" y="10" width="220" height="250" rx="14" class="card-bg"/>
  <text x="120" y="40" text-anchor="middle" class="tx-b">🚇 지하철 노선도</text>
  <line x1="40" y1="110" x2="200" y2="110" class="s1" stroke-width="5"/>
  <line x1="120" y1="70" x2="120" y2="200" class="s3" stroke-width="5"/>
  <circle cx="40" cy="110" r="9" class="p1"/><circle cx="120" cy="110" r="11" class="p2"/><circle cx="200" cy="110" r="9" class="p1"/>
  <circle cx="120" cy="70" r="9" class="p3"/><circle cx="120" cy="160" r="9" class="p3"/><circle cx="120" cy="200" r="9" class="p3"/>
  <text x="40" y="135" text-anchor="middle" class="tx-m">시청</text><text x="150" y="104" class="tx-m">환승역</text><text x="200" y="135" text-anchor="middle" class="tx-m">을지로</text>
  <text x="120" y="240" text-anchor="middle" class="tx-m">역 = 점, 구간 = 선</text>
  <text x="360" y="40" text-anchor="middle" class="tx-b">💬 SNS 친구</text>
  <line x1="360" y1="140" x2="300" y2="85" class="ln" stroke-width="2"/>
  <line x1="360" y1="140" x2="425" y2="85" class="ln" stroke-width="2"/>
  <line x1="360" y1="140" x2="290" y2="190" class="ln" stroke-width="2"/>
  <line x1="360" y1="140" x2="430" y2="195" class="ln" stroke-width="2"/>
  <line x1="300" y1="85" x2="425" y2="85" class="ln" stroke-width="2"/>
  <circle cx="360" cy="140" r="18" class="p2"/><text x="360" y="145" text-anchor="middle" class="tx-w">나</text>
  <circle cx="300" cy="85" r="13" class="p1s"/><circle cx="425" cy="85" r="13" class="p1s"/>
  <circle cx="290" cy="190" r="13" class="p1s"/><circle cx="430" cy="195" r="13" class="p1s"/>
  <text x="360" y="240" text-anchor="middle" class="tx-m">사람 = 점, 친구 사이 = 선</text>
  <text x="600" y="40" text-anchor="middle" class="tx-b">🌳 가계도</text>
  <rect x="560" y="60" width="80" height="30" rx="8" class="p5s"/><text x="600" y="80" text-anchor="middle" class="tx">할머니</text>
  <rect x="510" y="130" width="70" height="30" rx="8" class="p5s"/><text x="545" y="150" text-anchor="middle" class="tx">엄마</text>
  <rect x="620" y="130" width="70" height="30" rx="8" class="p5s"/><text x="655" y="150" text-anchor="middle" class="tx">삼촌</text>
  <rect x="510" y="190" width="70" height="30" rx="8" class="p2s"/><text x="545" y="210" text-anchor="middle" class="tx">나</text>
  <line x1="590" y1="92" x2="550" y2="127" class="ln" stroke-width="2" marker-end="url(#c01a1)"/>
  <line x1="610" y1="92" x2="650" y2="127" class="ln" stroke-width="2" marker-end="url(#c01a1)"/>
  <line x1="545" y1="162" x2="545" y2="187" class="ln" stroke-width="2" marker-end="url(#c01a1)"/>
  <text x="600" y="240" text-anchor="middle" class="tx-m">사람 = 점, 부모→자녀 = 화살표</text>
</svg>`;

  /* 그림 1-2. 속성 그래프의 구성 요소 */
  const FIG_LPG = `<svg viewBox="0 0 720 300" role="img" aria-label="Person 레이블의 민수 노드가 KNOWS 관계로 지영 노드를 가리키고, LIVES_IN 관계로 City 레이블의 서울 노드를 가리키는 속성 그래프">
  ${ARROW('c01a2')}
  <circle cx="130" cy="130" r="58" class="p1"/>
  <text x="130" y="120" text-anchor="middle" class="tx-w">:Person</text>
  <text x="130" y="145" text-anchor="middle" class="tx-w">민수</text>
  <circle cx="560" cy="90" r="52" class="p1"/>
  <text x="560" y="82" text-anchor="middle" class="tx-w">:Person</text>
  <text x="560" y="106" text-anchor="middle" class="tx-w">지영</text>
  <circle cx="470" cy="235" r="44" class="p3"/>
  <text x="470" y="230" text-anchor="middle" class="tx-w">:City</text>
  <text x="470" y="252" text-anchor="middle" class="tx-w">서울</text>
  <line x1="190" y1="120" x2="503" y2="96" class="ln" stroke-width="2.5" marker-end="url(#c01a2)"/>
  <rect x="270" y="78" width="130" height="28" rx="6" class="p2s"/>
  <text x="335" y="97" text-anchor="middle" class="tx-b">:KNOWS</text>
  <text x="335" y="128" text-anchor="middle" class="tx-m">{since: 2020}</text>
  <line x1="182" y1="160" x2="422" y2="228" class="ln" stroke-width="2.5" marker-end="url(#c01a2)"/>
  <rect x="245" y="185" width="120" height="28" rx="6" class="p2s"/>
  <text x="305" y="204" text-anchor="middle" class="tx-b">:LIVES_IN</text>
  <rect x="20" y="210" width="190" height="72" rx="10" class="p5s"/>
  <text x="32" y="234" class="tx">name: '민수'</text>
  <text x="32" y="256" class="tx">age: 17</text>
  <text x="32" y="276" class="tx-m">↑ 속성 (키: 값)</text>
  <text x="130" y="55" text-anchor="middle" class="tx-m">노드 = 점 · 레이블 = 종류(:Person)</text>
  <text x="560" y="175" text-anchor="middle" class="tx-m">관계 = 타입 + 방향(→)</text>
</svg>`;

  /* 그림 1-3. 무방향 vs 방향 그래프와 차수 */
  const FIG_DIR = `<svg viewBox="0 0 720 270" role="img" aria-label="왼쪽은 화살표 없는 친구 관계 그래프와 차수, 오른쪽은 화살표가 있는 팔로우 그래프와 들어오는 차수, 나가는 차수">
  ${ARROW('c01a3')}
  <rect x="10" y="10" width="340" height="250" rx="14" class="card-bg"/>
  <rect x="370" y="10" width="340" height="250" rx="14" class="card-bg"/>
  <text x="180" y="40" text-anchor="middle" class="tx-b">무방향 그래프 (친구 사이)</text>
  <line x1="100" y1="90" x2="250" y2="90" class="ln" stroke-width="2"/>
  <line x1="100" y1="90" x2="175" y2="200" class="ln" stroke-width="2"/>
  <line x1="250" y1="90" x2="175" y2="200" class="ln" stroke-width="2"/>
  <line x1="250" y1="90" x2="310" y2="170" class="ln" stroke-width="2"/>
  <circle cx="100" cy="90" r="20" class="p1"/><text x="100" y="95" text-anchor="middle" class="tx-w">A</text>
  <circle cx="250" cy="90" r="20" class="p2"/><text x="250" y="95" text-anchor="middle" class="tx-w">B</text>
  <circle cx="175" cy="200" r="20" class="p1"/><text x="175" y="205" text-anchor="middle" class="tx-w">C</text>
  <circle cx="310" cy="170" r="20" class="p1"/><text x="310" y="175" text-anchor="middle" class="tx-w">D</text>
  <text x="250" y="60" text-anchor="middle" class="tx-m">B 의 차수 = 3</text>
  <text x="180" y="245" text-anchor="middle" class="tx-m">B 의 이웃: A, C, D</text>
  <text x="540" y="40" text-anchor="middle" class="tx-b">방향 그래프 (팔로우)</text>
  <line x1="460" y1="90" x2="586" y2="90" class="ln" stroke-width="2" marker-end="url(#c01a3)"/>
  <line x1="472" y1="106" x2="525" y2="184" class="ln" stroke-width="2" marker-end="url(#c01a3)"/>
  <line x1="600" y1="110" x2="553" y2="184" class="ln" stroke-width="2" marker-end="url(#c01a3)"/>
  <line x1="660" y1="170" x2="622" y2="108" class="ln" stroke-width="2" marker-end="url(#c01a3)"/>
  <circle cx="460" cy="90" r="20" class="p1"/><text x="460" y="95" text-anchor="middle" class="tx-w">A</text>
  <circle cx="610" cy="90" r="20" class="p2"/><text x="610" y="95" text-anchor="middle" class="tx-w">B</text>
  <circle cx="535" cy="200" r="20" class="p1"/><text x="535" y="205" text-anchor="middle" class="tx-w">C</text>
  <circle cx="670" cy="185" r="20" class="p1"/><text x="670" y="190" text-anchor="middle" class="tx-w">D</text>
  <text x="610" y="55" text-anchor="middle" class="tx-m">B: 들어옴 2 · 나감 1</text>
  <text x="540" y="245" text-anchor="middle" class="tx-m">A → B 는 "A 가 B 를 팔로우"</text>
</svg>`;

  /* 그림 1-4. 같은 그래프의 두 가지 표현 */
  const FIG_ADJ = `<svg viewBox="0 0 720 270" role="img" aria-label="네 사람의 친구 그래프를 인접 리스트와 간선 목록으로 각각 표현한 그림">
  <rect x="10" y="10" width="220" height="250" rx="14" class="card-bg"/>
  <rect x="250" y="10" width="250" height="250" rx="14" class="card-bg"/>
  <rect x="520" y="10" width="190" height="250" rx="14" class="card-bg"/>
  <text x="120" y="38" text-anchor="middle" class="tx-b">그래프</text>
  <line x1="60" y1="90" x2="180" y2="90" class="ln" stroke-width="2"/>
  <line x1="60" y1="90" x2="60" y2="200" class="ln" stroke-width="2"/>
  <line x1="180" y1="90" x2="60" y2="200" class="ln" stroke-width="2"/>
  <line x1="180" y1="90" x2="180" y2="200" class="ln" stroke-width="2"/>
  <circle cx="60" cy="90" r="20" class="p1"/><text x="60" y="95" text-anchor="middle" class="tx-w">A</text>
  <circle cx="180" cy="90" r="20" class="p1"/><text x="180" y="95" text-anchor="middle" class="tx-w">B</text>
  <circle cx="60" cy="200" r="20" class="p1"/><text x="60" y="205" text-anchor="middle" class="tx-w">C</text>
  <circle cx="180" cy="200" r="20" class="p1"/><text x="180" y="205" text-anchor="middle" class="tx-w">D</text>
  <text x="375" y="38" text-anchor="middle" class="tx-b">인접 리스트 (딕셔너리)</text>
  <text x="270" y="80" class="tx">'A': ['B', 'C']</text>
  <text x="270" y="115" class="tx">'B': ['A', 'C', 'D']</text>
  <text x="270" y="150" class="tx">'C': ['A', 'B']</text>
  <text x="270" y="185" class="tx">'D': ['B']</text>
  <text x="375" y="240" text-anchor="middle" class="tx-m">"누구와 연결?" 바로 답함</text>
  <text x="615" y="38" text-anchor="middle" class="tx-b">간선 목록 (리스트)</text>
  <text x="560" y="80" class="tx">('A', 'B')</text>
  <text x="560" y="115" class="tx">('A', 'C')</text>
  <text x="560" y="150" class="tx">('B', 'C')</text>
  <text x="560" y="185" class="tx">('B', 'D')</text>
  <text x="615" y="240" text-anchor="middle" class="tx-m">선 하나 = 한 줄</text>
</svg>`;

  /* 그림 1-5. 표(관계형 DB)로 저장한 친구 데이터와 JOIN */
  const FIG_TABLES = `<svg viewBox="0 0 720 280" role="img" aria-label="사람 테이블과 친구 테이블을 id 로 이어 붙이는 JOIN 그림">
  ${ARROW('c01a4')}
  <text x="120" y="28" text-anchor="middle" class="tx-b">사람 테이블 (people)</text>
  <rect x="20" y="40" width="200" height="200" rx="10" class="p1s"/>
  <text x="45" y="66" class="tx-b">id</text><text x="110" y="66" class="tx-b">name</text>
  <line x1="20" y1="76" x2="220" y2="76" class="ln"/>
  <text x="45" y="100" class="tx">1</text><text x="110" y="100" class="tx">민수</text>
  <text x="45" y="128" class="tx">2</text><text x="110" y="128" class="tx">지영</text>
  <text x="45" y="156" class="tx">3</text><text x="110" y="156" class="tx">서준</text>
  <text x="45" y="184" class="tx">4</text><text x="110" y="184" class="tx">하은</text>
  <text x="45" y="214" class="tx-m">⋮</text>
  <text x="480" y="28" text-anchor="middle" class="tx-b">친구 테이블 (friends)</text>
  <rect x="380" y="40" width="200" height="200" rx="10" class="p3s"/>
  <text x="405" y="66" class="tx-b">me</text><text x="490" y="66" class="tx-b">friend</text>
  <line x1="380" y1="76" x2="580" y2="76" class="ln"/>
  <text x="405" y="100" class="tx">1</text><text x="490" y="100" class="tx">2</text>
  <text x="405" y="128" class="tx">1</text><text x="490" y="128" class="tx">3</text>
  <text x="405" y="156" class="tx">2</text><text x="490" y="156" class="tx">3</text>
  <text x="405" y="184" class="tx">3</text><text x="490" y="184" class="tx">4</text>
  <text x="405" y="214" class="tx-m">⋮</text>
  <path d="M376 128 C320 128 260 120 224 128" class="ln" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#c01a4)"/>
  <text x="300" y="112" text-anchor="middle" class="tx-m">friend = id</text>
  <text x="300" y="175" text-anchor="middle" class="tx-b">JOIN</text>
  <text x="300" y="195" text-anchor="middle" class="tx-m">번호로 짝 맞추기</text>
  <rect x="600" y="90" width="110" height="110" rx="10" class="p5s"/>
  <text x="655" y="118" text-anchor="middle" class="tx-b">결과</text>
  <text x="655" y="148" text-anchor="middle" class="tx">민수의 친구:</text>
  <text x="655" y="172" text-anchor="middle" class="tx">지영, 서준</text>
  <text x="360" y="268" text-anchor="middle" class="tx-m">관계(친구 사이)는 '번호 쌍'으로만 저장되고, 이름을 알려면 표를 이어 붙여야 합니다</text>
</svg>`;

  /* 그림 1-6. n단계 건너 아는 사람: 표 vs 그래프 */
  const FIG_HOPS = `<svg viewBox="0 0 720 290" role="img" aria-label="위쪽은 친구 테이블을 단계마다 JOIN 하는 표 방식, 아래쪽은 민수에서 선을 따라 서준, 하은, 수아로 이동하는 그래프 방식">
  ${ARROW('c01a5')}
  <text x="20" y="30" class="tx-b">표 방식: 한 단계 = JOIN 한 번 더</text>
  <rect x="20" y="45" width="130" height="50" rx="10" class="p3s"/><text x="85" y="76" text-anchor="middle" class="tx">friends</text>
  <rect x="200" y="45" width="130" height="50" rx="10" class="p3s"/><text x="265" y="76" text-anchor="middle" class="tx">friends</text>
  <rect x="380" y="45" width="130" height="50" rx="10" class="p3s"/><text x="445" y="76" text-anchor="middle" class="tx">friends</text>
  <text x="175" y="76" text-anchor="middle" class="tx-b">⋈</text><text x="355" y="76" text-anchor="middle" class="tx-b">⋈</text>
  <text x="540" y="64" class="tx-m">중간 결과 표가</text>
  <text x="540" y="84" class="tx-m">단계마다 커짐 📈</text>
  <line x1="20" y1="130" x2="700" y2="130" class="ln" stroke-dasharray="4 4"/>
  <text x="20" y="165" class="tx-b">그래프 방식: 한 단계 = 선 하나 따라가기</text>
  <circle cx="80" cy="230" r="26" class="p2"/><text x="80" y="235" text-anchor="middle" class="tx-w">민수</text>
  <circle cx="250" cy="230" r="26" class="p1"/><text x="250" y="235" text-anchor="middle" class="tx-w">서준</text>
  <circle cx="420" cy="230" r="26" class="p1"/><text x="420" y="235" text-anchor="middle" class="tx-w">하은</text>
  <circle cx="590" cy="230" r="26" class="p5"/><text x="590" y="235" text-anchor="middle" class="tx-w">수아</text>
  <line x1="108" y1="230" x2="220" y2="230" class="ln" stroke-width="2.5" marker-end="url(#c01a5)"/>
  <line x1="278" y1="230" x2="390" y2="230" class="ln" stroke-width="2.5" marker-end="url(#c01a5)"/>
  <line x1="448" y1="230" x2="560" y2="230" class="ln" stroke-width="2.5" marker-end="url(#c01a5)"/>
  <text x="165" y="218" text-anchor="middle" class="tx-m">1단계</text>
  <text x="335" y="218" text-anchor="middle" class="tx-m">2단계</text>
  <text x="505" y="218" text-anchor="middle" class="tx-m">3단계</text>
  <text x="360" y="280" text-anchor="middle" class="tx-m">지금 있는 점에서 이웃 목록만 보면 다음 점으로 이동할 수 있습니다</text>
</svg>`;

  PY_COURSE.addChapter({
    id: 'ch01',
    no: '01',
    title: '그래프로 세상 보기',
    subtitle: '노드 · 관계 · 속성 그래프 · 표와 그래프 비교',
    summary: '친구 관계 · 지하철 노선처럼 <b>연결</b>이 중요한 데이터를 <b>노드(점)와 관계(선)</b>로 표현하는 그래프 모델을 배우고, Python 딕셔너리로 직접 그래프를 만들어 그려 봅니다. 같은 데이터를 표(관계형 DB)로 저장했을 때와 비교하며 그래프 데이터베이스와 Neo4j 가 왜 필요한지 알아봅니다.',
    goals: [
      '노드 · 관계 · 레이블 · 속성으로 이루어진 속성 그래프를 설명할 수 있다',
      '방향 그래프와 무방향 그래프, 차수와 이웃의 뜻을 구분할 수 있다',
      'Python 딕셔너리 · 리스트로 인접 리스트와 간선 목록을 만들고 matplotlib 로 그릴 수 있다',
      '"친구의 친구"를 찾을 때 표(JOIN) 방식과 그래프(따라가기) 방식의 차이를 설명할 수 있다',
      '그래프 데이터베이스가 쓰이는 곳과 Neo4j 가 무엇인지 말할 수 있다'
    ],
    sections: [
      {
        id: 'ch01-1',
        title: '점과 선: 그래프 데이터 모델',
        minutes: 50,
        goals: ['노드 · 관계 · 레이블 · 속성을 구분한다', '방향 · 무방향 그래프와 차수 · 이웃을 이해한다', '인접 리스트 · 간선 목록으로 그래프를 만들고 그린다'],
        flow: [['도입 · 생활 속 그래프', 7], ['속성 그래프', 10], ['방향 · 차수 · 이웃', 8], ['Python 으로 표현', 12], ['그리기 · 함께 해 보기', 13]],
        content: [
          { type: 'p', html: '지하철을 탈 때 우리는 노선도를 봅니다. 노선도에는 실제 거리나 건물 모양은 거의 없고, <b>역(점)</b>과 <b>역 사이를 잇는 구간(선)</b>만 있습니다. 그런데도 "시청에서 을지로까지 몇 정거장?" 같은 질문에 바로 답할 수 있지요. 이렇게 <b>무엇과 무엇이 연결되어 있는가</b>를 점과 선으로 나타낸 것을 <b>그래프(graph)</b>라고 합니다.' },
          { type: 'callout', kind: 'info', title: '여기서 말하는 "그래프"는?', html: '막대그래프 · 꺾은선그래프 같은 <b>차트</b>가 아니라, 점과 선으로 연결을 나타내는 <b>네트워크 그림</b>을 말합니다. 수학에서는 이를 "그래프 이론"이라고 부릅니다.' },
          { type: 'h', text: '그래프란? 노드와 관계' },
          { type: 'p', html: '그래프는 딱 두 가지 재료로 만듭니다.' },
          { type: 'list', items: [
            '<b>노드(node, 점)</b> — 사람, 역, 상품, 개념처럼 "대상" 하나하나. 정점(vertex)이라고도 합니다.',
            '<b>관계(relationship, 선)</b> — 두 노드 사이의 연결. "친구이다", "다음 역이다", "부모이다". 간선(edge) · 링크라고도 합니다.'
          ] },
          { type: 'figure', html: FIG_LIFE, caption: '그림 1-1. 지하철 노선도 · SNS 친구 · 가계도는 모두 "점과 선"으로 그릴 수 있습니다.' },
          { type: 'p', html: '세 그림은 생김새가 달라도 구조가 같습니다. 그래서 그래프 하나의 방법만 익혀 두면 "환승이 가장 적은 길", "나와 공통 친구가 많은 사람", "나의 6촌" 같은 서로 다른 질문을 같은 방식으로 풀 수 있습니다.' },
          { type: 'h', text: '속성 그래프 (Labeled Property Graph)' },
          { type: 'p', html: '이 강좌에서 사용할 Neo4j 는 점과 선에 정보를 더 붙인 <b>속성 그래프</b>를 씁니다. 네 가지만 기억하면 됩니다.' },
          { type: 'table', head: ['구성 요소', '뜻', '예'], rows: [
            ['<b>노드</b>', '대상 하나', '민수, 지영, 서울'],
            ['<b>레이블</b> (label)', '노드의 종류 · 이름표. 콜론(:)을 붙여 씀', '<code>:Person</code>, <code>:City</code>'],
            ['<b>속성</b> (property)', '노드나 관계에 붙은 <b>키: 값</b> 정보', '<code>name: \'민수\'</code>, <code>age: 17</code>'],
            ['<b>관계 타입</b> + <b>방향</b>', '관계의 종류와 화살표 방향', '<code>:KNOWS</code>(안다), <code>:LIVES_IN</code>(산다)']
          ] },
          { type: 'figure', html: FIG_LPG, caption: '그림 1-2. 속성 그래프. "Person 민수(17세)는 2020년부터 Person 지영을 알고(KNOWS), City 서울에 산다(LIVES_IN)."' },
          { type: 'p', html: '그림을 문장으로 읽어 보면 <b>주어(노드) – 동사(관계) – 목적어(노드)</b> 구조가 됩니다. "민수가 지영을 안다", "민수가 서울에 산다". 관계에도 <code>since: 2020</code> 처럼 속성을 붙일 수 있다는 점이 표와 다른 큰 특징입니다.' },
          { type: 'code', title: '예제 1-1. 속성 그래프를 Python 딕셔너리로 적어 보기', code: `# 노드: 레이블 + 속성
nodes = {
    'p1': {'label': 'Person', 'name': '민수', 'age': 17},
    'p2': {'label': 'Person', 'name': '지영', 'age': 16},
    'c1': {'label': 'City', 'name': '서울'},
}

# 관계: 출발 노드 -[타입 + 속성]-> 도착 노드
rels = [
    {'start': 'p1', 'type': 'KNOWS', 'end': 'p2', 'since': 2020},
    {'start': 'p1', 'type': 'LIVES_IN', 'end': 'c1'},
]

for r in rels:
    a = nodes[r['start']]
    b = nodes[r['end']]
    print(f"({a['name']}:{a['label']}) -[:{r['type']}]-> ({b['name']}:{b['label']})")`,
            expect: '(민수:Person) -[:KNOWS]-> (지영:Person)\n(민수:Person) -[:LIVES_IN]-> (서울:City)',
            desc: '괄호 <code>( )</code> 는 노드, 대괄호 <code>-[ ]-></code> 는 관계를 나타내도록 출력했습니다. 이 모양은 나중에 배울 Neo4j 의 질의 언어와 닮아 있으니 눈에 익혀 두세요.' },
          { type: 'h', text: '방향 그래프 vs 무방향 그래프, 차수와 이웃' },
          { type: 'p', html: '"민수와 지영은 친구이다"는 양쪽이 같은 관계이므로 화살표가 필요 없습니다 → <b>무방향 그래프</b>. 반면 SNS 의 "팔로우"는 내가 상대를 팔로우해도 상대는 나를 팔로우하지 않을 수 있으므로 화살표가 있어야 합니다 → <b>방향 그래프</b>.' },
          { type: 'figure', html: FIG_DIR, caption: '그림 1-3. 왼쪽: 무방향 그래프에서 B 의 차수는 3. 오른쪽: 방향 그래프에서는 들어오는 선과 나가는 선을 따로 셉니다.' },
          { type: 'list', items: [
            '<b>이웃(neighbor)</b> — 어떤 노드와 선 하나로 바로 연결된 노드들. B 의 이웃은 A, C, D.',
            '<b>차수(degree)</b> — 이웃(연결된 선)의 개수. 친구 그래프에서는 "친구 수"와 같습니다.',
            '방향 그래프에서는 <b>들어오는 차수(in-degree, 팔로워 수)</b>와 <b>나가는 차수(out-degree, 팔로잉 수)</b>로 나눕니다.'
          ] },
          { type: 'callout', kind: 'tip', title: 'Neo4j 의 관계는 항상 방향이 있어요', html: 'Neo4j 에 저장되는 관계는 모두 화살표 방향을 가집니다. "친구"처럼 방향이 의미 없는 관계는 한쪽 방향으로만 저장하고, 찾을 때 <b>방향을 무시하고</b> 찾는 방식을 씁니다. 자세한 방법은 Cypher 를 배울 때 다룹니다.' },
          { type: 'h', text: 'Python 으로 그래프 표현하기' },
          { type: 'p', html: '그래프를 컴퓨터에 담는 대표적인 방법은 두 가지입니다. <b>간선 목록(edge list)</b>은 "선 하나 = 한 줄"로 연결을 나열한 것이고, <b>인접 리스트(adjacency list)</b>는 "노드마다 이웃 목록"을 딕셔너리로 정리한 것입니다.' },
          { type: 'figure', html: FIG_ADJ, caption: '그림 1-4. 같은 그래프를 인접 리스트와 간선 목록으로 표현. 무방향 그래프의 인접 리스트에서는 A-B 연결이 A 쪽과 B 쪽에 한 번씩 적힙니다.' },
          { type: 'code', title: '예제 1-2. 인접 리스트로 이웃과 차수 구하기', code: `# 인접 리스트: 노드 -> 이웃 목록
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'C', 'D'],
    'C': ['A', 'B'],
    'D': ['B'],
}

print('B 의 이웃:', graph['B'])
print('B 의 차수:', len(graph['B']))
print('C 와 D 는 이웃인가?', 'D' in graph['C'])

for node, neighbors in graph.items():
    print(node, '차수 =', len(neighbors))`,
            expect: "B 의 이웃: ['A', 'C', 'D']\nB 의 차수: 3\nC 와 D 는 이웃인가? False\nA 차수 = 2\nB 차수 = 3\nC 차수 = 2\nD 차수 = 1",
            desc: '인접 리스트는 "이 사람의 친구는?" 이라는 질문에 <code>graph[이름]</code> 한 번으로 답합니다. 이웃 목록의 길이가 곧 차수입니다.' },
          { type: 'code', title: '예제 1-3. 간선 목록을 인접 리스트로 바꾸기', code: `# 간선 목록: (한쪽, 다른쪽) 쌍을 나열
edges = [('A', 'B'), ('A', 'C'), ('B', 'C'), ('B', 'D')]

graph = {}
for a, b in edges:
    graph.setdefault(a, []).append(b)   # a 의 이웃에 b 추가
    graph.setdefault(b, []).append(a)   # 무방향이므로 b 의 이웃에도 a 추가

for node in sorted(graph):
    print(node, '->', graph[node])
print('선의 개수:', len(edges))
print('차수의 합:', sum(len(v) for v in graph.values()))`,
            expect: "A -> ['B', 'C']\nB -> ['A', 'C', 'D']\nC -> ['A', 'B']\nD -> ['B']\n선의 개수: 4\n차수의 합: 8",
            desc: '<code>setdefault(키, [])</code> 는 "키가 없으면 빈 리스트를 만들고, 그 리스트를 돌려줘"라는 뜻입니다. 선 하나가 양 끝 노드의 차수를 하나씩 올리므로 <b>차수의 합 = 선의 개수 × 2</b> 가 됩니다.' },
          { type: 'code', title: '예제 1-4. 방향 그래프: 팔로잉과 팔로워 세기', code: `# 방향 그래프: (팔로우하는 사람, 팔로우 받는 사람)
follows = [('A', 'B'), ('A', 'C'), ('B', 'C'), ('D', 'B')]

people = ['A', 'B', 'C', 'D']
for p in people:
    out_deg = sum(1 for a, b in follows if a == p)   # 내가 팔로우 (나가는 선)
    in_deg = sum(1 for a, b in follows if b == p)    # 나를 팔로우 (들어오는 선)
    print(p, '팔로잉', out_deg, '/ 팔로워', in_deg)`,
            expect: 'A 팔로잉 2 / 팔로워 0\nB 팔로잉 1 / 팔로워 2\nC 팔로잉 0 / 팔로워 2\nD 팔로잉 1 / 팔로워 0',
            desc: '그림 1-3 오른쪽 그래프를 그대로 옮긴 것입니다. 방향이 있으면 같은 선이라도 출발점에서는 "나감", 도착점에서는 "들어옴"으로 셉니다.' },
          { type: 'h', text: 'matplotlib 로 그래프 그려 보기' },
          { type: 'p', html: '그래프를 눈으로 보려면 노드마다 <b>좌표(x, y)</b>를 정해 점을 찍고, 간선마다 두 점을 <b>선으로 이으면</b> 됩니다. 별도 라이브러리 없이 matplotlib 만으로 충분합니다.' },
          { type: 'code', title: '예제 1-5. 좌표를 정해 점 찍고 선 긋기', code: `import matplotlib.pyplot as plt
plt.rcParams['font.family'] = 'Malgun Gothic'

edges = [('A', 'B'), ('A', 'C'), ('B', 'C'), ('B', 'D')]
pos = {'A': (0, 1), 'B': (2, 1), 'C': (0, 0), 'D': (2, 0)}   # 노드 좌표

plt.figure(figsize=(6, 4))
for a, b in edges:                       # 1) 선 먼저 긋기
    x1, y1 = pos[a]
    x2, y2 = pos[b]
    plt.plot([x1, x2], [y1, y2], color='gray', zorder=1)
for name, (x, y) in pos.items():         # 2) 그 위에 점 찍고 이름 쓰기
    plt.scatter(x, y, s=900, color='tab:blue', zorder=2)
    plt.text(x, y, name, color='white', ha='center', va='center', fontsize=14, zorder=3)

plt.title('나의 첫 그래프 그림')
plt.axis('off')
plt.show()`,
            desc: '선을 먼저 그리고 점을 나중에 그려야 선이 점 아래로 깔립니다(<code>zorder</code> 가 클수록 위). 좌표만 바꾸면 모양이 달라질 뿐, 연결 구조는 그대로입니다.' },
          { type: 'callout', kind: 'more', title: '좌표는 어떻게 정할까?', html: '노드가 많아지면 사람이 좌표를 일일이 정하기 어렵습니다. 이때는 연결된 점끼리 가깝게 자동 배치해 주는 알고리즘(예: 스프링 레이아웃)을 씁니다. Neo4j 의 화면도 이런 방식으로 그래프를 자동 배치해 보여 줍니다.' },
          { type: 'h', text: '함께 해 보기: 우리 반 친구 관계' },
          { type: 'p', html: '우리 반 친구 6명의 "아는 사이"를 간선 목록으로 적고, 인접 리스트로 바꾼 뒤 <b>친구가 가장 많은 사람</b>과 그 친구 목록을 찾아 그림으로 그려 봅시다.' },
          { type: 'code', title: '예제 1-6. 친구가 가장 많은 사람 찾고 그리기', code: `import matplotlib.pyplot as plt
plt.rcParams['font.family'] = 'Malgun Gothic'

edges = [('민수', '지영'), ('민수', '서준'), ('지영', '서준'),
         ('서준', '하은'), ('서준', '도윤'), ('하은', '수아')]

# 1) 인접 리스트 만들기
graph = {}
for a, b in edges:
    graph.setdefault(a, []).append(b)
    graph.setdefault(b, []).append(a)

# 2) 친구가 가장 많은 사람
for name, friends in graph.items():
    print(name, len(friends), '명:', friends)
star = max(graph, key=lambda n: len(graph[n]))
print('친구가 가장 많은 사람:', star, graph[star])

# 3) 그림 그리기 (친구왕은 주황색)
pos = {'민수': (0, 2), '지영': (0, 0), '서준': (2, 1),
       '하은': (4, 2), '도윤': (4, 0), '수아': (6, 2)}
plt.figure(figsize=(8, 4))
for a, b in edges:
    plt.plot([pos[a][0], pos[b][0]], [pos[a][1], pos[b][1]], color='gray', zorder=1)
for name, (x, y) in pos.items():
    color = 'tab:orange' if name == star else 'tab:blue'
    plt.scatter(x, y, s=1400, color=color, zorder=2)
    plt.text(x, y, name, color='white', ha='center', va='center', fontsize=12, zorder=3)
plt.axis('off')
plt.show()`,
            expect: "민수 2 명: ['지영', '서준']\n지영 2 명: ['민수', '서준']\n서준 4 명: ['민수', '지영', '하은', '도윤']\n하은 2 명: ['서준', '수아']\n도윤 1 명: ['서준']\n수아 1 명: ['하은']\n친구가 가장 많은 사람: 서준 ['민수', '지영', '하은', '도윤']",
            desc: '<code>max(graph, key=...)</code> 는 "이웃 목록 길이가 가장 큰 키"를 돌려줍니다. 간선 목록에 친구 쌍을 추가 · 삭제하며 결과와 그림이 어떻게 바뀌는지 직접 실험해 보세요.' },
          { type: 'callout', kind: 'warn', title: '자주 하는 실수', html: '무방향 그래프에서 <code>graph[b].append(a)</code> 를 빠뜨리면 "민수는 지영을 아는데 지영은 민수를 모르는" 이상한 그래프가 됩니다. 친구 관계처럼 양쪽이 같은 관계라면 <b>양쪽 모두</b>에 적어야 합니다.' }
        ],
        slides: [
          { layout: 'title', title: '그래프로 세상 보기', subtitle: '점과 선: 그래프 데이터 모델',
            notes: '<p>강좌 첫 시간. 오늘은 Neo4j 를 설치하지 않고, Python 으로 "그래프란 무엇인가"부터 손으로 익힌다고 안내합니다. (1분)</p>' },
          { layout: 'diagram', title: '생활 속 그래프', html: FIG_LIFE, caption: '지하철 · SNS · 가계도 = 점과 선',
            notes: '<p>💬 <b>발문:</b> "점과 선으로 그릴 수 있는 것을 더 찾아볼까요?" → 예상 답: 도로 지도, 웹 페이지 링크, 택배 경로, 먹이사슬.</p><p>막대그래프와 다른 의미라는 점을 짚습니다. (5분)</p>' },
          { layout: 'diagram', title: '속성 그래프: 노드 · 레이블 · 속성 · 관계', html: FIG_LPG, caption: '주어(노드) – 동사(관계) – 목적어(노드)',
            notes: '<p>그림을 문장으로 읽게 합니다: "민수는 지영을 안다", "민수는 서울에 산다".</p><p>레이블 = 종류, 속성 = 키:값, 관계에도 속성이 붙는다는 점 강조. (8분)</p>' },
          { layout: 'code', title: '인접 리스트로 이웃과 차수', code: `edges = [('A', 'B'), ('A', 'C'), ('B', 'C'), ('B', 'D')]

graph = {}
for a, b in edges:
    graph.setdefault(a, []).append(b)
    graph.setdefault(b, []).append(a)

for node in sorted(graph):
    print(node, graph[node], '차수', len(graph[node]))`,
            points: ['간선 목록 → 인접 리스트', '무방향이면 양쪽에 모두 추가', '차수 = 이웃 목록의 길이'],
            notes: '<p>▶ 실행 후 <code>graph[b].append(a)</code> 줄을 지우고 다시 실행해 결과가 어떻게 틀어지는지 보여 줍니다. (10분)</p><p>이어서 예제 1-6 (우리 반 친구) 을 학생들이 직접 실행 · 수정하게 합니다.</p>' },
          { layout: 'summary', title: '정리', bullets: ['그래프 = <b>노드(점)</b> + <b>관계(선)</b>', '속성 그래프: 레이블(<code>:Person</code>) · 속성(<code>name</code>) · 관계 타입(<code>:KNOWS</code>) · 방향', '차수 = 이웃 수, 방향 그래프는 들어옴 / 나감', 'Python: 인접 리스트(딕셔너리) · 간선 목록(리스트)', '다음 교시: 같은 데이터를 <b>표</b>로 저장하면?'],
            notes: '<p>출구 질문: "B 의 차수가 3 이라는 말은 무슨 뜻인가요?" (3분)</p>' }
        ]
      },
      {
        id: 'ch01-2',
        title: '왜 그래프 데이터베이스인가',
        minutes: 50,
        goals: ['같은 데이터를 표와 그래프로 저장해 비교한다', '"n단계 건너 아는 사람"을 JOIN 과 따라가기 두 방식으로 구한다', '그래프 DB 의 쓰임새와 Neo4j 를 소개할 수 있다'],
        flow: [['도입 · 표로 저장하기', 8], ['JOIN 의 개념', 10], ['친구의 친구 비교', 15], ['함께 해 보기', 9], ['쓰임새 · Neo4j · 정리', 8]],
        content: [
          { type: 'p', html: '지난 교시에 친구 관계를 점과 선으로 표현했습니다. 그런데 회사나 학교의 데이터는 대부분 엑셀처럼 생긴 <b>표</b>에 저장되어 있습니다. 표로 데이터를 저장하는 데이터베이스를 <b>관계형 데이터베이스(RDB)</b>라고 하며, MySQL · Oracle 등이 대표적입니다. 이번 교시에는 같은 친구 데이터를 표로 저장해 보고, 그래프와 무엇이 다른지 비교합니다.' },
          { type: 'h', text: '같은 데이터를 표로 저장하기' },
          { type: 'p', html: '표 방식에서는 보통 <b>사람 테이블</b>과 <b>친구 테이블</b>을 따로 만듭니다. 사람마다 번호(<code>id</code>)를 붙이고, 친구 테이블에는 "누가(me) 누구와(friend) 친구인지"를 <b>번호 쌍</b>으로 적습니다.' },
          { type: 'figure', html: FIG_TABLES, caption: '그림 1-5. 사람 테이블과 친구 테이블. 이름을 알려면 친구 테이블의 번호를 사람 테이블의 id 와 맞춰 이어 붙여야(JOIN) 합니다.' },
          { type: 'p', html: '두 표를 <b>같은 값을 기준으로 이어 붙이는 것</b>을 <b>JOIN</b>이라고 합니다. pandas 에서는 <code>merge()</code> 가 같은 일을 합니다.' },
          { type: 'code', title: '예제 2-1. 사람 표 · 친구 표 만들고 JOIN 하기', code: `import pandas as pd

people = pd.DataFrame({
    'id':   [1, 2, 3, 4, 5, 6],
    'name': ['민수', '지영', '서준', '하은', '도윤', '수아'],
    'age':  [17, 16, 17, 16, 17, 16],
})
pairs = [(1, 2), (1, 3), (2, 3), (3, 4), (3, 5), (4, 6)]
# 친구는 양쪽이 같은 관계 -> (a, b) 와 (b, a) 를 모두 저장
friends = pd.DataFrame(pairs + [(b, a) for a, b in pairs], columns=['me', 'friend'])
print('친구 테이블 행 수:', len(friends))

# 민수(id=1)의 친구 번호 -> 사람 표와 JOIN 해서 이름 얻기
minsu = friends[friends['me'] == 1]
result = minsu.merge(people, left_on='friend', right_on='id')
display(result[['me', 'friend', 'name']])
print('민수의 친구:', sorted(result['name']))`,
            expect: "친구 테이블 행 수: 12\n   me  friend name\n0   1       2   지영\n1   1       3   서준\n민수의 친구: ['서준', '지영']",
            desc: '<code>merge(people, left_on=\'friend\', right_on=\'id\')</code> 는 "친구 표의 friend 번호와 사람 표의 id 가 같은 행끼리 붙여라"라는 뜻입니다. 표에서는 연결이 <b>번호로만</b> 저장되어 있어 이름 하나를 얻는 데도 JOIN 이 필요합니다.' },
          { type: 'h', text: '"친구의 친구"를 찾아라' },
          { type: 'p', html: 'SNS 가 "알 수도 있는 친구"를 추천하려면 <b>내 친구의 친구 중 아직 내 친구가 아닌 사람</b>을 찾아야 합니다. 이것을 "2단계(2-hop) 건너 아는 사람"이라고 합니다. 단계가 3, 4 로 늘어나면 두 방식의 차이가 점점 커집니다.' },
          { type: 'figure', html: FIG_HOPS, caption: '그림 1-6. 표 방식은 단계마다 친구 표를 한 번 더 JOIN 하고, 그래프 방식은 이웃 목록을 보고 한 칸씩 이동합니다.' },
          { type: 'code', title: '예제 2-2. 표 방식: merge 를 반복해 2단계 친구 찾기', code: `import pandas as pd

people = pd.DataFrame({'id': [1, 2, 3, 4, 5, 6],
                       'name': ['민수', '지영', '서준', '하은', '도윤', '수아']})
pairs = [(1, 2), (1, 3), (2, 3), (3, 4), (3, 5), (4, 6)]
friends = pd.DataFrame(pairs + [(b, a) for a, b in pairs], columns=['me', 'friend'])

step1 = friends[friends['me'] == 1]                    # 1단계: 민수의 친구
step2 = step1.merge(friends, left_on='friend', right_on='me',
                    suffixes=('', '_2'))                # 2단계: JOIN 한 번 더
print('2단계 JOIN 결과 행 수:', len(step2))

direct = set(step1['friend'])
two_hop = set(step2['friend_2']) - direct - {1}         # 나 자신 · 이미 친구 제외
names = people[people['id'].isin(two_hop)]['name']      # 이름은 또 사람 표에서
print('2단계 건너 아는 사람:', sorted(names))`,
            expect: "2단계 JOIN 결과 행 수: 6\n2단계 건너 아는 사람: ['도윤', '하은']",
            desc: '친구 표를 <b>자기 자신과</b> 한 번 더 이어 붙였습니다. 3단계라면 <code>merge</code> 를 한 번 더, 4단계라면 또 한 번 더 써야 합니다.' },
          { type: 'code', title: '예제 2-3. 그래프 방식: 인접 리스트를 따라가기', code: `edges = [('민수', '지영'), ('민수', '서준'), ('지영', '서준'),
         ('서준', '하은'), ('서준', '도윤'), ('하은', '수아')]
graph = {}
for a, b in edges:
    graph.setdefault(a, []).append(b)
    graph.setdefault(b, []).append(a)

direct = set(graph['민수'])                # 1단계: 이웃 목록 보기
two_hop = set()
for f in direct:                           # 2단계: 친구의 이웃 목록 보기
    two_hop.update(graph[f])
two_hop = two_hop - direct - {'민수'}
print('2단계 건너 아는 사람:', sorted(two_hop))`,
            expect: "2단계 건너 아는 사람: ['도윤', '하은']",
            desc: '결과는 같지만 "표를 이어 붙이기" 대신 "지금 있는 사람의 이웃 목록 보기"만 반복했습니다. 이름이 노드에 바로 들어 있어 번호 → 이름 변환도 필요 없습니다.' },
          { type: 'h', text: '단계가 늘어나면?' },
          { type: 'p', html: '이번에는 단계 수 <code>k</code> 를 바꿔 가며 두 방식을 함수로 만들어 비교해 봅시다. 사람 200명, 한 사람당 친구가 평균 6명쯤인 가상의 학교를 만들어 <b>JOIN 중간 결과 표의 크기</b>를 세어 봅니다.' },
          { type: 'code', title: '예제 2-4. k단계: JOIN 중간 표 크기 vs 따라가며 만난 사람 수', code: `import random
import pandas as pd

random.seed(42)
N = 200
pairs = set()
while len(pairs) < 600:                       # 무작위 친구 쌍 600개
    a, b = random.sample(range(N), 2)
    pairs.add((min(a, b), max(a, b)))
pairs = sorted(pairs)
friends = pd.DataFrame(pairs + [(b, a) for a, b in pairs], columns=['me', 'friend'])

graph = {i: [] for i in range(N)}
for a, b in pairs:
    graph[a].append(b)
    graph[b].append(a)

def table_hops(start, k):
    t = friends[friends['me'] == start][['friend']].rename(columns={'friend': 'cur'})
    for _ in range(k - 1):                    # 단계마다 JOIN 한 번
        t = t.merge(friends, left_on='cur', right_on='me')[['friend']]
        t = t.rename(columns={'friend': 'cur'})
    return len(t), set(t['cur'])

def graph_hops(start, k):
    frontier, seen = {start}, {start}
    for _ in range(k):                        # 단계마다 이웃 목록 보기
        frontier = {n for f in frontier for n in graph[f]} - seen
        seen |= frontier
    return len(seen) - 1, frontier

for k in [1, 2, 3, 4]:
    rows, _ = table_hops(0, k)
    met, _ = graph_hops(0, k)
    print(f'{k}단계: JOIN 중간 표 {rows:5d}행 | 그래프로 만난 사람 {met:3d}명')`,
            expect: '1단계: JOIN 중간 표     8행 | 그래프로 만난 사람   8명\n2단계: JOIN 중간 표    56행 | 그래프로 만난 사람  53명\n3단계: JOIN 중간 표   387행 | 그래프로 만난 사람 169명\n4단계: JOIN 중간 표  2723행 | 그래프로 만난 사람 198명',
            desc: '표 방식은 같은 사람을 여러 경로로 반복해서 만나므로 중간 표가 단계마다 몇 배씩 커집니다. 그래프 방식은 이미 만난 사람(<code>seen</code>)을 건너뛰므로 최대 전체 인원(200명)을 넘지 않습니다.' },
          { type: 'callout', kind: 'info', title: '표가 나쁜 것은 아니에요', html: '매출 합계, 월별 통계처럼 <b>같은 모양의 데이터를 많이 모아 계산</b>하는 일은 표(관계형 DB)가 훨씬 잘합니다. 그래프 DB 는 <b>연결을 여러 단계 따라가는</b> 질문에 강합니다. 둘은 경쟁자라기보다 잘하는 일이 다른 도구입니다.' },
          { type: 'h', text: '함께 해 보기: 두 방식으로 같은 답 구하기' },
          { type: 'p', html: '같은 친구 데이터를 DataFrame 과 인접 리스트로 각각 만들고, 모든 사람에 대해 "2단계 건너 아는 사람"을 두 방식으로 구해 결과가 같은지 확인해 봅시다.' },
          { type: 'code', title: '예제 2-5. 표 방식과 그래프 방식 결과 비교', code: `import pandas as pd

edges = [('민수', '지영'), ('민수', '서준'), ('지영', '서준'),
         ('서준', '하은'), ('서준', '도윤'), ('하은', '수아')]

# (1) 표 방식
friends = pd.DataFrame(edges + [(b, a) for a, b in edges], columns=['me', 'friend'])
def two_hop_table(name):
    s1 = friends[friends['me'] == name]
    s2 = s1.merge(friends, left_on='friend', right_on='me', suffixes=('', '_2'))
    return set(s2['friend_2']) - set(s1['friend']) - {name}

# (2) 그래프 방식
graph = {}
for a, b in edges:
    graph.setdefault(a, []).append(b)
    graph.setdefault(b, []).append(a)
def two_hop_graph(name):
    result = set()
    for f in graph[name]:
        result.update(graph[f])
    return result - set(graph[name]) - {name}

for p in graph:
    t, g = two_hop_table(p), two_hop_graph(p)
    print(p, sorted(g), '같음' if t == g else '다름!')`,
            expect: "민수 ['도윤', '하은'] 같음\n지영 ['도윤', '하은'] 같음\n서준 ['수아'] 같음\n하은 ['도윤', '민수', '지영'] 같음\n도윤 ['민수', '지영', '하은'] 같음\n수아 ['서준'] 같음",
            desc: '두 함수의 결과는 같습니다. 표 방식은 <b>열 이름 · suffixes · JOIN 조건</b>을 신경 써야 하고, 그래프 방식은 "이웃의 이웃"이라는 생각을 그대로 코드로 옮겼습니다. 3단계로 늘리려면 각각 어디를 고쳐야 할지 생각해 보세요.' },
          { type: 'h', text: '그래프 데이터베이스가 쓰이는 곳' },
          { type: 'table', head: ['분야', '노드', '관계', '그래프로 묻는 질문'], rows: [
            ['🛍️ 추천', '고객, 상품', '구매했다, 좋아한다', '나와 비슷한 상품을 산 사람이 또 산 상품은?'],
            ['🛡️ 사기 탐지', '계좌, 전화번호, 기기', '송금했다, 사용했다', '여러 계좌가 같은 기기 · 번호로 얽혀 있나?'],
            ['🧠 지식그래프', '사람, 장소, 개념', '태어났다, ~의 한 종류다', '이 개념과 관련된 지식은 무엇이 있나?'],
            ['🌐 네트워크 · 공급망', '공장, 부품, 서버', '공급한다, 연결된다', '이 부품 공장이 멈추면 영향을 받는 제품은?']
          ], caption: '"연결을 여러 단계 따라가는 질문"이 많을수록 그래프 DB 가 빛납니다' },
          { type: 'callout', kind: 'more', title: '지식그래프 미리 보기', html: '검색창에 인물 이름을 치면 옆에 나이 · 출생지 · 가족 · 작품이 정리된 상자가 뜨지요? 이것이 지식그래프의 대표적인 예입니다. 다음 차시에서 <b>온톨로지</b>와 함께 자세히 배웁니다.' },
          { type: 'h', text: 'Neo4j 소개' },
          { type: 'p', html: '<b>Neo4j</b>(네오포제이)는 가장 널리 쓰이는 그래프 데이터베이스입니다. 오늘 배운 <b>속성 그래프</b>를 그대로 저장하고, 노드마다 이웃으로 가는 연결을 직접 가지고 있어 "선 따라가기"가 빠릅니다.' },
          { type: 'list', items: [
            '<b>Cypher(사이퍼)</b> — Neo4j 의 질의 언어. <code>(민수)-[:KNOWS]->(지영)</code> 처럼 <b>그림을 글자로 그리듯</b> 질문을 씁니다. 예제 1-1 에서 출력한 모양과 비슷하지요.',
            '<b>AuraDB Free</b> — 설치 없이 웹 브라우저로 쓰는 무료 클라우드 버전.',
            '<b>Neo4j Desktop</b> — 내 PC 에 설치해 쓰는 무료 프로그램.'
          ] },
          { type: 'callout', kind: 'tip', title: '이름에 주의!', html: '"Node4j" 가 아니라 <b>Neo4j</b> 입니다 (N-e-o). 검색할 때 철자를 정확히 입력하세요. 설치와 첫 실행은 3차시에서 함께 합니다.' }
        ],
        slides: [
          { layout: 'title', title: '왜 그래프 데이터베이스인가', subtitle: '표(JOIN) vs 그래프(따라가기)',
            notes: '<p>💬 <b>발문:</b> "학교 학생 명단은 보통 어떤 모양으로 저장되어 있을까요?" → 엑셀 표. 오늘은 친구 관계를 표로 저장해 보고 그래프와 비교합니다. (2분)</p>' },
          { layout: 'diagram', title: '표로 저장하면: 사람 표 + 친구 표', html: FIG_TABLES, caption: '연결은 번호 쌍, 이름은 JOIN 으로',
            notes: '<p>JOIN = "같은 번호끼리 짝 맞추기". 실제로 학생 두 명에게 각각 표를 들게 하고 번호로 맞춰 보는 활동도 좋습니다. (8분)</p><p>이어서 예제 2-1 을 실행합니다.</p>' },
          { layout: 'code', title: '친구의 친구: 그래프 방식', code: `edges = [('민수', '지영'), ('민수', '서준'), ('지영', '서준'),
         ('서준', '하은'), ('서준', '도윤'), ('하은', '수아')]
graph = {}
for a, b in edges:
    graph.setdefault(a, []).append(b)
    graph.setdefault(b, []).append(a)

direct = set(graph['민수'])
two_hop = set()
for f in direct:
    two_hop.update(graph[f])
print(sorted(two_hop - direct - {'민수'}))`,
            points: ['이웃 목록 → 이웃의 이웃 목록', '번호 → 이름 변환 불필요', '표 방식(예제 2-2)과 결과 비교'],
            notes: '<p>예제 2-2(merge)와 나란히 띄워 비교합니다. 💬 "3단계로 늘리려면 각각 무엇을 바꿔야 할까?" → 표: merge 한 번 더 / 그래프: for 문 한 번 더(또는 반복). (12분)</p><p>예제 2-4 로 중간 표가 커지는 것을 보여 줍니다.</p>' },
          { layout: 'table', title: '그래프 DB 가 쓰이는 곳', head: ['분야', '그래프로 묻는 질문'], rows: [
            ['추천', '비슷한 사람이 또 산 상품은?'],
            ['사기 탐지', '계좌들이 같은 기기로 얽혀 있나?'],
            ['지식그래프', '이 개념과 관련된 지식은?'],
            ['공급망', '이 공장이 멈추면 영향받는 제품은?']
          ], lead: 'Neo4j = 대표 그래프 DB · 질의 언어 Cypher · AuraDB Free / Desktop',
            notes: '<p>"Node4j" 가 아니라 Neo4j 철자 주의. 설치는 3차시, 다음 차시는 온톨로지와 지식그래프. (5분)</p>' },
          { layout: 'summary', title: '정리', bullets: ['표(RDB): 연결을 <b>번호 쌍</b>으로 저장 → 단계마다 <b>JOIN</b>', '그래프: 노드가 이웃을 바로 앎 → <b>선 따라가기</b>', '여러 단계 연결 질문일수록 그래프가 유리', '활용: 추천 · 사기 탐지 · 지식그래프 · 공급망', '<b>Neo4j</b> + <b>Cypher</b> — 다음 차시: 온톨로지와 지식그래프'],
            notes: '<p>출구 질문: "친구의 친구의 친구를 찾을 때 표 방식이 불편한 이유를 한 문장으로." (3분)</p>' }
        ]
      }
    ]
  });
})();
