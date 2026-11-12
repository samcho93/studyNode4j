/* 04차시 Cypher 기초: 만들고 찾기 */
(function () {
  const ARROW = (id) => `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fill-arrow"/></marker></defs>`;

  /* 원 두 개 사이의 화살표 (원 테두리에서 시작 · 끝) */
  function edge(a, b, r, mk, label, cls) {
    const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / d, uy = dy / d;
    const x1 = (a[0] + ux * r).toFixed(1), y1 = (a[1] + uy * r).toFixed(1);
    const x2 = (b[0] - ux * (r + 3)).toFixed(1), y2 = (b[1] - uy * (r + 3)).toFixed(1);
    let s = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls || 'ln'}" stroke-width="2" marker-end="url(#${mk})"/>`;
    if (label) s += `<text x="${((a[0] + b[0]) / 2).toFixed(1)}" y="${((a[1] + b[1]) / 2 - 4).toFixed(1)}" text-anchor="middle" class="tx-m">${label}</text>`;
    return s;
  }
  function circ(p, r, cls, t1, t2) {
    let s = `<circle cx="${p[0]}" cy="${p[1]}" r="${r}" class="${cls}"/>`;
    if (t2) s += `<text x="${p[0]}" y="${p[1] - 3}" text-anchor="middle" class="tx-w">${t1}</text><text x="${p[0]}" y="${p[1] + 15}" text-anchor="middle" class="tx-w">${t2}</text>`;
    else s += `<text x="${p[0]}" y="${p[1] + 5}" text-anchor="middle" class="tx-w">${t1}</text>`;
    return s;
  }

  /* 그림 4-1. 그림과 Cypher 글자 비교 */
  const FIG_ASCII = `<svg viewBox="0 0 720 280" role="img" aria-label="위쪽은 송강호 동그라미에서 기생충 동그라미로 ACTED_IN 화살표가 있는 그림, 아래쪽은 같은 내용을 괄호와 화살표 글자로 쓴 Cypher 패턴">
  ${ARROW('c04a1')}
  <rect x="10" y="10" width="700" height="120" rx="14" class="card-bg"/>
  <text x="30" y="36" class="tx-b">① 칠판에 그린 그림</text>
  ${circ([200, 78], 38, 'p1', '송강호')}
  ${circ([520, 78], 38, 'p3', '기생충')}
  <line x1="240" y1="78" x2="476" y2="78" class="ln" stroke-width="2.5" marker-end="url(#c04a1)"/>
  <text x="360" y="70" text-anchor="middle" class="tx-b">ACTED_IN</text>
  <rect x="10" y="145" width="700" height="125" rx="14" class="p5s"/>
  <text x="30" y="171" class="tx-b">② 키보드로 쓴 그림 = Cypher 패턴</text>
  <text x="360" y="212" text-anchor="middle" class="tx-b">(송강호)  -[:ACTED_IN]->  (기생충)</text>
  <text x="170" y="250" text-anchor="middle" class="tx-m">( ) 괄호 = 동그라미(노드)</text>
  <text x="360" y="250" text-anchor="middle" class="tx-m">-[ ]-> = 화살표(관계)</text>
  <text x="560" y="250" text-anchor="middle" class="tx-m">-> 의 &gt; = 화살촉(방향)</text>
</svg>`;

  /* 그림 4-2. 노드 패턴 해부도 */
  const FIG_NODE = `<svg viewBox="0 0 720 250" role="img" aria-label="노드 패턴 p 콜론 Person 중괄호 name 송강호 born 1967 을 변수, 레이블, 속성 세 부분으로 나눈 해부도">
  ${ARROW('c04a2')}
  <text x="360" y="42" text-anchor="middle" class="tx-b">(  p  :Person  {name: '송강호', born: 1967}  )</text>
  <rect x="40" y="100" width="190" height="110" rx="12" class="p2"/>
  <text x="135" y="130" text-anchor="middle" class="tx-w">p</text>
  <text x="135" y="156" text-anchor="middle" class="tx-w">변수 (이름표)</text>
  <text x="135" y="180" text-anchor="middle" class="tx-w">이 문장 안에서만</text>
  <text x="135" y="198" text-anchor="middle" class="tx-w">부르는 별명 · 생략 가능</text>
  <rect x="265" y="100" width="190" height="110" rx="12" class="p1"/>
  <text x="360" y="130" text-anchor="middle" class="tx-w">:Person</text>
  <text x="360" y="156" text-anchor="middle" class="tx-w">레이블 (종류)</text>
  <text x="360" y="180" text-anchor="middle" class="tx-w">콜론 : 뒤에 씀</text>
  <text x="360" y="198" text-anchor="middle" class="tx-w">여러 개 가능 :Person:Actor</text>
  <rect x="490" y="100" width="190" height="110" rx="12" class="p5s"/>
  <text x="585" y="130" text-anchor="middle" class="tx-b">{키: 값, …}</text>
  <text x="585" y="156" text-anchor="middle" class="tx-b">속성 (정보)</text>
  <text x="585" y="180" text-anchor="middle" class="tx-m">중괄호 안, 쉼표로 구분</text>
  <text x="585" y="198" text-anchor="middle" class="tx-m">문자열은 '작은따옴표'</text>
  <line x1="145" y1="52" x2="135" y2="96" class="ln" stroke-width="2" marker-end="url(#c04a2)"/>
  <line x1="215" y1="52" x2="340" y2="96" class="ln" stroke-width="2" marker-end="url(#c04a2)"/>
  <line x1="420" y1="52" x2="560" y2="96" class="ln" stroke-width="2" marker-end="url(#c04a2)"/>
  <text x="360" y="238" text-anchor="middle" class="tx-m">세 부분 모두 생략할 수 있습니다: ( ) 만 써도 "아무 노드 하나"</text>
</svg>`;

  /* 그림 4-3. 관계 패턴 해부도 */
  const FIG_REL = `<svg viewBox="0 0 720 250" role="img" aria-label="관계 패턴 대시 대괄호 r 콜론 ACTED_IN 중괄호 role 기택 대괄호 대시 화살표를 변수, 관계 타입, 속성, 방향 네 부분으로 나눈 해부도">
  ${ARROW('c04a3')}
  <text x="360" y="42" text-anchor="middle" class="tx-b">-[  r  :ACTED_IN  {role: '기택'}  ]-&gt;</text>
  <rect x="20" y="100" width="160" height="110" rx="12" class="p2"/>
  <text x="100" y="130" text-anchor="middle" class="tx-w">r</text>
  <text x="100" y="156" text-anchor="middle" class="tx-w">변수 (이름표)</text>
  <text x="100" y="180" text-anchor="middle" class="tx-w">생략 가능</text>
  <rect x="195" y="100" width="160" height="110" rx="12" class="p4"/>
  <text x="275" y="130" text-anchor="middle" class="tx-w">:ACTED_IN</text>
  <text x="275" y="156" text-anchor="middle" class="tx-w">관계 타입</text>
  <text x="275" y="180" text-anchor="middle" class="tx-w">만들 때는 꼭 1개</text>
  <rect x="370" y="100" width="160" height="110" rx="12" class="p5s"/>
  <text x="450" y="130" text-anchor="middle" class="tx-b">{role: '기택'}</text>
  <text x="450" y="156" text-anchor="middle" class="tx-b">관계의 속성</text>
  <text x="450" y="180" text-anchor="middle" class="tx-m">선 위에 붙는 정보</text>
  <rect x="545" y="100" width="160" height="110" rx="12" class="p3"/>
  <text x="625" y="130" text-anchor="middle" class="tx-w">-&gt;  또는  &lt;-</text>
  <text x="625" y="156" text-anchor="middle" class="tx-w">방향 (화살촉)</text>
  <text x="625" y="180" text-anchor="middle" class="tx-w">만들 때는 꼭 필요</text>
  <line x1="268" y1="52" x2="100" y2="96" class="ln" stroke-width="2" marker-end="url(#c04a3)"/>
  <line x1="330" y1="52" x2="275" y2="96" class="ln" stroke-width="2" marker-end="url(#c04a3)"/>
  <line x1="420" y1="52" x2="450" y2="96" class="ln" stroke-width="2" marker-end="url(#c04a3)"/>
  <line x1="490" y1="52" x2="620" y2="96" class="ln" stroke-width="2" marker-end="url(#c04a3)"/>
  <text x="360" y="238" text-anchor="middle" class="tx-m">대괄호 [ ] 는 화살표 줄기 가운데에 끼워 넣는 "꼬리표" 라고 생각하세요</text>
</svg>`;

  /* 그림 4-4. 실습 그래프 (영화 3 · 배우 5 · 감독 2) */
  const G1 = {
    bong: [220, 55], park: [560, 55],
    monster: [120, 175], parasite: [340, 175], oldboy: [560, 175],
    bae: [55, 295], song: [185, 295], lee: [315, 295], jo: [445, 295], choi: [600, 295]
  };
  const FIG_PRACTICE = `<svg viewBox="0 0 720 340" role="img" aria-label="감독 봉준호와 박찬욱이 위에, 영화 괴물 기생충 올드보이가 가운데, 배우 배두나 송강호 이선균 조여정 최민식이 아래에 있고 DIRECTED 와 ACTED_IN 화살표로 연결된 그래프">
  ${ARROW('c04a4')}
  ${edge(G1.bong, G1.monster, 30, 'c04a4', 'DIRECTED')}
  ${edge(G1.bong, G1.parasite, 30, 'c04a4', 'DIRECTED')}
  ${edge(G1.park, G1.oldboy, 30, 'c04a4', 'DIRECTED')}
  ${edge(G1.bae, G1.monster, 30, 'c04a4', '남주')}
  ${edge(G1.song, G1.monster, 30, 'c04a4', '강두')}
  ${edge(G1.song, G1.parasite, 30, 'c04a4', '기택')}
  ${edge(G1.lee, G1.parasite, 30, 'c04a4', '동익')}
  ${edge(G1.jo, G1.parasite, 30, 'c04a4', '연교')}
  ${edge(G1.choi, G1.oldboy, 30, 'c04a4', '오대수')}
  ${circ(G1.bong, 30, 'p2', '봉준호')}
  ${circ(G1.park, 30, 'p2', '박찬욱')}
  ${circ(G1.monster, 30, 'p3', '괴물')}
  ${circ(G1.parasite, 30, 'p3', '기생충')}
  ${circ(G1.oldboy, 30, 'p3', '올드보이')}
  ${circ(G1.bae, 30, 'p1', '배두나')}
  ${circ(G1.song, 30, 'p1', '송강호')}
  ${circ(G1.lee, 30, 'p1', '이선균')}
  ${circ(G1.jo, 30, 'p1', '조여정')}
  ${circ(G1.choi, 30, 'p1', '최민식')}
  <text x="700" y="60" text-anchor="end" class="tx-m">감독 (Person)</text>
  <text x="700" y="180" text-anchor="end" class="tx-m">영화 (Movie)</text>
  <text x="700" y="336" text-anchor="end" class="tx-m">배우 (Person) · 화살표 글자 = role</text>
</svg>`;

  /* 그림 4-5. MATCH = 본(틀)을 그래프에 대 보기 */
  const G2 = { song: [440, 170], parasite: [620, 80], monster: [620, 260], lee: [300, 60], bong: [300, 280] };
  const FIG_MATCH = `<svg viewBox="0 0 720 340" role="img" aria-label="왼쪽 패턴 틀 송강호 Person 에서 ACTED_IN 화살표로 Movie 를 오른쪽 그래프에 대 보면 송강호에서 기생충과 괴물로 가는 두 화살표가 굵게 강조되어 찾아짐">
  ${ARROW('c04a5')}
  <rect x="10" y="10" width="240" height="320" rx="14" class="p5s"/>
  <text x="130" y="38" text-anchor="middle" class="tx-b">찾는 틀 (패턴)</text>
  <circle cx="130" cy="100" r="40" class="p1s"/>
  <text x="130" y="96" text-anchor="middle" class="tx">p:Person</text>
  <text x="130" y="114" text-anchor="middle" class="tx-m">name='송강호'</text>
  <line x1="130" y1="142" x2="130" y2="212" class="ln" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#c04a5)"/>
  <text x="140" y="182" class="tx-m">:ACTED_IN</text>
  <circle cx="130" cy="256" r="40" class="p3s"/>
  <text x="130" y="261" text-anchor="middle" class="tx">m:Movie</text>
  <rect x="265" y="10" width="445" height="320" rx="14" class="card-bg"/>
  <text x="487" y="38" text-anchor="middle" class="tx-b">데이터베이스 그래프</text>
  ${edge(G2.song, G2.parasite, 34, 'c04a5', '', 's2')}
  ${edge(G2.song, G2.monster, 34, 'c04a5', '', 's2')}
  ${edge(G2.lee, G2.parasite, 34, 'c04a5', '')}
  ${edge(G2.bong, G2.monster, 34, 'c04a5', '')}
  ${circ(G2.song, 34, 'p1', '송강호')}
  ${circ(G2.parasite, 34, 'p3', '기생충')}
  ${circ(G2.monster, 34, 'p3', '괴물')}
  ${circ(G2.lee, 34, 'p1', '이선균')}
  ${circ(G2.bong, 34, 'p2', '봉준호')}
  <text x="545" y="118" class="tx-b">✓ 1행</text>
  <text x="545" y="230" class="tx-b">✓ 2행</text>
  <text x="300" y="322" class="tx-m">봉준호 → 괴물 은 DIRECTED 라서, 이선균 은 이름이 달라서 제외</text>
</svg>`;

  /* 그림 4-6. 절이 차례로 일하는 순서 */
  const FIG_PIPE = `<svg viewBox="0 0 720 230" role="img" aria-label="MATCH 가 패턴에 맞는 행 11개를 찾고, WHERE 가 조건으로 8개로 거르고, RETURN 이 원하는 칸만 고르고 DISTINCT 로 6개, ORDER BY 로 정렬, LIMIT 로 3개만 남기는 흐름">
  ${ARROW('c04a6')}
  <rect x="10" y="40" width="120" height="120" rx="12" class="p1"/>
  <rect x="155" y="55" width="120" height="90" rx="12" class="p2"/>
  <rect x="300" y="65" width="120" height="70" rx="12" class="p4"/>
  <rect x="445" y="65" width="120" height="70" rx="12" class="p3"/>
  <rect x="590" y="78" width="120" height="44" rx="12" class="p5"/>
  <text x="70" y="88" text-anchor="middle" class="tx-w">MATCH</text>
  <text x="70" y="112" text-anchor="middle" class="tx-w">패턴 찾기</text>
  <text x="70" y="136" text-anchor="middle" class="tx-w">11행</text>
  <text x="215" y="92" text-anchor="middle" class="tx-w">WHERE</text>
  <text x="215" y="116" text-anchor="middle" class="tx-w">조건 거르기 · 8행</text>
  <text x="360" y="95" text-anchor="middle" class="tx-w">RETURN</text>
  <text x="360" y="118" text-anchor="middle" class="tx-w">DISTINCT · 6행</text>
  <text x="505" y="95" text-anchor="middle" class="tx-w">ORDER BY</text>
  <text x="505" y="118" text-anchor="middle" class="tx-w">줄 세우기</text>
  <text x="650" y="105" text-anchor="middle" class="tx-w">LIMIT 3</text>
  <line x1="132" y1="100" x2="150" y2="100" class="ln" stroke-width="2" marker-end="url(#c04a6)"/>
  <line x1="277" y1="100" x2="295" y2="100" class="ln" stroke-width="2" marker-end="url(#c04a6)"/>
  <line x1="422" y1="100" x2="440" y2="100" class="ln" stroke-width="2" marker-end="url(#c04a6)"/>
  <line x1="567" y1="100" x2="585" y2="100" class="ln" stroke-width="2" marker-end="url(#c04a6)"/>
  <text x="360" y="195" text-anchor="middle" class="tx-m">위에서 아래로 쓴 문장이, 왼쪽에서 오른쪽으로 결과를 줄여 가며 일합니다</text>
  <text x="360" y="218" text-anchor="middle" class="tx-m">(행 수는 2교시 확장 영화 그래프의 '2000년 이후 출연 배우' 질문 예시)</text>
</svg>`;

  /* 그림 4-7. 방향이 있는 패턴 · 방향을 무시하는 패턴 */
  const FIG_DIR = `<svg viewBox="0 0 720 300" role="img" aria-label="데이터베이스에는 송강호에서 기생충으로 ACTED_IN 관계가 있음. 오른쪽 화살표 패턴은 1행, 왼쪽 화살표 패턴은 0행, 화살촉 없는 패턴은 1행을 찾음">
  ${ARROW('c04a7')}
  <rect x="10" y="10" width="700" height="80" rx="14" class="card-bg"/>
  <text x="30" y="36" class="tx-b">저장된 사실</text>
  ${circ([300, 50], 28, 'p1', '송강호')}
  ${circ([560, 50], 28, 'p3', '기생충')}
  <line x1="330" y1="50" x2="527" y2="50" class="ln" stroke-width="2.5" marker-end="url(#c04a7)"/>
  <text x="430" y="42" text-anchor="middle" class="tx-m">ACTED_IN</text>
  <rect x="10" y="105" width="700" height="56" rx="10" class="p3s"/>
  <text x="30" y="139" class="tx">(p:Person)-[:ACTED_IN]-&gt;(m:Movie)</text>
  <text x="690" y="139" text-anchor="end" class="tx-b">✓ 1행 — 방향이 같음</text>
  <rect x="10" y="170" width="700" height="56" rx="10" class="card-bg"/>
  <text x="30" y="204" class="tx">(p:Person)&lt;-[:ACTED_IN]-(m:Movie)</text>
  <text x="690" y="204" text-anchor="end" class="tx-b">✗ 0행 — 영화가 사람에게 출연?</text>
  <rect x="10" y="235" width="700" height="56" rx="10" class="p5s"/>
  <text x="30" y="269" class="tx">(p:Person)-[:ACTED_IN]-(m:Movie)</text>
  <text x="690" y="269" text-anchor="end" class="tx-b">✓ 1행 — 화살촉 없음 = 어느 쪽이든</text>
</svg>`;

  /* 그림 4-8. Graph · Table · Text 보기 */
  const FIG_VIEWS = `<svg viewBox="0 0 720 270" role="img" aria-label="같은 결과를 세 가지로 보기: Graph 는 동그라미와 화살표, Table 은 칸이 나뉜 표, Text 는 글자로 그린 표">
  ${ARROW('c04a8')}
  <rect x="10" y="10" width="220" height="250" rx="12" class="card-bg"/>
  <rect x="250" y="10" width="220" height="250" rx="12" class="card-bg"/>
  <rect x="490" y="10" width="220" height="250" rx="12" class="card-bg"/>
  <text x="120" y="36" text-anchor="middle" class="tx-b">Graph 보기</text>
  <text x="360" y="36" text-anchor="middle" class="tx-b">Table 보기</text>
  <text x="600" y="36" text-anchor="middle" class="tx-b">Text 보기</text>
  ${circ([65, 140], 30, 'p1', '송강호')}
  ${circ([175, 85], 30, 'p3', '기생충')}
  ${circ([175, 200], 30, 'p3', '괴물')}
  ${edge([65, 140], [175, 85], 30, 'c04a8', '')}
  ${edge([65, 140], [175, 200], 30, 'c04a8', '')}
  <rect x="265" y="60" width="190" height="34" class="p4s"/>
  <text x="310" y="82" text-anchor="middle" class="tx-b">배우</text>
  <text x="405" y="82" text-anchor="middle" class="tx-b">영화</text>
  <line x1="355" y1="60" x2="355" y2="162" class="ln"/>
  <text x="310" y="118" text-anchor="middle" class="tx">"송강호"</text><text x="405" y="118" text-anchor="middle" class="tx">"기생충"</text>
  <line x1="265" y1="128" x2="455" y2="128" class="ln"/>
  <text x="310" y="152" text-anchor="middle" class="tx">"송강호"</text><text x="405" y="152" text-anchor="middle" class="tx">"괴물"</text>
  <text x="360" y="200" text-anchor="middle" class="tx-m">행 = 찾은 경우 하나</text>
  <text x="360" y="222" text-anchor="middle" class="tx-m">열 = RETURN 한 것 하나</text>
  <text x="505" y="78" class="tx">╒═══════╤═══════╕</text>
  <text x="505" y="100" class="tx">│배우   │영화   │</text>
  <text x="505" y="122" class="tx">╞═══════╪═══════╡</text>
  <text x="505" y="144" class="tx">│송강호 │기생충 │</text>
  <text x="505" y="166" class="tx">│송강호 │괴물   │</text>
  <text x="505" y="188" class="tx">└───────┴───────┘</text>
  <text x="600" y="222" text-anchor="middle" class="tx-m">복사 · 붙여넣기에 편함</text>
  <text x="120" y="248" text-anchor="middle" class="tx-m">노드 · 관계를 RETURN 할 때만</text>
</svg>`;

  /* 1교시 실습: 한 번의 CREATE 문 (영화 3 · 배우 5 · 감독 2) */
  const CREATE_ALL = `CREATE
  (parasite:Movie {title: '기생충', released: 2019, genres: ['드라마', '스릴러'],
                   score: 9.5, oscar: true, opened: date('2019-05-30')}),
  (monster:Movie  {title: '괴물', released: 2006, genres: ['SF', '드라마']}),
  (oldboy:Movie   {title: '올드보이', released: 2003, genres: ['스릴러', '미스터리']}),
  (song:Person {name: '송강호', born: 1967}),
  (lee:Person  {name: '이선균', born: 1975}),
  (jo:Person   {name: '조여정', born: 1981}),
  (bae:Person  {name: '배두나', born: 1979}),
  (choi:Person {name: '최민식', born: 1962}),
  (bong:Person {name: '봉준호', born: 1969}),
  (park:Person {name: '박찬욱', born: 1963}),
  (song)-[:ACTED_IN {role: '기택'}]->(parasite),
  (lee)-[:ACTED_IN {role: '동익'}]->(parasite),
  (jo)-[:ACTED_IN {role: '연교'}]->(parasite),
  (song)-[:ACTED_IN {role: '강두'}]->(monster),
  (bae)-[:ACTED_IN {role: '남주'}]->(monster),
  (choi)-[:ACTED_IN {role: '오대수'}]->(oldboy),
  (bong)-[:DIRECTED]->(parasite),
  (bong)-[:DIRECTED]->(monster),
  (park)-[:DIRECTED]->(oldboy)`;

  /* 2교시: 확장 영화 그래프 (영화 5 · 사람 10) */
  const CREATE_BIG = `CREATE
  (parasite:Movie {title: '기생충', released: 2019, genres: ['드라마', '스릴러'], score: 9.5}),
  (monster:Movie  {title: '괴물', released: 2006, genres: ['SF', '드라마'], score: 8.0}),
  (memories:Movie {title: '살인의 추억', released: 2003, genres: ['범죄', '드라마'], score: 9.0}),
  (oldboy:Movie   {title: '올드보이', released: 2003, genres: ['스릴러', '미스터리']}),
  (shiri:Movie    {title: '쉬리', released: 1999, genres: ['액션', '드라마']}),
  (song:Person {name: '송강호', born: 1967}), (lee:Person {name: '이선균', born: 1975}),
  (jo:Person {name: '조여정', born: 1981}),   (bae:Person {name: '배두나', born: 1979}),
  (choi:Person {name: '최민식', born: 1962}), (han:Person {name: '한석규', born: 1964}),
  (kim:Person {name: '김상경', born: 1972}),
  (bong:Person {name: '봉준호', born: 1969}), (park:Person {name: '박찬욱', born: 1963}),
  (kang:Person {name: '강제규', born: 1962}),
  (song)-[:ACTED_IN {role: '기택'}]->(parasite), (lee)-[:ACTED_IN {role: '동익'}]->(parasite),
  (jo)-[:ACTED_IN {role: '연교'}]->(parasite),   (song)-[:ACTED_IN {role: '강두'}]->(monster),
  (bae)-[:ACTED_IN {role: '남주'}]->(monster),   (song)-[:ACTED_IN {role: '박두만'}]->(memories),
  (kim)-[:ACTED_IN {role: '서태윤'}]->(memories), (choi)-[:ACTED_IN {role: '오대수'}]->(oldboy),
  (han)-[:ACTED_IN {role: '유중원'}]->(shiri),   (choi)-[:ACTED_IN {role: '박무영'}]->(shiri),
  (song)-[:ACTED_IN {role: '이장길'}]->(shiri),
  (bong)-[:DIRECTED]->(parasite), (bong)-[:DIRECTED]->(monster), (bong)-[:DIRECTED]->(memories),
  (park)-[:DIRECTED]->(oldboy),   (kang)-[:DIRECTED]->(shiri)`;

  PY_COURSE.addChapter({
    id: 'ch04',
    no: '04',
    title: 'Cypher 기초: 만들고 찾기',
    subtitle: 'CREATE · 패턴 문법 · MATCH · WHERE · RETURN',
    summary: '그림처럼 생긴 질의 언어 <b>Cypher</b> 를 본격적으로 배웁니다. 괄호와 화살표로 그리는 <b>패턴 문법</b>을 익혀 <code>CREATE</code> 로 노드와 관계를 한 번에 만들고, <code>MATCH</code> 로 패턴을 찾고, <code>WHERE</code> 로 조건을 걸고, <code>RETURN</code> 으로 원하는 모양의 결과를 돌려받습니다. 같은 일을 브라우저 Python 의 <b>미니 그래프 저장소</b>로도 흉내 내어 데이터베이스 안에서 일어나는 원리를 눈으로 확인합니다.',
    goals: [
      'Cypher 패턴 <code>(변수:레이블 {속성})-[변수:타입 {속성}]-&gt;(…)</code> 을 읽고 쓸 수 있다',
      'CREATE 한 문장으로 여러 노드와 관계(관계 속성 포함)를 만들 수 있다',
      'Cypher 의 자료형(문자열 · 정수 · 실수 · 불리언 · 리스트 · 날짜)을 구분해 쓸 수 있다',
      'MATCH · WHERE · RETURN 으로 질문에 맞는 결과를 찾고 별칭 · 중복 제거 · 정렬 · 개수 제한으로 다듬을 수 있다',
      'Python 반복문과 pandas 로 MATCH 의 원리를 흉내 내어 같은 답을 구할 수 있다'
    ],
    sections: [
      /* ------------------------------------------------------------------ 1교시 */
      {
        id: 'ch04-1',
        title: 'CREATE 와 패턴 문법',
        minutes: 50,
        goals: ['Cypher 패턴을 그림처럼 읽는다', '노드 패턴 · 관계 패턴의 각 부분을 구분한다', 'CREATE 한 문장으로 노드 여러 개와 관계를 만든다', 'Cypher 자료형을 쓴다', 'Python 미니 저장소로 CREATE 원리를 이해한다'],
        flow: [['도입 · Cypher 는 그림', 5], ['노드 · 관계 패턴 해부', 12], ['CREATE 여러 개 · 관계 속성', 10], ['자료형', 8], ['함께 해 보기: 영화 그래프 만들기', 15]],
        content: [
          { type: 'p', html: '3차시에 Neo4j Browser 에서 <code>CREATE (:Person {name: \'홍길동\'})</code> 과 <code>MATCH (n) RETURN n</code> 두 문장을 써 보았습니다. 이번 차시에는 Neo4j 의 언어 <b>Cypher(사이퍼)</b>를 제대로 배웁니다. 먼저 <b>만드는 법(CREATE)</b>을, 다음 교시에 <b>찾는 법(MATCH)</b>을 익힙니다.' },
          { type: 'h', text: 'Cypher 는 키보드로 그리는 그림입니다' },
          { type: 'p', html: '칠판에 그래프를 그린다면 동그라미를 그리고 화살표로 잇겠지요. Cypher 는 이 그림을 <b>키보드 글자로 그대로 옮겨 놓은 것</b>입니다. 동그라미는 괄호 <code>( )</code>, 화살표는 <code>--&gt;</code>, 화살표에 붙는 이름은 대괄호 <code>[ ]</code> 안에 씁니다. 이렇게 글자로 그린 그림을 <b>ASCII 아트</b>라고 부르고, Cypher 에서 이 그림 한 덩어리를 <b>패턴(pattern)</b>이라고 합니다.' },
          { type: 'figure', html: FIG_ASCII, caption: '그림 4-1. 위의 그림과 아래의 글자는 같은 뜻입니다. 괄호는 동그라미, -[ ]-> 는 이름표 달린 화살표입니다.' },
          { type: 'p', html: '그래서 Cypher 패턴은 <b>왼쪽에서 오른쪽으로 문장처럼</b> 읽으면 됩니다. <code>(송강호)-[:ACTED_IN]-&gt;(기생충)</code> 은 "송강호가 기생충에 출연했다" 입니다. 화살표 방향을 뒤집어 <code>(기생충)&lt;-[:ACTED_IN]-(송강호)</code> 라고 써도 같은 뜻입니다. 화살촉이 가리키는 쪽이 "받는 쪽" 이기 때문입니다.' },
          { type: 'table', head: ['글자', '그림에서', '읽는 법'], rows: [
            ['<code>( )</code>', '동그라미', '노드 하나'],
            ['<code>--&gt;</code> · <code>&lt;--</code>', '화살표', '관계 하나 (화살촉이 방향)'],
            ['<code>-[:ACTED_IN]-&gt;</code>', '이름표 달린 화살표', '"출연했다" 관계'],
            ['<code>(a)-[:R]-&gt;(b)-[:S]-&gt;(c)</code>', '줄줄이 이어진 그림', 'a 가 b 에 R 하고, b 가 c 에 S 한다']
          ], caption: 'Cypher 패턴의 기본 글자들' },
          { type: 'h', text: '노드 패턴 해부도: (변수:레이블 {속성})' },
          { type: 'p', html: '괄호 안에는 최대 세 가지를 넣을 수 있습니다. <b>변수</b>는 이 문장 안에서 그 노드를 다시 부르기 위한 <b>별명(이름표)</b>, <b>레이블</b>은 3차시에 배운 노드의 <b>종류</b>, <b>속성</b>은 <b>키: 값</b> 짝으로 적는 정보입니다.' },
          { type: 'figure', html: FIG_NODE, caption: '그림 4-2. 노드 패턴의 세 부분. 변수 p 는 데이터베이스에 저장되지 않는, 이 문장 안에서만 쓰는 별명입니다.' },
          { type: 'table', head: ['쓴 모양', '뜻'], rows: [
            ['<code>()</code>', '아무 노드 하나 (이름표 없음)'],
            ['<code>(p)</code>', '아무 노드 하나, 이 문장에서는 <code>p</code> 라고 부름'],
            ['<code>(:Person)</code>', 'Person 종류의 노드'],
            ['<code>(p:Person)</code>', 'Person 종류의 노드, <code>p</code> 라고 부름'],
            ['<code>(p:Person {name: \'송강호\'})</code>', '이름이 송강호인 Person 노드, <code>p</code> 라고 부름'],
            ['<code>(p:Person:Actor)</code>', 'Person 이면서 Actor 인 노드 (3차시의 다중 레이블)']
          ], caption: '노드 패턴은 필요한 만큼만 적으면 됩니다' },
          { type: 'h', text: '관계 패턴 해부도: -[변수:타입 {속성}]->' },
          { type: 'p', html: '관계 패턴은 화살표 줄기 가운데에 대괄호를 끼워 넣은 모양입니다. 대괄호 안의 규칙은 노드와 거의 같아서 <b>변수 · 타입 · 속성</b>을 적습니다. 노드의 "레이블" 자리에 관계는 <b>"타입"</b>이 들어간다는 점만 다릅니다.' },
          { type: 'figure', html: FIG_REL, caption: '그림 4-3. 관계 패턴의 네 부분. 관계에도 속성을 붙일 수 있습니다 — "어떤 역할로 출연했나" 는 사람의 정보도, 영화의 정보도 아닌 출연 관계의 정보입니다.' },
          { type: 'callout', kind: 'warn', title: '관계를 만들 때 지켜야 할 두 가지', html: '<code>CREATE</code> 로 관계를 만들 때는 ① <b>타입이 꼭 하나</b> 있어야 하고 ② <b>방향(화살촉)</b>이 꼭 있어야 합니다. <code>CREATE (a)-[]-&gt;(b)</code> 나 <code>CREATE (a)-[:KNOWS]-(b)</code> 는 오류가 납니다. Neo4j 에 저장되는 관계는 <b>언제나 한 방향 · 한 타입</b>입니다. (찾을 때는 방향을 생략할 수 있는데, 이것은 2교시에 배웁니다.)' },
          { type: 'h', text: 'CREATE: 노드 여러 개와 관계를 한 번에' },
          { type: 'p', html: '<code>CREATE</code> 뒤에 패턴을 쉼표로 이어 쓰면 <b>한 문장으로 여러 개</b>를 만들 수 있습니다. 앞에서 변수 이름을 붙여 둔 노드는, 같은 문장 안의 뒤쪽에서 <b>변수만 써서</b> 다시 가리킬 수 있습니다.' },
          { type: 'code', title: 'Cypher 4-1. 노드 둘과 관계 하나를 한 문장으로 (Neo4j Browser 에서 실행)', run: false, code: `CREATE (song:Person {name: '송강호', born: 1967}),
       (parasite:Movie {title: '기생충', released: 2019}),
       (song)-[:ACTED_IN {role: '기택'}]->(parasite)`,
            expect: 'Added 2 labels, created 2 nodes, set 5 properties, created 1 relationship, completed after 20 ms.',
            desc: '첫 줄에서 만든 노드에 <code>song</code>, 둘째 줄의 노드에 <code>parasite</code> 라는 이름표를 붙였습니다. 셋째 줄의 <code>(song)</code> 은 <b>새 노드가 아니라</b> 첫 줄에서 만든 바로 그 노드입니다. 속성은 송강호 2개 + 기생충 2개 + 관계의 role 1개 = 5개가 설정됩니다.' },
          { type: 'code', title: 'Cypher 4-2. 한 줄로 이어 쓰기 — 경로(path) 모양 (Neo4j Browser 에서 실행)', run: false, code: `CREATE (:Person {name: '봉준호', born: 1969})
       -[:DIRECTED]->
       (:Movie {title: '괴물', released: 2006})
       <-[:ACTED_IN {role: '남주'}]-
       (:Person {name: '배두나', born: 1979})`,
            expect: 'Added 3 labels, created 3 nodes, set 7 properties, created 2 relationships, completed after 15 ms.',
            desc: '노드 → 관계 → 노드 → 관계 → 노드 를 줄줄이 이어 쓴 모양을 <b>경로(path)</b>라고 합니다. 가운데 괴물 노드로 화살표 두 개가 <b>양쪽에서 들어오는</b> 그림이 그대로 글자로 보입니다. 다시 부를 일이 없으니 변수 이름은 생략했습니다.' },
          { type: 'callout', kind: 'warn', title: '변수는 문장이 끝나면 사라집니다', html: 'Cypher 4-1 을 실행한 뒤 <b>다른 문장</b>에서 <code>CREATE (song)-[:ACTED_IN]-&gt;(:Movie {title: \'괴물\'})</code> 라고 쓰면 어떻게 될까요? 앞 문장의 <code>song</code> 은 이미 사라졌으므로, Neo4j 는 <code>(song)</code> 을 <b>레이블도 속성도 없는 새 빈 노드</b>로 만들어 버립니다. 이미 있는 노드에 관계를 이으려면 먼저 그 노드를 <b>찾아야(MATCH)</b> 합니다. 그래서 이번 교시의 실습은 모든 것을 <b>한 번의 CREATE 문</b>으로 만듭니다.' },
          { type: 'h', text: 'Cypher 의 자료형' },
          { type: 'p', html: '속성 값에는 여러 종류의 값을 넣을 수 있습니다. Python 과 거의 같지만 <b>쓰는 모양이 조금씩 다릅니다</b>. 특히 불리언은 소문자 <code>true</code> · <code>false</code>, 날짜는 <code>date(\'2019-05-30\')</code> 처럼 함수로 만듭니다.' },
          { type: 'table', head: ['자료형', 'Cypher 에서 쓰는 모양', 'Python 에서는', '예시 속성'], rows: [
            ['문자열 (String)', '<code>\'기생충\'</code> 또는 <code>"기생충"</code>', '<code>\'기생충\'</code>', 'title, name, role'],
            ['정수 (Integer)', '<code>2019</code>', '<code>2019</code>', 'released, born'],
            ['실수 (Float)', '<code>9.5</code>', '<code>9.5</code>', 'score (내 평점)'],
            ['불리언 (Boolean)', '<code>true</code> · <code>false</code> (소문자)', '<code>True</code> · <code>False</code>', 'oscar'],
            ['리스트 (List)', '<code>[\'드라마\', \'스릴러\']</code>', '<code>[\'드라마\', \'스릴러\']</code>', 'genres'],
            ['날짜 (Date)', '<code>date(\'2019-05-30\')</code>', '<code>datetime.date(2019, 5, 30)</code>', 'opened (개봉일)'],
            ['값 없음', '<code>null</code>', '<code>None</code>', '저장되지 않음']
          ], caption: 'Cypher 자료형과 Python 자료형 비교' },
          { type: 'p', html: 'Python 값을 Cypher 글자로 바꾸는 작은 함수를 만들어 보면 차이가 한눈에 보입니다. 7차시에 Python 으로 Neo4j 에 데이터를 보낼 때 이 차이를 드라이버가 자동으로 처리해 주지만, 원리를 알아 두면 오류를 읽기 쉽습니다.' },
          { type: 'code', title: '예제 4-1. Python 값을 Cypher 글자로 바꾸기', code: `import datetime

def to_cypher(v):
    if v is None:
        return 'null'
    if isinstance(v, bool):              # bool 을 int 보다 먼저 검사 (True 도 int 이므로)
        return 'true' if v else 'false'
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, str):
        return "'" + v + "'"
    if isinstance(v, list):
        return '[' + ', '.join(to_cypher(x) for x in v) + ']'
    if isinstance(v, datetime.date):
        return "date('" + v.isoformat() + "')"
    raise TypeError('속성에 넣을 수 없는 값: ' + type(v).__name__)

movie = {'title': '기생충', 'released': 2019, 'score': 9.5, 'oscar': True,
         'genres': ['드라마', '스릴러'], 'opened': datetime.date(2019, 5, 30)}

for key, value in movie.items():
    print(f'{key:9} {type(value).__name__:5} ->  {to_cypher(value)}')

props = ', '.join(f'{k}: {to_cypher(v)}' for k, v in movie.items())
print()
print('CREATE (:Movie {' + props + '})')`,
            expect: "title     str   ->  '기생충'\nreleased  int   ->  2019\nscore     float ->  9.5\noscar     bool  ->  true\ngenres    list  ->  ['드라마', '스릴러']\nopened    date  ->  date('2019-05-30')\n\nCREATE (:Movie {title: '기생충', released: 2019, score: 9.5, oscar: true, genres: ['드라마', '스릴러'], opened: date('2019-05-30')})",
            desc: 'Python 의 <code>True</code> 가 Cypher 의 <code>true</code> 로, <code>datetime.date</code> 가 <code>date(\'…\')</code> 로 바뀌었습니다. 마지막 줄을 그대로 복사해 Neo4j Browser 에 붙여 넣으면 실행됩니다.' },
          { type: 'callout', kind: 'info', title: '속성 값의 세 가지 규칙', html: '① 리스트 안의 값은 <b>모두 같은 종류</b>여야 합니다 (<code>[\'드라마\', 2019]</code> 처럼 섞으면 오류). ② 속성 값으로 <b>딕셔너리(맵)는 넣을 수 없습니다</b> — 정보가 복잡하면 노드로 따로 만드세요. ③ 속성을 <code>null</code> 로 주면 <b>그 속성 자체가 저장되지 않습니다</b>. 그래서 같은 Movie 라도 어떤 영화에는 <code>score</code> 가 있고 어떤 영화에는 없을 수 있습니다.' },
          { type: 'callout', kind: 'tip', title: '날짜에서 연 · 월 · 일 꺼내기', html: '<code>date(\'2019-05-30\')</code> 로 저장한 값은 나중에 <code>m.opened.year</code> → 2019, <code>m.opened.month</code> → 5 처럼 부분만 꺼낼 수 있습니다. 날짜를 <code>\'2019-05-30\'</code> 문자열로 저장하면 이런 계산이 안 되므로, 날짜는 <code>date()</code> 로 저장하는 습관을 들이세요.' },
          { type: 'h', text: 'Python 으로 미니 그래프 저장소 만들기' },
          { type: 'p', html: 'Neo4j 는 <code>CREATE</code> 를 받으면 안쪽에서 무엇을 할까요? 아주 단순하게 말하면 <b>노드 목록과 관계 목록에 한 줄씩 추가</b>합니다. 노드에는 자동으로 번호(id)가 붙고, 관계는 "몇 번 노드에서 몇 번 노드로" 를 기억합니다. 이것을 Python 리스트 두 개로 흉내 내 봅시다.' },
          { type: 'code', title: '예제 4-2. 미니 그래프 저장소: nodes · rels 두 리스트', code: `nodes = []   # {'id', 'label', 'props'}
rels = []    # {'type', 'start', 'end', 'props'}

def create_node(label, **props):
    node = {'id': len(nodes), 'label': label, 'props': props}
    nodes.append(node)
    return node['id']                    # 변수(이름표) 역할: 번호를 돌려줌

def create_rel(start, rel_type, end, **props):
    rels.append({'type': rel_type, 'start': start, 'end': end, 'props': props})

# CREATE (song:Person {...}), (parasite:Movie {...}),
#        (song)-[:ACTED_IN {role: '기택'}]->(parasite)
song = create_node('Person', name='송강호', born=1967)
parasite = create_node('Movie', title='기생충', released=2019)
create_rel(song, 'ACTED_IN', parasite, role='기택')

print('--- nodes ---')
for n in nodes:
    print(n)
print('--- rels ---')
for r in rels:
    print(r)`,
            expect: "--- nodes ---\n{'id': 0, 'label': 'Person', 'props': {'name': '송강호', 'born': 1967}}\n{'id': 1, 'label': 'Movie', 'props': {'title': '기생충', 'released': 2019}}\n--- rels ---\n{'type': 'ACTED_IN', 'start': 0, 'end': 1, 'props': {'role': '기택'}}",
            desc: '관계는 노드 자체가 아니라 <b>노드 번호</b>(0 → 1)를 기억합니다. Python 변수 <code>song</code> 에는 번호 0 이 들어 있어서, Cypher 의 변수처럼 "앞에서 만든 그 노드" 를 가리키는 이름표 역할을 합니다. 진짜 Neo4j 도 노드마다 안쪽 번호를 붙이고, 관계에 시작 · 끝 노드를 연결해 저장합니다.' },
          { type: 'p', html: '진짜 Neo4j 는 <code>CREATE</code> 를 실행하면 "레이블 몇 개, 노드 몇 개, 속성 몇 개, 관계 몇 개" 를 알려 줍니다. 미니 저장소도 그 알림을 흉내 내도록 만들어 봅시다. Cypher 4-2 와 같은 경로를 넣어 보면, Browser 의 알림과 숫자가 같은지 비교할 수 있습니다.' },
          { type: 'code', title: '예제 4-3. CREATE 결과 알림 흉내 내기', code: `nodes, rels = [], []
stats = {'labels': 0, 'nodes': 0, 'properties': 0, 'relationships': 0}

def create_node(label, **props):
    nodes.append({'id': len(nodes), 'label': label, 'props': props})
    stats['labels'] += 1
    stats['nodes'] += 1
    stats['properties'] += len(props)
    return len(nodes) - 1

def create_rel(start, rel_type, end, **props):
    rels.append({'type': rel_type, 'start': start, 'end': end, 'props': props})
    stats['relationships'] += 1
    stats['properties'] += len(props)

# Cypher 4-2 와 같은 경로: (봉준호)-[:DIRECTED]->(괴물)<-[:ACTED_IN]-(배두나)
bong = create_node('Person', name='봉준호', born=1969)
monster = create_node('Movie', title='괴물', released=2006)
bae = create_node('Person', name='배두나', born=1979)
create_rel(bong, 'DIRECTED', monster)
create_rel(bae, 'ACTED_IN', monster, role='남주')

print(f"Added {stats['labels']} labels, created {stats['nodes']} nodes, "
      f"set {stats['properties']} properties, "
      f"created {stats['relationships']} relationships")`,
            expect: 'Added 3 labels, created 3 nodes, set 7 properties, created 2 relationships',
            desc: '노드 속성 2 + 2 + 2 = 6개와 관계 속성(role) 1개를 더해 속성은 7개입니다. Browser 에서 Cypher 4-2 를 실행했을 때의 알림과 같지요. <b>관계 속성도 속성 개수에 들어간다</b>는 점을 눈여겨보세요.' },
          { type: 'h', text: '함께 해 보기: 영화 그래프를 한 번의 CREATE 로' },
          { type: 'p', html: '이제 영화 3편 · 배우 5명 · 감독 2명과 그 사이의 출연(<code>ACTED_IN</code>) · 감독(<code>DIRECTED</code>) 관계를 <b>한 문장</b>으로 만들어 봅시다. 먼저 그림으로 완성 모습을 확인합니다.' },
          { type: 'figure', html: FIG_PRACTICE, caption: '그림 4-4. 실습 그래프. 노드 10개(영화 3 · 사람 7), 관계 9개(출연 6 · 감독 3). 배우 쪽 화살표 위 글자는 관계 속성 role 입니다.' },
          { type: 'p', html: '아래 문장의 짜임을 보세요. <b>① 노드를 모두 만들며 변수 이름을 붙이고 → ② 그 변수들로 관계를 잇습니다.</b> 기생충 노드에는 일부러 여러 자료형(실수 · 불리언 · 날짜)을 넣었습니다. 데이터베이스가 비어 있는 상태에서 <b>딱 한 번만</b> 실행하세요.' },
          { type: 'code', title: 'Cypher 4-3. 영화 3 · 배우 5 · 감독 2 를 한 번에 (Neo4j Browser 에서 실행)', run: false, code: CREATE_ALL,
            expect: 'Added 10 labels, created 10 nodes, set 32 properties, created 9 relationships, completed after 35 ms.',
            desc: '끝에 쉼표가 없는지, 괄호 짝이 맞는지 확인하세요. 실행 후 <code>MATCH (n) RETURN n</code> 으로 그림 4-4 와 같은 모양이 나오는지 봅니다. 노드를 클릭하면 오른쪽 패널에 속성이, 관계(선)를 클릭하면 <code>role</code> 이 보입니다.' },
          { type: 'p', html: '같은 데이터를 Python 미니 저장소에도 넣어 봅시다. Cypher 문장의 <b>변수 이름과 Python 변수 이름을 똑같이</b> 맞춰 두었으니 한 줄씩 대응해 보세요. 알림 숫자가 Cypher 4-3 의 결과와 같은지도 확인합니다.' },
          { type: 'code', title: '예제 4-4. 같은 영화 그래프를 미니 저장소에 넣기', code: `import datetime

nodes, rels = [], []

def create_node(label, **props):
    nodes.append({'id': len(nodes), 'label': label, 'props': props})
    return len(nodes) - 1

def create_rel(start, rel_type, end, **props):
    rels.append({'type': rel_type, 'start': start, 'end': end, 'props': props})

parasite = create_node('Movie', title='기생충', released=2019, genres=['드라마', '스릴러'],
                       score=9.5, oscar=True, opened=datetime.date(2019, 5, 30))
monster = create_node('Movie', title='괴물', released=2006, genres=['SF', '드라마'])
oldboy = create_node('Movie', title='올드보이', released=2003, genres=['스릴러', '미스터리'])
song = create_node('Person', name='송강호', born=1967)
lee = create_node('Person', name='이선균', born=1975)
jo = create_node('Person', name='조여정', born=1981)
bae = create_node('Person', name='배두나', born=1979)
choi = create_node('Person', name='최민식', born=1962)
bong = create_node('Person', name='봉준호', born=1969)
park = create_node('Person', name='박찬욱', born=1963)

for actor, movie, role in [(song, parasite, '기택'), (lee, parasite, '동익'),
                           (jo, parasite, '연교'), (song, monster, '강두'),
                           (bae, monster, '남주'), (choi, oldboy, '오대수')]:
    create_rel(actor, 'ACTED_IN', movie, role=role)
for director, movie in [(bong, parasite), (bong, monster), (park, oldboy)]:
    create_rel(director, 'DIRECTED', movie)

n_props = sum(len(n['props']) for n in nodes) + sum(len(r['props']) for r in rels)
print('노드', len(nodes), '개 · 관계', len(rels), '개 · 속성', n_props, '개')

def name(i):
    p = nodes[i]['props']
    return p.get('name') or p.get('title')

for r in rels:
    role = r['props'].get('role', '')
    print(f"({name(r['start'])})-[:{r['type']}]->({name(r['end'])})", role)`,
            expect: "노드 10 개 · 관계 9 개 · 속성 32 개\n(송강호)-[:ACTED_IN]->(기생충) 기택\n(이선균)-[:ACTED_IN]->(기생충) 동익\n(조여정)-[:ACTED_IN]->(기생충) 연교\n(송강호)-[:ACTED_IN]->(괴물) 강두\n(배두나)-[:ACTED_IN]->(괴물) 남주\n(최민식)-[:ACTED_IN]->(올드보이) 오대수\n(봉준호)-[:DIRECTED]->(기생충) \n(봉준호)-[:DIRECTED]->(괴물) \n(박찬욱)-[:DIRECTED]->(올드보이) ",
            desc: '출력을 Cypher 패턴 모양으로 찍어 보니 미니 저장소의 내용이 곧 Cypher 문장처럼 읽힙니다. 노드 10 · 관계 9 · 속성 32 — Cypher 4-3 의 알림과 숫자가 같은지 확인하세요.' },
          { type: 'p', html: '미니 저장소의 내용을 matplotlib 으로 그려 보면 Browser 의 Graph 보기와 비슷한 그림이 나옵니다. 감독 · 영화 · 배우를 세 줄로 놓고 관계를 화살표로 잇습니다.' },
          { type: 'code', title: '예제 4-5. 미니 저장소를 그래프 그림으로 그리기', code: `import matplotlib.pyplot as plt

nodes = [('기생충', 'Movie'), ('괴물', 'Movie'), ('올드보이', 'Movie'),
         ('송강호', 'Actor'), ('이선균', 'Actor'), ('조여정', 'Actor'),
         ('배두나', 'Actor'), ('최민식', 'Actor'), ('봉준호', 'Director'), ('박찬욱', 'Director')]
rels = [('송강호', 'ACTED_IN', '기생충'), ('이선균', 'ACTED_IN', '기생충'),
        ('조여정', 'ACTED_IN', '기생충'), ('송강호', 'ACTED_IN', '괴물'),
        ('배두나', 'ACTED_IN', '괴물'), ('최민식', 'ACTED_IN', '올드보이'),
        ('봉준호', 'DIRECTED', '기생충'), ('봉준호', 'DIRECTED', '괴물'),
        ('박찬욱', 'DIRECTED', '올드보이')]

pos = {'봉준호': (2.2, 2), '박찬욱': (5.6, 2),
       '괴물': (1.2, 1), '기생충': (3.4, 1), '올드보이': (5.6, 1),
       '배두나': (0.5, 0), '송강호': (1.8, 0), '이선균': (3.1, 0),
       '조여정': (4.4, 0), '최민식': (6.0, 0)}
color = {'Movie': 'tab:orange', 'Actor': 'tab:blue', 'Director': 'tab:green'}

fig, ax = plt.subplots(figsize=(9, 4))
for a, t, b in rels:
    (x1, y1), (x2, y2) = pos[a], pos[b]
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle='-|>', color='gray', shrinkA=18, shrinkB=18))
for name, kind in nodes:
    x, y = pos[name]
    ax.scatter(x, y, s=1500, color=color[kind], zorder=3)
    ax.text(x, y, name, ha='center', va='center', color='white', fontsize=10, zorder=4)
ax.set_xlim(-0.3, 6.8)
ax.set_ylim(-0.5, 2.5)
ax.axis('off')
ax.set_title('영화 그래프 (초록: 감독 · 주황: 영화 · 파랑: 배우)')
plt.show()
print('노드', len(nodes), '개 · 관계', len(rels), '개')`,
            expect: '노드 10 개 · 관계 9 개',
            desc: '그림 4-4 와 같은 모양이 그려집니다. Neo4j 에서는 감독과 배우 모두 <code>Person</code> 레이블이지만, 그림에서는 구분하기 쉽게 색을 다르게 칠했습니다.' },
          { type: 'callout', kind: 'tip', title: '실수했을 때 처음부터 다시 하기', html: 'Cypher 4-3 을 두 번 실행해 노드가 20개가 되었거나 오타가 난 채로 만들어졌다면, 3차시에 배운 <code>MATCH (n) DETACH DELETE n</code> 으로 모두 지우고 다시 실행하면 됩니다. (되돌릴 수 없으니 연습용 데이터베이스에서만 쓰세요.) 이미 있는 노드를 찾아서 고치는 방법(<code>SET</code>, <code>MERGE</code> 등)은 5차시에서 배웁니다.' },
          { type: 'callout', kind: 'more', title: '변수 이름 · 레이블 · 타입의 대소문자', html: 'Cypher 에서 <b>레이블 · 관계 타입 · 속성 이름 · 변수</b>는 대소문자를 구분합니다. <code>:Person</code> 과 <code>:person</code> 은 서로 다른 레이블이 되어 버립니다. 반면 <code>CREATE</code> · <code>create</code> 같은 <b>명령어(키워드)</b>는 대소문자를 가리지 않지만, 읽기 쉽게 대문자로 쓰는 것이 관례입니다.' },
          { type: 'callout', kind: 'info', teacher: true, title: '수업 운영 팁', html: '① Cypher 4-3 은 길어서 오타가 많이 납니다. 학생들에게 직접 치게 하기보다 강좌 화면의 코드를 복사해 붙여 넣게 하고, 대신 <b>각 줄이 그림 4-4 의 어느 부분인지</b> 짚어 보게 하세요. ② 가장 흔한 오류는 마지막 줄 뒤의 쉼표, 따옴표 짝 불일치, <code>True</code>(대문자) 사용입니다. ③ 2교시 시작에 확장 데이터로 다시 만들므로, 1교시 데이터가 엉켜도 걱정하지 않아도 된다고 안내합니다.' }
        ],
        slides: [
          { layout: 'title', title: 'Cypher 기초: 만들고 찾기', subtitle: '1교시 · CREATE 와 패턴 문법',
            notes: '<p>💬 <b>발문:</b> "친구에게 우리 반 친구 관계를 문자 메시지로 설명하려면 어떻게 쓸까요?" → 화살표 기호, 괄호 등을 떠올리게 한 뒤 Cypher 가 바로 그 방식이라고 연결합니다. (3분)</p>' },
          { layout: 'diagram', title: 'Cypher 는 키보드로 그리는 그림', html: FIG_ASCII, caption: '( ) = 노드 · -[ ]-> = 관계 · > = 방향',
            notes: '<p>칠판에 동그라미 두 개와 화살표를 그리고, 바로 아래에 같은 내용을 Cypher 글자로 적습니다. 방향을 뒤집어 쓰는 <code>&lt;-</code> 도 같은 뜻임을 보여 줍니다. (5분)</p>' },
          { layout: 'two', title: '노드 패턴 · 관계 패턴 해부', left: { title: '노드 (변수:레이블 {속성})', html: FIG_NODE }, right: { title: '관계 -[변수:타입 {속성}]->', html: FIG_REL },
            notes: '<p>세 부분(변수 · 레이블/타입 · 속성)이 노드와 관계에 똑같이 있다는 점을 강조합니다. 💬 "기택이라는 역할은 송강호의 정보일까요, 기생충의 정보일까요?" → 둘 다 아님, 출연 관계의 정보. 만들 때는 타입 1개 · 방향 필수. (12분)</p>' },
          { layout: 'table', title: 'Cypher 자료형', head: ['자료형', 'Cypher', 'Python'], rows: [
            ['문자열', "'기생충'", "'기생충'"], ['정수 · 실수', '2019 · 9.5', '2019 · 9.5'],
            ['불리언', 'true / false', 'True / False'], ['리스트', "['드라마', '스릴러']", "['드라마', '스릴러']"],
            ['날짜', "date('2019-05-30')", 'datetime.date(2019, 5, 30)']
          ], lead: '불리언은 소문자, 날짜는 date() 함수',
            notes: '<p>예제 4-1 을 실행해 Python 값이 Cypher 글자로 바뀌는 모습을 보여 줍니다. null 을 넣으면 속성이 저장되지 않는다는 점을 짚습니다. 이어 예제 4-2 · 4-3 으로 미니 저장소를 소개합니다. (10분)</p>' },
          { layout: 'summary', title: '정리 · 함께 해 보기', bullets: ['패턴 = 글자로 그린 그림 <code>(a)-[:R]-&gt;(b)</code>', '노드 <code>(변수:레이블 {속성})</code> · 관계 <code>-[변수:타입 {속성}]-&gt;</code>', 'CREATE 한 문장: 노드에 변수 붙이기 → 변수로 관계 잇기', '변수는 문장이 끝나면 사라진다', '실습: Cypher 4-3 실행 → 미니 저장소(예제 4-4 · 4-5)와 비교'],
            notes: '<p>그림 4-4 를 보여 주고 Cypher 4-3 을 복사해 실행하게 합니다. 알림의 숫자(노드 10 · 관계 9 · 속성 32)를 예제 4-4 결과와 비교하게 합니다. 남는 시간에 각자 좋아하는 영화 한 편을 추가하는 CREATE 를 써 보게 합니다. (20분)</p>' }
        ]
      },
      /* ------------------------------------------------------------------ 2교시 */
      {
        id: 'ch04-2',
        title: 'MATCH · WHERE · RETURN',
        minutes: 50,
        goals: ['MATCH 로 패턴에 맞는 노드와 관계를 찾는다', 'WHERE 로 조건을 건다', 'RETURN 의 AS · DISTINCT · ORDER BY · SKIP · LIMIT 을 쓴다', '방향이 있는 패턴과 없는 패턴을 구분한다', 'Python 반복문 · pandas 로 MATCH 원리를 체험한다'],
        flow: [['도입 · 데이터 준비', 5], ['MATCH 와 방향', 10], ['WHERE 조건', 10], ['RETURN 꾸미기 · 결과 보기', 10], ['함께 해 보기: 질문 5개', 15]],
        content: [
          { type: 'p', html: '1교시에 데이터를 넣었으니 이제 꺼내 볼 차례입니다. 데이터베이스를 쓰는 시간의 대부분은 사실 <b>찾는 일</b>입니다. Cypher 로 찾을 때는 세 단어가 짝을 이룹니다: <b>MATCH(이런 모양을 찾아라) → WHERE(이 조건에 맞는 것만) → RETURN(이것을 보여 줘라)</b>.' },
          { type: 'h', text: '데이터 준비: 확장 영화 그래프' },
          { type: 'p', html: '조건 검색을 연습하려면 데이터가 조금 더 있어야 합니다. 1교시 그래프에 1999년 영화 <b>쉬리</b>와 2003년 영화 <b>살인의 추억</b>, 배우 2명 · 감독 1명을 더한 <b>확장 영화 그래프</b>(영화 5편 · 사람 10명 · 관계 16개)를 만듭니다. 연습용 데이터베이스에서 아래 문장을 실행하세요.' },
          { type: 'code', title: 'Cypher 4-4a. 1교시 데이터 비우기 (Neo4j Browser 에서 실행 — 주의!)', run: false, code: `MATCH (n) DETACH DELETE n`,
            desc: '연습용 데이터베이스의 노드와 관계를 <b>모두</b> 지웁니다. 되돌릴 수 없으니 다른 데이터가 없는지 확인하고 실행하세요.' },
          { type: 'code', title: 'Cypher 4-4b. 확장 영화 그래프 만들기 (Neo4j Browser 에서 실행)', run: false, code: CREATE_BIG,
            expect: 'Added 15 labels, created 15 nodes, set 49 properties, created 16 relationships, completed after 40 ms.',
            desc: '한 줄에 노드 두 개씩 적어 짧게 만들었을 뿐, 1교시 Cypher 4-3 과 짜임이 같습니다. 영화 중 쉬리 · 올드보이에는 <code>score</code> 속성을 <b>일부러 넣지 않았습니다</b> (WHERE 의 IS NULL 연습용).' },
          { type: 'h', text: 'MATCH: 틀(패턴)을 그래프에 대 보기' },
          { type: 'p', html: '<code>MATCH</code> 는 <b>쿠키 틀</b>과 같습니다. 1교시에 배운 패턴을 틀로 만들어 그래프 위 이곳저곳에 대 보고, <b>모양이 꼭 맞는 곳을 모두</b> 찾아 줍니다. 찾은 곳 하나하나가 결과의 <b>한 행</b>이 되고, 패턴의 변수(<code>p</code>, <code>m</code>)에는 그 자리의 노드가 담깁니다.' },
          { type: 'figure', html: FIG_MATCH, caption: '그림 4-5. 틀 (송강호:Person)-[:ACTED_IN]->(m:Movie) 를 그림의 작은 그래프에 대 보면 두 군데가 꼭 맞습니다. 그래서 결과는 2행이고, m 에는 각각 기생충 · 괴물이 담깁니다.' },
          { type: 'code', title: 'Cypher 4-5. 송강호가 출연한 영화 (Neo4j Browser 에서 실행)', run: false, code: `MATCH (p:Person {name: '송강호'})-[:ACTED_IN]->(m:Movie)
RETURN m.title, m.released`,
            expect: '╒═════════════╤════════════╕\n│m.title      │m.released  │\n╞═════════════╪════════════╡\n│"기생충"     │2019        │\n│"괴물"       │2006        │\n│"살인의 추억"│2003        │\n│"쉬리"       │1999        │\n└─────────────┴────────────┘',
            desc: '<code>m.title</code> 처럼 <b>변수.속성</b>으로 원하는 속성만 꺼냅니다. 확장 그래프에서는 송강호가 4편에 출연했으므로 4행이 나옵니다. (행 순서는 실행할 때마다 다를 수 있습니다 — 순서를 정하는 법은 아래 ORDER BY 에서 배웁니다.)' },
          { type: 'code', title: 'Cypher 4-6. 기생충의 감독 (Neo4j Browser 에서 실행)', run: false, code: `MATCH (d:Person)-[:DIRECTED]->(m:Movie {title: '기생충'})
RETURN d.name`,
            expect: '╒══════════╕\n│d.name    │\n╞══════════╡\n│"봉준호"  │\n└──────────┘',
            desc: '이번에는 화살표의 <b>끝 쪽</b>(영화)에 조건을 걸고 <b>시작 쪽</b>(감독)을 돌려받았습니다. 패턴의 어느 자리에든 조건을 걸 수 있고, 어느 변수든 돌려받을 수 있습니다.' },
          { type: 'p', html: 'MATCH 가 안쪽에서 하는 일을 미니 저장소로 흉내 내 봅시다. 원리는 단순합니다. <b>관계를 하나씩 꺼내 보면서</b> 타입이 맞는지, 시작 노드가 조건에 맞는지, 끝 노드가 조건에 맞는지 확인하고, 모두 맞으면 결과에 넣습니다.' },
          { type: 'code', title: '예제 4-6. MATCH 를 반복문으로 흉내 내기', code: `nodes, rels = [], []
def add(label, **props):
    nodes.append({'label': label, 'props': props})
    return len(nodes) - 1
def link(a, rel_type, b, **props):
    rels.append({'type': rel_type, 'start': a, 'end': b, 'props': props})

parasite = add('Movie', title='기생충', released=2019)
monster = add('Movie', title='괴물', released=2006)
memories = add('Movie', title='살인의 추억', released=2003)
shiri = add('Movie', title='쉬리', released=1999)
song, lee = add('Person', name='송강호'), add('Person', name='이선균')
bong = add('Person', name='봉준호')
for m in [parasite, monster, memories, shiri]:
    link(song, 'ACTED_IN', m)
link(lee, 'ACTED_IN', parasite)
link(bong, 'DIRECTED', parasite)
link(bong, 'DIRECTED', monster)

# MATCH (p:Person {name:'송강호'})-[:ACTED_IN]->(m:Movie) RETURN m.title, m.released
print('m.title      m.released')
for r in rels:                                      # 관계를 하나씩 대 보기
    p, m = nodes[r['start']], nodes[r['end']]
    if (r['type'] == 'ACTED_IN'
            and p['label'] == 'Person' and p['props']['name'] == '송강호'
            and m['label'] == 'Movie'):
        print(f"{m['props']['title']:10}  {m['props']['released']}")

# MATCH (d:Person)-[:DIRECTED]->(m:Movie {title:'기생충'}) RETURN d.name
print()
print('d.name')
for r in rels:
    d, m = nodes[r['start']], nodes[r['end']]
    if r['type'] == 'DIRECTED' and m['props'].get('title') == '기생충':
        print(d['props']['name'])`,
            expect: "m.title      m.released\n기생충         2019\n괴물          2006\n살인의 추억      2003\n쉬리          1999\n\nd.name\n봉준호",
            desc: '패턴의 각 부분(관계 타입, 시작 노드 조건, 끝 노드 조건)이 <code>if</code> 문의 <code>and</code> 조건 하나씩으로 바뀌었습니다. 진짜 Neo4j 는 모든 관계를 다 훑지 않고 송강호 노드에서 <b>바로 이어진 관계만</b> 따라가기 때문에 데이터가 수백만 개여도 빠릅니다. 이것이 그래프 데이터베이스의 강점입니다.' },
          { type: 'h', text: '방향이 있는 패턴 · 방향을 무시하는 패턴' },
          { type: 'p', html: '찾을 때는 화살촉을 <b>생략</b>할 수 있습니다. <code>-[:ACTED_IN]-</code> 처럼 쓰면 "어느 방향이든 이어져 있으면" 찾습니다. 반대로 화살촉을 잘못된 쪽으로 쓰면 <b>오류 없이 결과가 0행</b>이 되므로 주의해야 합니다.' },
          { type: 'figure', html: FIG_DIR, caption: '그림 4-7. 저장된 관계는 언제나 한 방향입니다. 찾을 때 방향이 반대면 0행, 화살촉을 생략하면 양쪽 모두 찾습니다.' },
          { type: 'code', title: 'Cypher 4-7. 기생충과 이어진 모든 사람 — 방향 무시 (Neo4j Browser 에서 실행)', run: false, code: `MATCH (p:Person)-[r]-(m:Movie {title: '기생충'})
RETURN p.name, type(r)`,
            desc: '관계 타입을 적지 않고 변수 <code>r</code> 만 붙였습니다. <code>type(r)</code> 은 관계의 타입 이름을 알려 주는 함수입니다. 결과는 송강호 · 이선균 · 조여정(ACTED_IN), 봉준호(DIRECTED) 4행입니다. "이 영화와 관련된 사람 모두" 처럼 방향이 중요하지 않은 질문에 편리합니다.' },
          { type: 'code', title: '예제 4-7. 방향 있는 찾기 · 없는 찾기 비교', code: `nodes = ['송강호', '기생충', '봉준호']
rels = [(0, 'ACTED_IN', 1), (2, 'DIRECTED', 1)]   # (시작, 타입, 끝)

def match(a_name, rel_type, b_name, direction):
    rows = []
    for s, t, e in rels:
        if rel_type and t != rel_type:
            continue
        pairs = []
        if direction in ('->', '-'):
            pairs.append((s, e))          # 저장된 방향 그대로
        if direction in ('<-', '-'):
            pairs.append((e, s))          # 거꾸로 읽기
        for x, y in pairs:
            if nodes[x] == a_name and (b_name is None or nodes[y] == b_name):
                rows.append((nodes[x], t, nodes[y]))
    return rows

print("(송강호)-[:ACTED_IN]->(기생충) :", len(match('송강호', 'ACTED_IN', '기생충', '->')), '행')
print("(송강호)<-[:ACTED_IN]-(기생충) :", len(match('송강호', 'ACTED_IN', '기생충', '<-')), '행')
print("(송강호)-[:ACTED_IN]-(기생충)  :", len(match('송강호', 'ACTED_IN', '기생충', '-')), '행')
print("(기생충)-[r]-(사람) :", match('기생충', None, None, '-'))`,
            expect: "(송강호)-[:ACTED_IN]->(기생충) : 1 행\n(송강호)<-[:ACTED_IN]-(기생충) : 0 행\n(송강호)-[:ACTED_IN]-(기생충)  : 1 행\n(기생충)-[r]-(사람) : [('기생충', 'ACTED_IN', '송강호'), ('기생충', 'DIRECTED', '봉준호')]",
            desc: '방향을 무시하면 저장된 방향과 <b>거꾸로 읽은 방향을 모두</b> 확인합니다. 그래서 기생충에서 출발해도 송강호 · 봉준호를 찾을 수 있습니다.' },
          { type: 'callout', kind: 'warn', title: '결과가 0행이면 먼저 방향을 의심하세요', html: 'Cypher 는 방향이 틀려도 <b>오류를 내지 않습니다</b>. 그냥 "그런 모양은 없다" 고 0행을 돌려줍니다. 결과가 비어 있으면 ① 화살촉 방향, ② 레이블 · 타입의 대소문자(<code>:movie</code>?), ③ 속성 값의 오타(<code>\'송강호 \'</code> 처럼 공백)를 차례로 확인하세요. 방향을 잘 모르겠으면 일단 화살촉을 빼고 찾아본 뒤 결과를 보고 고치는 것도 방법입니다.' },
          { type: 'h', text: 'WHERE: 조건 걸기' },
          { type: 'p', html: '패턴 안의 <code>{name: \'송강호\'}</code> 는 "<b>같다</b>" 조건만 쓸 수 있습니다. "2000년 <b>이후</b>", "이름에 송이 <b>들어간</b>" 처럼 더 다양한 조건은 <code>WHERE</code> 절에 씁니다. 사실 아래 두 문장은 똑같이 동작합니다.' },
          { type: 'code', title: 'Cypher 4-8. 같은 뜻의 두 문장 (Neo4j Browser 에서 실행)', run: false, code: `MATCH (p:Person {name: '송강호'}) RETURN p

MATCH (p:Person) WHERE p.name = '송강호' RETURN p`,
            desc: '같은지 비교할 때 Cypher 는 <code>=</code> <b>하나</b>를 씁니다 (Python 은 <code>==</code>). 같지 않다는 <code>&lt;&gt;</code> 입니다 (Python 은 <code>!=</code>).' },
          { type: 'table', head: ['종류', 'Cypher', '뜻 · 예시', 'Python 에서는'], rows: [
            ['비교', '<code>= &lt;&gt; &lt; &lt;= &gt; &gt;=</code>', '<code>m.released &gt;= 2000</code>', '<code>== != &lt; &lt;= &gt; &gt;=</code>'],
            ['그리고 · 또는 · 아니다', '<code>AND</code> · <code>OR</code> · <code>NOT</code>', '<code>m.released &gt;= 2000 AND m.score &gt; 8.5</code>', '<code>and</code> · <code>or</code> · <code>not</code>'],
            ['~로 시작 · 끝', '<code>STARTS WITH</code> · <code>ENDS WITH</code>', '<code>p.name STARTS WITH \'송\'</code>', '<code>startswith()</code> · <code>endswith()</code>'],
            ['~를 포함', '<code>CONTAINS</code>', '<code>m.title CONTAINS \'추억\'</code>', '<code>in</code>'],
            ['목록 안에 있음', '<code>IN [ … ]</code>', '<code>m.title IN [\'괴물\', \'쉬리\']</code>', '<code>in [ … ]</code>'],
            ['값이 없음 · 있음', '<code>IS NULL</code> · <code>IS NOT NULL</code>', '<code>m.score IS NULL</code>', '<code>is None</code> · <code>is not None</code>']
          ], caption: 'WHERE 에서 자주 쓰는 조건. 문자열 조건은 대소문자 · 띄어쓰기를 정확히 구분합니다.' },
          { type: 'code', title: 'Cypher 4-9. WHERE 조건 모음 (Neo4j Browser 에서 하나씩 실행)', run: false, code: `// ① 2000년 이후 · 평점 8.5 초과인 영화
MATCH (m:Movie) WHERE m.released >= 2000 AND m.score > 8.5
RETURN m.title, m.score

// ② 이름이 '송' 으로 시작하거나 1980년 이후 태어난 사람
MATCH (p:Person) WHERE p.name STARTS WITH '송' OR p.born >= 1980
RETURN p.name, p.born

// ③ 장르 목록에 '스릴러' 가 들어 있는 영화
MATCH (m:Movie) WHERE '스릴러' IN m.genres
RETURN m.title, m.genres

// ④ 평점(score) 속성이 없는 영화
MATCH (m:Movie) WHERE m.score IS NULL
RETURN m.title

// ⑤ 봉준호 영화가 아닌 영화
MATCH (d:Person)-[:DIRECTED]->(m:Movie) WHERE NOT d.name = '봉준호'
RETURN m.title, d.name`,
            desc: '결과: ① 기생충 9.5 · 살인의 추억 9.0 ② 송강호 1967 · 조여정 1981 ③ 기생충 · 올드보이 ④ 올드보이 · 쉬리 ⑤ 올드보이 박찬욱 · 쉬리 강제규. ③ 처럼 <code>IN</code> 의 오른쪽에 <b>리스트 속성</b>을 두면 "리스트 안에 이 값이 있나?" 를 묻습니다. ④ 의 <code>m.score = null</code> 은 <b>동작하지 않으니</b> 꼭 <code>IS NULL</code> 을 쓰세요.' },
          { type: 'p', html: '같은 조건을 Python 으로 써 보면 WHERE 가 결국 <b>각 행에 대해 참 · 거짓을 판단하는 if 문</b>이라는 것을 알 수 있습니다.' },
          { type: 'code', title: '예제 4-8. WHERE 조건을 Python 으로', code: `movies = [
    {'title': '기생충', 'released': 2019, 'genres': ['드라마', '스릴러'], 'score': 9.5},
    {'title': '괴물', 'released': 2006, 'genres': ['SF', '드라마'], 'score': 8.0},
    {'title': '살인의 추억', 'released': 2003, 'genres': ['범죄', '드라마'], 'score': 9.0},
    {'title': '올드보이', 'released': 2003, 'genres': ['스릴러', '미스터리']},
    {'title': '쉬리', 'released': 1999, 'genres': ['액션', '드라마']},
]

def where(cond):
    return [m['title'] for m in movies if cond(m)]

# m.get('score') : 속성이 없으면 None (Cypher 의 null)
print('① 2000년 이후 AND 평점 > 8.5 :',
      where(lambda m: m['released'] >= 2000 and (m.get('score') or 0) > 8.5))
print("③ '스릴러' IN genres        :", where(lambda m: '스릴러' in m['genres']))
print("   title CONTAINS '추억'     :", where(lambda m: '추억' in m['title']))
print("   title IN ['괴물', '쉬리'] :", where(lambda m: m['title'] in ['괴물', '쉬리']))
print('④ score IS NULL             :', where(lambda m: m.get('score') is None))
print('   NOT released < 2005      :', where(lambda m: not m['released'] < 2005))`,
            expect: "① 2000년 이후 AND 평점 > 8.5 : ['기생충', '살인의 추억']\n③ '스릴러' IN genres        : ['기생충', '올드보이']\n   title CONTAINS '추억'     : ['살인의 추억']\n   title IN ['괴물', '쉬리'] : ['괴물', '쉬리']\n④ score IS NULL             : ['올드보이', '쉬리']\n   NOT released < 2005      : ['기생충', '괴물']",
            desc: 'Python 에서는 없는 키를 <code>m[\'score\']</code> 로 꺼내면 오류가 나서 <code>m.get(\'score\')</code> 를 썼습니다. Cypher 는 없는 속성을 꺼내면 오류 대신 <code>null</code> 을 돌려주고, <code>null &gt; 8.5</code> 같은 비교는 "참이 아님" 으로 처리되어 그 행은 결과에서 빠집니다.' },
          { type: 'h', text: 'RETURN 꾸미기: AS · DISTINCT · ORDER BY · SKIP · LIMIT' },
          { type: 'p', html: '<code>RETURN</code> 은 찾은 결과를 <b>표 모양으로 정리</b>하는 단계입니다. 칸 이름을 바꾸고(AS), 겹치는 행을 없애고(DISTINCT), 줄을 세우고(ORDER BY), 몇 개만 고를(SKIP · LIMIT) 수 있습니다. 여러 절은 아래 그림의 순서로 결과를 줄여 가며 일합니다.' },
          { type: 'figure', html: FIG_PIPE, caption: '그림 4-6. MATCH 로 찾은 행이 WHERE · RETURN · ORDER BY · LIMIT 을 거치며 다듬어집니다.' },
          { type: 'table', head: ['꾸미기', '쓰는 법', '하는 일', 'pandas 로는'], rows: [
            ['<b>AS</b> 별칭', '<code>RETURN m.title AS 제목</code>', '결과 칸 이름 바꾸기', '<code>rename(columns=…)</code>'],
            ['<b>DISTINCT</b>', '<code>RETURN DISTINCT p.name</code>', '똑같은 행은 하나만', '<code>drop_duplicates()</code>'],
            ['<b>ORDER BY</b>', '<code>ORDER BY 제목</code> / <code>… DESC</code>', '오름차순 / 내림차순 정렬', '<code>sort_values(…, ascending=…)</code>'],
            ['<b>SKIP</b>', '<code>SKIP 2</code>', '앞에서 2행 건너뛰기', '<code>iloc[2:]</code>'],
            ['<b>LIMIT</b>', '<code>LIMIT 3</code>', '3행까지만', '<code>head(3)</code>']
          ], caption: 'RETURN 꾸미기. 순서는 언제나 RETURN → ORDER BY → SKIP → LIMIT 입니다.' },
          { type: 'code', title: 'Cypher 4-10. RETURN 꾸미기 (Neo4j Browser 에서 실행)', run: false, code: `MATCH (p:Person)-[:ACTED_IN]->(m:Movie)
WHERE m.released >= 2000
RETURN DISTINCT p.name AS 배우
ORDER BY 배우
SKIP 1 LIMIT 3`,
            expect: '╒════════╕\n│배우    │\n╞════════╡\n│"배두나"│\n│"송강호"│\n│"이선균"│\n└────────┘',
            desc: '2000년 이후 영화의 출연 행은 8개(송강호가 3번 나옴)이지만 <code>DISTINCT</code> 로 6명이 됩니다. 가나다순으로 세운 뒤 첫 사람을 건너뛰고 3명을 받으면 <b>배두나 · 송강호 · 이선균</b> 이 나옵니다. <code>ORDER BY</code> 에서는 <code>AS</code> 로 붙인 새 이름(배우)을 쓸 수 있습니다.' },
          { type: 'callout', kind: 'tip', title: 'DISTINCT 는 왜 필요할까요?', html: 'MATCH 는 패턴이 맞는 <b>곳마다</b> 한 행을 만듭니다. 송강호는 2000년 이후 영화 3편(기생충 · 괴물 · 살인의 추억)에 출연했으니 이름만 돌려받으면 "송강호" 가 3줄 나옵니다. 사람 목록이 필요할 때는 <code>DISTINCT</code> 를 붙이는 습관을 들이세요.' },
          { type: 'p', html: '이제 미니 저장소로 MATCH 원리를 체험하면서, 결과를 <b>pandas 표(DataFrame)</b>로 받아 RETURN 꾸미기를 그대로 따라 해 봅시다. MATCH 로 찾은 행들이 곧 표의 행이 됩니다.' },
          { type: 'code', title: '예제 4-9. (Person)-[:ACTED_IN]->(Movie) 를 찾아 pandas 표로', code: `import pandas as pd

movies = {'기생충': 2019, '괴물': 2006, '살인의 추억': 2003, '올드보이': 2003, '쉬리': 1999}
acted = [('송강호', '기생충', '기택'), ('이선균', '기생충', '동익'), ('조여정', '기생충', '연교'),
         ('송강호', '괴물', '강두'), ('배두나', '괴물', '남주'), ('송강호', '살인의 추억', '박두만'),
         ('김상경', '살인의 추억', '서태윤'), ('최민식', '올드보이', '오대수'),
         ('한석규', '쉬리', '유중원'), ('최민식', '쉬리', '박무영'), ('송강호', '쉬리', '이장길')]

# MATCH (p:Person)-[r:ACTED_IN]->(m:Movie) RETURN p.name, r.role, m.title, m.released
rows = []
for person, title, role in acted:
    rows.append({'p.name': person, 'r.role': role, 'm.title': title, 'm.released': movies[title]})
df = pd.DataFrame(rows)
print('MATCH 로 찾은 행:', len(df))

# WHERE m.released >= 2000
df = df[df['m.released'] >= 2000]
print('WHERE 뒤 행    :', len(df))

# RETURN DISTINCT p.name AS 배우 ORDER BY 배우 SKIP 1 LIMIT 3
result = (df[['p.name']].rename(columns={'p.name': '배우'})
          .drop_duplicates()
          .sort_values('배우')
          .iloc[1:]
          .head(3)
          .reset_index(drop=True))
print('DISTINCT 뒤 행 :', df['p.name'].nunique())
display(result)`,
            expect: 'MATCH 로 찾은 행: 11\nWHERE 뒤 행    : 8\nDISTINCT 뒤 행 : 6\n    배우\n0  배두나\n1  송강호\n2  이선균',
            desc: '11행 → WHERE 로 8행 → DISTINCT 로 6행 → SKIP 1 · LIMIT 3 으로 3행. 그림 4-6 의 흐름이 숫자로 보입니다. 마지막 표에는 배두나 · 송강호 · 이선균이 나옵니다. 한글 문자열 정렬은 Python 과 Neo4j 모두 가나다순입니다.' },
          { type: 'h', text: 'Neo4j Browser 결과 읽기: Graph · Table · Text' },
          { type: 'p', html: 'Browser 의 결과 창은 같은 결과를 세 가지 모양으로 보여 줍니다. 무엇을 <code>RETURN</code> 했느냐에 따라 쓸 수 있는 보기가 달라집니다.' },
          { type: 'figure', html: FIG_VIEWS, caption: '그림 4-8. 같은 결과의 세 가지 보기. Graph 는 노드 · 관계를 돌려받았을 때만 그려집니다.' },
          { type: 'table', head: ['RETURN 한 것', 'Graph', 'Table · Text', '예'], rows: [
            ['노드 · 관계 (변수 자체)', '✓ 동그라미와 선', '✓ 속성을 JSON 모양으로', '<code>RETURN p, m</code>'],
            ['속성 값 (문자열 · 숫자 …)', '✗ 그릴 것이 없음', '✓ 깔끔한 표', '<code>RETURN p.name, m.title</code>']
          ], caption: '그래프 모양을 보고 싶으면 노드를, 목록 · 숫자가 필요하면 속성을 RETURN 합니다.' },
          { type: 'callout', kind: 'info', title: 'Graph 보기의 "숨은 선"', html: '<code>MATCH (p:Person {name:\'송강호\'})-[:ACTED_IN]-&gt;(m) RETURN p, m</code> 처럼 노드만 돌려받아도 Graph 보기에는 화살표가 그려집니다. Browser 가 화면의 노드들 사이에 이미 있는 관계를 <b>알아서 이어 주기</b> 때문입니다 (설정의 "Connect result nodes"). 그래서 Graph 에는 보이는 선이 Table 에는 없을 수 있습니다. 정확한 결과는 Table 로 확인하세요.' },
          { type: 'p', html: 'Text 보기는 표를 글자로 그린 것입니다. 결과를 메모장이나 메신저에 붙여 넣을 때 편리합니다. Python 으로 같은 모양을 만들어 보면 "행과 열" 구조가 분명하게 보입니다.' },
          { type: 'code', title: '예제 4-10. Text 보기처럼 결과 표 그리기', code: `def text_view(columns, rows, width=10):
    def cell(v):
        s = '"' + v + '"' if isinstance(v, str) else str(v)
        return s + ' ' * (width - len(s))
    line = '+' + '+'.join(['-' * width] * len(columns)) + '+'
    print(line)
    print('|' + '|'.join(c + ' ' * (width - len(c)) for c in columns) + '|')
    print(line)
    for row in rows:
        print('|' + '|'.join(cell(v) for v in row) + '|')
    print(line)
    print(len(rows), 'rows')

# MATCH (p:Person {name:'송강호'})-[r:ACTED_IN]->(m:Movie)
# WHERE m.released >= 2000
# RETURN m.title AS 영화, r.role AS 역할, m.released AS 개봉 ORDER BY 개봉 DESC
rows = [('기생충', '기택', 2019), ('괴물', '강두', 2006), ('살인의 추억', '박두만', 2003)]
text_view(['영화', '역할', '개봉'], rows)`,
            expect: '+----------+----------+----------+\n|영화        |역할        |개봉        |\n+----------+----------+----------+\n|"기생충"     |"기택"      |2019      |\n|"괴물"      |"강두"      |2006      |\n|"살인의 추억"  |"박두만"     |2003      |\n+----------+----------+----------+\n3 rows',
            desc: '문자열은 큰따옴표로 감싸고 숫자는 그대로 표시하는 것까지 Text 보기와 같습니다. (한글은 화면에서 영문보다 폭이 넓어 칸이 조금 어긋나 보일 수 있습니다.)' },
          { type: 'h', text: '함께 해 보기: 영화 그래프에 질문 5개' },
          { type: 'p', html: '확장 영화 그래프(Cypher 4-4b)에 아래 다섯 질문을 Cypher 로 물어봅시다. 먼저 스스로 써 보고, 아래 답과 비교하세요. 질문을 <b>① 어떤 패턴인가? ② 어떤 조건인가? ③ 무엇을 어떤 순서로 보여 줄까?</b> 세 단계로 쪼개면 쉽습니다.' },
          { type: 'list', ordered: true, items: [
            '2000년 이후 개봉한 영화에 출연한 배우 이름을 가나다순으로 10명',
            '봉준호 감독의 영화 제목과 개봉연도를 최신순으로',
            '1970년 이전에 태어난 배우가 맡은 역할을, 배우 · 영화 · 역할 칸으로',
            '장르에 \'드라마\' 가 들어 있고 평점(score)이 없는 영화',
            '제목에 \'의\' 가 들어 있거나 장르에 \'SF\' 가 있는 영화를 오래된 순으로'
          ] },
          { type: 'code', title: 'Cypher 4-11. 질문 5개의 답 (Neo4j Browser 에서 하나씩 실행)', run: false, code: `// 1. 2000년 이후 영화 출연 배우, 가나다순 10명
MATCH (p:Person)-[:ACTED_IN]->(m:Movie)
WHERE m.released >= 2000
RETURN DISTINCT p.name AS 배우
ORDER BY 배우 LIMIT 10

// 2. 봉준호 영화, 최신순
MATCH (:Person {name: '봉준호'})-[:DIRECTED]->(m:Movie)
RETURN m.title AS 제목, m.released AS 개봉
ORDER BY 개봉 DESC

// 3. 1970년 이전 출생 배우의 역할
MATCH (p:Person)-[r:ACTED_IN]->(m:Movie)
WHERE p.born < 1970
RETURN p.name AS 배우, m.title AS 영화, r.role AS 역할
ORDER BY 배우, 영화

// 4. 드라마 장르인데 평점이 없는 영화
MATCH (m:Movie)
WHERE '드라마' IN m.genres AND m.score IS NULL
RETURN m.title AS 제목

// 5. 제목에 '의' 가 있거나 SF 장르인 영화, 오래된 순
MATCH (m:Movie)
WHERE m.title CONTAINS '의' OR 'SF' IN m.genres
RETURN m.title AS 제목, m.released AS 개봉, m.genres AS 장르
ORDER BY 개봉`,
            desc: '정답 1: 김상경 · 배두나 · 송강호 · 이선균 · 조여정 · 최민식 (한석규는 1999년 쉬리에만 나와서 빠짐, 6명이라 LIMIT 10 을 다 채우지 못함). 2: 기생충 2019 · 괴물 2006 · 살인의 추억 2003. 3: 송강호 4행 · 최민식 2행 · 한석규 1행. 4: 쉬리 (올드보이는 평점이 없지만 장르에 드라마가 없음). 5: 살인의 추억 2003 · 괴물 2006.' },
          { type: 'p', html: '이 중 1번과 3번을 Python 미니 저장소로도 풀어, Cypher 의 답과 같은지 확인해 봅시다. 데이터는 확장 영화 그래프와 똑같습니다.' },
          { type: 'code', title: '예제 4-11. 질문 1 을 Python 으로: 2000년 이후 영화 출연 배우 가나다순 10명', code: `import pandas as pd

nodes, rels = [], []
def add(label, **props):
    nodes.append({'label': label, 'props': props})
    return len(nodes) - 1
def link(a, rel_type, b, **props):
    rels.append({'type': rel_type, 'start': a, 'end': b, 'props': props})

M = {t: add('Movie', title=t, released=y) for t, y in
     [('기생충', 2019), ('괴물', 2006), ('살인의 추억', 2003), ('올드보이', 2003), ('쉬리', 1999)]}
P = {n: add('Person', name=n, born=b) for n, b in
     [('송강호', 1967), ('이선균', 1975), ('조여정', 1981), ('배두나', 1979), ('최민식', 1962),
      ('한석규', 1964), ('김상경', 1972), ('봉준호', 1969), ('박찬욱', 1963), ('강제규', 1962)]}
for n, t, role in [('송강호', '기생충', '기택'), ('이선균', '기생충', '동익'), ('조여정', '기생충', '연교'),
                   ('송강호', '괴물', '강두'), ('배두나', '괴물', '남주'), ('송강호', '살인의 추억', '박두만'),
                   ('김상경', '살인의 추억', '서태윤'), ('최민식', '올드보이', '오대수'),
                   ('한석규', '쉬리', '유중원'), ('최민식', '쉬리', '박무영'), ('송강호', '쉬리', '이장길')]:
    link(P[n], 'ACTED_IN', M[t], role=role)
for n, t in [('봉준호', '기생충'), ('봉준호', '괴물'), ('봉준호', '살인의 추억'),
             ('박찬욱', '올드보이'), ('강제규', '쉬리')]:
    link(P[n], 'DIRECTED', M[t])

# MATCH (p:Person)-[:ACTED_IN]->(m:Movie) WHERE m.released >= 2000
rows = []
for r in rels:
    p, m = nodes[r['start']], nodes[r['end']]
    if r['type'] == 'ACTED_IN' and m['props']['released'] >= 2000:
        rows.append({'배우': p['props']['name']})

# RETURN DISTINCT p.name AS 배우 ORDER BY 배우 LIMIT 10
answer = pd.DataFrame(rows).drop_duplicates().sort_values('배우').head(10)
print(answer.to_string(index=False))`,
            expect: ' 배우\n김상경\n배두나\n송강호\n이선균\n조여정\n최민식',
            desc: 'Cypher 의 답과 같은 6명입니다. 한석규는 1999년 쉬리에만 출연해서 WHERE 에서 걸러졌습니다.' },
          { type: 'code', title: '예제 4-12. 질문 3 을 Python 으로: 1970년 이전 출생 배우의 역할', code: `import pandas as pd

people = {'송강호': 1967, '이선균': 1975, '조여정': 1981, '배두나': 1979, '최민식': 1962,
          '한석규': 1964, '김상경': 1972}
acted = [('송강호', '기생충', '기택'), ('이선균', '기생충', '동익'), ('조여정', '기생충', '연교'),
         ('송강호', '괴물', '강두'), ('배두나', '괴물', '남주'), ('송강호', '살인의 추억', '박두만'),
         ('김상경', '살인의 추억', '서태윤'), ('최민식', '올드보이', '오대수'),
         ('한석규', '쉬리', '유중원'), ('최민식', '쉬리', '박무영'), ('송강호', '쉬리', '이장길')]

# MATCH (p:Person)-[r:ACTED_IN]->(m:Movie) WHERE p.born < 1970
rows = [{'배우': p, '영화': m, '역할': role} for p, m, role in acted if people[p] < 1970]

# RETURN p.name AS 배우, m.title AS 영화, r.role AS 역할 ORDER BY 배우, 영화
answer = pd.DataFrame(rows).sort_values(['배우', '영화']).reset_index(drop=True)
print(answer.to_string())
print()
print(answer.groupby('배우').size().to_string())`,
            expect: '    배우      영화   역할\n0  송강호      괴물   강두\n1  송강호     기생충   기택\n2  송강호  살인의 추억  박두만\n3  송강호      쉬리  이장길\n4  최민식      쉬리  박무영\n5  최민식    올드보이  오대수\n6  한석규      쉬리  유중원\n\n배우\n송강호    4\n최민식    2\n한석규    1',
            desc: '송강호 4행 · 최민식 2행 · 한석규 1행으로, Cypher 4-11 의 3번 답과 같습니다. <code>ORDER BY 배우, 영화</code> 처럼 여러 칸으로 정렬하면 pandas 에서도 <code>sort_values([\'배우\', \'영화\'])</code> 로 리스트를 넘깁니다.' },
          { type: 'callout', kind: 'more', title: 'Cypher 절의 순서 한눈에 보기', html: '<code>MATCH 패턴</code> → <code>WHERE 조건</code> → <code>RETURN [DISTINCT] 값 AS 별칭</code> → <code>ORDER BY 기준 [DESC]</code> → <code>SKIP n</code> → <code>LIMIT n</code>. 이 순서를 바꾸면 문법 오류가 납니다. 앞으로 배울 내용(5차시: 고치기 <code>SET</code> · 세기 <code>count</code> · 여러 단계 따라가기)도 모두 이 뼈대 위에 붙습니다.' },
          { type: 'callout', kind: 'info', teacher: true, title: '오개념 지도 팁 · 정답 확인', html: '① <code>=</code> 와 <code>==</code> 혼동이 가장 흔합니다 (Cypher 는 <code>=</code>). ② <code>IS NULL</code> 대신 <code>= null</code> 을 쓰면 오류 없이 0행이 나와 학생이 당황합니다. ③ DISTINCT 를 빼먹은 1번 답은 송강호가 3번 나옵니다 — 일부러 빼고 실행해 차이를 보여 주면 좋습니다. ④ 5번에서 OR 와 AND 를 바꿔 써 보게 하면 결과가 0행이 되는 것을 보며 논리 연산의 차이를 체감할 수 있습니다. ⑤ 4번의 올드보이처럼 "조건 하나만 맞는" 경우를 짚어 AND 의 뜻을 확인합니다.' }
        ],
        slides: [
          { layout: 'title', title: 'Cypher 기초: 만들고 찾기', subtitle: '2교시 · MATCH · WHERE · RETURN',
            notes: '<p>Cypher 4-4a · 4-4b 로 확장 영화 그래프를 미리 만들어 둡니다. 💬 <b>발문:</b> "도서관에서 \'2000년 이후 나온 추리소설\' 을 찾으려면 무엇을 정해야 할까요?" → 종류(패턴) · 조건 · 보여 줄 정보. (5분)</p>' },
          { layout: 'diagram', title: 'MATCH = 틀을 그래프에 대 보기', html: FIG_MATCH, caption: '맞는 곳 하나 = 결과 한 행',
            notes: '<p>Cypher 4-5 · 4-6 을 실행하고, 예제 4-6 으로 반복문 흉내를 보여 줍니다. 그림 4-7 로 방향 반대면 0행, 화살촉 생략이면 양쪽이라는 점을 확인합니다. 💬 "결과가 0행이면 무엇부터 의심할까요?" → 방향. (10분)</p>' },
          { layout: 'table', title: 'WHERE 조건', head: ['종류', 'Cypher'], rows: [
            ['비교', '= &lt;&gt; &lt; &lt;= &gt; &gt;='], ['논리', 'AND · OR · NOT'], ['문자열', 'STARTS WITH · ENDS WITH · CONTAINS'],
            ['목록', "IN ['괴물', '쉬리']"], ['값 없음', 'IS NULL · IS NOT NULL']
          ], lead: '같다는 = 하나, 같지 않다는 &lt;&gt;',
            notes: '<p>Cypher 4-9 의 다섯 문장을 하나씩 실행하고, 예제 4-8 로 Python 과 비교합니다. <code>= null</code> 이 0행이 되는 것을 직접 보여 줍니다. (10분)</p>' },
          { layout: 'diagram', title: 'RETURN 꾸미기의 흐름', html: FIG_PIPE, caption: 'MATCH → WHERE → RETURN(DISTINCT · AS) → ORDER BY → SKIP · LIMIT',
            notes: '<p>Cypher 4-10 과 예제 4-9 를 나란히 실행해 11 → 8 → 6 → 3행이 되는 과정을 확인합니다. 그림 4-8 로 Graph · Table · Text 보기 차이를 설명합니다. (10분)</p>' },
          { layout: 'summary', title: '정리 · 함께 해 보기', bullets: ['MATCH: 패턴에 맞는 곳마다 한 행', '방향이 틀리면 오류 없이 0행, <code>-[]-</code> 는 양쪽 모두', 'WHERE: 비교 · AND/OR/NOT · STARTS WITH · CONTAINS · IN · IS NULL', 'RETURN: AS · DISTINCT · ORDER BY · SKIP · LIMIT', '실습: 질문 5개를 Cypher 로, 2개는 Python 으로 (예제 4-11 · 4-12)'],
            notes: '<p>질문 5개를 먼저 스스로 쓰게 하고(8분) Cypher 4-11 로 맞춰 봅니다. 예제 4-11 · 4-12 로 Python 답이 같은지 확인하며 마칩니다. 다음 차시 예고: 고치기(SET) · 세기(count) · 따라가기. (15분)</p>' }
        ]
      }
    ]
  });
})();
