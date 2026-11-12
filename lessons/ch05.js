/* 05차시 Cypher 활용: 고치고 세고 따라가기 */
(function () {
  const ARROW = (id) => `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fill-arrow"/></marker></defs>`;

  /* 원 두 개 사이의 화살표 (원 테두리에서 시작 · 끝) */
  function edge(a, b, r, mk, label, cls, sw) {
    const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / d, uy = dy / d;
    const x1 = (a[0] + ux * r).toFixed(1), y1 = (a[1] + uy * r).toFixed(1);
    const x2 = (b[0] - ux * (r + (mk ? 3 : 0))).toFixed(1), y2 = (b[1] - uy * (r + (mk ? 3 : 0))).toFixed(1);
    let s = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls || 'ln'}" stroke-width="${sw || 2}"${mk ? ` marker-end="url(#${mk})"` : ''}/>`;
    if (label) s += `<text x="${((a[0] + b[0]) / 2).toFixed(1)}" y="${((a[1] + b[1]) / 2 - 6).toFixed(1)}" text-anchor="middle" class="tx-m">${label}</text>`;
    return s;
  }
  function circ(p, r, cls, t1, t2) {
    let s = `<circle cx="${p[0]}" cy="${p[1]}" r="${r}" class="${cls}"/>`;
    const tc = /s$/.test(cls) || cls === 'card-bg' ? 'tx' : 'tx-w';
    if (t2) s += `<text x="${p[0]}" y="${p[1] - 3}" text-anchor="middle" class="${tc}">${t1}</text><text x="${p[0]}" y="${p[1] + 15}" text-anchor="middle" class="${tc}">${t2}</text>`;
    else s += `<text x="${p[0]}" y="${p[1] + 5}" text-anchor="middle" class="${tc}">${t1}</text>`;
    return s;
  }

  /* 그림 5-1. CREATE 두 번 vs MERGE 두 번 */
  const FIG_DUP = `<svg viewBox="0 0 720 260" role="img" aria-label="왼쪽은 CREATE 를 두 번 실행해 송강호 노드가 두 개 생긴 그림, 오른쪽은 MERGE 를 두 번 실행해도 송강호 노드가 하나뿐인 그림">
  <rect x="10" y="10" width="340" height="240" rx="14" class="card-bg"/>
  <rect x="370" y="10" width="340" height="240" rx="14" class="p5s"/>
  <text x="180" y="40" text-anchor="middle" class="tx-b">CREATE 를 두 번 실행하면</text>
  <text x="180" y="64" text-anchor="middle" class="tx-m">CREATE (:Person {name: '송강호'})  × 2</text>
  ${circ([115, 140], 40, 'p1', '송강호')}
  ${circ([245, 140], 40, 'p1', '송강호')}
  <text x="180" y="212" text-anchor="middle" class="tx-b">✗ 같은 사람이 2명?!</text>
  <text x="180" y="234" text-anchor="middle" class="tx-m">무조건 새로 만들기 때문</text>
  <text x="540" y="40" text-anchor="middle" class="tx-b">MERGE 를 두 번 실행하면</text>
  <text x="540" y="64" text-anchor="middle" class="tx-m">MERGE (:Person {name: '송강호'})  × 2</text>
  ${circ([540, 140], 40, 'p1', '송강호')}
  <text x="540" y="212" text-anchor="middle" class="tx-b">✓ 언제나 1명</text>
  <text x="540" y="234" text-anchor="middle" class="tx-m">1번째: 없어서 만듦 · 2번째: 있어서 찾음</text>
</svg>`;

  /* 그림 5-2. MERGE 가 일하는 순서 */
  const FIG_MERGE = `<svg viewBox="0 0 720 300" role="img" aria-label="MERGE 는 먼저 같은 노드가 있는지 찾고, 있으면 그 노드를 쓰며 ON MATCH SET 을, 없으면 새로 만들며 ON CREATE SET 을 실행한다">
  ${ARROW('c05a1')}
  <rect x="10" y="112" width="215" height="76" rx="12" class="p4"/>
  <text x="117" y="144" text-anchor="middle" class="tx-w">MERGE</text>
  <text x="117" y="168" text-anchor="middle" class="tx-w">(p:Person {name:'송강호'})</text>
  <polygon points="335,95 420,150 335,205 250,150" class="p5s"/>
  <text x="335" y="146" text-anchor="middle" class="tx-b">그런 노드가</text>
  <text x="335" y="166" text-anchor="middle" class="tx-b">있나?</text>
  <rect x="460" y="20" width="250" height="90" rx="12" class="p3"/>
  <text x="585" y="52" text-anchor="middle" class="tx-w">있다 → 그 노드를 찾아 씀</text>
  <text x="585" y="80" text-anchor="middle" class="tx-w">ON MATCH SET 실행</text>
  <rect x="460" y="190" width="250" height="90" rx="12" class="p2"/>
  <text x="585" y="222" text-anchor="middle" class="tx-w">없다 → 새로 만듦</text>
  <text x="585" y="250" text-anchor="middle" class="tx-w">ON CREATE SET 실행</text>
  <line x1="227" y1="150" x2="246" y2="150" class="ln" stroke-width="2" marker-end="url(#c05a1)"/>
  <path d="M378 122 L440 70 L456 66" class="ln" stroke-width="2" marker-end="url(#c05a1)"/>
  <path d="M378 178 L440 230 L456 234" class="ln" stroke-width="2" marker-end="url(#c05a1)"/>
  <text x="420" y="84" class="tx-b">예</text>
  <text x="408" y="226" class="tx-b">아니오</text>
  <text x="117" y="230" text-anchor="middle" class="tx-m">어느 쪽이든 p 에는</text>
  <text x="117" y="248" text-anchor="middle" class="tx-m">송강호 노드 하나가 담깁니다</text>
</svg>`;

  /* 그림 5-3. 패턴 전체 MERGE 의 함정 */
  const FIG_TRAP = `<svg viewBox="0 0 720 340" role="img" aria-label="송강호와 기생충 노드가 이미 있을 때, 패턴 전체를 MERGE 하면 두 노드가 새로 하나씩 더 생기고, 노드를 먼저 MERGE 한 뒤 관계를 MERGE 하면 기존 노드끼리 이어진다">
  ${ARROW('c05a2')}
  <rect x="10" y="10" width="700" height="90" rx="14" class="card-bg"/>
  <text x="30" y="40" class="tx-b">처음 상태</text>
  <text x="30" y="62" class="tx-m">두 노드는 있고</text>
  <text x="30" y="80" class="tx-m">관계만 없음</text>
  ${circ([360, 55], 30, 'p1', '송강호')}
  ${circ([560, 55], 30, 'p3', '기생충')}
  <rect x="10" y="110" width="345" height="220" rx="14" class="card-bg"/>
  <text x="182" y="136" text-anchor="middle" class="tx-b">✗ 패턴 전체를 한 번에 MERGE</text>
  <text x="182" y="156" text-anchor="middle" class="tx-m">MERGE (:Person {…})-[:ACTED_IN]-&gt;(:Movie {…})</text>
  ${circ([90, 200], 26, 'p1', '송강호')}
  ${circ([275, 200], 26, 'p3', '기생충')}
  <circle cx="90" cy="275" r="26" class="p1"/><circle cx="90" cy="275" r="31" class="s5" stroke-width="2" stroke-dasharray="5 4"/>
  <text x="90" y="280" text-anchor="middle" class="tx-w">송강호</text>
  <circle cx="275" cy="275" r="26" class="p3"/><circle cx="275" cy="275" r="31" class="s5" stroke-width="2" stroke-dasharray="5 4"/>
  <text x="275" y="280" text-anchor="middle" class="tx-w">기생충</text>
  ${edge([90, 275], [275, 275], 31, 'c05a2', 'ACTED_IN')}
  <text x="182" y="322" text-anchor="middle" class="tx-m">점선 = 새로 생긴 복제 노드 (중복!)</text>
  <rect x="365" y="110" width="345" height="220" rx="14" class="p5s"/>
  <text x="537" y="136" text-anchor="middle" class="tx-b">✓ 노드 먼저, 관계는 나중에</text>
  <text x="537" y="156" text-anchor="middle" class="tx-m">MERGE (p) · MERGE (m) · MERGE (p)-[:ACTED_IN]-&gt;(m)</text>
  ${circ([440, 235], 30, 'p1', '송강호')}
  ${circ([635, 235], 30, 'p3', '기생충')}
  ${edge([440, 235], [635, 235], 30, 'c05a2', 'ACTED_IN')}
  <text x="537" y="300" text-anchor="middle" class="tx-m">이미 있는 두 노드 사이에 관계만 새로 생김</text>
</svg>`;

  /* 그림 5-4. DELETE vs DETACH DELETE */
  const FIG_DELETE = `<svg viewBox="0 0 720 270" role="img" aria-label="관계가 붙어 있는 이선균 노드를 DELETE 하면 끊어진 화살표가 남으므로 오류가 나고, DETACH DELETE 는 관계를 먼저 지운 뒤 노드를 지운다">
  ${ARROW('c05a3')}
  <rect x="10" y="10" width="340" height="250" rx="14" class="card-bg"/>
  <rect x="370" y="10" width="340" height="250" rx="14" class="p5s"/>
  <text x="180" y="40" text-anchor="middle" class="tx-b">DELETE p  →  ✗ 오류</text>
  <circle cx="80" cy="130" r="32" class="card-bg" stroke-dasharray="5 4"/>
  <text x="80" y="135" text-anchor="middle" class="tx-m">이선균?</text>
  ${circ([270, 130], 32, 'p3', '기생충')}
  ${edge([80, 130], [270, 130], 32, 'c05a3', 'ACTED_IN', 's5', 2.5)}
  <text x="180" y="200" text-anchor="middle" class="tx">노드만 지우면 시작점 없는</text>
  <text x="180" y="220" text-anchor="middle" class="tx">"끊어진 화살표" 가 남습니다</text>
  <text x="180" y="244" text-anchor="middle" class="tx-m">그래서 Neo4j 가 거부합니다</text>
  <text x="540" y="40" text-anchor="middle" class="tx-b">DETACH DELETE p  →  ✓</text>
  <text x="400" y="78" class="tx-m">① 붙은 관계를 먼저 끊고</text>
  <circle cx="440" cy="140" r="32" class="card-bg" stroke-dasharray="5 4"/>
  <text x="440" y="145" text-anchor="middle" class="tx-m">이선균</text>
  <line x1="474" y1="140" x2="596" y2="140" class="ln" stroke-width="2" stroke-dasharray="3 6"/>
  <text x="535" y="133" text-anchor="middle" class="tx-b">✂</text>
  ${circ([630, 140], 32, 'p3', '기생충')}
  <text x="400" y="205" class="tx-m">② 그다음 노드를 지웁니다</text>
  <text x="540" y="240" text-anchor="middle" class="tx">기생충 노드는 그대로 남습니다</text>
</svg>`;

  /* 그림 5-5. 집계: 그룹 기준이 자동으로 정해지는 규칙 */
  const FIG_GROUP = `<svg viewBox="0 0 720 330" role="img" aria-label="MATCH 로 찾은 7개 행을 배우 이름으로 묶으면 송강호 4행, 최민식 2행, 이선균 1행 세 묶음이 되고, 묶음마다 count 와 collect 결과 한 행이 나온다">
  ${ARROW('c05a4')}
  <text x="360" y="26" text-anchor="middle" class="tx-b">RETURN  p.name ,  count(m) ,  collect(m.title)</text>
  <text x="252" y="48" text-anchor="middle" class="tx-m">↑ 그룹 기준 (집계 아님)</text>
  <text x="470" y="48" text-anchor="middle" class="tx-m">↑ 집계 함수 → 묶음마다 하나</text>
  <rect x="20" y="64" width="250" height="30" class="p4s"/>
  <text x="80" y="84" text-anchor="middle" class="tx-b">p.name</text><text x="200" y="84" text-anchor="middle" class="tx-b">m.title</text>
  <rect x="20" y="96" width="250" height="118" rx="4" class="p1s"/>
  <rect x="20" y="216" width="250" height="58" rx="4" class="p2s"/>
  <rect x="20" y="276" width="250" height="28" rx="4" class="p3s"/>
  <text x="80" y="115" text-anchor="middle" class="tx">송강호</text><text x="200" y="115" text-anchor="middle" class="tx">기생충</text>
  <text x="80" y="144" text-anchor="middle" class="tx">송강호</text><text x="200" y="144" text-anchor="middle" class="tx">괴물</text>
  <text x="80" y="173" text-anchor="middle" class="tx">송강호</text><text x="200" y="173" text-anchor="middle" class="tx">살인의 추억</text>
  <text x="80" y="202" text-anchor="middle" class="tx">송강호</text><text x="200" y="202" text-anchor="middle" class="tx">쉬리</text>
  <text x="80" y="236" text-anchor="middle" class="tx">최민식</text><text x="200" y="236" text-anchor="middle" class="tx">올드보이</text>
  <text x="80" y="264" text-anchor="middle" class="tx">최민식</text><text x="200" y="264" text-anchor="middle" class="tx">쉬리</text>
  <text x="80" y="295" text-anchor="middle" class="tx">이선균</text><text x="200" y="295" text-anchor="middle" class="tx">기생충</text>
  <text x="145" y="324" text-anchor="middle" class="tx-m">MATCH 가 찾은 행 (일부)</text>
  <line x1="276" y1="155" x2="330" y2="155" class="ln" stroke-width="2" marker-end="url(#c05a4)"/>
  <line x1="276" y1="245" x2="330" y2="200" class="ln" stroke-width="2" marker-end="url(#c05a4)"/>
  <line x1="276" y1="290" x2="330" y2="245" class="ln" stroke-width="2" marker-end="url(#c05a4)"/>
  <text x="303" y="140" text-anchor="middle" class="tx-m">묶기</text>
  <rect x="340" y="110" width="370" height="30" class="p4s"/>
  <text x="390" y="130" text-anchor="middle" class="tx-b">p.name</text><text x="470" y="130" text-anchor="middle" class="tx-b">count</text><text x="600" y="130" text-anchor="middle" class="tx-b">collect</text>
  <rect x="340" y="142" width="370" height="32" rx="4" class="p1s"/>
  <rect x="340" y="186" width="370" height="32" rx="4" class="p2s"/>
  <rect x="340" y="230" width="370" height="32" rx="4" class="p3s"/>
  <text x="390" y="163" text-anchor="middle" class="tx">송강호</text><text x="470" y="163" text-anchor="middle" class="tx-b">4</text><text x="600" y="163" text-anchor="middle" class="tx-m">[기생충, 괴물, 살인의 추억, 쉬리]</text>
  <text x="390" y="207" text-anchor="middle" class="tx">최민식</text><text x="470" y="207" text-anchor="middle" class="tx-b">2</text><text x="600" y="207" text-anchor="middle" class="tx-m">[올드보이, 쉬리]</text>
  <text x="390" y="251" text-anchor="middle" class="tx">이선균</text><text x="470" y="251" text-anchor="middle" class="tx-b">1</text><text x="600" y="251" text-anchor="middle" class="tx-m">[기생충]</text>
  <text x="525" y="292" text-anchor="middle" class="tx-m">그룹 하나 = 결과 한 행</text>
</svg>`;

  /* 그림 5-6. WITH 로 중간 결과 넘기기 */
  const FIG_WITH = `<svg viewBox="0 0 720 220" role="img" aria-label="MATCH 가 출연 행 11개를 찾고, WITH 가 배우별로 묶어 7행을 만들고, WHERE 가 3편 이상만 남겨 1행, RETURN 이 결과를 돌려준다">
  ${ARROW('c05a5')}
  <rect x="10" y="40" width="155" height="120" rx="12" class="p1"/>
  <rect x="190" y="50" width="185" height="100" rx="12" class="p4"/>
  <rect x="400" y="60" width="150" height="80" rx="12" class="p2"/>
  <rect x="575" y="70" width="135" height="60" rx="12" class="p3"/>
  <text x="87" y="78" text-anchor="middle" class="tx-w">MATCH</text>
  <text x="87" y="102" text-anchor="middle" class="tx-w">(p)-[:ACTED_IN]-&gt;(m)</text>
  <text x="87" y="132" text-anchor="middle" class="tx-w">출연 행 11개</text>
  <text x="282" y="82" text-anchor="middle" class="tx-w">WITH p,</text>
  <text x="282" y="104" text-anchor="middle" class="tx-w">count(m) AS 출연</text>
  <text x="282" y="132" text-anchor="middle" class="tx-w">배우마다 1행 → 7행</text>
  <text x="475" y="94" text-anchor="middle" class="tx-w">WHERE 출연 &gt;= 3</text>
  <text x="475" y="120" text-anchor="middle" class="tx-w">1행</text>
  <text x="642" y="96" text-anchor="middle" class="tx-w">RETURN</text>
  <text x="642" y="117" text-anchor="middle" class="tx-w">p.name, 출연</text>
  <line x1="167" y1="100" x2="185" y2="100" class="ln" stroke-width="2" marker-end="url(#c05a5)"/>
  <line x1="377" y1="100" x2="395" y2="100" class="ln" stroke-width="2" marker-end="url(#c05a5)"/>
  <line x1="552" y1="100" x2="570" y2="100" class="ln" stroke-width="2" marker-end="url(#c05a5)"/>
  <text x="360" y="192" text-anchor="middle" class="tx-m">WITH 는 "여기까지의 결과를 이 모양으로 다음 줄에 넘긴다" 는 중간 RETURN 입니다</text>
  <text x="360" y="212" text-anchor="middle" class="tx-m">WITH 에 적지 않은 변수는 다음 줄에서 사라집니다</text>
</svg>`;

  /* 그림 5-7. 함께 출연한 배우 패턴 */
  const FIG_COSTAR = `<svg viewBox="0 0 720 250" role="img" aria-label="송강호에서 괴물로, 배두나에서 괴물로 ACTED_IN 화살표가 가운데 영화로 모이는 그림과 그 Cypher 패턴">
  ${ARROW('c05a6')}
  <rect x="10" y="10" width="700" height="160" rx="14" class="card-bg"/>
  ${circ([130, 90], 40, 'p1', 'a', '송강호')}
  ${circ([360, 90], 40, 'p3', 'm', '괴물')}
  ${circ([590, 90], 40, 'p1', 'b', '배두나')}
  ${edge([130, 90], [360, 90], 40, 'c05a6', 'ACTED_IN', '', 2.5)}
  ${edge([590, 90], [360, 90], 40, 'c05a6', 'ACTED_IN', '', 2.5)}
  <text x="360" y="155" text-anchor="middle" class="tx-m">화살표 두 개가 가운데 영화로 모입니다 = "같은 영화에 함께 출연"</text>
  <rect x="10" y="182" width="700" height="58" rx="12" class="p5s"/>
  <text x="360" y="218" text-anchor="middle" class="tx-b">(a:Person)-[:ACTED_IN]-&gt;(m:Movie)&lt;-[:ACTED_IN]-(b:Person)</text>
</svg>`;

  /* 그림 5-8. 친구 · 친구의 친구 · 3단계 */
  const H = { minsu: [90, 150], jiyoung: [240, 75], junho: [240, 225], hyunwoo: [390, 150], seoyeon: [540, 150], daeun: [665, 150] };
  const FIG_HOPS = `<svg viewBox="0 0 720 320" role="img" aria-label="민수에서 시작해 지영과 준호가 1단계, 현우가 2단계, 서연이 3단계, 다은이 4단계에 있는 KNOWS 관계 그래프. KNOWS*1..3 이 닿는 범위는 지영, 준호, 현우, 서연">
  ${ARROW('c05a7')}
  <rect x="180" y="30" width="420" height="250" rx="16" class="p5s"/>
  <text x="390" y="52" text-anchor="middle" class="tx-b">-[:KNOWS*1..3]- 가 닿는 범위</text>
  ${edge(H.minsu, H.jiyoung, 30, 'c05a7', '')}
  ${edge(H.minsu, H.junho, 30, 'c05a7', '')}
  ${edge(H.jiyoung, H.hyunwoo, 30, 'c05a7', '')}
  ${edge(H.junho, H.hyunwoo, 30, 'c05a7', '')}
  ${edge(H.hyunwoo, H.seoyeon, 30, 'c05a7', '')}
  ${edge(H.seoyeon, H.daeun, 30, 'c05a7', '')}
  ${circ(H.minsu, 30, 'p4', '민수')}
  ${circ(H.jiyoung, 30, 'p1', '지영')}
  ${circ(H.junho, 30, 'p1', '준호')}
  ${circ(H.hyunwoo, 30, 'p2', '현우')}
  ${circ(H.seoyeon, 30, 'p3', '서연')}
  ${circ(H.daeun, 30, 'card-bg', '다은')}
  <text x="90" y="305" text-anchor="middle" class="tx-m">출발 (0)</text>
  <text x="240" y="305" text-anchor="middle" class="tx-m">1단계: 친구</text>
  <text x="390" y="305" text-anchor="middle" class="tx-m">2단계: 친구의 친구</text>
  <text x="540" y="305" text-anchor="middle" class="tx-m">3단계</text>
  <text x="665" y="305" text-anchor="middle" class="tx-m">4단계 (범위 밖)</text>
</svg>`;

  /* 그림 5-9. 경로 변수 해부 */
  const FIG_PATH = `<svg viewBox="0 0 720 280" role="img" aria-label="민수 지영 현우로 이어진 경로 p 를 nodes(p) 는 노드 3개 목록, relationships(p) 는 관계 2개 목록, length(p) 는 관계 개수 2 로 꺼내는 그림">
  ${ARROW('c05a8')}
  <text x="360" y="28" text-anchor="middle" class="tx-b">p = (민수)-[:KNOWS]-&gt;(지영)-[:KNOWS]-&gt;(현우)</text>
  ${circ([150, 95], 32, 'p4', '민수')}
  ${circ([360, 95], 32, 'p1', '지영')}
  ${circ([570, 95], 32, 'p2', '현우')}
  ${edge([150, 95], [360, 95], 32, 'c05a8', 'KNOWS ①', 's2', 3)}
  ${edge([360, 95], [570, 95], 32, 'c05a8', 'KNOWS ②', 's2', 3)}
  <rect x="20" y="150" width="680" height="36" rx="8" class="p1s"/>
  <text x="40" y="174" class="tx">nodes(p)</text><text x="250" y="174" class="tx">[민수, 지영, 현우]</text><text x="680" y="174" text-anchor="end" class="tx-m">노드 3개 (동그라미)</text>
  <rect x="20" y="192" width="680" height="36" rx="8" class="p2s"/>
  <text x="40" y="216" class="tx">relationships(p)</text><text x="250" y="216" class="tx">[KNOWS ①, KNOWS ②]</text><text x="680" y="216" text-anchor="end" class="tx-m">관계 2개 (화살표)</text>
  <rect x="20" y="234" width="680" height="36" rx="8" class="p3s"/>
  <text x="40" y="258" class="tx">length(p)</text><text x="250" y="258" class="tx-b">2</text><text x="680" y="258" text-anchor="end" class="tx-m">길이 = 관계(화살표) 개수 = 노드 수 − 1</text>
</svg>`;

  /* 그림 5-10. 너비 우선 탐색(BFS) 단계 */
  const BFS_LEVELS = [['탕웨이'], ['박해일'], ['김상경', '배두나', '송강호'], ['유해진', '이선균', '조여정', '최민식', '한석규'], ['김윤석', '김태리', '유지태', '이정재', '하정우', '황정민'], ['김민희']];
  const BFS_PATH = { 0: 0, 1: 0, 2: 2, 3: 0, 4: 1, 5: 0 };
  const FIG_BFS = (function () {
    const X = (d) => 62 + d * 119, Y = (i) => 80 + i * 38;
    let s = `<svg viewBox="0 0 720 350" role="img" aria-label="탕웨이에서 출발한 너비 우선 탐색이 0단계부터 5단계까지 배우들을 물결처럼 방문하고, 탕웨이 박해일 송강호 유해진 김태리 김민희로 이어지는 최단 경로가 강조된 그림">`;
    BFS_LEVELS.forEach((lv, d) => {
      s += `<text x="${X(d)}" y="36" text-anchor="middle" class="tx-b">${d}단계</text>`;
      s += `<text x="${X(d)}" y="56" text-anchor="middle" class="tx-m">${lv.length}명</text>`;
    });
    for (let d = 0; d < 5; d++) {
      s += `<line x1="${X(d) + 48}" y1="${Y(BFS_PATH[d])}" x2="${X(d + 1) - 48}" y2="${Y(BFS_PATH[d + 1])}" class="s3" stroke-width="4"/>`;
    }
    BFS_LEVELS.forEach((lv, d) => {
      lv.forEach((name, i) => {
        const on = BFS_PATH[d] === i;
        s += `<rect x="${X(d) - 48}" y="${Y(i) - 15}" width="96" height="30" rx="8" class="${on ? 'p3' : 'card-bg'}"/>`;
        s += `<text x="${X(d)}" y="${Y(i) + 5}" text-anchor="middle" class="${on ? 'tx-w' : 'tx'}">${name}</text>`;
      });
    });
    s += `<text x="360" y="330" text-anchor="middle" class="tx-m">가까운 사람부터 한 단계씩 물결처럼 퍼집니다. 목표에 처음 닿은 단계 = 최단 거리 (여기서는 5)</text>`;
    return s + '</svg>';
  })();

  /* 그림 5-11. MATCH vs OPTIONAL MATCH */
  const FIG_OPT = `<svg viewBox="0 0 720 270" role="img" aria-label="MATCH 로 연출 관계를 찾으면 봉준호와 박찬욱만 남고, OPTIONAL MATCH 로 찾으면 송강호와 이선균도 연출 0 으로 결과에 남는다">
  <rect x="10" y="10" width="340" height="250" rx="14" class="card-bg"/>
  <rect x="370" y="10" width="340" height="250" rx="14" class="p5s"/>
  <text x="180" y="38" text-anchor="middle" class="tx-b">MATCH (p)-[:DIRECTED]-&gt;(m)</text>
  <text x="540" y="38" text-anchor="middle" class="tx-b">OPTIONAL MATCH (p)-[:DIRECTED]-&gt;(m)</text>
  <rect x="40" y="56" width="280" height="30" class="p4s"/><rect x="400" y="56" width="280" height="30" class="p4s"/>
  <text x="110" y="76" text-anchor="middle" class="tx-b">p.name</text><text x="250" y="76" text-anchor="middle" class="tx-b">count(m)</text>
  <text x="470" y="76" text-anchor="middle" class="tx-b">p.name</text><text x="610" y="76" text-anchor="middle" class="tx-b">count(m)</text>
  <text x="110" y="110" text-anchor="middle" class="tx">봉준호</text><text x="250" y="110" text-anchor="middle" class="tx">3</text>
  <text x="110" y="140" text-anchor="middle" class="tx">박찬욱</text><text x="250" y="140" text-anchor="middle" class="tx">3</text>
  <text x="180" y="190" text-anchor="middle" class="tx-m">송강호 · 이선균은 연출작이 없어서</text>
  <text x="180" y="208" text-anchor="middle" class="tx-m">패턴이 맞지 않아 행이 통째로 사라짐</text>
  <text x="470" y="110" text-anchor="middle" class="tx">봉준호</text><text x="610" y="110" text-anchor="middle" class="tx">3</text>
  <text x="470" y="140" text-anchor="middle" class="tx">박찬욱</text><text x="610" y="140" text-anchor="middle" class="tx">3</text>
  <rect x="400" y="150" width="280" height="58" rx="6" class="p3s"/>
  <text x="470" y="170" text-anchor="middle" class="tx">송강호</text><text x="610" y="170" text-anchor="middle" class="tx-b">0</text>
  <text x="470" y="198" text-anchor="middle" class="tx">이선균</text><text x="610" y="198" text-anchor="middle" class="tx-b">0</text>
  <text x="540" y="236" text-anchor="middle" class="tx-m">못 찾으면 m 에 null 을 넣고 행은 남김</text>
</svg>`;

  PY_COURSE.addChapter({
    id: 'ch05',
    no: '05',
    title: 'Cypher 활용: 고치고 세고 따라가기',
    subtitle: 'MERGE · SET · DELETE · 집계 · WITH · 경로 탐색 · shortestPath',
    summary: '4차시에 만들고 찾는 법을 배웠다면, 이번에는 그래프를 <b>고치고(MERGE · SET · DELETE)</b>, <b>세고(count · avg · collect · WITH)</b>, <b>따라가는(여러 단계 패턴 · 가변 길이 관계 · 최단 경로)</b> 법을 배웁니다. 중복 없이 안전하게 넣는 MERGE, pandas groupby 와 똑같이 동작하는 집계, 그리고 표 데이터베이스로는 어려운 "몇 단계 건너 아는 사이" 질의까지 — 그래프 DB 의 진짜 힘을 Cypher 와 Python 양쪽으로 경험합니다.',
    goals: [
      'CREATE 와 MERGE 의 차이를 설명하고, ON CREATE SET · ON MATCH SET 으로 중복 없이 데이터를 넣을 수 있다',
      'SET · REMOVE 로 속성과 레이블을 고치고, DELETE 와 DETACH DELETE 를 구분해 쓸 수 있다',
      'count · sum · avg · min · max · collect 로 통계를 내고, 그룹 기준이 정해지는 규칙과 WITH 를 이해한다',
      '여러 단계 패턴 · 가변 길이 관계 · 경로 변수로 그래프를 따라가며 질의할 수 있다',
      'shortestPath 의 원리를 Python 너비 우선 탐색(BFS)으로 직접 구현해 확인할 수 있다'
    ],
    sections: [
      /* ------------------------------------------------------------------ 1교시 */
      {
        id: 'ch05-1',
        title: 'MERGE · SET · DELETE 와 집계',
        minutes: 50,
        goals: ['CREATE 를 두 번 하면 생기는 중복 문제를 MERGE 로 해결한다', 'ON CREATE SET · ON MATCH SET 을 구분해 쓴다', 'SET · REMOVE · DELETE · DETACH DELETE 로 그래프를 고친다', '집계 함수와 그룹 기준 규칙, WITH 를 이해한다', '같은 집계를 pandas groupby 로 해 보고 결과를 비교한다'],
        flow: [['도입 · 중복 문제', 5], ['MERGE · ON CREATE/ON MATCH', 10], ['SET · REMOVE · DELETE', 8], ['집계 · WITH · pandas 비교', 12], ['함께 해 보기: 중복 없는 출연 목록과 통계', 15]],
        content: [
          { type: 'p', html: '4차시에는 <code>CREATE</code> 로 그래프를 만들고 <code>MATCH</code> 로 찾았습니다. 그런데 실제로 데이터를 다루다 보면 "이미 넣은 것을 또 넣는" 일, "잘못 넣은 것을 고치는" 일, "몇 개인지 세는" 일이 훨씬 많습니다. 이번 교시에는 그래프를 <b>안전하게 고치는 법</b>과 <b>세는 법</b>을 배웁니다.' },
          { type: 'h', text: 'CREATE 를 두 번 하면 무슨 일이 생길까요?' },
          { type: 'p', html: '<code>CREATE</code> 는 이름 그대로 <b>"무조건 새로 만들어라"</b> 입니다. 데이터베이스에 송강호가 이미 있는지 확인하지 않습니다. 그래서 같은 문장을 실수로 두 번 실행하거나, 출연 목록에 송강호가 여러 번 나오면 <b>송강호 노드가 여러 개</b> 생깁니다. 이렇게 되면 "송강호의 출연작" 을 물었을 때 답이 여러 노드에 흩어져 엉망이 됩니다.' },
          { type: 'figure', html: FIG_DUP, caption: '그림 5-1. CREATE 는 실행할 때마다 새 노드를 만들고, MERGE 는 "있으면 찾고 없으면 만듭니다".' },
          { type: 'p', html: '<code>MERGE</code> 는 <b>"있으면 찾고, 없으면 만들어라"</b> 입니다. 몇 번을 실행해도 결과가 같기 때문에, 데이터를 넣는 문장은 되도록 MERGE 로 쓰는 것이 안전합니다. 아래 예제는 이름 목록에 중복이 섞여 있을 때 두 방식이 어떻게 다른지 Python 으로 흉내 낸 것입니다.' },
          { type: 'code', title: 'Cypher 5-1. CREATE 와 MERGE (Neo4j Browser 에서 실행)', run: false, code: `// 두 번 실행해 보세요 → 송강호가 2명
CREATE (:Person {name: '송강호'})

// 두 번 실행해 보세요 → 송강호는 언제나 1명
MERGE (:Person {name: '송강호'})

// 확인
MATCH (p:Person {name: '송강호'}) RETURN count(p)`,
            desc: '두 번째 실행에서 CREATE 는 "Created 1 node" 를, MERGE 는 아무것도 만들지 않았다는 뜻으로 "(no changes, no records)" 를 보여 줍니다. 실습 전에 <code>MATCH (n) DETACH DELETE n</code> 으로 데이터베이스를 비우고 시작하세요 (이 문장의 뜻은 조금 뒤에 배웁니다).' },
          { type: 'code', title: '예제 5-1. CREATE 와 MERGE 를 Python 으로 흉내 내기', code: `names = ['송강호', '이선균', '송강호', '조여정', '이선균', '송강호']

# 방법 1: CREATE 처럼 — 확인 없이 무조건 새로 만들기
store_create = []
for name in names:
    store_create.append({'label': 'Person', 'name': name})

# 방법 2: MERGE 처럼 — 같은 것이 있으면 찾고, 없으면 만들기
store_merge = []
def merge(store, label, name):
    for node in store:
        if node['label'] == label and node['name'] == name:
            return node, '찾음'
    node = {'label': label, 'name': name}
    store.append(node)
    return node, '만듦'

for name in names:
    node, what = merge(store_merge, 'Person', name)
    print('MERGE', name, '→', what)

print()
print('CREATE 로 넣은 노드 수:', len(store_create))
print('MERGE  로 넣은 노드 수:', len(store_merge))
print('CREATE 저장소의 송강호:', sum(1 for n in store_create if n['name'] == '송강호'), '명')`,
            expect: 'MERGE 송강호 → 만듦\nMERGE 이선균 → 만듦\nMERGE 송강호 → 찾음\nMERGE 조여정 → 만듦\nMERGE 이선균 → 찾음\nMERGE 송강호 → 찾음\n\nCREATE 로 넣은 노드 수: 6\nMERGE  로 넣은 노드 수: 3\nCREATE 저장소의 송강호: 3 명',
            desc: 'MERGE 는 넣기 전에 <b>먼저 찾아보는</b> 단계가 있습니다. 그래서 6번 넣어도 서로 다른 3명만 남습니다. Neo4j 의 MERGE 도 원리는 같습니다 — 패턴을 먼저 MATCH 해 보고, 하나도 없을 때만 CREATE 합니다.' },
          { type: 'callout', kind: 'tip', title: 'MERGE 에는 "누구인지 알아볼 수 있는 속성" 만', html: '<code>MERGE (:Person {name: \'송강호\', born: 1967})</code> 처럼 속성을 여러 개 적으면, 이름과 출생연도가 <b>모두 같은</b> 노드를 찾습니다. 이미 <code>{name: \'송강호\'}</code> 만 있는 노드가 있다면 "다른 사람" 으로 보고 하나 더 만들어 버립니다. MERGE 의 괄호에는 <b>이름 · 아이디처럼 그 대상을 알아볼 수 있는 속성(식별 속성)</b>만 적고, 나머지 정보는 다음에 배울 <code>ON CREATE SET</code> · <code>SET</code> 으로 붙이세요.' },
          { type: 'h', text: 'ON CREATE SET · ON MATCH SET: 처음과 다시 만날 때 다르게' },
          { type: 'p', html: 'MERGE 는 결국 두 갈래 중 하나로 갑니다. <b>새로 만들었을 때</b>와 <b>이미 있던 것을 찾았을 때</b>입니다. 각 갈래에서만 실행할 일을 따로 적을 수 있습니다. 예를 들어 "처음 등록한 날짜" 는 만들 때 한 번만 적고, "방문 횟수" 는 다시 만날 때마다 1 씩 늘리고 싶다면 이렇게 씁니다.' },
          { type: 'figure', html: FIG_MERGE, caption: '그림 5-2. MERGE 는 먼저 찾아보고, 결과에 따라 ON MATCH SET 또는 ON CREATE SET 중 하나만 실행합니다.' },
          { type: 'code', title: 'Cypher 5-2. 처음이면 등록일, 다시 오면 방문 횟수 + 1 (Neo4j Browser 에서 여러 번 실행)', run: false, code: `MERGE (p:Person {name: '송강호'})
ON CREATE SET p.created = date(), p.visits = 1
ON MATCH SET  p.visits = p.visits + 1, p.lastSeen = date()
RETURN p.name, p.visits, p.created, p.lastSeen`,
            desc: '처음 실행하면 visits 가 1, lastSeen 은 <code>null</code> 입니다. 다시 실행할 때마다 visits 가 2, 3, … 으로 늘고 lastSeen 이 채워집니다. <code>date()</code> 는 오늘 날짜를 돌려주는 함수입니다.' },
          { type: 'code', title: '예제 5-2. ON CREATE SET · ON MATCH SET 흉내 내기', code: `store = []

def merge_visit(name, day):
    for node in store:
        if node['name'] == name:
            # ON MATCH SET p.visits = p.visits + 1, p.lastSeen = day
            node['visits'] = node['visits'] + 1
            node['lastSeen'] = day
            return node, 'ON MATCH '
    # ON CREATE SET p.created = day, p.visits = 1
    node = {'name': name, 'created': day, 'visits': 1}
    store.append(node)
    return node, 'ON CREATE'

log = [('송강호', '11-01'), ('이선균', '11-01'), ('송강호', '11-03'),
       ('송강호', '11-07'), ('이선균', '11-09')]
for name, day in log:
    node, branch = merge_visit(name, day)
    print(day, name, branch, '→', node)

print()
for node in store:
    print(node['name'], '방문', node['visits'], '번 / 처음', node['created'],
          '/ 마지막', node.get('lastSeen'))`,
            expect: "11-01 송강호 ON CREATE → {'name': '송강호', 'created': '11-01', 'visits': 1}\n11-01 이선균 ON CREATE → {'name': '이선균', 'created': '11-01', 'visits': 1}\n11-03 송강호 ON MATCH  → {'name': '송강호', 'created': '11-01', 'visits': 2, 'lastSeen': '11-03'}\n11-07 송강호 ON MATCH  → {'name': '송강호', 'created': '11-01', 'visits': 3, 'lastSeen': '11-07'}\n11-09 이선균 ON MATCH  → {'name': '이선균', 'created': '11-01', 'visits': 2, 'lastSeen': '11-09'}\n\n송강호 방문 3 번 / 처음 11-01 / 마지막 11-07\n이선균 방문 2 번 / 처음 11-01 / 마지막 11-09",
            desc: '처음 만난 날(created)은 한 번 적힌 뒤 바뀌지 않고, 방문 횟수와 마지막 방문일만 계속 바뀝니다. 만약 <code>ON CREATE</code> 없이 그냥 <code>SET p.created = date()</code> 라고 쓰면 실행할 때마다 created 가 오늘로 덮어써집니다.' },
          { type: 'h', text: '관계를 MERGE 할 때의 함정' },
          { type: 'p', html: 'MERGE 는 괄호 안의 <b>패턴 전체</b>를 하나로 보고 찾습니다. 그래서 송강호와 기생충 노드가 이미 있는데 관계만 없는 상태에서 <code>MERGE (:Person {name:\'송강호\'})-[:ACTED_IN]-&gt;(:Movie {title:\'기생충\'})</code> 를 실행하면, "이 모양 전체" 가 없으므로 <b>노드 둘과 관계를 모두 새로 만듭니다</b>. 송강호와 기생충이 하나씩 더 생기는 것이지요.' },
          { type: 'figure', html: FIG_TRAP, caption: '그림 5-3. 왼쪽처럼 쓰면 중복 노드가 생깁니다. 노드를 먼저 MERGE 해 변수에 담고, 관계는 그 변수로 MERGE 하세요.' },
          { type: 'code', title: 'Cypher 5-3. 관계를 안전하게 MERGE 하는 순서 (Neo4j Browser 에서 실행)', run: false, code: `// ✗ 패턴 전체가 없으면 노드까지 새로 만든다
MERGE (:Person {name: '송강호'})-[:ACTED_IN]->(:Movie {title: '기생충'})

// ✓ ① 노드를 하나씩 MERGE ② 변수로 관계만 MERGE
MERGE (p:Person {name: '송강호'})
MERGE (m:Movie {title: '기생충'})
MERGE (p)-[:ACTED_IN]->(m)`,
            desc: '두 번째 문장에서 셋째 줄의 <code>(p)</code> · <code>(m)</code> 은 앞 줄에서 찾았거나 만든 <b>바로 그 노드</b>입니다. 그래서 관계만 새로 생기고, 이미 관계가 있다면 아무것도 만들지 않습니다.' },
          { type: 'code', title: '예제 5-3. 패턴 전체 MERGE 와 나눠서 MERGE 비교', code: `def fresh():
    # 처음 상태: 송강호 · 기생충 노드는 있고, 관계는 없음
    nodes = [{'label': 'Person', 'name': '송강호'}, {'label': 'Movie', 'name': '기생충'}]
    return nodes, []

def merge_node(nodes, label, name):
    for i, n in enumerate(nodes):
        if n['label'] == label and n['name'] == name:
            return i
    nodes.append({'label': label, 'name': name})
    return len(nodes) - 1

# ✗ 패턴 전체를 찾고, 없으면 전체를 새로 만든다
nodes, rels = fresh()
found = any(nodes[a]['name'] == '송강호' and nodes[b]['name'] == '기생충' for a, t, b in rels)
if not found:
    nodes.append({'label': 'Person', 'name': '송강호'})
    nodes.append({'label': 'Movie', 'name': '기생충'})
    rels.append((len(nodes) - 2, 'ACTED_IN', len(nodes) - 1))
print('✗ 패턴 전체 MERGE → 노드', len(nodes), '개, 관계', len(rels), '개')

# ✓ 노드를 하나씩 MERGE 한 뒤, 관계만 MERGE
nodes, rels = fresh()
p = merge_node(nodes, 'Person', '송강호')
m = merge_node(nodes, 'Movie', '기생충')
if (p, 'ACTED_IN', m) not in rels:
    rels.append((p, 'ACTED_IN', m))
print('✓ 나눠서 MERGE   → 노드', len(nodes), '개, 관계', len(rels), '개')`,
            expect: '✗ 패턴 전체 MERGE → 노드 4 개, 관계 1 개\n✓ 나눠서 MERGE   → 노드 2 개, 관계 1 개',
            desc: '노드가 4개가 되었다는 것은 송강호 · 기생충이 각각 2개씩이라는 뜻입니다. 나눠서 MERGE 하면 원래 있던 2개 노드 사이에 관계 하나만 생깁니다.' },
          { type: 'h', text: 'SET · REMOVE: 속성과 레이블 고치기' },
          { type: 'p', html: '이미 있는 노드를 고칠 때는 먼저 <code>MATCH</code> (또는 MERGE)로 찾아 변수에 담고, <code>SET</code> 으로 바꾸거나 더하고, <code>REMOVE</code> 로 지웁니다. 노드를 Python 딕셔너리라고 생각하면 아주 쉽습니다 — SET 은 <code>d[키] = 값</code>, REMOVE 는 <code>del d[키]</code> 입니다.' },
          { type: 'table', head: ['하고 싶은 일', 'Cypher', 'Python 딕셔너리로는'], rows: [
            ['속성 추가 · 수정', '<code>SET p.born = 1967</code>', '<code>p[\'born\'] = 1967</code>'],
            ['속성 여러 개 한꺼번에 더하기', '<code>SET p += {nick: \'국민배우\', awards: 3}</code>', '<code>p.update({...})</code>'],
            ['속성 전부 바꿔치기 (주의!)', '<code>SET p = {name: \'송강호\'}</code>', '<code>p = {...}</code> — 나머지는 모두 사라짐'],
            ['속성 지우기', '<code>REMOVE p.nick</code> 또는 <code>SET p.nick = null</code>', '<code>del p[\'nick\']</code>'],
            ['레이블 추가', '<code>SET p:Actor</code>', '레이블 집합에 <code>add</code>'],
            ['레이블 지우기', '<code>REMOVE p:Actor</code>', '레이블 집합에서 <code>discard</code>']
          ], caption: 'SET 과 REMOVE. 속성에 null 을 넣는 것은 "그 속성을 지운다" 와 같습니다.' },
          { type: 'code', title: 'Cypher 5-4. 송강호 노드 고치기 (Neo4j Browser 에서 실행)', run: false, code: `MATCH (p:Person {name: '송강호'})
SET p.born = 1967,
    p += {nick: '국민배우', awards: 3},
    p:Actor
RETURN p

MATCH (p:Person {name: '송강호'})
REMOVE p.nick, p:Actor
SET p.awards = null
RETURN p, labels(p)`,
            desc: '<code>SET</code> 뒤에 쉼표로 여러 개를 이어 쓸 수 있습니다. <code>labels(p)</code> 는 노드의 레이블 목록을 돌려주는 함수입니다. 두 번째 문장 뒤에는 name 과 born 만 남고 레이블은 <code>["Person"]</code> 입니다.' },
          { type: 'code', title: '예제 5-4. 딕셔너리로 보는 SET · REMOVE', code: `labels = {'Person'}
props = {'name': '송강호'}

def show(step):
    print(step.ljust(36), ':' + ':'.join(sorted(labels)), props)

show('처음')
props['born'] = 1966;                      show("SET p.born = 1966")
props['born'] = 1967;                      show("SET p.born = 1967  (수정)")
props.update({'nick': '국민배우', 'awards': 3}); show("SET p += {nick, awards}")
labels.add('Actor');                       show("SET p:Actor")
del props['nick'];                         show("REMOVE p.nick")
props.pop('awards');                       show("SET p.awards = null")
labels.discard('Actor');                   show("REMOVE p:Actor")
props = {'name': '송강호'};                 show("SET p = {name: '송강호'}  (주의!)")`,
            expect: "처음                                   :Person {'name': '송강호'}\nSET p.born = 1966                    :Person {'name': '송강호', 'born': 1966}\nSET p.born = 1967  (수정)              :Person {'name': '송강호', 'born': 1967}\nSET p += {nick, awards}              :Person {'name': '송강호', 'born': 1967, 'nick': '국민배우', 'awards': 3}\nSET p:Actor                          :Actor:Person {'name': '송강호', 'born': 1967, 'nick': '국민배우', 'awards': 3}\nREMOVE p.nick                        :Actor:Person {'name': '송강호', 'born': 1967, 'awards': 3}\nSET p.awards = null                  :Actor:Person {'name': '송강호', 'born': 1967}\nREMOVE p:Actor                       :Person {'name': '송강호', 'born': 1967}\nSET p = {name: '송강호'}  (주의!)         :Person {'name': '송강호'}",
            desc: '마지막 줄을 보세요. <code>+=</code> 가 아닌 <code>=</code> 로 맵을 통째로 넣으면 <b>born 까지 사라집니다</b>. 속성을 더하고 싶을 때는 꼭 <code>+=</code> 를 쓰세요.' },
          { type: 'h', text: 'DELETE 와 DETACH DELETE' },
          { type: 'p', html: '노드를 지우는 명령은 <code>DELETE</code> 입니다. 그런데 <b>관계가 붙어 있는 노드</b>를 DELETE 하면 오류가 납니다. 노드만 사라지면 그 노드에서 출발하던 화살표가 "출발점 없는 화살표" 로 남기 때문입니다. Neo4j 는 이런 끊어진 관계를 절대 허용하지 않습니다.' },
          { type: 'figure', html: FIG_DELETE, caption: '그림 5-4. DELETE 는 관계가 없는 노드만 지울 수 있고, DETACH DELETE 는 붙은 관계를 먼저 지운 뒤 노드를 지웁니다.' },
          { type: 'code', title: 'Cypher 5-5. 지우기 세 가지 (Neo4j Browser 에서 실행)', run: false, code: `// ① 관계가 붙은 노드를 DELETE → 오류
MATCH (p:Person {name: '이선균'}) DELETE p
// Cannot delete node<12>, because it still has relationships.
// To delete this node, you must first delete its relationships.

// ② 관계만 지우기: 관계에 변수를 붙여 DELETE
MATCH (:Person {name: '이선균'})-[r:ACTED_IN]->(:Movie {title: '기생충'})
DELETE r

// ③ 관계까지 한꺼번에: DETACH DELETE
MATCH (p:Person {name: '이선균'}) DETACH DELETE p

// (연습용) 데이터베이스 전체 비우기 — 되돌릴 수 없으니 조심!
MATCH (n) DETACH DELETE n`,
            desc: '오류 메시지의 <code>node&lt;12&gt;</code> 숫자는 데이터베이스마다 다릅니다. 지우기는 <b>되돌리기(Ctrl+Z)가 없습니다</b>. 지우기 전에 같은 MATCH 로 <code>RETURN</code> 해서 무엇이 지워질지 먼저 확인하는 습관을 들이세요.' },
          { type: 'code', title: '예제 5-5. DELETE 가 거부되는 이유 흉내 내기', code: `nodes = {'송강호': 'Person', '이선균': 'Person', '기생충': 'Movie', '임시배우': 'Person'}
rels = [('송강호', 'ACTED_IN', '기생충'), ('이선균', 'ACTED_IN', '기생충')]

def delete(name):
    attached = [r for r in rels if name in (r[0], r[2])]
    if attached:
        raise ValueError(f'Cannot delete node<{name}>, because it still has relationships ({len(attached)}개)')
    del nodes[name]

def detach_delete(name):
    attached = [r for r in rels if name in (r[0], r[2])]
    for r in attached:
        rels.remove(r)        # ① 관계를 먼저 끊고
    del nodes[name]           # ② 노드를 지운다
    return len(attached)

delete('임시배우')
print('DELETE 임시배우 → 성공 (관계가 없었음)')

try:
    delete('이선균')
except ValueError as e:
    print('DELETE 이선균 → 오류:', e)

n = detach_delete('이선균')
print('DETACH DELETE 이선균 → 관계', n, '개와 노드를 지움')
print('남은 노드:', list(nodes))
print('남은 관계:', rels)`,
            expect: "DELETE 임시배우 → 성공 (관계가 없었음)\nDELETE 이선균 → 오류: Cannot delete node<이선균>, because it still has relationships (1개)\nDETACH DELETE 이선균 → 관계 1 개와 노드를 지움\n남은 노드: ['송강호', '기생충']\n남은 관계: [('송강호', 'ACTED_IN', '기생충')]",
            desc: '관계가 없던 임시배우는 DELETE 로 바로 지워졌지만, 이선균은 거부되었습니다. DETACH DELETE 는 이선균에게 붙은 관계 1개를 먼저 끊고 노드를 지웁니다. 기생충 노드와 송강호의 관계는 그대로입니다.' },
          { type: 'callout', kind: 'warn', title: 'DETACH DELETE 는 편리하지만 무섭습니다', html: '<code>MATCH (n) DETACH DELETE n</code> 은 경고 없이 <b>모든 노드와 관계</b>를 지웁니다. 연습할 때는 편리하지만, 실제 데이터에서는 MATCH 에 레이블과 조건을 꼭 붙이고, 먼저 <code>RETURN count(n)</code> 으로 지울 개수를 확인하세요.' },
          { type: 'h', text: '집계: count · sum · avg · min · max · collect' },
          { type: 'p', html: '"송강호는 몇 편에 출연했나?", "영화 평점의 평균은?" 처럼 여러 행을 <b>하나의 값으로 모으는</b> 계산을 <b>집계(aggregation)</b>라고 합니다. Cypher 의 집계 함수는 엑셀 · pandas 의 함수와 거의 같습니다. 4차시의 확장 영화 그래프(영화 5편, 출연 관계 11개)로 연습합니다.' },
          { type: 'table', head: ['함수', '하는 일', '예', 'pandas 로는'], rows: [
            ['<code>count(x)</code>', '개수 (null 은 빼고 셈)', '<code>count(m)</code>', '<code>count()</code> · <code>size()</code>'],
            ['<code>count(*)</code>', '행 개수 (null 도 셈)', '<code>count(*)</code>', '<code>len(df)</code>'],
            ['<code>sum(x)</code>', '합계', '<code>sum(m.score)</code>', '<code>sum()</code>'],
            ['<code>avg(x)</code>', '평균 (null 은 빼고)', '<code>avg(m.score)</code>', '<code>mean()</code>'],
            ['<code>min(x)</code> · <code>max(x)</code>', '최솟값 · 최댓값', '<code>min(m.released)</code>', '<code>min()</code> · <code>max()</code>'],
            ['<code>collect(x)</code>', '값들을 리스트로 모으기', '<code>collect(m.title)</code>', '<code>agg(list)</code>'],
            ['<code>count(DISTINCT x)</code>', '서로 다른 것만 세기', '<code>count(DISTINCT p)</code>', '<code>nunique()</code>']
          ], caption: '자주 쓰는 집계 함수. 집계 함수는 모두 null 값을 건너뜁니다 (count(*) 만 예외).' },
          { type: 'code', title: 'Cypher 5-6. 영화 전체를 하나로 모으는 집계 (Neo4j Browser 에서 실행)', run: false, code: `MATCH (m:Movie)
RETURN count(*)          AS 영화수,
       count(m.score)    AS 평점있는영화,
       avg(m.score)      AS 평균평점,
       min(m.released)   AS 가장오래된,
       max(m.released)   AS 가장최근,
       collect(m.title)  AS 제목목록`,
            expect: '영화수 5 · 평점있는영화 3 · 평균평점 8.833… · 가장오래된 1999 · 가장최근 2019 · 제목목록 ["기생충", "괴물", "살인의 추억", "올드보이", "쉬리"]',
            desc: '올드보이 · 쉬리는 score 속성이 없어서(null) <code>count(m.score)</code> 는 3, 평균도 세 영화(9.5 · 8.0 · 9.0)로만 계산됩니다. 집계 함수만 RETURN 하면 결과는 <b>딱 1행</b>입니다.' },
          { type: 'h', text: '그룹 기준은 자동으로 정해집니다' },
          { type: 'p', html: 'SQL 이나 pandas 에서는 "무엇으로 묶을지" 를 <code>GROUP BY</code> · <code>groupby()</code> 로 따로 적습니다. Cypher 에는 GROUP BY 가 없습니다. 대신 <b>RETURN 에 함께 적은 "집계가 아닌 값" 이 자동으로 그룹 기준</b>이 됩니다.' },
          { type: 'figure', html: FIG_GROUP, caption: '그림 5-5. p.name 은 집계 함수가 아니므로 그룹 기준이 되고, count · collect 는 그룹(배우)마다 계산됩니다.' },
          { type: 'table', head: ['RETURN 에 쓴 것', '그룹 기준', '결과 행'], rows: [
            ['<code>count(m)</code>', '없음 (전체가 한 그룹)', '1행: 11'],
            ['<code>p.name, count(m)</code>', 'p.name', '배우마다 1행 (7행)'],
            ['<code>m.title, count(p)</code>', 'm.title', '영화마다 1행 (5행)'],
            ['<code>p.name, m.title, count(*)</code>', 'p.name + m.title', '배우-영화 짝마다 1행 (11행)']
          ], caption: '집계가 아닌 칸을 하나 더 적으면 그만큼 더 잘게 묶입니다.' },
          { type: 'code', title: 'Cypher 5-7. 배우별 출연 편수와 출연작 (Neo4j Browser 에서 실행)', run: false, code: `MATCH (p:Person)-[:ACTED_IN]->(m:Movie)
RETURN p.name AS 배우, count(m) AS 출연, collect(m.title) AS 출연작
ORDER BY 출연 DESC, 배우`,
            expect: '╒══════╤════╤══════════════════════════════════╕\n│배우  │출연│출연작                            │\n╞══════╪════╪══════════════════════════════════╡\n│"송강호"│4   │["기생충", "괴물", "살인의 추억", "쉬리"]│\n│"최민식"│2   │["올드보이", "쉬리"]                │\n│"김상경"│1   │["살인의 추억"]                     │\n│ …    │    │                                  │\n└──────┴────┴──────────────────────────────────┘',
            desc: 'ORDER BY 에 <code>출연 DESC, 배우</code> 처럼 두 기준을 주면, 출연이 같을 때는 이름 가나다순으로 정렬됩니다. collect 안의 순서는 정해져 있지 않으니, 순서가 중요하면 미리 ORDER BY 한 뒤 모아야 합니다 (WITH 에서 배웁니다).' },
          { type: 'p', html: '같은 계산을 Python 으로 해 봅시다. 먼저 딕셔너리로 직접 세 보고, 이어서 pandas 의 <code>groupby</code> 로 한 줄에 끝내 봅니다. 둘 다 <b>"묶고 → 묶음마다 계산"</b> 하는 같은 원리입니다.' },
          { type: 'code', title: '예제 5-6. 딕셔너리로 직접 세기 = count · collect 의 원리', code: `acted = [('송강호', '기생충'), ('이선균', '기생충'), ('조여정', '기생충'),
         ('송강호', '괴물'), ('배두나', '괴물'), ('송강호', '살인의 추억'),
         ('김상경', '살인의 추억'), ('최민식', '올드보이'),
         ('한석규', '쉬리'), ('최민식', '쉬리'), ('송강호', '쉬리')]

count, titles = {}, {}
for actor, movie in acted:                     # MATCH 가 찾은 행 하나씩
    count[actor] = count.get(actor, 0) + 1     # count(m)
    titles.setdefault(actor, []).append(movie)  # collect(m.title)

# ORDER BY 출연 DESC, 배우
for actor in sorted(count, key=lambda a: (-count[a], a)):
    print(actor, count[actor], titles[actor])`,
            expect: "송강호 4 ['기생충', '괴물', '살인의 추억', '쉬리']\n최민식 2 ['올드보이', '쉬리']\n김상경 1 ['살인의 추억']\n배두나 1 ['괴물']\n이선균 1 ['기생충']\n조여정 1 ['기생충']\n한석규 1 ['쉬리']",
            desc: '딕셔너리의 키(배우 이름)가 곧 그룹 기준입니다. 정렬 키 <code>(-count[a], a)</code> 는 "편수는 큰 순, 같으면 이름순" 이라는 뜻으로 Cypher 의 <code>ORDER BY 출연 DESC, 배우</code> 와 같습니다.' },
          { type: 'code', title: '예제 5-7. pandas 로 같은 집계: 전체 집계와 groupby', code: `import pandas as pd

movies = pd.DataFrame({
    'title': ['기생충', '괴물', '살인의 추억', '올드보이', '쉬리'],
    'released': [2019, 2006, 2003, 2003, 1999],
    'score': [9.5, 8.0, 9.0, None, None],     # 평점 없음 = NaN (Cypher 의 null)
})
print('count(*)       :', len(movies))
print('count(m.score) :', movies['score'].count())
print('avg(m.score)   :', round(movies['score'].mean(), 3))
print('min · max 개봉 :', movies['released'].min(), movies['released'].max())
print()

acted = pd.DataFrame([('송강호', '기생충'), ('이선균', '기생충'), ('조여정', '기생충'),
                      ('송강호', '괴물'), ('배두나', '괴물'), ('송강호', '살인의 추억'),
                      ('김상경', '살인의 추억'), ('최민식', '올드보이'),
                      ('한석규', '쉬리'), ('최민식', '쉬리'), ('송강호', '쉬리')],
                     columns=['배우', '영화'])
# RETURN p.name AS 배우, count(m) AS 출연, collect(m.title) AS 출연작
result = acted.groupby('배우').agg(출연=('영화', 'count'), 출연작=('영화', list)).reset_index()
result = result.sort_values(['출연', '배우'], ascending=[False, True])
print(result.to_string(index=False))`,
            expect: "count(*)       : 5\ncount(m.score) : 3\navg(m.score)   : 8.833\nmin · max 개봉 : 1999 2019\n\n 배우  출연                   출연작\n송강호   4 [기생충, 괴물, 살인의 추억, 쉬리]\n최민식   2            [올드보이, 쉬리]\n김상경   1              [살인의 추억]\n배두나   1                  [괴물]\n이선균   1                 [기생충]\n조여정   1                 [기생충]\n한석규   1                  [쉬리]",
            desc: 'pandas 도 Cypher 처럼 평균을 낼 때 빈 값(NaN)을 건너뜁니다. 그래서 평균은 (9.5 + 8.0 + 9.0) ÷ 3 ≈ 8.833 으로 Cypher 5-6 과 같습니다. pandas 는 <code>groupby(\'배우\')</code> 로 그룹 기준을 <b>직접 적고</b>, Cypher 는 RETURN 의 <code>p.name</code> 으로 <b>자동으로 정한다</b>는 차이만 있습니다.' },
          { type: 'h', text: 'WITH: 중간 결과를 다음 단계로 넘기기' },
          { type: 'p', html: '"출연작이 <b>3편 이상</b>인 배우" 를 찾고 싶다고 해 봅시다. 출연 편수는 집계를 해야 알 수 있는데, <code>WHERE</code> 는 MATCH 바로 뒤에서 <b>집계 전에</b> 일합니다. 그래서 "일단 세고 → 그 결과로 거르기" 를 하려면 중간에 한 번 끊어 주는 <code>WITH</code> 가 필요합니다. WITH 는 <b>문장 가운데에 넣는 RETURN</b> 이라고 생각하면 됩니다.' },
          { type: 'figure', html: FIG_WITH, caption: '그림 5-6. WITH 에서 한 번 집계해 넘기면, 그다음 WHERE 는 집계 결과(출연)로 거를 수 있습니다.' },
          { type: 'code', title: 'Cypher 5-8. 출연작이 3편 이상인 배우 (Neo4j Browser 에서 실행)', run: false, code: `MATCH (p:Person)-[:ACTED_IN]->(m:Movie)
WITH p, count(m) AS 출연
WHERE 출연 >= 3
RETURN p.name AS 배우, 출연
ORDER BY 출연 DESC

// WITH 로 정렬한 뒤 모으면 collect 순서도 정할 수 있습니다
MATCH (p:Person {name: '송강호'})-[:ACTED_IN]->(m:Movie)
WITH m ORDER BY m.released
RETURN collect(m.title) AS 개봉순_출연작`,
            desc: '첫 문장의 결과는 <b>송강호 4</b> 한 행입니다. WITH 다음 줄부터는 WITH 에 적은 <code>p</code> 와 <code>출연</code> 만 쓸 수 있고, <code>m</code> 은 사라집니다. 두 번째 문장의 결과는 <code>["쉬리", "살인의 추억", "괴물", "기생충"]</code> 입니다.' },
          { type: 'code', title: '예제 5-8. WITH … WHERE 를 pandas 로', code: `import pandas as pd

acted = pd.DataFrame([('송강호', '기생충'), ('이선균', '기생충'), ('조여정', '기생충'),
                      ('송강호', '괴물'), ('배두나', '괴물'), ('송강호', '살인의 추억'),
                      ('김상경', '살인의 추억'), ('최민식', '올드보이'),
                      ('한석규', '쉬리'), ('최민식', '쉬리'), ('송강호', '쉬리')],
                     columns=['배우', '영화'])

# WITH p, count(m) AS 출연
step = acted.groupby('배우').size().reset_index(name='출연')
print('WITH 뒤 행 수:', len(step))

# WHERE 출연 >= 3  RETURN p.name AS 배우, 출연
print(step[step['출연'] >= 3].to_string(index=False))
print()
print('2편 이상이면:', list(step[step['출연'] >= 2]['배우']))`,
            expect: "WITH 뒤 행 수: 7\n 배우  출연\n송강호   4\n\n2편 이상이면: ['송강호', '최민식']",
            desc: '11행 → WITH(묶기)로 7행 → WHERE 로 1행. 그림 5-6 의 흐름 그대로입니다. SQL 을 아는 분이라면 "WITH … WHERE" 가 SQL 의 <code>HAVING</code> 역할이라고 보면 됩니다.' },
          { type: 'h', text: '함께 해 보기: 중복이 섞인 출연 목록을 MERGE 로 넣고 통계 내기' },
          { type: 'p', html: '새 데이터로 연습해 봅시다. 영화 8편의 정보와, 여러 자료를 합치다 보니 <b>중복 행이 섞인 출연 목록(25행)</b>이 있습니다. 이번에는 장르를 속성이 아니라 <code>(:Genre)</code> 노드로 만들어 <code>(m)-[:IN_GENRE]-&gt;(g)</code> 로 잇습니다 — 2차시 온톨로지에서 배운 것처럼 "장르" 를 하나의 개념(클래스)으로 다루는 것이지요. 목표는 ① 중복 없이 저장하고 ② 배우별 출연 편수 ③ 장르별 평균 평점을 Cypher 와 pandas 로 각각 구해 비교하는 것입니다.' },
          { type: 'table', head: ['영화', '개봉', '장르', '평점*', '출연 배우'], rows: [
            ['기생충', '2019', '드라마', '9.5', '송강호 · 이선균 · 조여정'],
            ['괴물', '2006', 'SF', '8.0', '송강호 · 배두나 · 박해일'],
            ['살인의 추억', '2003', '범죄', '9.0', '송강호 · 김상경 · 박해일'],
            ['올드보이', '2003', '스릴러', '8.5', '최민식 · 유지태'],
            ['쉬리', '1999', '액션', '7.5', '한석규 · 최민식 · 송강호'],
            ['택시운전사', '2017', '드라마', '9.0', '송강호 · 유해진'],
            ['신세계', '2013', '범죄', '8.5', '최민식 · 이정재 · 황정민'],
            ['추격자', '2008', '스릴러', '8.0', '김윤석 · 하정우']
          ], caption: '실습 데이터. * 평점은 수업용으로 정한 값이며 실제 평점과 다를 수 있습니다. 장르는 대표 장르 하나만 적었습니다.' },
          { type: 'code', title: 'Cypher 5-9. 영화 · 장르 넣기와 중복이 섞인 출연 목록 넣기 (Neo4j Browser 에서 실행)', run: false, code: `// ① 영화와 장르 — MERGE 라서 몇 번 실행해도 안전
UNWIND [
  ['기생충', 2019, '드라마', 9.5], ['괴물', 2006, 'SF', 8.0],
  ['살인의 추억', 2003, '범죄', 9.0], ['올드보이', 2003, '스릴러', 8.5],
  ['쉬리', 1999, '액션', 7.5], ['택시운전사', 2017, '드라마', 9.0],
  ['신세계', 2013, '범죄', 8.5], ['추격자', 2008, '스릴러', 8.0]
] AS row
MERGE (m:Movie {title: row[0]})
  ON CREATE SET m.released = row[1], m.score = row[3]
MERGE (g:Genre {name: row[2]})
MERGE (m)-[:IN_GENRE]->(g);

// ② 출연 목록 25행 (기생충-송강호 3번, 올드보이-최민식 2번, 괴물-박해일 2번 중복)
UNWIND [
  ['송강호','기생충'], ['이선균','기생충'], ['송강호','기생충'], ['조여정','기생충'],
  ['송강호','괴물'], ['배두나','괴물'], ['박해일','괴물'], ['박해일','괴물'],
  ['송강호','살인의 추억'], ['김상경','살인의 추억'], ['박해일','살인의 추억'],
  ['최민식','올드보이'], ['유지태','올드보이'], ['최민식','올드보이'],
  ['한석규','쉬리'], ['최민식','쉬리'], ['송강호','쉬리'],
  ['송강호','택시운전사'], ['유해진','택시운전사'], ['송강호','기생충'],
  ['최민식','신세계'], ['이정재','신세계'], ['황정민','신세계'],
  ['김윤석','추격자'], ['하정우','추격자']
] AS row
MERGE (p:Person {name: row[0]})
MERGE (m:Movie {title: row[1]})
MERGE (p)-[:ACTED_IN]->(m);`,
            desc: '<code>UNWIND [ … ] AS row</code> 는 리스트를 <b>한 줄씩 풀어서</b> 그 아래 문장을 줄마다 실행해 주는 명령입니다 (Python 의 <code>for row in [ … ]:</code> 와 같습니다 — 자세한 데이터 불러오기는 6차시에서 배웁니다). <code>row[0]</code> 은 리스트의 첫 번째 칸입니다. 두 문장을 세미콜론(;)으로 이어 한 번에 실행할 수 있습니다. 결과 메시지에서 관계가 <b>25개가 아니라 21개</b> 만들어진 것을 확인하세요.' },
          { type: 'code', title: 'Cypher 5-10. 배우별 출연 편수 · 장르별 평균 평점 (Neo4j Browser 에서 실행)', run: false, code: `// 배우별 출연 편수 (3편 이상만)
MATCH (p:Person)-[:ACTED_IN]->(m:Movie)
WITH p, count(m) AS 출연
WHERE 출연 >= 3
RETURN p.name AS 배우, 출연 ORDER BY 출연 DESC

// 장르별 영화 수 · 평균 평점
MATCH (m:Movie)-[:IN_GENRE]->(g:Genre)
RETURN g.name AS 장르, count(m) AS 영화수, round(avg(m.score), 2) AS 평균평점
ORDER BY 평균평점 DESC`,
            desc: '정답: 송강호 5 · 최민식 3. 장르는 드라마 2편 9.25 · 범죄 2편 8.75 · 스릴러 2편 8.25 · SF 1편 8.0 · 액션 1편 7.5. <code>round(값, 2)</code> 는 소수 둘째 자리까지 반올림합니다.' },
          { type: 'code', title: '예제 5-9. 같은 일을 Python 과 pandas 로', code: `import pandas as pd

movies = {  # 제목: (개봉, 장르, 평점)
    '기생충': (2019, '드라마', 9.5), '괴물': (2006, 'SF', 8.0),
    '살인의 추억': (2003, '범죄', 9.0), '올드보이': (2003, '스릴러', 8.5),
    '쉬리': (1999, '액션', 7.5), '택시운전사': (2017, '드라마', 9.0),
    '신세계': (2013, '범죄', 8.5), '추격자': (2008, '스릴러', 8.0),
}
raw = [('송강호', '기생충'), ('이선균', '기생충'), ('송강호', '기생충'), ('조여정', '기생충'),
       ('송강호', '괴물'), ('배두나', '괴물'), ('박해일', '괴물'), ('박해일', '괴물'),
       ('송강호', '살인의 추억'), ('김상경', '살인의 추억'), ('박해일', '살인의 추억'),
       ('최민식', '올드보이'), ('유지태', '올드보이'), ('최민식', '올드보이'),
       ('한석규', '쉬리'), ('최민식', '쉬리'), ('송강호', '쉬리'),
       ('송강호', '택시운전사'), ('유해진', '택시운전사'), ('송강호', '기생충'),
       ('최민식', '신세계'), ('이정재', '신세계'), ('황정민', '신세계'),
       ('김윤석', '추격자'), ('하정우', '추격자')]

# MERGE 흉내: 집합(set)은 같은 것을 여러 번 넣어도 하나만 남습니다
people, acted = set(), set()
for actor, title in raw:
    people.add(actor)              # MERGE (p:Person {name: actor})
    acted.add((actor, title))      # MERGE (p)-[:ACTED_IN]->(m)
print('원본 행 수:', len(raw), '/ MERGE 후 사람', len(people), '명, 관계', len(acted), '개')

# 배우별 출연 편수 — WITH p, count(m) AS 출연 WHERE 출연 >= 3
df = pd.DataFrame(sorted(acted), columns=['배우', '영화'])
cnt = df.groupby('배우').size().reset_index(name='출연')
cnt = cnt.sort_values(['출연', '배우'], ascending=[False, True])
print(cnt[cnt['출연'] >= 3].to_string(index=False))
print()

# 장르별 영화 수 · 평균 평점
m = pd.DataFrame([(t, g, s) for t, (y, g, s) in movies.items()], columns=['영화', '장르', '평점'])
genre = m.groupby('장르').agg(영화수=('영화', 'count'), 평균평점=('평점', 'mean'))
display(genre.round(2).sort_values('평균평점', ascending=False))`,
            expect: '원본 행 수: 25 / MERGE 후 사람 14 명, 관계 21 개\n 배우  출연\n송강호   5\n최민식   3\n\n     영화수  평균평점\n장르              \n드라마    2  9.25\n범죄     2  8.75\n스릴러    2  8.25\nSF     1  8.00\n액션     1  7.50',
            desc: '25행 중 중복 4행이 걸러져 관계 21개가 남았고, 출연 편수와 장르별 평균이 Cypher 5-10 의 답과 똑같습니다. 데이터베이스(Cypher)로 하든 표(pandas)로 하든 <b>"묶고 → 계산"</b> 의 원리는 같다는 것을 확인했습니다. 다음 교시에는 표로는 하기 어려운, 그래프만의 질문으로 넘어갑니다.' },
          { type: 'callout', kind: 'more', title: '중복을 아예 막는 방법: 유일성 제약조건', html: 'MERGE 를 잘 써도 누군가 CREATE 로 중복을 넣을 수는 있습니다. 데이터베이스 차원에서 막으려면 <code>CREATE CONSTRAINT person_name FOR (p:Person) REQUIRE p.name IS UNIQUE</code> 처럼 <b>유일성 제약조건</b>을 걸 수 있습니다. 그러면 같은 이름의 Person 을 CREATE 하려 할 때 오류가 나고, MERGE 의 찾기도 빨라집니다. 단, 실제로는 동명이인이 있을 수 있으니 이름보다 아이디 같은 속성에 거는 것이 좋습니다.' },
          { type: 'callout', kind: 'info', teacher: true, title: '오개념 지도 팁', html: '① "MERGE 는 업데이트 명령이다" 라는 오해가 많습니다 — MERGE 는 <b>찾기 또는 만들기</b>이고, 고치는 일은 SET 이 합니다. ② 관계 MERGE 함정(그림 5-3)은 실제로 Browser 에서 실행해 노드 수가 늘어나는 것을 보여 주면 오래 기억합니다. ③ <code>SET p = {…}</code> 로 속성이 날아가는 사례를 꼭 보여 주세요. ④ 집계에서 "왜 GROUP BY 가 없나요?" 라는 질문이 나오면 "RETURN 에 쓴 것 → 그룹 기준" 표를 다시 짚습니다. ⑤ 실습 시작 전에 <code>MATCH (n) DETACH DELETE n</code> 으로 비우게 해야 4차시 데이터와 섞이지 않습니다.' }
        ],
        slides: [
          { layout: 'title', title: 'Cypher 활용: 고치고 세고 따라가기', subtitle: '1교시 · MERGE · SET · DELETE 와 집계',
            notes: '<p>Neo4j Browser 를 띄워 두고, <code>CREATE (:Person {name:\'송강호\'})</code> 를 두 번 실행해 노드 2개가 생기는 것을 먼저 보여 줍니다. 💬 <b>발문:</b> "출석부에 같은 학생을 두 번 적으면 어떤 문제가 생길까요?" → 인원수가 틀리고, 기록이 흩어집니다. (5분)</p>' },
          { layout: 'diagram', title: 'MERGE = 있으면 찾고, 없으면 만들기', html: FIG_MERGE, caption: 'ON MATCH SET / ON CREATE SET 은 두 갈래 중 한쪽에서만 실행',
            notes: '<p>그림 5-1 로 CREATE 와 비교한 뒤, Cypher 5-2 를 세 번 실행해 visits 가 1 → 2 → 3 으로 늘어나는 것을 보여 줍니다. 이어서 그림 5-3 의 관계 MERGE 함정을 직접 실행해 노드 수가 늘어나는 것을 확인합니다. 💬 "MERGE 괄호에 born 까지 적으면?" → 이름과 생년이 모두 같은 노드를 찾으므로 중복이 생길 수 있음. (10분)</p>' },
          { layout: 'table', title: '고치기 · 지우기 한눈에', head: ['하고 싶은 일', 'Cypher'], rows: [
            ['속성 추가 · 수정', 'SET p.born = 1967'], ['여러 속성 더하기', 'SET p += {…}'], ['속성 지우기', 'REMOVE p.nick · SET p.nick = null'],
            ['레이블 추가 · 지우기', 'SET p:Actor · REMOVE p:Actor'], ['관계 없는 노드 지우기', 'DELETE p'], ['관계까지 지우기', 'DETACH DELETE p']
          ], lead: 'SET p = {…} 는 속성을 통째로 바꿔치기 — 주의!',
            notes: '<p>예제 5-4 · 5-5 를 실행해 딕셔너리와 비교합니다. 이선균을 DELETE 해서 오류 메시지를 함께 읽고, DETACH DELETE 로 지워 봅니다. 지우기 전에 RETURN 으로 먼저 확인하는 습관을 강조합니다. (8분)</p>' },
          { layout: 'code', title: '집계와 WITH 를 pandas 로', code: `import pandas as pd
acted = [('송강호', '기생충'), ('송강호', '기생충'), ('이선균', '기생충'),
         ('송강호', '괴물'), ('배두나', '괴물'), ('송강호', '쉬리'),
         ('최민식', '쉬리'), ('최민식', '올드보이'), ('송강호', '살인의 추억')]
df = pd.DataFrame(acted, columns=['배우', '영화'])
print('CREATE 처럼:', len(df), '행')
df = df.drop_duplicates()            # MERGE 처럼 중복 없이
print('MERGE 처럼 :', len(df), '행')

# RETURN p.name, count(m)  →  그룹 기준 = 배우
cnt = df.groupby('배우').size().sort_values(ascending=False)
print(cnt.to_string())

# WITH p, count(m) AS 출연 WHERE 출연 >= 3
print('3편 이상:', list(cnt[cnt >= 3].index))`,
            points: ['Cypher 에는 GROUP BY 가 없고, RETURN 의 집계 아닌 칸이 그룹 기준', 'WITH = 중간 RETURN → 집계 결과로 거를 수 있음', '집계 함수는 null 을 건너뜀 (count(*) 제외)'],
            notes: '<p>그림 5-5 · 5-6 을 보여 준 뒤 이 코드를 실행합니다. 💬 "RETURN 에 m.title 을 하나 더 적으면 행이 몇 개가 될까요?" → 배우-영화 짝마다 1행. Cypher 5-7 · 5-8 을 Browser 에서 실행해 같은 숫자를 확인합니다. (12분)</p>' },
          { layout: 'summary', title: '정리 · 함께 해 보기', bullets: ['CREATE = 무조건 새로, MERGE = 있으면 찾고 없으면 만들기', '관계는 노드를 먼저 MERGE 한 뒤 변수로 MERGE', 'SET · REMOVE 로 고치고, 관계가 있으면 DETACH DELETE', 'count · sum · avg · min · max · collect, 그룹 기준은 자동', '실습: 중복 25행 → MERGE → 관계 21개, 배우별 · 장르별 통계를 Cypher 와 pandas 로'],
            notes: '<p>DB 를 비우고 Cypher 5-9 를 실행해 관계 21개가 생기는 것을 확인한 뒤, 한 번 더 실행해 "no changes" 가 나오는 것도 보여 줍니다. Cypher 5-10 과 예제 5-9 의 답을 비교하며 마칩니다. 다음 교시 예고: 함께 출연한 배우, 친구의 친구, 최단 경로. (15분)</p>' }
        ]
      },
      /* ------------------------------------------------------------------ 2교시 */
      {
        id: 'ch05-2',
        title: '경로 탐색과 가변 길이 관계',
        minutes: 50,
        goals: ['여러 단계 패턴으로 "함께 출연한 배우" 를 찾는다', '가변 길이 관계로 친구의 친구를 찾는다', '경로 변수와 length · nodes · relationships 를 쓴다', 'shortestPath · allShortestPaths 로 최단 연결을 찾는다', 'Python BFS 로 최단 경로를 직접 구하고 그림으로 강조한다', 'OPTIONAL MATCH 로 관계가 없는 것도 결과에 남긴다'],
        flow: [['도입 · 여러 단계 패턴', 7], ['가변 길이 · 경로 변수', 10], ['최단 경로 · BFS', 15], ['OPTIONAL MATCH', 5], ['함께 해 보기: 배우 사이 최단 연결 그리기', 13]],
        content: [
          { type: 'p', html: '1교시의 집계는 사실 표(pandas)로도 똑같이 할 수 있었습니다. 이번 교시에는 <b>그래프 데이터베이스가 정말 잘하는 일</b>, 관계를 <b>여러 단계 따라가는</b> 질의를 배웁니다. "송강호와 함께 출연한 배우", "친구의 친구", "두 배우는 몇 다리 건너면 연결될까?" 같은 질문입니다.' },
          { type: 'h', text: '준비: 협업 그래프 넓히기' },
          { type: 'p', html: '1교시 실습 그래프(영화 8편 · 배우 14명)에 영화 3편을 더해 <b>배우 협업 그래프</b>를 만듭니다. 1교시에 배운 MERGE 를 쓰므로 이미 있는 배우(박해일 · 유해진 · 하정우 · 김윤석)는 새로 만들지 않고 찾아서 이어 줍니다.' },
          { type: 'code', title: 'Cypher 5-11. 영화 3편 더하기 (1교시 실습 그래프에 이어서 실행)', run: false, code: `UNWIND [
  ['박해일', '헤어질 결심'], ['탕웨이', '헤어질 결심'],
  ['김윤석', '1987'], ['하정우', '1987'], ['유해진', '1987'], ['김태리', '1987'],
  ['김민희', '아가씨'], ['김태리', '아가씨'], ['하정우', '아가씨']
] AS row
MERGE (p:Person {name: row[0]})
MERGE (m:Movie {title: row[1]})
MERGE (p)-[:ACTED_IN]->(m)`,
            desc: '이제 영화 11편 · 배우 17명 · 출연 관계 30개입니다. 새로 생긴 배우는 탕웨이 · 김태리 · 김민희 3명뿐입니다.' },
          { type: 'h', text: '여러 단계 패턴: 함께 출연한 배우' },
          { type: 'p', html: '"송강호와 <b>같은 영화에</b> 출연한 배우" 는 그림으로 그리면 배우 → 영화 ← 배우 모양입니다. 화살표 두 개가 가운데 영화 노드로 <b>모이는</b> 패턴이지요. 4차시에 배운 패턴을 그대로 이어 쓰기만 하면 됩니다.' },
          { type: 'figure', html: FIG_COSTAR, caption: '그림 5-7. 두 배우의 화살표가 같은 영화로 모이면 "함께 출연" 입니다.' },
          { type: 'code', title: 'Cypher 5-12. 송강호와 함께 출연한 배우 (Neo4j Browser 에서 실행)', run: false, code: `MATCH (a:Person {name: '송강호'})-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(b:Person)
RETURN b.name AS 동료, count(m) AS 함께, collect(m.title) AS 영화
ORDER BY 함께 DESC, 동료

// 함께 출연한 모든 배우 짝 (같은 짝이 두 번 나오지 않게)
MATCH (a:Person)-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(b:Person)
WHERE a.name < b.name
RETURN a.name, b.name, collect(m.title) AS 함께한영화`,
            desc: '첫 문장의 결과는 박해일 2편(괴물 · 살인의 추억)이 맨 위이고, 나머지 7명(김상경 · 배두나 · 유해진 · 이선균 · 조여정 · 최민식 · 한석규)은 1편입니다. 송강호 자신은 나오지 않습니다 — Cypher 는 한 패턴 안에서 <b>같은 관계를 두 번 쓰지 않기</b> 때문에 a 와 b 가 같은 관계를 공유할 수 없습니다. 두 번째 문장의 <code>a.name &lt; b.name</code> 은 (송강호, 이선균) 과 (이선균, 송강호) 가 둘 다 나오는 것을 막는 요령입니다.' },
          { type: 'code', title: '예제 5-10. 함께 출연한 배우를 Python 으로', code: `import pandas as pd

cast = {
    '기생충': ['송강호', '이선균', '조여정'], '괴물': ['송강호', '배두나', '박해일'],
    '살인의 추억': ['송강호', '김상경', '박해일'], '올드보이': ['최민식', '유지태'],
    '쉬리': ['한석규', '최민식', '송강호'], '택시운전사': ['송강호', '유해진'],
    '신세계': ['최민식', '이정재', '황정민'], '추격자': ['김윤석', '하정우'],
    '헤어질 결심': ['박해일', '탕웨이'], '1987': ['김윤석', '하정우', '유해진', '김태리'],
    '아가씨': ['김민희', '김태리', '하정우'],
}
acted = [(actor, movie) for movie, actors in cast.items() for actor in actors]
print('출연 관계 수:', len(acted))

# (a {name:'송강호'})-[:ACTED_IN]->(m)<-[:ACTED_IN]-(b)
rows = []
for a, m in acted:                    # 1단계: 송강호 → 영화
    if a != '송강호':
        continue
    for b, m2 in acted:               # 2단계: 같은 영화 ← 다른 배우
        if m2 == m and b != a:
            rows.append({'동료': b, '영화': m})

df = pd.DataFrame(rows)
result = df.groupby('동료').agg(함께=('영화', 'count'), 영화=('영화', list)).reset_index()
print(result.sort_values(['함께', '동료'], ascending=[False, True]).to_string(index=False))`,
            expect: '출연 관계 수: 30\n 동료  함께           영화\n박해일   2 [괴물, 살인의 추억]\n김상경   1     [살인의 추억]\n배두나   1         [괴물]\n유해진   1      [택시운전사]\n이선균   1        [기생충]\n조여정   1        [기생충]\n최민식   1         [쉬리]\n한석규   1         [쉬리]',
            desc: '반복문 두 겹이 패턴의 두 화살표에 하나씩 대응합니다. <code>b != a</code> 조건이 "송강호 자신은 빼기" 입니다. 단계가 늘어날수록 반복문이 한 겹씩 깊어지는데, 그래프 DB 는 노드마다 연결된 관계를 바로 따라가므로 이런 질의가 빠릅니다.' },
          { type: 'h', text: '가변 길이 관계: 친구의 친구' },
          { type: 'p', html: '단계가 2개, 3개, … 로 늘어날 때마다 패턴을 길게 쓰기는 번거롭습니다. Cypher 는 관계 타입 뒤에 <code>*</code> 를 붙여 <b>"이 관계를 몇 번 이어서"</b> 를 짧게 쓸 수 있습니다. 이것을 <b>가변 길이 관계</b>라고 합니다. SNS 친구 관계로 연습해 봅시다.' },
          { type: 'code', title: 'Cypher 5-13. SNS 친구 그래프 만들기 (Neo4j Browser 에서 실행)', run: false, code: `CREATE (minsu:User {name: '민수'}), (jiyoung:User {name: '지영'}),
       (junho:User {name: '준호'}),  (hyunwoo:User {name: '현우'}),
       (seoyeon:User {name: '서연'}), (daeun:User {name: '다은'}),
       (minsu)-[:KNOWS]->(jiyoung),  (minsu)-[:KNOWS]->(junho),
       (jiyoung)-[:KNOWS]->(hyunwoo), (junho)-[:KNOWS]->(hyunwoo),
       (hyunwoo)-[:KNOWS]->(seoyeon), (seoyeon)-[:KNOWS]->(daeun)`,
            desc: '배우와 섞이지 않도록 레이블을 <code>User</code> 로 했습니다. 아는 사이는 서로 아는 것이지만 Neo4j 의 관계에는 항상 방향이 있으므로 한 방향으로만 저장하고, 찾을 때 방향을 빼고(<code>-[:KNOWS]-</code>) 찾습니다.' },
          { type: 'figure', html: FIG_HOPS, caption: '그림 5-8. 민수에서 출발하면 지영 · 준호는 1단계, 현우는 2단계(친구의 친구), 서연은 3단계, 다은은 4단계입니다.' },
          { type: 'table', head: ['쓰는 법', '뜻', '민수에서 출발하면'], rows: [
            ['<code>-[:KNOWS]-</code>', '정확히 1단계 (지금까지 쓴 것)', '지영 · 준호'],
            ['<code>-[:KNOWS*2]-</code>', '정확히 2단계', '현우 (두 길로 2번)'],
            ['<code>-[:KNOWS*1..3]-</code>', '1단계 이상 3단계 이하', '지영 · 준호 · 현우 · 서연'],
            ['<code>-[:KNOWS*..3]-</code>', '3단계 이하 (최소 1)', '위와 같음'],
            ['<code>-[:KNOWS*]-</code>', '몇 단계든 (상한 없음 — 주의!)', '지영 · 준호 · 현우 · 서연 · 다은']
          ], caption: '가변 길이 관계 쓰는 법. 별표 뒤의 숫자가 "몇 번 건너뛸지" 입니다.' },
          { type: 'code', title: 'Cypher 5-14. 친구의 친구 찾기 (Neo4j Browser 에서 실행)', run: false, code: `// 1~3단계 안의 모든 사람
MATCH (me:User {name: '민수'})-[:KNOWS*1..3]-(other:User)
RETURN other.name, count(*) AS 경로수

// 친구의 친구 — 이미 친구인 사람과 나 자신은 빼고
MATCH (me:User {name: '민수'})-[:KNOWS*2]-(fof:User)
WHERE fof <> me AND NOT (me)-[:KNOWS]-(fof)
RETURN DISTINCT fof.name AS 추천친구`,
            desc: '첫 문장에서 지영 · 준호는 경로가 2개씩(1단계 길 + 3단계로 돌아오는 길), 현우 2개, 서연 2개입니다. 같은 사람에게 가는 길이 여러 개면 <b>길마다 한 행</b>이 나오므로 DISTINCT 나 집계가 필요합니다. 두 번째 문장의 결과는 <b>현우</b>입니다. <code>NOT (me)-[:KNOWS]-(fof)</code> 처럼 WHERE 안에 패턴을 쓰면 "그런 관계가 없다" 는 조건이 됩니다 — SNS 의 "알 수도 있는 사람" 추천이 바로 이 원리입니다.' },
          { type: 'code', title: '예제 5-11. 가변 길이 관계를 Python 으로: 경로 모두 나열하기', code: `knows = [('민수', '지영'), ('민수', '준호'), ('지영', '현우'),
         ('준호', '현우'), ('현우', '서연'), ('서연', '다은')]

def paths_from(start, min_len, max_len):
    """start 에서 출발해 관계를 min_len~max_len 번 건너는 모든 경로 (같은 관계는 한 번만)"""
    result = []
    def walk(path, used):
        if len(path) - 1 >= min_len:
            result.append(path)
        if len(path) - 1 == max_len:
            return
        here = path[-1]
        for i, (a, b) in enumerate(knows):
            if i in used:
                continue
            if here == a:          # 방향 무시: a→b 도, b→a 도 따라감
                walk(path + [b], used | {i})
            elif here == b:
                walk(path + [a], used | {i})
    walk([start], set())
    return result

print('MATCH (me {name:"민수"})-[:KNOWS*1..3]-(other)')
paths = paths_from('민수', 1, 3)
for p in paths:
    print(f'  길이 {len(p) - 1}:', ' - '.join(p))
print('경로 수:', len(paths))

ends = {}
for p in paths:
    ends[p[-1]] = min(ends.get(p[-1], 99), len(p) - 1)
print('만나는 사람과 가장 짧은 단계:', ends)

friends = {p[-1] for p in paths_from('민수', 1, 1)}
fof = {p[-1] for p in paths_from('민수', 2, 2)} - friends - {'민수'}
print('친구:', sorted(friends), '/ 친구의 친구:', sorted(fof))`,
            expect: 'MATCH (me {name:"민수"})-[:KNOWS*1..3]-(other)\n  길이 1: 민수 - 지영\n  길이 2: 민수 - 지영 - 현우\n  길이 3: 민수 - 지영 - 현우 - 준호\n  길이 3: 민수 - 지영 - 현우 - 서연\n  길이 1: 민수 - 준호\n  길이 2: 민수 - 준호 - 현우\n  길이 3: 민수 - 준호 - 현우 - 지영\n  길이 3: 민수 - 준호 - 현우 - 서연\n경로 수: 8\n만나는 사람과 가장 짧은 단계: {\'지영\': 1, \'현우\': 2, \'준호\': 1, \'서연\': 3}\n친구: [\'준호\', \'지영\'] / 친구의 친구: [\'현우\']',
            desc: '<code>walk</code> 는 자기 자신을 다시 부르는 <b>재귀 함수</b>로, 갈 수 있는 길을 끝까지 하나씩 가 봅니다. 결과를 보면 준호에게 가는 길이 "민수-준호"(1단계)와 "민수-지영-현우-준호"(3단계) 두 개입니다. Cypher 의 <code>*1..3</code> 도 이렇게 <b>모든 경로</b>를 찾기 때문에 행이 8개 나옵니다.' },
          { type: 'callout', kind: 'warn', title: '상한 없는 * 는 조심하세요', html: '<code>-[:KNOWS*]-</code> 처럼 상한을 빼면 Neo4j 는 가능한 모든 길이의 경로를 찾으려 합니다. 친구가 100명씩만 있어도 3단계면 100만, 5단계면 100억 개의 경로가 됩니다. 실제 데이터에서는 <b>항상 <code>*1..3</code> 처럼 상한을 적는 습관</b>을 들이세요. 최단 연결만 궁금하다면 아래의 shortestPath 를 씁니다.' },
          { type: 'h', text: '경로 변수: p = (…)' },
          { type: 'p', html: '패턴 앞에 <code>p =</code> 를 붙이면 찾은 <b>경로 전체</b>를 변수 하나에 담을 수 있습니다. 경로는 "노드 - 관계 - 노드 - 관계 - 노드 …" 가 번갈아 이어진 것이고, 세 함수로 부분을 꺼냅니다.' },
          { type: 'figure', html: FIG_PATH, caption: '그림 5-9. 경로의 길이는 노드 수가 아니라 관계(화살표) 수입니다.' },
          { type: 'code', title: 'Cypher 5-15. 경로를 변수에 담기 (Neo4j Browser 에서 실행)', run: false, code: `MATCH p = (:User {name: '민수'})-[:KNOWS*1..3]-(:User {name: '서연'})
RETURN length(p) AS 길이,
       [n IN nodes(p) | n.name] AS 거쳐간사람,
       size(relationships(p)) AS 관계수
ORDER BY 길이`,
            desc: '결과는 두 행: <code>3, ["민수", "지영", "현우", "서연"], 3</code> 과 <code>3, ["민수", "준호", "현우", "서연"], 3</code>. <code>[n IN nodes(p) | n.name]</code> 은 Python 의 리스트 컴프리헨션 <code>[n.name for n in nodes(p)]</code> 과 같은 뜻입니다. Graph 보기에서 <code>RETURN p</code> 하면 경로가 그림으로 그려집니다.' },
          { type: 'code', title: '예제 5-12. 경로 = 노드와 관계가 번갈아 놓인 리스트', code: `# p = (민수)-[:KNOWS]->(지영)-[:KNOWS]->(현우)-[:KNOWS]->(서연)
p = ['민수', 'KNOWS', '지영', 'KNOWS', '현우', 'KNOWS', '서연']

nodes = p[0::2]            # 짝수 칸: 노드
relationships = p[1::2]    # 홀수 칸: 관계
print('nodes(p)        :', nodes)
print('relationships(p):', relationships)
print('length(p)       :', len(relationships))
print('노드 수 - 1     :', len(nodes) - 1)
print('시작 · 끝       :', nodes[0], '→', nodes[-1])`,
            expect: "nodes(p)        : ['민수', '지영', '현우', '서연']\nrelationships(p): ['KNOWS', 'KNOWS', 'KNOWS']\nlength(p)       : 3\n노드 수 - 1     : 3\n시작 · 끝       : 민수 → 서연",
            desc: '<code>p[0::2]</code> 는 "0번째부터 2칸씩 건너뛰며" 고르는 슬라이싱입니다. 경로 길이가 언제나 <b>노드 수 − 1</b> 인 이유가 한눈에 보입니다.' },
          { type: 'h', text: '최단 경로: 케빈 베이컨의 6단계' },
          { type: 'p', html: '"세상 사람은 여섯 다리만 건너면 모두 연결된다" 는 말을 들어 보셨나요? 할리우드에서는 이것을 놀이로 만들어 <b>배우 케빈 베이컨까지 몇 단계</b> 만에 닿는지를 "베이컨 수" 라고 부릅니다. 함께 출연했으면 1단계, 함께 출연한 사람의 동료면 2단계입니다. 우리 협업 그래프에서는 <b>탕웨이와 김민희</b>가 몇 단계 만에 이어지는지 찾아봅시다.' },
          { type: 'p', html: '<code>shortestPath( 패턴 )</code> 은 두 노드 사이의 경로 중 <b>가장 짧은 것 하나</b>를, <code>allShortestPaths( 패턴 )</code> 은 가장 짧은 길이의 경로를 <b>모두</b> 돌려줍니다. 가변 길이 관계와 함께 씁니다.' },
          { type: 'code', title: 'Cypher 5-16. 탕웨이와 김민희 사이의 최단 연결 (Neo4j Browser 에서 실행)', run: false, code: `// 가장 짧은 경로 하나
MATCH p = shortestPath(
  (a:Person {name: '탕웨이'})-[:ACTED_IN*]-(b:Person {name: '김민희'}))
RETURN length(p) AS 길이,
       [n IN nodes(p) | coalesce(n.name, n.title)] AS 경로

// 가장 짧은 경로 모두
MATCH p = allShortestPaths(
  (a:Person {name: '탕웨이'})-[:ACTED_IN*]-(b:Person {name: '김민희'}))
RETURN [n IN nodes(p) | coalesce(n.name, n.title)] AS 경로`,
            desc: '길이는 <b>10</b>입니다. 경로가 배우 → 영화 → 배우 → 영화 … 로 번갈아 가므로, 배우끼리의 단계(베이컨 수)는 10 ÷ 2 = <b>5</b> 입니다. 영화 노드에는 name 이 없고 title 이 있으므로 <code>coalesce(n.name, n.title)</code> 로 "name 이 없으면 title" 을 꺼냈습니다. allShortestPaths 는 길이 10 인 경로 <b>4개</b>를 돌려줍니다 (박해일-송강호 사이가 괴물 · 살인의 추억 2가지, 유해진-김민희 사이가 김태리 · 하정우 2가지 → 2 × 2).' },
          { type: 'p', html: '데이터베이스는 이 최단 경로를 어떻게 찾을까요? 기본 원리는 <b>너비 우선 탐색(BFS, Breadth-First Search)</b>입니다. 출발점에서 <b>1단계 떨어진 사람을 모두</b> 방문하고, 그다음 <b>2단계를 모두</b>, 그다음 3단계… 처럼 연못에 돌을 던졌을 때 물결이 퍼지듯 한 겹씩 넓혀 갑니다. 이렇게 하면 목표에 <b>처음 닿는 순간</b>의 단계가 곧 최단 거리입니다.' },
          { type: 'figure', html: FIG_BFS, caption: '그림 5-10. 탕웨이에서 시작한 BFS. 같은 단계의 사람을 모두 본 뒤에야 다음 단계로 넘어갑니다. 강조된 칸이 찾은 최단 경로입니다.' },
          { type: 'list', ordered: true, items: [
            '출발점을 <b>대기줄(큐)</b>에 넣고, "누구를 통해 왔는지" 를 적는 <b>부모 표</b>에 출발점을 적습니다.',
            '대기줄 맨 앞 사람을 꺼냅니다. 목표라면 멈춥니다.',
            '그 사람의 이웃 중 <b>아직 부모 표에 없는 사람</b>을 대기줄 맨 뒤에 넣고, 부모 표에 "이 사람을 통해 왔음" 이라고 적습니다.',
            '대기줄이 빌 때까지 2~3 을 반복합니다.',
            '목표에서 부모 표를 거꾸로 따라가면 최단 경로가 나옵니다.'
          ] },
          { type: 'code', title: '예제 5-13. BFS 로 최단 경로 찾기 (배우끼리의 협업 그래프)', code: `from collections import deque

cast = {
    '기생충': ['송강호', '이선균', '조여정'], '괴물': ['송강호', '배두나', '박해일'],
    '살인의 추억': ['송강호', '김상경', '박해일'], '올드보이': ['최민식', '유지태'],
    '쉬리': ['한석규', '최민식', '송강호'], '택시운전사': ['송강호', '유해진'],
    '신세계': ['최민식', '이정재', '황정민'], '추격자': ['김윤석', '하정우'],
    '헤어질 결심': ['박해일', '탕웨이'], '1987': ['김윤석', '하정우', '유해진', '김태리'],
    '아가씨': ['김민희', '김태리', '하정우'],
}
# 함께 출연했으면 이웃 (배우 - 배우 그래프)
graph = {}
for actors in cast.values():
    for a in actors:
        for b in actors:
            if a != b:
                graph.setdefault(a, set()).add(b)

def bfs(start, goal):
    parent = {start: None}            # 부모 표: 누구를 통해 왔나
    level = {start: 0}                # 몇 단계 만에 왔나
    queue = deque([start])            # 대기줄
    while queue:
        here = queue.popleft()
        if here == goal:
            break
        for nxt in sorted(graph[here]):
            if nxt not in parent:
                parent[nxt] = here
                level[nxt] = level[here] + 1
                queue.append(nxt)
    path, node = [], goal
    while node is not None:           # 목표에서 거꾸로 따라가기
        path.append(node)
        node = parent[node]
    return path[::-1], level

path, level = bfs('탕웨이', '김민희')
for d in range(max(level.values()) + 1):
    print(f'{d}단계:', sorted(n for n in level if level[n] == d))
print('최단 경로:', ' → '.join(path))
print('탕웨이 → 김민희 단계 수:', len(path) - 1)`,
            expect: "0단계: ['탕웨이']\n1단계: ['박해일']\n2단계: ['김상경', '배두나', '송강호']\n3단계: ['유해진', '이선균', '조여정', '최민식', '한석규']\n4단계: ['김윤석', '김태리', '유지태', '이정재', '하정우', '황정민']\n5단계: ['김민희']\n최단 경로: 탕웨이 → 박해일 → 송강호 → 유해진 → 김태리 → 김민희\n탕웨이 → 김민희 단계 수: 5",
            desc: '단계별 목록이 그림 5-10 과 똑같습니다. 5단계 = Cypher 의 길이 10 ÷ 2 입니다. <code>deque</code> 는 앞에서 꺼내고(<code>popleft</code>) 뒤에 넣기(<code>append</code>)가 빠른 대기줄 자료형입니다. 이웃을 <code>sorted</code> 로 정렬해 방문해서 실행할 때마다 같은 경로가 나옵니다 — 하정우를 거치는 경로도 똑같이 짧지만, 가나다순으로 김태리가 먼저 방문되었습니다.' },
          { type: 'p', html: '이번에는 Neo4j 와 똑같이 <b>영화 노드까지 포함한</b> 그래프에서, 가장 짧은 경로를 <b>모두</b> 찾아봅시다 (allShortestPaths). 부모를 하나만 적지 않고, 같은 단계에서 온 부모를 <b>모두</b> 적어 두면 됩니다.' },
          { type: 'code', title: '예제 5-14. allShortestPaths 흉내: 가장 짧은 경로 모두 찾기', code: `from collections import deque

cast = {
    '기생충': ['송강호', '이선균', '조여정'], '괴물': ['송강호', '배두나', '박해일'],
    '살인의 추억': ['송강호', '김상경', '박해일'], '올드보이': ['최민식', '유지태'],
    '쉬리': ['한석규', '최민식', '송강호'], '택시운전사': ['송강호', '유해진'],
    '신세계': ['최민식', '이정재', '황정민'], '추격자': ['김윤석', '하정우'],
    '헤어질 결심': ['박해일', '탕웨이'], '1987': ['김윤석', '하정우', '유해진', '김태리'],
    '아가씨': ['김민희', '김태리', '하정우'],
}
# 배우 - 영화 그래프: Neo4j 의 (Person)-[:ACTED_IN]-(Movie) 와 같은 모양
graph = {}
for movie, actors in cast.items():
    m = '《' + movie + '》'
    for a in actors:
        graph.setdefault(a, []).append(m)
        graph.setdefault(m, []).append(a)

def all_shortest(start, goal):
    dist, parents = {start: 0}, {start: []}
    queue = deque([start])
    while queue:
        here = queue.popleft()
        for nxt in graph[here]:
            if nxt not in dist:                     # 처음 만남
                dist[nxt] = dist[here] + 1
                parents[nxt] = [here]
                queue.append(nxt)
            elif dist[nxt] == dist[here] + 1:       # 같은 거리로 또 만남
                parents[nxt].append(here)
    def back(node):                                 # 부모를 따라 모든 경로 만들기
        if node == start:
            return [[start]]
        return [path + [node] for par in parents[node] for path in back(par)]
    return dist[goal], back(goal)

length, paths = all_shortest('탕웨이', '김민희')
print('최단 길이 length(p):', length, '/ 배우 단계:', length // 2)
print('경로 수:', len(paths))
for p in sorted(paths):
    print(' -', ' - '.join(p))`,
            expect: '최단 길이 length(p): 10 / 배우 단계: 5\n경로 수: 4\n - 탕웨이 - 《헤어질 결심》 - 박해일 - 《괴물》 - 송강호 - 《택시운전사》 - 유해진 - 《1987》 - 김태리 - 《아가씨》 - 김민희\n - 탕웨이 - 《헤어질 결심》 - 박해일 - 《괴물》 - 송강호 - 《택시운전사》 - 유해진 - 《1987》 - 하정우 - 《아가씨》 - 김민희\n - 탕웨이 - 《헤어질 결심》 - 박해일 - 《살인의 추억》 - 송강호 - 《택시운전사》 - 유해진 - 《1987》 - 김태리 - 《아가씨》 - 김민희\n - 탕웨이 - 《헤어질 결심》 - 박해일 - 《살인의 추억》 - 송강호 - 《택시운전사》 - 유해진 - 《1987》 - 하정우 - 《아가씨》 - 김민희',
            desc: 'Cypher 5-16 의 allShortestPaths 결과와 같은 <b>길이 10 · 경로 4개</b>입니다. 영화 노드까지 세므로 길이가 배우 단계의 두 배가 됩니다.' },
          { type: 'callout', kind: 'more', title: 'Neo4j 5 의 새 문법: SHORTEST', html: '최신 Neo4j(5.21 이후)에서는 같은 질의를 <code>MATCH p = SHORTEST 1 (a:Person {name:\'탕웨이\'})-[:ACTED_IN]-+(b:Person {name:\'김민희\'})</code> 처럼 쓸 수도 있습니다. <code>-+</code> 는 "1번 이상 반복", <code>ALL SHORTEST</code> 는 allShortestPaths 와 같은 뜻입니다. 이 강좌에서는 오래된 버전에서도 동작하는 <code>shortestPath</code> 를 씁니다.' },
          { type: 'h', text: 'OPTIONAL MATCH: 관계가 없어도 결과에 남기기' },
          { type: 'p', html: '<code>MATCH</code> 는 패턴이 맞지 않으면 그 행을 <b>통째로 버립니다</b>. 그래서 "사람마다 연출한 영화 수" 를 물으면 연출작이 없는 사람은 결과에서 아예 사라집니다. "없으면 0 이라고라도 보여 줘" 가 필요할 때 <code>OPTIONAL MATCH</code> 를 씁니다. 못 찾은 부분은 <code>null</code> 로 채우고 행은 남깁니다 (SQL 의 LEFT JOIN 과 같습니다).' },
          { type: 'code', title: 'Cypher 5-17. 연출작이 없는 사람도 남기기 (Neo4j Browser 에서 실행)', run: false, code: `// 감독 두 명과 연출 관계 추가
UNWIND [['봉준호', '기생충'], ['봉준호', '괴물'], ['봉준호', '살인의 추억'],
        ['박찬욱', '올드보이'], ['박찬욱', '아가씨'], ['박찬욱', '헤어질 결심']] AS row
MERGE (d:Person {name: row[0]})
MERGE (m:Movie {title: row[1]})
MERGE (d)-[:DIRECTED]->(m);

// MATCH 만 쓰면: 봉준호 · 박찬욱 2행
MATCH (p:Person) WHERE p.name IN ['봉준호', '박찬욱', '송강호', '이선균']
MATCH (p)-[:DIRECTED]->(m:Movie)
RETURN p.name, count(m) AS 연출;

// OPTIONAL MATCH: 4행 (송강호 · 이선균은 0)
MATCH (p:Person) WHERE p.name IN ['봉준호', '박찬욱', '송강호', '이선균']
OPTIONAL MATCH (p)-[:DIRECTED]->(m:Movie)
RETURN p.name, count(m) AS 연출, collect(m.title) AS 연출작;`,
            desc: '송강호 · 이선균의 행에서는 m 이 <code>null</code> 이므로 <code>count(m)</code> 은 0, <code>collect(m.title)</code> 은 빈 리스트 <code>[]</code> 가 됩니다. 집계 함수가 null 을 건너뛰는 규칙(1교시)이 여기서 쓸모가 있습니다.' },
          { type: 'figure', html: FIG_OPT, caption: '그림 5-11. MATCH 는 맞지 않는 행을 버리고, OPTIONAL MATCH 는 null 을 채워 남깁니다.' },
          { type: 'code', title: '예제 5-15. OPTIONAL MATCH = pandas 의 왼쪽 합치기(left merge)', code: `import pandas as pd

people = pd.DataFrame({'name': ['봉준호', '박찬욱', '송강호', '이선균']})
directed = pd.DataFrame([('봉준호', '기생충'), ('봉준호', '괴물'), ('봉준호', '살인의 추억'),
                         ('박찬욱', '올드보이'), ('박찬욱', '아가씨'), ('박찬욱', '헤어질 결심')],
                        columns=['name', 'title'])

# MATCH: 양쪽에 다 있는 것만 (inner)
inner = people.merge(directed, on='name', how='inner')
print('MATCH 행 수         :', len(inner))
print(inner.groupby('name', sort=False)['title'].count().to_string())
print()

# OPTIONAL MATCH: 왼쪽(사람)은 모두 남기고, 없으면 NaN (left)
left = people.merge(directed, on='name', how='left')
print('OPTIONAL MATCH 행 수:', len(left))
print(left.groupby('name', sort=False)['title'].count().to_string())`,
            expect: 'MATCH 행 수         : 6\nname\n봉준호    3\n박찬욱    3\n\nOPTIONAL MATCH 행 수: 8\nname\n봉준호    3\n박찬욱    3\n송강호    0\n이선균    0',
            desc: 'left 합치기에서 송강호 · 이선균은 title 이 NaN 인 행으로 남고, <code>count()</code> 는 NaN 을 세지 않아 0 이 됩니다. Cypher 의 OPTIONAL MATCH + count 와 결과가 같습니다.' },
          { type: 'h', text: '함께 해 보기: 두 배우 사이의 최단 연결을 그림으로' },
          { type: 'p', html: '마지막으로 Cypher 의 shortestPath 와 Python BFS 의 답을 비교하고, 협업 그래프 전체를 그린 뒤 <b>최단 경로만 빨간 선</b>으로 강조해 봅시다. 아래 코드의 <code>START</code> · <code>GOAL</code> 을 바꿔 여러 배우 쌍을 시험해 보세요 (예: 조여정 → 황정민, 배두나 → 김윤석).' },
          { type: 'code', title: '예제 5-16. 협업 그래프에서 최단 경로를 빨간 선으로 표시하기', code: `import math
from collections import deque
import matplotlib.pyplot as plt
plt.rcParams['font.family'] = 'Malgun Gothic'

START, GOAL = '탕웨이', '김민희'      # ← 바꿔 보세요

cast = {
    '기생충': ['송강호', '이선균', '조여정'], '괴물': ['송강호', '배두나', '박해일'],
    '살인의 추억': ['송강호', '김상경', '박해일'], '올드보이': ['최민식', '유지태'],
    '쉬리': ['한석규', '최민식', '송강호'], '택시운전사': ['송강호', '유해진'],
    '신세계': ['최민식', '이정재', '황정민'], '추격자': ['김윤석', '하정우'],
    '헤어질 결심': ['박해일', '탕웨이'], '1987': ['김윤석', '하정우', '유해진', '김태리'],
    '아가씨': ['김민희', '김태리', '하정우'],
}
graph, movie_of = {}, {}
for movie, actors in cast.items():
    for a in actors:
        for b in actors:
            if a != b:
                graph.setdefault(a, set()).add(b)
                movie_of.setdefault(frozenset((a, b)), movie)

def bfs(start, goal):
    parent, queue = {start: None}, deque([start])
    while queue:
        here = queue.popleft()
        if here == goal:
            break
        for nxt in sorted(graph[here]):
            if nxt not in parent:
                parent[nxt] = here
                queue.append(nxt)
    path, node = [], goal
    while node is not None:
        path.append(node)
        node = parent[node]
    return path[::-1]

path = bfs(START, GOAL)
print('최단 경로:', ' → '.join(path), f'({len(path) - 1}단계)')
for a, b in zip(path, path[1:]):
    print(f'  {a} - {b} : 《{movie_of[frozenset((a, b))]}》 함께 출연')

# 원 둘레에 배우를 놓고 그리기
order = ['탕웨이', '박해일', '배두나', '김상경', '송강호', '이선균', '조여정', '한석규', '최민식',
         '유지태', '이정재', '황정민', '유해진', '김윤석', '하정우', '김태리', '김민희']
pos = {n: (math.cos(2 * math.pi * i / len(order)), math.sin(2 * math.pi * i / len(order)))
       for i, n in enumerate(order)}
on_path = set(zip(path, path[1:])) | set(zip(path[1:], path))

fig, ax = plt.subplots(figsize=(7, 7))
for a in graph:
    for b in graph[a]:
        if a < b:
            red = (a, b) in on_path
            ax.plot([pos[a][0], pos[b][0]], [pos[a][1], pos[b][1]],
                    color='red' if red else 'lightgray', lw=4 if red else 1, zorder=2 if red else 1)
for n, (x, y) in pos.items():
    ax.scatter(x, y, s=900, color='tomato' if n in path else 'steelblue', zorder=3)
    ax.text(x, y, n, ha='center', va='center', color='white', fontsize=9, fontweight='bold', zorder=4)
ax.set_title(f'{START} → {GOAL} 최단 경로 ({len(path) - 1}단계)')
ax.axis('equal')
ax.axis('off')
plt.show()`,
            expect: '최단 경로: 탕웨이 → 박해일 → 송강호 → 유해진 → 김태리 → 김민희 (5단계)\n  탕웨이 - 박해일 : 《헤어질 결심》 함께 출연\n  박해일 - 송강호 : 《괴물》 함께 출연\n  송강호 - 유해진 : 《택시운전사》 함께 출연\n  유해진 - 김태리 : 《1987》 함께 출연\n  김태리 - 김민희 : 《아가씨》 함께 출연',
            desc: '배우 17명이 원 둘레에 놓이고, 최단 경로의 선 5개만 빨갛게 그려집니다. <code>movie_of</code> 는 두 배우가 함께 나온 영화를 기억해 두는 딕셔너리로, Cypher 결과의 <code>nodes(p)</code> 에서 영화 노드를 읽는 것과 같은 정보입니다. Cypher 5-16 의 shortestPath 는 4개 경로 중 아무거나 하나를 돌려주므로, 가운데 영화(괴물/살인의 추억)나 배우(김태리/하정우)가 Python 결과와 다를 수 있지만 <b>길이는 언제나 같습니다</b>.' },
          { type: 'callout', kind: 'tip', title: '표 DB 와 그래프 DB 의 차이가 느껴지나요?', html: '관계형 DB(SQL)로 5단계 연결을 찾으려면 출연 표를 자기 자신과 10번 가까이 JOIN 해야 하고, 단계 수를 미리 정해야 합니다. 그래프 DB 는 노드마다 붙은 관계를 바로 따라가므로 <code>shortestPath((a)-[*]-(b))</code> 한 줄이면 됩니다. "몇 단계 건너 연결되는가" 는 추천 · 사기 탐지 · 지식그래프 추론에서 아주 자주 쓰이는 질문입니다.' },
          { type: 'callout', kind: 'info', teacher: true, title: '오개념 지도 팁 · 확장 활동', html: '① length(p) 를 노드 수로 착각하는 경우가 많습니다 — 그림 5-9 로 "화살표 개수" 임을 강조하세요. ② shortestPath 결과가 학생마다 다를 수 있음(같은 길이의 경로가 여러 개)을 미리 알려 주면 혼란이 줄어듭니다. ③ BFS 는 종이 위에서 대기줄(큐)을 직접 써 가며 2~3단계만 따라가 보게 하면 이해가 빠릅니다. ④ 확장: 예제 5-16 의 START 를 송강호로 고정하고 모든 배우까지의 단계를 구해 "송강호 수" 표를 만들어 보게 합니다 (가장 먼 사람은 김민희 · 탕웨이 등).' }
        ],
        slides: [
          { layout: 'title', title: '경로 탐색과 가변 길이 관계', subtitle: '2교시 · 함께 출연 · 친구의 친구 · 최단 경로',
            notes: '<p>Cypher 5-11 · 5-13 으로 협업 그래프와 SNS 그래프를 미리 준비합니다. 💬 <b>발문:</b> "여러분과 좋아하는 연예인은 몇 사람 건너면 연결될까요?" → 대개 4~6명이라는 \'여섯 단계 분리\' 이야기로 시작합니다. (5분)</p>' },
          { layout: 'diagram', title: '여러 단계 · 가변 길이 관계', html: FIG_HOPS, caption: '-[:KNOWS*1..3]- = KNOWS 를 1~3번 이어서',
            notes: '<p>그림 5-7 과 Cypher 5-12 로 함께 출연한 배우를 먼저 찾고(예제 5-10), 이어 이 그림으로 친구의 친구를 설명합니다. Cypher 5-14 를 실행해 같은 사람이 여러 행 나오는 이유를 예제 5-11 의 경로 목록으로 확인합니다. 상한 없는 * 의 위험도 짚습니다. (12분)</p>' },
          { layout: 'diagram', title: '최단 경로 = 물결처럼 퍼지는 BFS', html: FIG_BFS, caption: '목표에 처음 닿은 단계 = 최단 거리',
            notes: '<p>Cypher 5-16 을 실행해 길이 10 을 확인하고 "왜 5단계가 아니라 10일까요?" 를 묻습니다 → 영화 노드도 세기 때문. 이 그림으로 BFS 를 설명한 뒤 예제 5-13 · 5-14 를 실행합니다. (15분)</p>' },
          { layout: 'code', title: 'BFS 핵심 코드', code: `from collections import deque
knows = [('민수', '지영'), ('민수', '준호'), ('지영', '현우'),
         ('준호', '현우'), ('현우', '서연'), ('서연', '다은')]
graph = {}
for a, b in knows:
    graph.setdefault(a, []).append(b)
    graph.setdefault(b, []).append(a)

def bfs(start, goal):
    parent, queue = {start: None}, deque([start])
    while queue:
        here = queue.popleft()
        for nxt in graph[here]:
            if nxt not in parent:
                parent[nxt] = here
                queue.append(nxt)
    path, node = [], goal
    while node is not None:
        path.append(node)
        node = parent[node]
    return path[::-1]

print(' → '.join(bfs('민수', '다은')))`,
            points: ['대기줄(큐)에서 앞사람을 꺼내 이웃을 뒤에 넣기', '부모 표를 거꾸로 따라가면 경로', '처음 닿은 순간이 최단'],
            notes: '<p>학생들과 칠판에 큐를 그려 가며 한 단계씩 따라간 뒤 실행합니다. 결과: 민수 → 지영 → 현우 → 서연 → 다은. 💬 "준호를 거치는 길도 같은 길이인데 왜 지영이 나왔을까요?" → 이웃 목록에서 지영이 먼저 방문되었기 때문. (5분)</p>' },
          { layout: 'summary', title: '정리 · 함께 해 보기', bullets: ['(a)-[:ACTED_IN]-&gt;(m)&lt;-[:ACTED_IN]-(b) = 함께 출연', '-[:KNOWS*1..3]- 가변 길이, 상한은 꼭 적기', 'p = (…) 와 length(p) · nodes(p) · relationships(p)', 'shortestPath · allShortestPaths = BFS 원리', 'OPTIONAL MATCH = 없으면 null 로 남기기 (left join)', '실습: 예제 5-16 으로 최단 경로를 빨간 선으로'],
            notes: '<p>Cypher 5-17 과 예제 5-15 로 OPTIONAL MATCH 를 짧게 확인하고(5분), 예제 5-16 에서 START · GOAL 을 바꿔 가며 Cypher shortestPath 결과와 비교하게 합니다(10분). 다음 차시 예고: 표 · CSV 데이터를 지식그래프로 옮기기. (13분)</p>' }
        ]
      }
    ]
  });
})();
