/* 08차시 그래프 분석과 지식그래프 미니 프로젝트 */
(function () {
  const ARROW = (id) => `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fill-arrow"/></marker></defs>`;

  /* 원 두 개 사이의 선 (원 테두리에서 시작 · 끝) — ra, rb 는 두 원의 반지름 */
  function edge(a, b, ra, rb, mk, label, cls, sw, dash) {
    const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / d, uy = dy / d;
    const x1 = (a[0] + ux * ra).toFixed(1), y1 = (a[1] + uy * ra).toFixed(1);
    const x2 = (b[0] - ux * (rb + (mk ? 3 : 0))).toFixed(1), y2 = (b[1] - uy * (rb + (mk ? 3 : 0))).toFixed(1);
    let s = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls || 'ln'}" stroke-width="${sw || 2}"${dash ? ' stroke-dasharray="6 4"' : ''}${mk ? ` marker-end="url(#${mk})"` : ''}/>`;
    if (label) s += `<text x="${((a[0] + b[0]) / 2).toFixed(1)}" y="${((a[1] + b[1]) / 2 - 6).toFixed(1)}" text-anchor="middle" class="tx-m">${label}</text>`;
    return s;
  }
  function circ(p, r, cls, t1, t2) {
    let s = `<circle cx="${p[0]}" cy="${p[1]}" r="${r}" class="${cls}"/>`;
    if (!t1) return s;
    const tc = /s$/.test(cls) || cls === 'card-bg' ? 'tx' : 'tx-w';
    if (t2) s += `<text x="${p[0]}" y="${p[1] - 3}" text-anchor="middle" class="${tc}">${t1}</text><text x="${p[0]}" y="${p[1] + 15}" text-anchor="middle" class="${tc}">${t2}</text>`;
    else s += `<text x="${p[0]}" y="${p[1] + 5}" text-anchor="middle" class="${tc}">${t1}</text>`;
    return s;
  }
  function badge(p, r, n) {
    const x = p[0] + r * 0.75, y = p[1] - r * 0.75;
    return `<circle cx="${x}" cy="${y}" r="12" class="p5"/><text x="${x}" y="${y + 5}" text-anchor="middle" class="tx-w">${n}</text>`;
  }

  /* 그림 8-1. 그래프 분석의 세 가지 질문 */
  const FIG_THREE = (() => {
    const hub = [120, 150], leaves = [[120, 80], [185, 120], [180, 195], [60, 195], [55, 120]];
    let s = `<svg viewBox="0 0 720 260" role="img" aria-label="세 개의 상자. 중심성은 연결이 몰린 노드, 커뮤니티는 끼리끼리 모인 두 무리, 유사도는 같은 영화를 좋아한 두 사람을 보여 준다">`;
    s += `<rect x="10" y="10" width="220" height="240" rx="14" class="card-bg"/><text x="120" y="38" text-anchor="middle" class="tx-b">① 중심성: 누가 중요한가?</text>`;
    leaves.forEach(l => { s += edge(hub, l, 24, 12); });
    s += circ(hub, 24, 'p1', '허브');
    leaves.forEach(l => { s += circ(l, 12, 'p1s'); });
    s += `<rect x="250" y="10" width="220" height="240" rx="14" class="card-bg"/><text x="360" y="38" text-anchor="middle" class="tx-b">② 커뮤니티: 어떤 무리?</text>`;
    const A = [[290, 110], [330, 160], [280, 200]], B = [[420, 100], [440, 170], [395, 205]];
    [[0, 1], [1, 2], [0, 2]].forEach(([i, j]) => { s += edge(A[i], A[j], 14, 14); s += edge(B[i], B[j], 14, 14); });
    s += edge(A[1], B[2], 14, 14, null, null, 'ln', 1.5, true);
    A.forEach(p => { s += circ(p, 14, 'p2'); });
    B.forEach(p => { s += circ(p, 14, 'p3'); });
    s += `<text x="360" y="238" text-anchor="middle" class="tx-m">안쪽은 촘촘, 무리 사이는 듬성</text>`;
    s += `<rect x="490" y="10" width="220" height="240" rx="14" class="card-bg"/><text x="600" y="38" text-anchor="middle" class="tx-b">③ 유사도: 누가 비슷한가?</text>`;
    const u1 = [545, 95], u2 = [655, 95], ms = [[530, 195], [600, 195], [670, 195]];
    s += edge(u1, ms[0], 22, 16) + edge(u1, ms[1], 22, 16) + edge(u2, ms[1], 22, 16) + edge(u2, ms[2], 22, 16);
    s += circ(u1, 22, 'p4', '민수') + circ(u2, 22, 'p4', '지영');
    ms.forEach((m, i) => { s += circ(m, 16, i === 1 ? 'p5' : 'p5s', i === 1 ? '공통' : ''); });
    s += `<text x="600" y="238" text-anchor="middle" class="tx-m">같은 이웃이 많을수록 비슷</text>`;
    return s + `</svg>`;
  })();

  /* 그림 8-2. 연결 중심성(차수) */
  const FIG_DEGREE = (() => {
    const P = { 민수: [150, 80], 준호: [150, 220], 지영: [330, 150], 현우: [480, 60], 서연: [520, 200], 다은: [330, 275], 하나: [660, 230] };
    const E = [['민수', '지영'], ['민수', '준호'], ['지영', '준호'], ['지영', '현우'], ['지영', '서연'], ['지영', '다은'], ['현우', '서연'], ['서연', '하나']];
    const deg = {};
    E.forEach(([a, b]) => { deg[a] = (deg[a] || 0) + 1; deg[b] = (deg[b] || 0) + 1; });
    let s = `<svg viewBox="0 0 720 320" role="img" aria-label="친구 7명 그래프. 지영은 5명과 연결되어 가장 크고, 서연 3, 민수 · 준호 · 현우 2, 다은 · 하나 1">`;
    E.forEach(([a, b]) => { s += edge(P[a], P[b], 28, 28); });
    Object.keys(P).forEach(n => { s += circ(P[n], n === '지영' ? 34 : 28, n === '지영' ? 'p1' : 'p1s', n); s += badge(P[n], n === '지영' ? 34 : 28, deg[n]); });
    s += `<text x="40" y="306" class="tx-m">주황 숫자 = 연결 수(차수). 지영이 5로 가장 많으므로 연결 중심성 1위</text>`;
    return s + `</svg>`;
  })();

  /* 그림 8-3. 페이지랭크 — 팔로우 = 한 표 */
  const FIG_PR = (() => {
    const P = { 민수: [80, 70], 준호: [80, 235], 현우: [230, 40], 다은: [215, 265], 서연: [340, 190], 지영: [470, 100], 하나: [640, 150] };
    const R = { 민수: 20, 준호: 20, 현우: 20, 다은: 23, 서연: 26, 지영: 44, 하나: 40 };
    const S = { 민수: '.02', 준호: '.02', 현우: '.02', 다은: '.04', 서연: '.06', 지영: '.44', 하나: '.39' };
    const F = [['민수', '지영'], ['민수', '다은'], ['준호', '지영'], ['준호', '다은'], ['현우', '지영'], ['현우', '서연'], ['서연', '지영'], ['다은', '서연']];
    let s = `<svg viewBox="0 0 720 320" role="img" aria-label="팔로우 그래프. 지영은 5표를 받아 0.44, 하나는 지영 한 사람에게서만 1표를 받았지만 0.39 로 2위, 다은은 2표를 받았지만 0.04">${ARROW('c08a1')}`;
    F.forEach(([a, b]) => { s += edge(P[a], P[b], R[a], R[b], 'c08a1'); });
    s += edge([P.지영[0], P.지영[1] - 8], [P.하나[0], P.하나[1] - 8], R.지영, R.하나, 'c08a1', null, 's1', 3);
    s += edge([P.하나[0], P.하나[1] + 8], [P.지영[0], P.지영[1] + 8], R.하나, R.지영, 'c08a1');
    Object.keys(P).forEach(n => {
      const big = R[n] >= 40;
      s += circ(P[n], R[n], big ? 'p2' : 'p2s', n);
      s += `<text x="${P[n][0]}" y="${P[n][1] + R[n] + 16}" text-anchor="middle" class="tx-m">${S[n]}</text>`;
    });
    s += `<text x="560" y="250" text-anchor="middle" class="tx">하나는 1표뿐이지만</text><text x="560" y="272" text-anchor="middle" class="tx">1위 지영의 표라서 2위!</text>`;
    s += `<text x="20" y="310" class="tx-m">화살표 = 팔로우 = 한 표 · 숫자 = 페이지랭크 · 원 크기 = 중요도</text>`;
    return s + `</svg>`;
  })();

  /* 그림 8-4. 연결 요소(무리) */
  const FIG_COMP = (() => {
    const G = [
      { cls: 'p1', nodes: { 민수: [80, 90], 지영: [190, 70], 준호: [140, 180] }, e: [['민수', '지영'], ['지영', '준호'], ['준호', '민수']], tag: '무리 1 (3명)', tx: 135 },
      { cls: 'p2', nodes: { 현우: [300, 80], 서연: [410, 70], 다은: [360, 175], 하나: [470, 200] }, e: [['현우', '서연'], ['서연', '다은'], ['다은', '현우'], ['다은', '하나']], tag: '무리 2 (4명)', tx: 385 },
      { cls: 'p3', nodes: { 도윤: [560, 80], 유진: [660, 110] }, e: [['도윤', '유진']], tag: '무리 3 (2명)', tx: 610 },
      { cls: 'p4', nodes: { 태호: [610, 220] }, e: [], tag: '무리 4 (혼자)', tx: 610 }
    ];
    let s = `<svg viewBox="0 0 720 300" role="img" aria-label="10명이 선으로 이어진 정도에 따라 네 무리로 나뉜다: 3명, 4명, 2명, 혼자 1명">`;
    G.forEach(g => { g.e.forEach(([a, b]) => { s += edge(g.nodes[a], g.nodes[b], 26, 26); }); });
    G.forEach(g => { Object.keys(g.nodes).forEach(n => { s += circ(g.nodes[n], 26, g.cls, n); }); });
    s += `<text x="135" y="245" text-anchor="middle" class="tx-b">무리 1 (3명)</text><text x="385" y="255" text-anchor="middle" class="tx-b">무리 2 (4명)</text>`;
    s += `<text x="610" y="160" text-anchor="middle" class="tx-b">무리 3 (2명)</text><text x="610" y="275" text-anchor="middle" class="tx-b">무리 4 (혼자)</text>`;
    s += `<line x1="250" y1="30" x2="250" y2="280" class="ln" stroke-dasharray="4 4"/><line x1="520" y1="30" x2="520" y2="280" class="ln" stroke-dasharray="4 4"/>`;
    return s + `</svg>`;
  })();

  /* 그림 8-5. 자카드 유사도 */
  const FIG_JACCARD = `<svg viewBox="0 0 720 300" role="img" aria-label="민수와 지영이 좋아한 영화의 벤 다이어그램. 겹치는 부분은 기생충과 살인의 추억 2편, 전체는 5편이므로 자카드 유사도는 0.4">
  <circle cx="230" cy="140" r="115" class="p1s" fill-opacity="0.6"/><circle cx="230" cy="140" r="115" class="s1" stroke-width="3"/>
  <circle cx="380" cy="140" r="115" class="p2s" fill-opacity="0.6"/><circle cx="380" cy="140" r="115" class="s2" stroke-width="3"/>
  <text x="170" y="22" text-anchor="middle" class="tx-b">민수가 좋아한 영화</text>
  <text x="440" y="22" text-anchor="middle" class="tx-b">지영이 좋아한 영화</text>
  <text x="175" y="145" text-anchor="middle" class="tx">괴물</text>
  <text x="305" y="125" text-anchor="middle" class="tx-b">기생충</text>
  <text x="305" y="160" text-anchor="middle" class="tx-b">살인의 추억</text>
  <text x="440" y="125" text-anchor="middle" class="tx">추격자</text>
  <text x="440" y="160" text-anchor="middle" class="tx">올드보이</text>
  <rect x="520" y="60" width="190" height="170" rx="12" class="card-bg"/>
  <text x="615" y="88" text-anchor="middle" class="tx-b">자카드 유사도</text>
  <text x="615" y="120" text-anchor="middle" class="tx">겹친 것 ÷ 모두 합친 것</text>
  <line x1="560" y1="150" x2="670" y2="150" class="ln"/>
  <text x="615" y="143" text-anchor="middle" class="tx">2 (기생충, 살인의 추억)</text>
  <text x="615" y="172" text-anchor="middle" class="tx">5 (중복 없이 전체)</text>
  <text x="615" y="210" text-anchor="middle" class="tx-b">= 0.4</text>
  <text x="305" y="285" text-anchor="middle" class="tx-m">공통 이웃 수 = 2 · 자카드 = 2 / 5 = 0.4</text>
</svg>`;

  /* 그림 8-6. 협업 필터링 경로 */
  const FIG_CF = (() => {
    const me = [90, 150], m1 = [270, 80], m2 = [270, 220], other = [450, 150], rec = [630, 150];
    let s = `<svg viewBox="0 0 720 300" role="img" aria-label="민수가 좋아한 기생충과 살인의 추억을 지영도 좋아했고, 지영이 좋아한 추격자를 민수에게 추천하는 경로">${ARROW('c08a2')}`;
    s += edge(me, m1, 34, 34, 'c08a2', '좋아함') + edge(me, m2, 34, 34, 'c08a2', '좋아함');
    s += edge(other, m1, 34, 34, 'c08a2', '좋아함') + edge(other, m2, 34, 34, 'c08a2', '좋아함');
    s += edge(other, rec, 34, 38, 'c08a2', '좋아함');
    s += `<path d="M 90 190 Q 360 330 615 188" class="s5" stroke-width="3" stroke-dasharray="8 5" fill="none" marker-end="url(#c08a2)"/>`;
    s += circ(me, 34, 'p4', '민수') + circ(m1, 34, 'p3s', '기생충') + circ(m2, 34, 'p3s', '살인의', '추억') + circ(other, 34, 'p4', '지영') + circ(rec, 38, 'p5', '추격자');
    s += `<text x="360" y="292" text-anchor="middle" class="tx-b">추천! "나와 같은 영화를 좋아한 사람이 좋아한 다른 영화"</text>`;
    s += `<text x="180" y="30" text-anchor="middle" class="tx-m">① 내가 좋아한 영화</text><text x="450" y="30" text-anchor="middle" class="tx-m">② 같이 좋아한 사람</text><text x="630" y="90" text-anchor="middle" class="tx-m">③ 그 사람의 다른 영화</text>`;
    return s + `</svg>`;
  })();

  /* 그림 8-7. 프로젝트 7단계 */
  const FIG_PIPE = (() => {
    const steps = [['주제', '선정'], ['질문', '정하기'], ['온톨로지', '설계'], ['데이터', '준비'], ['적재', '(Neo4j)'], ['질의', '· 분석'], ['발표', '']];
    const cls = ['p1', 'p1', 'p2', 'p3', 'p3', 'p4', 'p5'];
    let s = `<svg viewBox="0 0 720 190" role="img" aria-label="주제 선정, 질문 정하기, 온톨로지 설계, 데이터 준비, 적재, 질의 분석, 발표의 7단계 흐름">${ARROW('c08b1')}`;
    steps.forEach((t, i) => {
      const x = 12 + i * 101;
      s += `<rect x="${x}" y="40" width="84" height="74" rx="12" class="${cls[i]}"/>`;
      s += `<text x="${x + 42}" y="${t[1] ? 72 : 82}" text-anchor="middle" class="tx-w">${t[0]}</text>`;
      if (t[1]) s += `<text x="${x + 42}" y="94" text-anchor="middle" class="tx-w">${t[1]}</text>`;
      s += `<text x="${x + 42}" y="30" text-anchor="middle" class="tx-m">${i + 1}단계</text>`;
      if (i < 6) s += `<line x1="${x + 86}" y1="77" x2="${x + 99}" y2="77" class="ln" stroke-width="2" marker-end="url(#c08b1)"/>`;
    });
    s += `<path d="M 559 120 Q 400 175 254 120" class="ln" stroke-width="2" stroke-dasharray="6 4" fill="none" marker-end="url(#c08b1)"/>`;
    s += `<text x="405" y="178" text-anchor="middle" class="tx-m">질의가 안 되면 설계로 돌아가 고칩니다 (반복)</text>`;
    return s + `</svg>`;
  })();

  /* 그림 8-8. 영화 지식그래프 스키마 */
  const FIG_SCHEMA = (() => {
    const per = [150, 150], mov = [420, 150], gen = [640, 150], usr = [420, 40];
    let s = `<svg viewBox="0 0 720 280" role="img" aria-label="Person 은 Movie 에 ACTED_IN, DIRECTED 관계로, Movie 는 Genre 에 IN_GENRE 관계로 이어진다. User 는 Movie 에 RATED 관계(score 속성)로 이어진다">${ARROW('c08b2')}`;
    s += `<path d="M 186 132 Q 285 85 382 132" class="ln" stroke-width="2" fill="none" marker-end="url(#c08b2)"/><text x="285" y="92" text-anchor="middle" class="tx-m">ACTED_IN</text>`;
    s += `<path d="M 186 168 Q 285 215 382 168" class="ln" stroke-width="2" fill="none" marker-end="url(#c08b2)"/><text x="285" y="222" text-anchor="middle" class="tx-m">DIRECTED</text>`;
    s += edge(mov, gen, 40, 40, 'c08b2', 'IN_GENRE');
    s += `<line x1="420" y1="62" x2="420" y2="104" class="ln" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#c08b2)"/><text x="490" y="88" class="tx-m">RATED {score}</text>`;
    s += circ(per, 40, 'p1', 'Person') + circ(mov, 40, 'p3', 'Movie') + circ(gen, 40, 'p2', 'Genre');
    s += `<rect x="370" y="22" width="100" height="36" rx="18" class="p4s"/><text x="420" y="45" text-anchor="middle" class="tx">User (선택)</text>`;
    s += `<text x="150" y="212" text-anchor="middle" class="tx-m">name</text><text x="420" y="212" text-anchor="middle" class="tx-m">title · released</text><text x="640" y="212" text-anchor="middle" class="tx-m">name</text>`;
    s += `<text x="360" y="265" text-anchor="middle" class="tx-m">클래스 4개 · 관계 4종류 — 처음에는 이 정도 크기가 알맞습니다</text>`;
    return s + `</svg>`;
  })();

  /* 그림 8-9. 질의응답 봇의 흐름 */
  const FIG_QA = (() => {
    const box = (x, w, cls, t1, t2) => `<rect x="${x}" y="70" width="${w}" height="80" rx="12" class="${cls}"/><text x="${x + w / 2}" y="104" text-anchor="middle" class="${/s$/.test(cls) ? 'tx-b' : 'tx-w'}">${t1}</text><text x="${x + w / 2}" y="128" text-anchor="middle" class="${/s$/.test(cls) ? 'tx-m' : 'tx-w'}">${t2}</text>`;
    let s = `<svg viewBox="0 0 720 220" role="img" aria-label="질문 문장에서 키워드로 질문 유형을 고르고, 영화 · 사람 이름을 찾고, 지식그래프에서 답을 찾아 문장으로 돌려준다">${ARROW('c08b3')}`;
    s += box(10, 130, 'card-bg', '질문 입력', '"기생충에 출연한…"');
    s += box(160, 130, 'p1', '① 유형 고르기', '키워드 "출연"');
    s += box(310, 130, 'p2', '② 이름 찾기', '영화 = 기생충');
    s += box(460, 120, 'p3', '③ 그래프 검색', 'ACTED_IN 따라가기');
    s += box(600, 110, 'p5s', '④ 답하기', '송강호, 이선균…');
    [[140, 160], [290, 310], [440, 460], [580, 600]].forEach(([a, b]) => { s += `<line x1="${a + 2}" y1="110" x2="${b - 2}" y2="110" class="ln" stroke-width="2" marker-end="url(#c08b3)"/>`; });
    s += `<text x="360" y="40" text-anchor="middle" class="tx-m">Neo4j 에서는 ③ 이 Cypher 템플릿 + 매개변수($movie) 한 줄이 됩니다</text>`;
    s += `<text x="360" y="190" text-anchor="middle" class="tx-m">유형이나 이름을 못 찾으면 "예시 질문" 을 안내합니다</text>`;
    return s + `</svg>`;
  })();

  /* 그림 8-10. GraphRAG 흐름 */
  const FIG_RAG = (() => {
    let s = `<svg viewBox="0 0 720 250" role="img" aria-label="질문에서 개체를 찾고, 지식그래프에서 주변 사실을 꺼내, 질문과 함께 대규모 언어 모델에 보내면 근거 있는 답이 나온다">${ARROW('c08b4')}`;
    s += `<rect x="10" y="90" width="120" height="70" rx="12" class="card-bg"/><text x="70" y="120" text-anchor="middle" class="tx-b">질문</text><text x="70" y="142" text-anchor="middle" class="tx-m">사람의 말</text>`;
    s += `<rect x="160" y="90" width="130" height="70" rx="12" class="p1"/><text x="225" y="120" text-anchor="middle" class="tx-w">① 개체 찾기</text><text x="225" y="142" text-anchor="middle" class="tx-w">박해일 · 스릴러</text>`;
    s += `<rect x="320" y="20" width="150" height="90" rx="12" class="p3s"/><text x="395" y="50" text-anchor="middle" class="tx-b">지식그래프</text><text x="395" y="74" text-anchor="middle" class="tx-m">(Neo4j)</text><text x="395" y="96" text-anchor="middle" class="tx-m">주변 사실 꺼내기</text>`;
    s += `<rect x="320" y="140" width="150" height="90" rx="12" class="p3"/><text x="395" y="174" text-anchor="middle" class="tx-w">② 사실 목록</text><text x="395" y="198" text-anchor="middle" class="tx-w">"박해일 — 괴물 출연"…</text>`;
    s += `<rect x="500" y="90" width="100" height="70" rx="12" class="p2"/><text x="550" y="120" text-anchor="middle" class="tx-w">③ LLM</text><text x="550" y="142" text-anchor="middle" class="tx-w">문장 만들기</text>`;
    s += `<rect x="625" y="90" width="85" height="70" rx="12" class="p5s"/><text x="667" y="120" text-anchor="middle" class="tx-b">답</text><text x="667" y="142" text-anchor="middle" class="tx-m">근거 있음</text>`;
    s += `<line x1="132" y1="125" x2="156" y2="125" class="ln" stroke-width="2" marker-end="url(#c08b4)"/>`;
    s += `<line x1="292" y1="110" x2="316" y2="80" class="ln" stroke-width="2" marker-end="url(#c08b4)"/>`;
    s += `<line x1="395" y1="112" x2="395" y2="136" class="ln" stroke-width="2" marker-end="url(#c08b4)"/>`;
    s += `<line x1="472" y1="180" x2="497" y2="150" class="ln" stroke-width="2" marker-end="url(#c08b4)"/>`;
    s += `<line x1="602" y1="125" x2="621" y2="125" class="ln" stroke-width="2" marker-end="url(#c08b4)"/>`;
    s += `<path d="M 70 162 Q 70 245 300 240 Q 470 240 530 165" class="ln" stroke-width="1.5" stroke-dasharray="5 4" fill="none" marker-end="url(#c08b4)"/><text x="160" y="232" text-anchor="middle" class="tx-m">질문도 함께</text>`;
    return s + `</svg>`;
  })();

  PY_COURSE.addChapter({
    id: 'ch08', no: '08', title: '그래프 분석과 지식그래프 미니 프로젝트',
    subtitle: '연결 중심성 · 페이지랭크 · 연결 요소 · 자카드 유사도 · 협업 필터링 추천 · 미니 프로젝트 · 질의응답 봇 · GraphRAG',
    summary: '지식그래프에 데이터를 넣고 찾는 법을 익혔으니, 이제 그래프에게 <b>더 큰 질문</b>을 던져 봅니다. "누가 가장 중요한가?"(<b>중심성</b>), "어떤 무리가 있는가?"(<b>커뮤니티</b>), "누가 나와 비슷한가?"(<b>유사도</b>) 를 Python 으로 직접 계산하고, 그 결과로 <b>영화 추천</b>을 만들어 Cypher 로도 표현합니다. 2교시에는 지금까지 배운 모든 것을 모아 <b>나만의 지식그래프 미니 프로젝트</b>를 완성합니다 — 주제와 질문 정하기, 온톨로지 설계, 데이터 준비 · 적재, 질문을 Cypher 템플릿으로 바꾸기, <code>input()</code> 으로 대화하는 <b>질의응답 봇</b>, 그리고 발표까지.',
    goals: [
      '연결 중심성(차수)과 페이지랭크의 뜻을 설명하고, Python(numpy)으로 직접 계산할 수 있다',
      '연결 요소(connected components)로 그래프의 무리를 찾을 수 있다',
      '공통 이웃 수와 자카드 유사도로 비슷한 사용자를 찾고, 협업 필터링 추천을 Python 과 Cypher 로 만들 수 있다',
      '주제 → 질문 → 온톨로지 → 데이터 → 적재 → 질의 · 분석 → 발표 순서로 나만의 지식그래프를 완성할 수 있다',
      '질문을 Cypher 템플릿으로 바꾸고, 키워드로 질문 유형을 고르는 Python 질의응답 봇을 만들 수 있다'
    ],
    sections: [
      /* ------------------------------------------------------------------ 1교시 */
      {
        id: 'ch08-1',
        title: '그래프 분석과 추천',
        minutes: 50,
        goals: ['연결 중심성과 페이지랭크를 직관으로 이해하고 numpy 로 계산한다', '연결 요소로 무리를 찾는다', '자카드 유사도로 비슷한 사용자를 찾아 영화를 추천한다', '같은 추천을 Cypher 질의로 작성한다'],
        flow: [['도입 · 그래프 분석이란', 5], ['중심성: 차수 · 페이지랭크', 15], ['커뮤니티 · 연결 요소', 8], ['유사도와 추천 (Python)', 14], ['Cypher 추천 · GDS · 정리', 8]],
        content: [
          { type: 'h', text: '그래프 분석: 그래프에게 묻는 세 가지 질문' },
          { type: 'p', html: '지금까지는 "기생충에 출연한 배우는?" 처럼 <b>특정한 노드 주변</b>을 찾는 질문을 했습니다. 그런데 그래프가 커지면 이런 질문도 궁금해집니다.' },
          { type: 'list', items: [
            '이 친구 모임에서 <b>가장 영향력 있는 사람</b>은 누구일까? (홍보를 부탁한다면 누구에게?)',
            '이 사람들은 <b>몇 개의 무리</b>로 나뉠까? (동아리 · 반 · 팬클럽)',
            '나와 <b>취향이 비슷한 사람</b>은 누구이고, 그 사람은 무엇을 좋아할까? (추천)'
          ] },
          { type: 'p', html: '이렇게 <b>그래프 전체의 연결 모양</b>을 보고 답을 계산하는 것을 <b>그래프 분석(graph analytics)</b> 이라고 합니다. 대표적인 분석은 세 가지입니다.' },
          { type: 'figure', html: FIG_THREE, caption: '그림 8-1. 그래프 분석의 세 가지 대표 질문. ① 연결이 몰린 노드 찾기(중심성), ② 끼리끼리 모인 무리 찾기(커뮤니티), ③ 같은 이웃을 공유하는 노드 찾기(유사도).' },
          { type: 'table', head: ['분석', '묻는 질문', '생활 속 예', '이번 교시에서 배우는 방법'], rows: [
            ['중심성 (centrality)', '누가 중요한가?', '인플루언서 찾기, 검색 결과 순위', '연결 중심성(차수), 페이지랭크'],
            ['커뮤니티 (community)', '어떤 무리가 있는가?', '동아리 · 친구 무리, 비슷한 상품 묶음', '연결 요소 (+ 더 알아보기: 루뱅)'],
            ['유사도 (similarity)', '누가 나와 비슷한가?', '"이 상품을 산 사람이 산 상품", 친구 추천', '공통 이웃 수, 자카드 유사도']
          ], caption: '표 8-1. 이번 교시에서 다루는 그래프 분석' },
          { type: 'callout', kind: 'info', title: '이번 교시의 코드는 대부분 이 페이지에서 바로 실행됩니다', html: '분석 방법의 <b>원리</b>를 이해하는 것이 목표이므로, 작은 그래프를 Python 의 리스트 · 딕셔너리로 만들어 직접 계산합니다. 같은 계산을 Neo4j 에서 하는 Cypher 는 제목에 <b>"(Neo4j Browser 에서 실행)"</b> 이라고 표시했습니다.' },

          { type: 'h', text: '연결 중심성: 친구가 많은 사람이 중요하다' },
          { type: 'p', html: '가장 쉬운 생각은 "<b>연결이 많은 노드가 중요하다</b>" 입니다. 반에서 친구가 가장 많은 학생에게 소식을 전하면 금방 퍼지겠지요. 노드에 붙은 관계(선)의 개수를 <b>차수(degree)</b> 라고 하고, 차수로 중요도를 매기는 것을 <b>연결 중심성(degree centrality)</b> 이라고 합니다.' },
          { type: 'figure', html: FIG_DEGREE, caption: '그림 8-2. 친구 7명의 그래프. 각 노드에 붙은 선의 개수가 차수입니다. 지영은 5명과 연결되어 연결 중심성이 가장 높습니다.' },
          { type: 'p', html: '사람 수가 다른 그래프끼리 비교하려면 <b>정규화</b>를 합니다. 한 사람이 가질 수 있는 최대 친구 수는 (전체 인원 − 1) 이므로, <b>차수 ÷ (n − 1)</b> 을 계산하면 0 ~ 1 사이 값이 됩니다. 1 이면 "모든 사람과 친구" 입니다.' },
          { type: 'code', title: '예제 8-1. 연결 중심성(차수) 계산하기', code: `import matplotlib.pyplot as plt

# 친구 관계 (방향 없음): 그림 8-2 와 같은 그래프
friends = [('민수', '지영'), ('민수', '준호'), ('지영', '준호'), ('지영', '현우'),
           ('지영', '서연'), ('지영', '다은'), ('현우', '서연'), ('서연', '하나')]

degree = {}
for a, b in friends:              # 관계 하나 = 양쪽 사람의 연결 수 +1
    degree[a] = degree.get(a, 0) + 1
    degree[b] = degree.get(b, 0) + 1

n = len(degree)
ranking = sorted(degree.items(), key=lambda x: -x[1])
print('사람 수:', n, '/ 관계 수:', len(friends))
print('이름  차수  정규화(차수 / 6)')
for name, d in ranking:
    print(f'{name}   {d}     {d / (n - 1):.2f}')

plt.figure(figsize=(6, 3.5))
plt.bar([r[0] for r in ranking], [r[1] for r in ranking], color='#4C78A8')
plt.title('친구 그래프의 연결 중심성(차수)')
plt.ylabel('연결 수')
plt.show()`,
            expect: '사람 수: 7 / 관계 수: 8\n이름  차수  정규화(차수 / 6)\n지영   5     0.83\n서연   3     0.50\n민수   2     0.33\n준호   2     0.33\n현우   2     0.33\n다은   1     0.17\n하나   1     0.17',
            desc: '관계 하나가 <b>두 사람의 차수를 1씩</b> 올립니다. 그래서 모든 차수를 더하면 관계 수의 2배(16)가 됩니다. <code>sorted(…, key=lambda x: -x[1])</code> 는 "차수가 큰 순서로 정렬" 이라는 뜻입니다.' },
          { type: 'code', title: 'Cypher 8-1. Neo4j 에서 차수 세기 (Neo4j Browser 에서 실행)', run: false, code: `// 5차시에 만든 친구 그래프(User, KNOWS)에서
MATCH (u:User)
RETURN u.name AS 이름, COUNT { (u)-[:KNOWS]-() } AS 차수
ORDER BY 차수 DESC`,
            desc: '<code>COUNT { 패턴 }</code> 은 "이 패턴이 몇 개 있는지" 를 세어 줍니다. 방향 없이 <code>-[:KNOWS]-</code> 로 쓰면 들어오는 관계와 나가는 관계를 모두 셉니다.' },
          { type: 'callout', kind: 'tip', title: '방향이 있는 그래프라면: 들어오는 차수 · 나가는 차수', html: '팔로우처럼 방향이 있는 관계는 <b>들어오는 차수(in-degree, 나를 팔로우한 수)</b> 와 <b>나가는 차수(out-degree, 내가 팔로우한 수)</b> 를 나누어 봅니다. 인기를 재고 싶다면 들어오는 차수가 더 알맞습니다. Cypher 로는 <code>COUNT { (u)&lt;-[:FOLLOWS]-() }</code> 처럼 화살표 방향을 정해 셉니다.' },

          { type: 'h', text: '페이지랭크: 중요한 사람에게 받은 한 표는 더 무겁다' },
          { type: 'p', html: '연결 중심성에는 약점이 있습니다. <b>아무도 모르는 사람 100명</b>의 팔로우와 <b>유명인 1명</b>의 팔로우가 똑같이 취급되지요. <b>페이지랭크(PageRank)</b> 는 이 점을 고친 방법으로, 구글이 웹 페이지 순위를 매기려고 만든 것으로 유명합니다. 핵심 생각은 한 문장입니다.' },
          { type: 'callout', kind: 'info', title: '페이지랭크의 직관', html: '"<b>중요한 노드에게서 많이 연결 받은 노드가 중요하다.</b>" — 팔로우는 <b>투표</b>와 같고, 내가 가진 점수(중요도)를 내가 팔로우한 사람들에게 <b>똑같이 나눠서</b> 줍니다. 그래서 중요한 사람이 던진 한 표는 무겁고, 여러 명을 팔로우한 사람의 표는 나뉘어 가벼워집니다.' },
          { type: 'figure', html: FIG_PR, caption: '그림 8-3. 팔로우 그래프의 페이지랭크. 하나는 표를 <b>1개</b>(지영에게서) 밖에 못 받았지만, 1위인 지영이 가진 점수를 <b>통째로</b> 받아 2위가 됩니다. 다은은 2표를 받았지만 보낸 사람(민수 · 준호)이 중요하지 않고 표도 나뉘어 낮습니다.' },
          { type: 'p', html: '그런데 "중요한 사람" 을 알려면 페이지랭크가 필요하고, 페이지랭크를 알려면 "중요한 사람" 을 알아야 합니다. 닭이 먼저냐 달걀이 먼저냐 같은 이 문제는 <b>반복</b>으로 풉니다.' },
          { type: 'list', ordered: true, items: [
            '처음에는 모두에게 같은 점수 <b>1/N</b> 을 줍니다 (N = 노드 수).',
            '각자 자기 점수를 팔로우한 사람 수로 나눠 <b>나눠 줍니다</b>.',
            '받은 점수를 모두 더해 새 점수로 삼습니다. 이때 <b>감쇠 계수 d = 0.85</b> 를 곱하고, 남은 0.15 는 모두에게 똑같이 나눕니다.',
            '점수가 거의 변하지 않을 때까지 2 ~ 3 을 반복합니다.'
          ] },
          { type: 'p', html: '식으로 쓰면 다음과 같습니다. <b>PR(v) = (1 − d) / N + d × Σ PR(u) / out(u)</b> — 여기서 Σ 는 "v 를 팔로우한 모든 u 에 대해 더하기", out(u) 는 u 가 팔로우한 사람 수입니다. 감쇠 계수는 "링크를 따라 돌아다니던 사람이 15% 확률로 지루해져서 <b>아무 페이지로나 순간이동</b>한다" 는 뜻으로, 점수가 한쪽에 갇히지 않게 해 줍니다.' },
          { type: 'p', html: 'numpy 로 이 반복을 계산해 봅시다. "누가 누구에게 점수를 얼마나 주는가" 를 표(행렬) <b>M</b> 으로 만들면, 한 번의 반복은 <code>M @ pr</code> (행렬 곱하기) 한 줄이 됩니다.' },
          { type: 'code', title: '예제 8-2. 페이지랭크 반복 계산 직접 구현하기 (numpy)', code: `import numpy as np

names = ['민수', '준호', '현우', '서연', '다은', '지영', '하나']
follows = [('민수', '지영'), ('민수', '다은'), ('준호', '지영'), ('준호', '다은'),
           ('현우', '지영'), ('현우', '서연'), ('서연', '지영'), ('다은', '서연'),
           ('지영', '하나'), ('하나', '지영')]          # (a, b) = a 가 b 를 팔로우
idx = {n: i for i, n in enumerate(names)}
N = len(names)

# M[b, a] = a 가 b 에게 주는 몫 = 1 / (a 가 팔로우한 수)
out = {n: sum(1 for a, b in follows if a == n) for n in names}
M = np.zeros((N, N))
for a, b in follows:
    M[idx[b], idx[a]] = 1 / out[a]

d = 0.85
pr = np.full(N, 1 / N)                  # ① 처음엔 모두 1/7
print(' 0회:', np.round(pr, 3))
for step in range(1, 101):
    new = (1 - d) / N + d * (M @ pr)    # ②③ 나눠 주고, 받은 만큼 더하기
    change = np.abs(new - pr).sum()
    pr = new
    if step <= 3:
        print(f'{step:2d}회:', np.round(pr, 3))
    if change < 1e-6:                   # ④ 거의 안 변하면 멈춤
        print(f'{step:2d}회:', np.round(pr, 3), '<- 수렴!')
        break
print('순서:', names)
print('점수 합계:', round(pr.sum(), 3))`,
            desc: '반복할수록 지영 · 하나의 점수는 커지고, 아무에게도 팔로우 받지 못한 민수 · 준호 · 현우는 기본 몫 <code>0.15 / 7 ≈ 0.021</code> 만 남습니다. 점수의 <b>합계는 언제나 1</b>입니다 — 점수를 나눠 주기만 할 뿐 새로 만들거나 없애지 않기 때문입니다.' },
          { type: 'code', title: '예제 8-3. 차수 vs 페이지랭크 비교 그래프', code: `import numpy as np
import matplotlib.pyplot as plt

names = ['민수', '준호', '현우', '서연', '다은', '지영', '하나']
follows = [('민수', '지영'), ('민수', '다은'), ('준호', '지영'), ('준호', '다은'),
           ('현우', '지영'), ('현우', '서연'), ('서연', '지영'), ('다은', '서연'),
           ('지영', '하나'), ('하나', '지영')]

def pagerank(names, follows, d=0.85, steps=100):
    N = len(names)
    idx = {n: i for i, n in enumerate(names)}
    M = np.zeros((N, N))
    for a, b in follows:
        M[idx[b], idx[a]] = 1 / sum(1 for x, y in follows if x == a)
    pr = np.full(N, 1 / N)
    for _ in range(steps):
        pr = (1 - d) / N + d * (M @ pr)
    return pr

pr = pagerank(names, follows)
indeg = [sum(1 for a, b in follows if b == n) for n in names]
order = np.argsort(-pr, kind='stable')
print('순위  이름  받은 표  페이지랭크')
for rank, i in enumerate(order, 1):
    print(f'{rank}위   {names[i]}   {indeg[i]}표     {pr[i]:.3f}')

fig, axes = plt.subplots(1, 2, figsize=(10, 4))
axes[0].bar(names, indeg, color='#4C78A8')
axes[0].set_title('받은 팔로우 수 (들어오는 차수)')
axes[1].bar(names, pr, color='#F58518')
axes[1].set_title('페이지랭크')
plt.tight_layout()
plt.show()`,
                        desc: '왼쪽 그래프(받은 표 수)에서 하나는 다은 · 서연보다 낮지만, 오른쪽(페이지랭크)에서는 <b>2위</b>로 올라갑니다. "얼마나 많이" 뿐 아니라 "<b>누구에게서</b>" 받았는지를 따지는 것이 페이지랭크입니다.' },
          { type: 'callout', kind: 'warn', title: '나가는 관계가 없는 노드(막다른 노드)는 조심', html: '아무도 팔로우하지 않는 노드가 있으면, 그 노드에 모인 점수는 나눠 줄 곳이 없어 <b>새어 나갑니다</b>(합계가 1 보다 작아짐). 예제에서는 모든 사람이 누군가를 팔로우하도록 데이터를 만들었습니다. 실제 라이브러리는 이런 노드의 점수를 모두에게 고르게 나눠 주는 방식으로 처리합니다.' },

          { type: 'h', text: '커뮤니티: 끼리끼리 모인 무리 찾기' },
          { type: 'p', html: '<b>커뮤니티(community)</b> 는 "안쪽끼리는 촘촘하게, 바깥과는 듬성듬성 연결된 노드 무리" 입니다. 커뮤니티 찾기의 가장 기초는 <b>연결 요소(connected components)</b> 입니다. 선을 따라 갈 수 있는 노드끼리 한 무리로 묶는 것으로, "서로 한 번도 이어지지 않은 섬이 몇 개인가?" 를 세는 것과 같습니다.' },
          { type: 'figure', html: FIG_COMP, caption: '그림 8-4. 10명의 친구 관계를 연결 요소로 나누면 네 무리가 됩니다. 무리 사이에는 선이 하나도 없습니다. 태호처럼 연결이 없는 사람은 혼자 한 무리입니다.' },
          { type: 'p', html: '계산 방법은 <b>너비 우선 탐색(BFS)</b> 입니다. ① 아직 무리가 없는 사람 한 명에서 출발해, ② 그 사람의 친구, 친구의 친구 … 를 차례로 모두 방문해 같은 무리로 표시하고, ③ 더 갈 곳이 없으면 아직 방문하지 않은 다음 사람에서 새 무리를 시작합니다. 5차시에 배운 가변 길이 경로 <code>-[:KNOWS*]-</code> 로 닿는 사람들이 바로 한 무리입니다.' },
          { type: 'code', title: '예제 8-4. 연결 요소로 무리 찾기 (BFS)', code: `from collections import deque

def components(people, edges):
    adj = {p: [] for p in people}           # 이웃 목록 만들기
    for a, b in edges:
        adj[a].append(b)
        adj[b].append(a)
    seen, groups = set(), []
    for start in people:
        if start in seen:
            continue
        group, queue = [], deque([start])   # 새 무리 시작
        seen.add(start)
        while queue:
            p = queue.popleft()
            group.append(p)
            for q in adj[p]:                # 친구를 차례로 방문
                if q not in seen:
                    seen.add(q)
                    queue.append(q)
        groups.append(group)
    return groups

people = ['민수', '지영', '준호', '현우', '서연', '다은', '하나', '도윤', '유진', '태호']
edges = [('민수', '지영'), ('지영', '준호'), ('준호', '민수'),
         ('현우', '서연'), ('서연', '다은'), ('다은', '현우'), ('다은', '하나'),
         ('도윤', '유진')]

for i, g in enumerate(components(people, edges), 1):
    print(f'무리 {i}: {g} ({len(g)}명)')

print()
print('준호 - 현우 가 친구가 되면?')
for i, g in enumerate(components(people, edges + [('준호', '현우')]), 1):
    print(f'무리 {i}: {g} ({len(g)}명)')`,
            expect: "무리 1: ['민수', '지영', '준호'] (3명)\n무리 2: ['현우', '서연', '다은', '하나'] (4명)\n무리 3: ['도윤', '유진'] (2명)\n무리 4: ['태호'] (1명)\n\n준호 - 현우 가 친구가 되면?\n무리 1: ['민수', '지영', '준호', '현우', '서연', '다은', '하나'] (7명)\n무리 2: ['도윤', '유진'] (2명)\n무리 3: ['태호'] (1명)",
            desc: '<code>deque</code> 는 앞에서 꺼내기(<code>popleft</code>)가 빠른 줄 서기 자료구조입니다. 마지막 부분이 중요합니다. 관계 <b>단 하나</b>가 생기자 두 무리가 하나로 합쳐졌습니다. 연결 요소는 "조금이라도 이어져 있는가" 만 보기 때문입니다.' },
          { type: 'callout', kind: 'more', title: '더 알아보기: 이어져 있어도 무리를 나누는 루뱅(Louvain)', html: '실제 소셜 네트워크는 거의 모든 사람이 어떻게든 이어져 있어서, 연결 요소로는 큰 무리 하나만 나옵니다. 그래서 <b>루뱅(Louvain)</b> 같은 방법은 "무리 <b>안쪽</b>의 선은 많고 무리 <b>사이</b>의 선은 적게" 되도록 나누는 점수(<b>모듈성, modularity</b>)를 계산해, 그 점수가 가장 높아지는 나누기를 찾습니다. 위 예제에서 준호 – 현우 다리가 생겨도 루뱅은 원래의 두 무리를 그대로 찾아냅니다. 직접 구현은 어려우므로 아래 GDS 라이브러리로 사용합니다.' },

          { type: 'h', text: '유사도: 나와 취향이 비슷한 사람 찾기' },
          { type: 'p', html: '이제 추천으로 넘어갑니다. 여섯 사람이 영화에 1 ~ 5점 평점을 남긴 <b>사용자 – 영화 평점 그래프</b>가 있습니다. 평점 <b>4점 이상</b>이면 "좋아함" 으로 보겠습니다.' },
          { type: 'table', head: ['사용자', '평점 (4점 이상 = 좋아함 굵게)'], rows: [
            ['민수', '<b>기생충 5</b> · <b>괴물 4</b> · <b>살인의 추억 5</b> · 올드보이 2'],
            ['지영', '<b>기생충 5</b> · <b>살인의 추억 4</b> · <b>추격자 5</b> · <b>올드보이 4</b>'],
            ['준호', '<b>괴물 5</b> · <b>설국열차 4</b> · <b>부산행 5</b> · 기생충 3'],
            ['현우', '<b>기생충 4</b> · <b>살인의 추억 5</b> · <b>추격자 4</b> · <b>쉬리 4</b>'],
            ['서연', '<b>부산행 4</b> · <b>설국열차 5</b> · <b>괴물 4</b>'],
            ['다은', '<b>올드보이 5</b> · <b>추격자 4</b> · 쉬리 3']
          ], caption: '표 8-2. 이번 교시의 평점 데이터 (사용자 6명 · 영화 8편)' },
          { type: 'p', html: '그래프로 보면 사용자와 영화가 "좋아함" 선으로 이어져 있고, 두 사용자가 <b>같은 영화(공통 이웃)</b>에 많이 이어져 있을수록 취향이 비슷합니다. 비슷함을 재는 방법은 두 가지입니다.' },
          { type: 'list', items: [
            '<b>공통 이웃 수</b> = |A ∩ B| — 두 사람이 함께 좋아한 영화의 수. 간단하지만, 영화를 아주 많이 본 사람은 누구와도 공통 영화가 많아서 "모두와 비슷한 사람" 이 되어 버립니다.',
            '<b>자카드 유사도(Jaccard)</b> = |A ∩ B| ÷ |A ∪ B| — 함께 좋아한 영화 수를 <b>둘 중 누구라도 좋아한 영화 수</b>로 나눕니다. 0(겹침 없음) ~ 1(완전히 같음) 사이 값이라 많이 본 사람에게 유리하지 않습니다.'
          ] },
          { type: 'figure', html: FIG_JACCARD, caption: '그림 8-5. 민수와 지영이 좋아한 영화. 겹치는 부분(∩)은 2편, 둘 중 누구라도 좋아한 영화(∪)는 5편이므로 자카드 유사도는 2 / 5 = 0.4 입니다.' },
          { type: 'code', title: '예제 8-5. 자카드 유사도로 비슷한 사람 찾기', code: `import pandas as pd
import matplotlib.pyplot as plt

ratings = {
    '민수': {'기생충': 5, '괴물': 4, '살인의 추억': 5, '올드보이': 2},
    '지영': {'기생충': 5, '살인의 추억': 4, '추격자': 5, '올드보이': 4},
    '준호': {'괴물': 5, '설국열차': 4, '부산행': 5, '기생충': 3},
    '현우': {'기생충': 4, '살인의 추억': 5, '추격자': 4, '쉬리': 4},
    '서연': {'부산행': 4, '설국열차': 5, '괴물': 4},
    '다은': {'올드보이': 5, '추격자': 4, '쉬리': 3},
}
# 4점 이상 = 좋아함 (사람 -> 좋아한 영화 집합)
likes = {u: {m for m, s in r.items() if s >= 4} for u, r in ratings.items()}

def jaccard(a, b):
    union = a | b
    return len(a & b) / len(union) if union else 0.0

me = '민수'
print(me, '가 좋아한 영화:', sorted(likes[me]))
rows = []
for other in likes:
    if other != me:
        common = likes[me] & likes[other]
        rows.append({'사람': other, '공통 이웃 수': len(common),
                     '자카드': round(jaccard(likes[me], likes[other]), 2),
                     '함께 좋아한 영화': ', '.join(sorted(common))})
df = pd.DataFrame(rows).sort_values('자카드', ascending=False, kind='stable')
display(df)

# 모든 사람 쌍의 자카드 유사도 표 (히트맵)
users = list(likes)
sim = pd.DataFrame([[jaccard(likes[a], likes[b]) for b in users] for a in users],
                   index=users, columns=users)
plt.figure(figsize=(6, 5))
plt.imshow(sim, cmap='Blues', vmin=0, vmax=1)
plt.xticks(range(len(users)), users)
plt.yticks(range(len(users)), users)
for i in range(len(users)):
    for j in range(len(users)):
        plt.text(j, i, f'{sim.iloc[i, j]:.2f}', ha='center', va='center')
plt.title('사용자 사이의 자카드 유사도')
plt.colorbar()
plt.show()`,
            desc: '<code>a &amp; b</code> 는 교집합(둘 다), <code>a | b</code> 는 합집합(둘 중 하나라도)입니다. 표를 보면 민수와 가장 비슷한 사람은 <b>지영 · 현우(0.4)</b> 입니다. 히트맵의 대각선이 모두 1.00 인 것은 "자기 자신과는 완전히 같다" 는 뜻이고, 준호 – 서연(1.00, 좋아한 영화가 똑같음)처럼 민수와 상관없는 비슷한 쌍도 한눈에 보입니다.' },

          { type: 'h', text: '협업 필터링: 비슷한 사람이 좋아한 다른 영화 추천하기' },
          { type: 'p', html: '이제 추천을 만듭니다. 생각은 간단합니다. "<b>나와 같은 영화를 좋아한 사람이 좋아한 다른 영화</b>" 를 추천하는 것입니다. 여러 사람의 취향을 함께(협업) 이용해 걸러 낸다(필터링)고 해서 <b>협업 필터링(collaborative filtering)</b> 이라고 부릅니다. 쇼핑몰의 "이 상품을 구매한 분들이 함께 본 상품" 이 바로 이것입니다.' },
          { type: 'figure', html: FIG_CF, caption: '그림 8-6. 협업 필터링은 그래프에서 <b>세 걸음</b> 경로입니다. 민수 → (좋아한 영화) ← 지영 → (지영이 좋아한 다른 영화). 마지막 영화를 민수가 아직 보지 않았다면 추천합니다.' },
          { type: 'list', ordered: true, items: [
            '나와 다른 모든 사람의 <b>자카드 유사도</b>를 계산합니다.',
            '유사도가 가장 높은 사람 <b>k 명</b>(여기서는 2명)을 고릅니다.',
            '그 사람들이 좋아한 영화 중 <b>내가 아직 평점을 남기지 않은</b> 영화를 모읍니다.',
            '영화마다 "추천해 준 사람들의 유사도" 를 더해 <b>추천 점수</b>로 삼고, 높은 순으로 정렬합니다.'
          ] },
          { type: 'code', title: '예제 8-6. 자카드 유사도 기반 영화 추천', code: `ratings = {
    '민수': {'기생충': 5, '괴물': 4, '살인의 추억': 5, '올드보이': 2},
    '지영': {'기생충': 5, '살인의 추억': 4, '추격자': 5, '올드보이': 4},
    '준호': {'괴물': 5, '설국열차': 4, '부산행': 5, '기생충': 3},
    '현우': {'기생충': 4, '살인의 추억': 5, '추격자': 4, '쉬리': 4},
    '서연': {'부산행': 4, '설국열차': 5, '괴물': 4},
    '다은': {'올드보이': 5, '추격자': 4, '쉬리': 3},
}
likes = {u: {m for m, s in r.items() if s >= 4} for u, r in ratings.items()}

def jaccard(a, b):
    return len(a & b) / len(a | b) if a | b else 0.0

def recommend(me, k=2):
    # ① 나와 다른 사람의 유사도
    sims = {u: jaccard(likes[me], likes[u]) for u in likes if u != me}
    # ② 가장 비슷한 k 명 (유사도 0 은 제외)
    top = [u for u in sorted(sims, key=sims.get, reverse=True) if sims[u] > 0][:k]
    print(f'[{me}] 비슷한 사람:', [(u, round(sims[u], 2)) for u in top])
    # ③④ 그들이 좋아했고, 내가 아직 안 본 영화에 유사도를 더한다
    scores, why = {}, {}
    for u in top:
        for movie in sorted(likes[u] - set(ratings[me])):
            scores[movie] = scores.get(movie, 0) + sims[u]
            why.setdefault(movie, []).append(u)
    result = sorted(scores.items(), key=lambda x: -x[1])
    for rank, (movie, sc) in enumerate(result, 1):
        print(f'  {rank}. {movie}  (점수 {sc:.2f}, 추천한 사람: {why[movie]})')
    return result

recommend('민수')
recommend('서연')`,
            expect: "[민수] 비슷한 사람: [('지영', 0.4), ('현우', 0.4)]\n  1. 추격자  (점수 0.80, 추천한 사람: ['지영', '현우'])\n  2. 쉬리  (점수 0.40, 추천한 사람: ['현우'])\n[서연] 비슷한 사람: [('준호', 1.0), ('민수', 0.2)]\n  1. 기생충  (점수 0.20, 추천한 사람: ['민수'])\n  2. 살인의 추억  (점수 0.20, 추천한 사람: ['민수'])",
            desc: '민수에게는 비슷한 두 사람이 모두 좋아한 <b>추격자</b>가 1위입니다. 올드보이는 지영이 좋아했지만 민수가 이미 2점을 주었으므로(= 이미 봄) 빠졌습니다. 서연과 취향이 똑같은(유사도 1.0) 준호가 좋아한 영화는 서연이 이미 다 봤기 때문에, 두 번째로 비슷한 민수의 영화가 추천되었습니다. <code>why</code> 처럼 <b>추천 이유</b>를 함께 보여 주면 사용자가 추천을 더 믿게 됩니다.' },
          { type: 'p', html: '같은 추천을 Neo4j 에서 해 봅시다. 먼저 평점 그래프를 만듭니다. 사용자 이름은 5차시 친구 그래프와 같으므로 <code>MERGE</code> 로 기존 <code>User</code> 노드를 재사용합니다.' },
          { type: 'code', title: 'Cypher 8-2. 사용자 – 영화 평점 그래프 만들기 (Neo4j Browser 에서 실행)', run: false, code: `UNWIND [
  ['민수', '기생충', 5], ['민수', '괴물', 4], ['민수', '살인의 추억', 5], ['민수', '올드보이', 2],
  ['지영', '기생충', 5], ['지영', '살인의 추억', 4], ['지영', '추격자', 5], ['지영', '올드보이', 4],
  ['준호', '괴물', 5], ['준호', '설국열차', 4], ['준호', '부산행', 5], ['준호', '기생충', 3],
  ['현우', '기생충', 4], ['현우', '살인의 추억', 5], ['현우', '추격자', 4], ['현우', '쉬리', 4],
  ['서연', '부산행', 4], ['서연', '설국열차', 5], ['서연', '괴물', 4],
  ['다은', '올드보이', 5], ['다은', '추격자', 4], ['다은', '쉬리', 3]
] AS row
MERGE (u:User {name: row[0]})
MERGE (m:Movie {title: row[1]})
MERGE (u)-[r:RATED]->(m)
SET r.score = row[2]`,
            desc: '평점은 관계의 속성 <code>score</code> 에 넣습니다. 관계 패턴에는 속성을 넣지 않고 <code>SET</code> 으로 따로 정하면, 같은 문장을 다시 실행해도 관계가 두 개로 늘지 않습니다 (5차시 MERGE 주의점).' },
          { type: 'code', title: 'Cypher 8-3. 가장 단순한 협업 필터링 추천 (Neo4j Browser 에서 실행)', run: false, code: `// 나와 같은 영화를 좋아한 사람이 좋아한 다른 영화
MATCH (me:User {name: '민수'})-[r1:RATED]->(m:Movie)<-[r2:RATED]-(other:User),
      (other)-[r3:RATED]->(rec:Movie)
WHERE r1.score >= 4 AND r2.score >= 4 AND r3.score >= 4
  AND NOT EXISTS { (me)-[:RATED]->(rec) }       // 내가 아직 안 본 영화만
RETURN rec.title AS 추천영화,
       count(DISTINCT other) AS 추천한사람수,
       collect(DISTINCT other.name) AS 누가
ORDER BY 추천한사람수 DESC`,
            desc: '그림 8-6 의 세 걸음 경로를 그대로 MATCH 패턴으로 쓴 것입니다. 결과: <b>추격자</b>(지영 · 현우 2명), <b>쉬리</b>(현우 1명). 이 간단한 버전은 공통 영화가 1편뿐인 준호의 영화(설국열차 · 부산행)까지 함께 나옵니다. 유사도로 사람을 걸러 내야 하는 이유입니다.' },
          { type: 'code', title: 'Cypher 8-4. 자카드 유사도로 비슷한 2명을 골라 추천 (Neo4j Browser 에서 실행)', run: false, code: `// ① 내가 좋아한 영화 목록
MATCH (me:User {name: '민수'})-[r:RATED]->(m:Movie) WHERE r.score >= 4
WITH me, collect(m) AS myLikes
// ② 다른 사람마다 좋아한 영화 목록
MATCH (other:User)-[r2:RATED]->(m2:Movie) WHERE other <> me AND r2.score >= 4
WITH me, myLikes, other, collect(m2) AS otherLikes
// ③ 자카드 = 교집합 / 합집합
WITH me, other, otherLikes, size([x IN myLikes WHERE x IN otherLikes]) AS inter,
     size(myLikes) + size(otherLikes) AS total
WITH me, other, otherLikes, toFloat(inter) / (total - inter) AS jaccard
WHERE jaccard > 0
ORDER BY jaccard DESC LIMIT 2
// ④ 그들이 좋아했고 내가 안 본 영화에 유사도 더하기
UNWIND otherLikes AS rec
WITH me, rec, other, jaccard
WHERE NOT EXISTS { (me)-[:RATED]->(rec) }
RETURN rec.title AS 추천영화, round(sum(jaccard), 2) AS 점수,
       collect(other.name) AS 근거
ORDER BY 점수 DESC`,
            desc: '예제 8-6 의 ①~④ 단계를 <code>WITH</code> 로 한 단계씩 이어 붙였습니다. 합집합 크기는 <b>|A| + |B| − |A ∩ B|</b> 로 계산합니다. 결과는 Python 과 똑같이 <b>추격자 0.8</b>, <b>쉬리 0.4</b> 입니다. 긴 질의는 이처럼 <b>Python 으로 먼저 생각을 정리한 뒤</b> Cypher 로 옮기면 훨씬 쉽습니다.' },
          { type: 'callout', kind: 'warn', title: '협업 필터링의 약점', html: '① <b>새 사용자 문제(콜드 스타트)</b>: 평점이 하나도 없는 사람은 비슷한 사람을 찾을 수 없습니다 → 처음에는 인기 영화나 장르 기반 추천(<code>IN_GENRE</code> 를 따라가기)을 함께 씁니다. ② <b>인기 쏠림</b>: 많은 사람이 본 영화가 계속 추천됩니다. ③ 평점이 4점 이상인지만 보면 4점과 5점의 차이를 무시합니다 — 더 정교한 방법은 점수 자체를 비교하는 코사인 유사도 등을 씁니다.' },

          { type: 'h', text: '더 알아보기: Neo4j Graph Data Science(GDS) 라이브러리' },
          { type: 'p', html: '오늘 직접 구현한 분석은 원리를 이해하기 위한 것입니다. 노드가 수백만 개인 실제 그래프에서는 Neo4j 가 제공하는 <b>Graph Data Science(GDS)</b> 라이브러리를 씁니다. 페이지랭크 · 루뱅 · 노드 유사도 등 수십 가지 알고리즘이 <code>CALL gds.…</code> 한 줄로 준비되어 있습니다. 사용 순서는 언제나 같습니다: <b>① 분석할 부분을 메모리에 올리기(projection) → ② 알고리즘 실행 → ③ 메모리에서 내리기</b>.' },
          { type: 'code', title: 'Cypher 8-5. GDS 로 페이지랭크 · 루뱅 · 노드 유사도 (GDS 가 설치된 Neo4j 에서 실행)', run: false, code: `// ① 평점 그래프를 메모리에 올리기 (이름: 'ratings')
CALL gds.graph.project('ratings', ['User', 'Movie'],
                       {RATED: {orientation: 'UNDIRECTED'}});

// ② 페이지랭크: 중요한 노드
CALL gds.pageRank.stream('ratings')
YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS n, score
RETURN coalesce(n.name, n.title) AS 노드, round(score, 3) AS 점수
ORDER BY 점수 DESC LIMIT 5;

// ③ 루뱅: 무리(커뮤니티) 번호
CALL gds.louvain.stream('ratings')
YIELD nodeId, communityId
WITH gds.util.asNode(nodeId) AS n, communityId
RETURN communityId AS 무리, collect(coalesce(n.name, n.title)) AS 구성원;

// ④ 노드 유사도(자카드): 사용자끼리만 보기
CALL gds.nodeSimilarity.stream('ratings')
YIELD node1, node2, similarity
WITH gds.util.asNode(node1) AS a, gds.util.asNode(node2) AS b, similarity
WHERE a:User
RETURN a.name AS 사람1, b.name AS 사람2, round(similarity, 2) AS 유사도
ORDER BY 유사도 DESC LIMIT 5;

// ⑤ 다 쓴 그래프는 메모리에서 내리기
CALL gds.graph.drop('ratings');`,
            desc: '<code>.stream</code> 은 결과를 화면에 돌려주기만 하고, <code>.write</code> 를 쓰면 점수를 노드 속성으로 저장합니다 (예: <code>gds.pageRank.write(\'ratings\', {writeProperty: \'pagerank\'})</code>). 이 예는 평점 4점 미만 관계까지 모두 포함하므로 예제 8-5 와 숫자가 조금 다를 수 있습니다.' },
          { type: 'callout', kind: 'more', title: 'GDS 는 어디서 쓸 수 있나요?', html: '<b>Neo4j Desktop</b> 에서는 데이터베이스의 <b>Plugins</b> 탭에서 Graph Data Science 를 설치하면 바로 쓸 수 있습니다. <b>AuraDB 무료 인스턴스</b>에는 GDS 가 들어 있지 않아 위 문장이 "알 수 없는 프로시저" 오류를 냅니다 — 이때는 오늘처럼 Python 으로 계산하거나, 7차시처럼 드라이버로 데이터를 받아 분석하면 됩니다. Python 에서는 <code>networkx</code> 라이브러리(로컬 PC 에서 <code>pip install networkx</code>)의 <code>nx.pagerank</code> · <code>nx.connected_components</code> · <code>nx.jaccard_coefficient</code> 도 많이 씁니다.' },
          { type: 'callout', kind: 'info', teacher: true, title: '수업 준비 · 지도 팁', html: '① 페이지랭크는 식보다 <b>"투표 + 나눠 주기"</b> 비유가 먼저입니다. 칠판에 그림 8-3 을 그리고 학생들에게 첫 반복을 손으로 계산하게 하면(지영: 민수 ½ + 준호 ½ + 현우 ½ + 서연 1 + 하나 1 …) 직관이 생깁니다. ② "하나는 왜 2위?" 를 💬 발문으로 던져 연결 중심성과의 차이를 스스로 말하게 합니다. ③ 예제 8-4 의 마지막 부분(다리 하나로 무리가 합쳐짐)은 루뱅을 소개하는 계기로 씁니다. ④ 자카드에서 "공통 영화 수만 세면 왜 안 되나?" → "1000편 본 사람은 모두와 비슷해진다" 를 끌어냅니다. ⑤ Cypher 8-2 ~ 8-4 는 Neo4j 가 준비된 반에서만 시연하고, 그렇지 않으면 Python 결과와 같다는 점만 짚습니다. GDS 는 소개만 합니다.' }
        ],
        slides: [
          { layout: 'title', title: '그래프 분석과 추천', subtitle: '1교시 · 중심성 · 커뮤니티 · 유사도 · 협업 필터링',
            notes: '<p>💬 "SNS 에서 홍보를 딱 한 사람에게 부탁할 수 있다면 누구에게?" → 팔로워가 많은 사람, 유명한 사람. "넷플릭스는 내가 좋아할 영화를 어떻게 알까?" → 비슷한 사람의 취향. 오늘은 이 두 질문을 그래프로 계산합니다. (3분)</p>' },
          { layout: 'diagram', title: '그래프에게 묻는 세 가지 질문', html: FIG_THREE, caption: '중심성 · 커뮤니티 · 유사도',
            notes: '<p>표 8-1 과 함께 세 분석을 한 줄씩 소개합니다. 오늘은 각각 가장 쉬운 방법(차수 · 페이지랭크 / 연결 요소 / 자카드)을 직접 구현하고, 큰 그래프용 GDS 는 마지막에 소개만 한다고 안내합니다. (2분)</p>' },
          { layout: 'diagram', title: '페이지랭크: 누구에게 받은 표인가', html: FIG_PR, caption: '하나는 1표뿐이지만 2위',
            notes: '<p>먼저 예제 8-1 로 연결 중심성을 보여 준 뒤 이 그림으로 넘어갑니다. 💬 "받은 표가 2개인 다은과 1개인 하나, 누가 더 중요할까?" → 대부분 다은. 예제 8-2 · 8-3 을 실행해 하나가 2위인 것을 확인하고 "누구에게서 받았는가" 를 강조합니다. 감쇠 계수 0.85 는 "15% 는 순간이동" 정도로만 설명합니다. (13분)</p>' },
          { layout: 'code', title: '자카드 유사도로 추천하기', code: `likes = {'민수': {'기생충', '괴물', '살인의 추억'},
         '지영': {'기생충', '살인의 추억', '추격자', '올드보이'},
         '준호': {'괴물', '설국열차', '부산행'},
         '현우': {'기생충', '살인의 추억', '추격자', '쉬리'},
         '다은': {'올드보이', '추격자'}}
rated = {'기생충', '괴물', '살인의 추억', '올드보이'}   # 민수가 이미 본 영화
me = '민수'
sim = {u: len(likes[me] & s) / len(likes[me] | s) for u, s in likes.items() if u != me}
top = sorted(sim, key=sim.get, reverse=True)[:2]
print('비슷한 사람:', [(u, round(sim[u], 2)) for u in top])
score = {}
for u in top:
    for m in likes[u] - rated:
        score[m] = score.get(m, 0) + sim[u]
print('추천:', sorted(score.items(), key=lambda x: -x[1]))`,
            points: ['자카드 = 교집합 ÷ 합집합 (0 ~ 1)', '비슷한 2명이 좋아한 영화 중 <b>안 본 것</b>만', '추천 점수 = 추천한 사람들의 유사도 합'],
            notes: '<p>그림 8-4 연결 요소(예제 8-4)를 먼저 간단히 실행한 뒤 추천으로 넘어갑니다. 슬라이드에서 ▶ 실행 → 추격자 0.8, 쉬리 0.4. 💬 "올드보이는 지영이 좋아했는데 왜 빠졌을까?" → 민수가 이미 봤으니까(2점). 이어 Cypher 8-3 · 8-4 가 같은 생각을 MATCH 경로로 쓴 것임을 보여 줍니다. (17분)</p>' },
          { layout: 'summary', title: '정리', bullets: ['연결 중심성 = 연결 수(차수), 정규화하면 차수 ÷ (n − 1)', '페이지랭크 = 중요한 노드의 표가 더 무겁다 (반복 계산, d = 0.85)', '연결 요소 = 선으로 이어진 무리 (BFS) · 루뱅은 촘촘한 무리', '자카드 = |A ∩ B| ÷ |A ∪ B| → 비슷한 사람의 영화 추천', '큰 그래프는 GDS: gds.pageRank · gds.louvain · gds.nodeSimilarity'],
            notes: '<p>GDS 는 Neo4j Desktop 에 플러그인으로 설치할 수 있고 AuraDB 무료에서는 쓸 수 없다는 점만 짚습니다. 다음 교시 예고: 지금까지 배운 것을 모두 모아 나만의 지식그래프 프로젝트를 만듭니다. 주제를 하나씩 생각해 오라고 합니다. (5분)</p>' }
        ]
      },

      /* ------------------------------------------------------------------ 2교시 */
      {
        id: 'ch08-2',
        title: '미니 프로젝트: 나만의 지식그래프',
        minutes: 50,
        goals: ['프로젝트의 7단계 흐름에 따라 주제 · 질문 · 온톨로지를 정한다', '데이터를 노드 · 관계 표로 준비하고 점검한 뒤 적재한다', '질문을 Cypher 템플릿으로 바꾸고, 키워드로 답하는 Python 질의응답 봇을 만든다', '스키마 그림 · 대표 질의 · 분석 그래프로 결과를 발표한다'],
        flow: [['프로젝트 흐름 · 주제 고르기', 8], ['온톨로지 · 데이터 · 적재', 10], ['질문 → Cypher 템플릿', 10], ['Python 질의응답 봇', 12], ['발표 · GraphRAG · 정리', 10]],
        content: [
          { type: 'h', text: '프로젝트 흐름 한눈에 보기' },
          { type: 'p', html: '마지막 교시입니다. 1차시부터 배운 것을 모두 모아 <b>나만의 지식그래프</b>를 만들어 봅니다. 처음 해 보는 프로젝트는 "무엇부터 해야 할지" 가 가장 막막합니다. 아래 <b>7단계</b>를 순서대로 따라가면 길을 잃지 않습니다.' },
          { type: 'figure', html: FIG_PIPE, caption: '그림 8-7. 지식그래프 프로젝트의 7단계. 6단계에서 질문이 잘 안 풀리면 3단계(설계)로 돌아가 고치는 것이 자연스러운 과정입니다.' },
          { type: 'table', head: ['단계', '할 일', '만들어지는 것', '배운 차시'], rows: [
            ['1. 주제 선정', '내가 잘 알고 좋아하는 분야를 고른다', '주제 한 줄', '1차시'],
            ['2. 질문 정하기', '이 그래프로 답하고 싶은 질문 3 ~ 5개를 적는다', '질문 목록 (역량 질문)', '2차시'],
            ['3. 온톨로지 설계', '클래스(레이블) · 관계 · 속성을 정한다', '스키마 그림', '2차시'],
            ['4. 데이터 준비', '노드 표 · 관계 표(CSV)를 만들고 점검한다', 'nodes.csv · rels.csv', '6차시'],
            ['5. 적재', '제약 조건을 만들고 MERGE 로 넣는다', 'Neo4j 속 그래프', '3 · 6 · 7차시'],
            ['6. 질의 · 분석', '질문을 Cypher 로 바꾸고, 중심성 · 추천 등을 계산한다', '대표 질의 3개 · 분석 결과', '4 · 5 · 7 · 8차시'],
            ['7. 발표', '스키마 · 질의 · 분석 그래프를 보여 준다', '발표 자료 · 질의응답 봇', '8차시']
          ], caption: '표 8-3. 단계별 할 일과 결과물' },

          { type: 'h', text: '1 · 2단계: 주제를 고르고 질문부터 정하기' },
          { type: 'p', html: '좋은 주제는 <b>내가 이미 잘 아는 분야</b>입니다. 데이터를 직접 적어야 하니, 정답을 아는 분야라야 틀린 곳도 금방 찾습니다. 그리고 2차시에서 배운 것처럼 <b>데이터보다 질문을 먼저</b> 정합니다. 질문이 있어야 "어떤 노드와 관계가 필요한지" 가 정해지기 때문입니다.' },
          { type: 'table', head: ['주제 예시', '노드(레이블)', '관계', '답하고 싶은 질문'], rows: [
            ['우리 동네 맛집', 'Restaurant · Food · Area · Person', 'SERVES · LOCATED_IN · LIKES', '역 근처에서 떡볶이를 파는 곳은? 내 친구들이 좋아한 식당은?'],
            ['좋아하는 아이돌', 'Artist · Group · Song · Album', 'MEMBER_OF · SANG · IN_ALBUM · FEATURED', '이 멤버가 참여한 노래는? 두 그룹이 함께 부른 노래는?'],
            ['역사 인물', 'Person · Event · Dynasty · Place', 'TEACHER_OF · TOOK_PART_IN · RULED · BORN_IN', '세종과 같은 시대 인물은? 이 사건에 참여한 사람들의 스승은?'],
            ['도서관 책', 'Book · Author · Topic · Reader', 'WROTE · ABOUT · BORROWED', '이 작가와 같은 주제를 쓴 작가는? 이 책을 빌린 사람이 빌린 다른 책은?'],
            ['영화 (오늘의 예시)', 'Person · Movie · Genre · User', 'ACTED_IN · DIRECTED · IN_GENRE · RATED', '이 영화의 배우는? 이 감독의 영화는? 함께 출연한 배우는?']
          ], caption: '표 8-4. 주제 예시. 처음에는 레이블 3 ~ 4개, 관계 3 ~ 4종류, 노드 20 ~ 50개면 충분합니다.' },
          { type: 'callout', kind: 'tip', title: '좋은 질문의 조건', html: '① <b>관계를 따라가야 답이 나오는 질문</b>이 좋습니다 — "기생충의 개봉 연도는?" 은 표 한 칸이면 되지만, "송강호와 함께 출연한 배우는?" 은 그래프라서 쉽습니다. ② <b>두 걸음 이상</b>의 질문을 하나 이상 넣습니다 (친구의 친구, 같은 장르의 다른 영화). ③ 분석 질문을 하나 넣습니다 — "가장 연결이 많은 배우는?", "나에게 추천할 영화는?".' },

          { type: 'h', text: '3단계: 온톨로지(스키마) 설계' },
          { type: 'p', html: '질문에 나온 <b>명사</b>는 노드(클래스)가 되고, 명사를 잇는 <b>동사</b>는 관계가 됩니다. "배우가 영화에 <u>출연했다</u>" → <code>(:Person)-[:ACTED_IN]->(:Movie)</code>. 오늘의 예시 영화 지식그래프의 스키마는 이렇습니다.' },
          { type: 'figure', html: FIG_SCHEMA, caption: '그림 8-8. 영화 지식그래프의 스키마. 배우와 감독은 같은 <code>Person</code> 클래스로 두고 <b>관계</b>로 역할을 구별합니다 (한 사람이 배우이자 감독일 수도 있으니까요).' },
          { type: 'table', head: ['종류', '이름', '규칙 / 속성'], rows: [
            ['클래스', '<code>Person</code> · <code>Movie</code> · <code>Genre</code> (· <code>User</code>)', '고유 키: Person.name · Movie.title · Genre.name — 유일성 제약 조건'],
            ['관계', '<code>ACTED_IN</code> · <code>DIRECTED</code>', 'Person → Movie'],
            ['관계', '<code>IN_GENRE</code>', 'Movie → Genre (한 영화가 여러 장르 가능)'],
            ['관계', '<code>RATED</code>', 'User → Movie, 속성 <code>score</code> (1 ~ 5) — 추천을 하고 싶을 때'],
          ], caption: '표 8-5. 설계 결과를 표로 정리하기 — 발표 자료에 그대로 들어갑니다.' },

          { type: 'h', text: '4단계: 데이터 준비와 점검' },
          { type: 'p', html: '데이터는 6차시에서 배운 것처럼 <b>노드 표</b>와 <b>관계 표</b> 두 개로 준비하면 적재가 쉽습니다. 손으로 적을 때는 "<b>(주어, 관계, 목적어)</b>" 세 칸짜리 <b>트리플</b>로 적은 뒤 Python 으로 두 표를 만들면 편합니다. 적재 전에 꼭 <b>점검</b>합니다: 노드 수가 충분한가? 같은 이름이 다른 레이블로 들어가지 않았나? 중복된 관계는 없나?' },
          { type: 'code', title: '예제 8-7. 트리플 → 노드 표 · 관계 표 만들고 점검하기', code: `import pandas as pd

DIRECTED = {'봉준호': ['기생충', '괴물', '살인의 추억', '설국열차'],
            '박찬욱': ['올드보이', '헤어질 결심'], '나홍진': ['추격자']}
ACTED_IN = {'기생충': ['송강호', '이선균', '조여정'], '괴물': ['송강호', '배두나', '박해일'],
            '살인의 추억': ['송강호', '김상경', '박해일'], '설국열차': ['송강호'],
            '올드보이': ['최민식', '유지태'], '헤어질 결심': ['박해일', '탕웨이'],
            '추격자': ['김윤석', '하정우', '김윤석']}          # 실수로 김윤석을 두 번 적음
GENRE = {'기생충': ['드라마', '스릴러'], '괴물': ['SF'], '살인의 추억': ['범죄'],
         '설국열차': ['SF'], '올드보이': ['스릴러'], '헤어질 결심': ['로맨스'], '추격자': ['스릴러']}

triples = ([(p, 'DIRECTED', m) for p, ms in DIRECTED.items() for m in ms]
           + [(a, 'ACTED_IN', m) for m, ps in ACTED_IN.items() for a in ps]
           + [(m, 'IN_GENRE', g) for m, gs in GENRE.items() for g in gs])

# 관계 종류 -> (주어 레이블, 목적어 레이블)
LABEL = {'DIRECTED': ('Person', 'Movie'), 'ACTED_IN': ('Person', 'Movie'),
         'IN_GENRE': ('Movie', 'Genre')}
rels = pd.DataFrame(triples, columns=['source', 'type', 'target'])
node_rows = []
for s, t, o in triples:
    node_rows += [(s, LABEL[t][0]), (o, LABEL[t][1])]
nodes = pd.DataFrame(node_rows, columns=['name', 'label']).drop_duplicates()

print('[점검]')
print('① 노드', len(nodes), '개 / 관계', len(rels), '개')
print('② 레이블별:', nodes['label'].value_counts().to_dict())
clash = nodes[nodes['name'].duplicated()]['name'].tolist()
print('③ 두 레이블에 들어간 이름:', clash if clash else '없음')
print('④ 중복 관계:', int(rels.duplicated().sum()), '개 -> 지웁니다')
rels = rels.drop_duplicates().reset_index(drop=True)
print('⑤ 노드 20개 이상?', '통과' if len(nodes) >= 20 else '부족')
print('⑥ 최종 관계 수:', len(rels))

nodes.to_csv('nodes.csv', index=False)
rels.to_csv('rels.csv', index=False)
print('nodes.csv, rels.csv 저장 완료')
display(rels.sample(5, random_state=42))`,
            desc: '딕셔너리 세 개로 적으면 트리플 수십 개도 금방 만들어집니다. 점검 ④ 에서 <b>일부러 넣은 실수</b>(김윤석 두 번)가 잡혔습니다. 점검 ③ 은 "기생충" 이 영화이면서 실수로 사람으로도 들어간 경우를 잡아냅니다. 저장한 CSV 는 6차시의 <code>LOAD CSV</code> 나 7차시의 드라이버로 적재할 수 있습니다.' },

          { type: 'h', text: '5단계: Neo4j 에 적재하기' },
          { type: 'p', html: '7차시의 <code>UNWIND $rows</code> 방법으로 두 CSV 를 한 번에 넣습니다. 먼저 <b>유일성 제약 조건</b>을 만들어 같은 노드가 두 번 생기지 않게 하고, 노드를 넣은 다음 관계를 넣습니다 (관계는 양 끝 노드가 있어야 만들 수 있으니까요).' },
          { type: 'code', title: '예제 8-8. 노드 · 관계 CSV 를 Neo4j 에 적재하기 (로컬 PC 에서 실행)', run: false, code: `import os
import pandas as pd
from dotenv import load_dotenv
from neo4j import GraphDatabase

load_dotenv()
URI = os.getenv('NEO4J_URI')
AUTH = (os.getenv('NEO4J_USERNAME'), os.getenv('NEO4J_PASSWORD'))
nodes = pd.read_csv('nodes.csv')
rels = pd.read_csv('rels.csv')

KEY = {'Person': 'name', 'Movie': 'title', 'Genre': 'name'}   # 레이블별 고유 키
REL_QUERY = {
    'ACTED_IN': 'MATCH (a:Person {name: row.source}) MATCH (b:Movie {title: row.target}) MERGE (a)-[:ACTED_IN]->(b)',
    'DIRECTED': 'MATCH (a:Person {name: row.source}) MATCH (b:Movie {title: row.target}) MERGE (a)-[:DIRECTED]->(b)',
    'IN_GENRE': 'MATCH (a:Movie {title: row.source}) MATCH (b:Genre {name: row.target}) MERGE (a)-[:IN_GENRE]->(b)',
}

with GraphDatabase.driver(URI, auth=AUTH) as driver:
    for label, key in KEY.items():           # ① 제약 조건 + 노드
        driver.execute_query(f'CREATE CONSTRAINT IF NOT EXISTS FOR (n:{label}) REQUIRE n.{key} IS UNIQUE',
                             database_='neo4j')
        rows = nodes[nodes['label'] == label].to_dict('records')
        driver.execute_query(f'UNWIND $rows AS row MERGE (n:{label} {{{key}: row.name}})',
                             rows=rows, database_='neo4j')
        print(label, len(rows), '개 적재')
    for rtype, query in REL_QUERY.items():  # ② 관계
        rows = rels[rels['type'] == rtype].to_dict('records')
        driver.execute_query('UNWIND $rows AS row ' + query, rows=rows, database_='neo4j')
        print(rtype, len(rows), '개 적재')`,
            desc: '레이블과 관계 종류는 매개변수(<code>$</code>)로 넘길 수 없어서, <b>내가 정한 목록(KEY, REL_QUERY)</b> 에서만 골라 문장에 넣었습니다 — 사용자 입력을 레이블 자리에 붙이면 7차시에서 본 위험이 생깁니다. f-string 안의 <code>{{ }}</code> 는 "중괄호 글자 그대로" 라는 뜻입니다.' },
          { type: 'callout', kind: 'tip', title: '적재 후 꼭 해 볼 확인 질의', html: '<code>MATCH (n) RETURN labels(n) AS 레이블, count(*) AS 개수</code> 로 레이블별 개수가 nodes.csv 와 같은지, <code>CALL db.schema.visualization()</code> 으로 스키마 그림이 설계(그림 8-8)와 같은지 확인합니다. 다르면 4단계로 돌아갑니다.' },

          { type: 'h', text: '6단계: 질문을 Cypher 로 — 템플릿 만들기' },
          { type: 'p', html: '"기생충에 출연한 배우는?" 과 "괴물에 출연한 배우는?" 은 <b>영화 이름만 다른 같은 질문</b>입니다. 그래서 질문 하나하나에 Cypher 를 따로 쓰지 않고, 바뀌는 부분을 <b>빈칸(매개변수)</b>으로 둔 <b>템플릿</b>을 만듭니다. 빈칸은 7차시에서 배운 <code>$movie</code> 같은 매개변수가 됩니다.' },
          { type: 'table', head: ['질문 유형', '질문 틀', 'Cypher 템플릿'], rows: [
            ['출연', '○○ 에 출연한 배우는?', '<code>MATCH (p:Person)-[:ACTED_IN]-&gt;(:Movie {title: $movie}) RETURN p.name</code>'],
            ['감독', '○○ 의 감독은?', '<code>MATCH (p:Person)-[:DIRECTED]-&gt;(:Movie {title: $movie}) RETURN p.name</code>'],
            ['작품', '○○ 이(가) 참여한 영화는?', '<code>MATCH (:Person {name: $person})-[:ACTED_IN|DIRECTED]-&gt;(m:Movie) RETURN m.title</code>'],
            ['장르', '○○ 장르 영화는?', '<code>MATCH (m:Movie)-[:IN_GENRE]-&gt;(:Genre {name: $genre}) RETURN m.title</code>'],
            ['함께', '○○ 와(과) 함께 출연한 배우는?', '<code>MATCH (:Person {name: $person})-[:ACTED_IN]-&gt;(:Movie)&lt;-[:ACTED_IN]-(co) RETURN DISTINCT co.name</code>']
          ], caption: '표 8-6. 질문 틀 ↔ Cypher 템플릿. ○○ 자리가 매개변수가 됩니다.' },
          { type: 'code', title: '예제 8-9. 질문 템플릿에 값 채워 Cypher 만들기', code: `TEMPLATES = {
    '출연': ('{movie}에 출연한 배우는?',
             'MATCH (p:Person)-[:ACTED_IN]->(:Movie {title: $movie}) RETURN p.name AS 배우'),
    '감독': ('{movie}의 감독은?',
             'MATCH (p:Person)-[:DIRECTED]->(:Movie {title: $movie}) RETURN p.name AS 감독'),
    '작품': ('{person}이(가) 참여한 영화는?',
             'MATCH (:Person {name: $person})-[:ACTED_IN|DIRECTED]->(m:Movie) RETURN m.title AS 영화'),
    '장르': ('{genre} 장르 영화는?',
             'MATCH (m:Movie)-[:IN_GENRE]->(:Genre {name: $genre}) RETURN m.title AS 영화'),
    '함께': ('{person}와(과) 함께 출연한 배우는?',
             'MATCH (:Person {name: $person})-[:ACTED_IN]->(:Movie)<-[:ACTED_IN]-(co:Person) '
             'RETURN DISTINCT co.name AS 배우'),
}

asks = [('출연', {'movie': '기생충'}),
        ('작품', {'person': '박해일'}),
        ('함께', {'person': '송강호'})]

for kind, params in asks:
    question, cypher = TEMPLATES[kind]
    print('질문  :', question.format(**params))   # 사람이 읽는 문장
    print('Cypher:', cypher)                       # 모양이 고정된 문장
    print('값    :', params)                       # execute_query(cypher, **params)
    print()`,
            expect: "질문  : 기생충에 출연한 배우는?\nCypher: MATCH (p:Person)-[:ACTED_IN]->(:Movie {title: $movie}) RETURN p.name AS 배우\n값    : {'movie': '기생충'}\n\n질문  : 박해일이(가) 참여한 영화는?\nCypher: MATCH (:Person {name: $person})-[:ACTED_IN|DIRECTED]->(m:Movie) RETURN m.title AS 영화\n값    : {'person': '박해일'}\n\n질문  : 송강호와(과) 함께 출연한 배우는?\nCypher: MATCH (:Person {name: $person})-[:ACTED_IN]->(:Movie)<-[:ACTED_IN]-(co:Person) RETURN DISTINCT co.name AS 배우\n값    : {'person': '송강호'}",
            desc: '질문 문장의 <code>{movie}</code> 는 Python 의 <code>format</code> 이 채우고, Cypher 의 <code>$movie</code> 는 Neo4j 가 채웁니다. Cypher 문장은 <b>절대 format 으로 채우지 않는다</b>는 점이 중요합니다 (7차시의 매개변수 원칙). 실제로는 <code>driver.execute_query(cypher, **params)</code> 로 실행합니다.' },
          { type: 'code', title: 'Cypher 8-6. 발표용 대표 질의 3개 예시 (Neo4j Browser 에서 실행)', run: false, code: `// Q1. 한 걸음: 봉준호 감독의 영화와 장르는?
MATCH (:Person {name: '봉준호'})-[:DIRECTED]->(m:Movie)-[:IN_GENRE]->(g:Genre)
RETURN m.title AS 영화, collect(g.name) AS 장르;

// Q2. 두 걸음: 송강호와 함께 출연한 배우와 함께한 횟수는?
MATCH (:Person {name: '송강호'})-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(co:Person)
RETURN co.name AS 배우, count(m) AS 횟수, collect(m.title) AS 영화
ORDER BY 횟수 DESC;

// Q3. 분석: 가장 많은 영화에 참여한 사람 TOP 3 (연결 중심성)
MATCH (p:Person)
RETURN p.name AS 이름, COUNT { (p)-[:ACTED_IN|DIRECTED]->(:Movie) } AS 참여작
ORDER BY 참여작 DESC LIMIT 3;`,
            desc: '대표 질의는 <b>한 걸음 · 두 걸음 · 분석</b>을 하나씩 고르면 지식그래프의 장점이 잘 드러납니다. Q2 결과에서 박해일이 2회(괴물 · 살인의 추억)로 1위입니다. Q3 은 1교시의 연결 중심성을 Cypher 로 쓴 것입니다.' },

          { type: 'h', text: 'Python 으로 질의응답 봇 만들기' },
          { type: 'p', html: '이제 질문을 <b>문장으로 입력하면 답해 주는 봇</b>을 만듭니다. 어려운 인공지능 없이도 두 가지 요령이면 충분합니다. ① 질문에 들어 있는 <b>키워드</b>("출연", "감독", "함께")로 <b>질문 유형</b>을 고르고, ② 지식그래프에 있는 <b>이름</b>(영화 · 사람 · 장르)이 질문에 들어 있는지 찾아 빈칸을 채웁니다. 그다음은 템플릿대로 그래프를 따라가면 됩니다.' },
          { type: 'figure', html: FIG_QA, caption: '그림 8-9. 키워드 기반 질의응답 봇의 흐름. ③ 단계를 이 페이지에서는 Python 트리플 검색으로, Neo4j 에서는 예제 8-9 의 Cypher 템플릿으로 합니다.' },
          { type: 'code', title: '예제 8-10. 영화 지식그래프 질의응답 봇 (input 사용)', stdin: '기생충에 출연한 배우는?\n괴물 감독은 누구야?\n박해일이 나온 영화 알려줘\n스릴러 영화는?\n송강호와 함께 출연한 배우는?\n오늘 날씨 어때?\n그만\n', code: `DIRECTED = {'봉준호': ['기생충', '괴물', '살인의 추억', '설국열차'],
            '박찬욱': ['올드보이', '헤어질 결심'], '나홍진': ['추격자']}
ACTED_IN = {'기생충': ['송강호', '이선균', '조여정'], '괴물': ['송강호', '배두나', '박해일'],
            '살인의 추억': ['송강호', '김상경', '박해일'], '설국열차': ['송강호'],
            '올드보이': ['최민식', '유지태'], '헤어질 결심': ['박해일', '탕웨이'],
            '추격자': ['김윤석', '하정우']}
GENRE = {'기생충': ['드라마', '스릴러'], '괴물': ['SF'], '살인의 추억': ['범죄'],
         '설국열차': ['SF'], '올드보이': ['스릴러'], '헤어질 결심': ['로맨스'], '추격자': ['스릴러']}
triples = ([(p, 'DIRECTED', m) for p, ms in DIRECTED.items() for m in ms]
           + [(a, 'ACTED_IN', m) for m, ps in ACTED_IN.items() for a in ps]
           + [(m, 'IN_GENRE', g) for m, gs in GENRE.items() for g in gs])

movies = set(GENRE)
people = {s for s, p, o in triples if p in ('DIRECTED', 'ACTED_IN')}
genres = {o for s, p, o in triples if p == 'IN_GENRE'}

def find(names, text):                  # 질문 속 이름 찾기 (긴 이름부터)
    for n in sorted(names, key=len, reverse=True):
        if n in text:
            return n
    return None

def objs(s, rel):                       # s -[rel]-> ?
    return [o for a, p, o in triples if a == s and p == rel]

def subjs(rel, o):                      # ? -[rel]-> o
    return [a for a, p, b in triples if p == rel and b == o]

def answer(q):
    movie, person, genre = find(movies, q), find(people, q), find(genres, q)
    if '함께' in q and person:
        co = []
        for m in objs(person, 'ACTED_IN'):
            co += [a for a in subjs('ACTED_IN', m) if a != person and a not in co]
        return f'{person}와(과) 함께 출연한 배우: ' + ', '.join(co)
    if ('출연' in q or '배우' in q) and movie:
        return f'{movie}에 출연한 배우: ' + ', '.join(subjs('ACTED_IN', movie))
    if '감독' in q and movie:
        return f'{movie}의 감독: ' + ', '.join(subjs('DIRECTED', movie))
    if genre:
        return f'{genre} 영화: ' + ', '.join(subjs('IN_GENRE', genre))
    if person:
        works = objs(person, 'ACTED_IN') + objs(person, 'DIRECTED')
        return f'{person}이(가) 참여한 영화: ' + ', '.join(works)
    return '아직 이해하지 못한 질문이에요. 예) 기생충에 출연한 배우는?'

print('영화 지식그래프 봇입니다. 끝내려면 "그만" 을 입력하세요.')
while True:
    q = input('질문> ')
    if q.strip() in ('그만', ''):
        print('봇: 안녕히 가세요!')
        break
    print('봇:', answer(q))`,
            desc: '<b>규칙의 순서</b>가 중요합니다. "송강호와 함께 출연한 배우는?" 에는 "출연" 도 들어 있으므로, 더 구체적인 "함께" 규칙을 먼저 검사합니다. <code>find</code> 가 <b>긴 이름부터</b> 찾는 것도 같은 이유입니다 (예: "살인의 추억" 안에 다른 짧은 이름이 들어 있을 때). 오른쪽 결과 창에서 직접 질문을 바꿔 입력해 보세요.' },
          { type: 'callout', kind: 'tip', title: '봇을 더 똑똑하게 만드는 아이디어', html: '① <b>같은 뜻의 키워드</b>를 묶기: <code>{\'출연\': [\'출연\', \'나온\', \'배우\']}</code>. ② 찾은 이름이 없으면 <b>비슷한 이름 추천</b>: <code>difflib.get_close_matches(\'기생\', movies)</code>. ③ Neo4j 에 연결하면 <code>answer</code> 안의 트리플 검색을 예제 8-9 의 템플릿 + <code>execute_query</code> 로 바꾸기만 하면 됩니다. ④ 1교시의 <code>recommend</code> 를 "추천" 키워드에 연결하면 추천 봇이 됩니다.' },
          { type: 'callout', kind: 'warn', title: '키워드 봇의 한계', html: '"기생충 말고 다른 봉준호 영화는?" 처럼 부정이나 조건이 섞인 질문, 이름을 줄여 쓴 질문("기생충 감독님 성함"은 되지만 "봉감독 영화"는 안 됨)은 처리하지 못합니다. 이런 자연스러운 질문을 다루는 방법이 아래 <b>GraphRAG</b> 입니다.' },

          { type: 'h', text: '7단계: 결과 발표하기' },
          { type: 'p', html: '발표는 5분 정도로 짧게, 아래 <b>세 가지</b>를 꼭 보여 줍니다.' },
          { type: 'list', ordered: true, items: [
            '<b>스키마 그림</b> — 그림 8-8 처럼 클래스와 관계를 한 장에 (<code>CALL db.schema.visualization()</code> 화면을 캡처해도 됩니다). 노드 · 관계 수도 함께 적습니다.',
            '<b>대표 질의 3개</b> — 질문 문장, Cypher, 결과 화면을 나란히 (Cypher 8-6 처럼 한 걸음 · 두 걸음 · 분석).',
            '<b>분석 결과 그래프</b> — 연결 중심성 순위, 추천 결과 등을 matplotlib 막대그래프로. 그리고 질의응답 봇 시연!'
          ] },
          { type: 'code', title: '예제 8-11. 발표용 분석 그래프 만들기', code: `import pandas as pd
import matplotlib.pyplot as plt

DIRECTED = {'봉준호': ['기생충', '괴물', '살인의 추억', '설국열차'],
            '박찬욱': ['올드보이', '헤어질 결심'], '나홍진': ['추격자']}
ACTED_IN = {'기생충': ['송강호', '이선균', '조여정'], '괴물': ['송강호', '배두나', '박해일'],
            '살인의 추억': ['송강호', '김상경', '박해일'], '설국열차': ['송강호'],
            '올드보이': ['최민식', '유지태'], '헤어질 결심': ['박해일', '탕웨이'],
            '추격자': ['김윤석', '하정우']}
GENRE = {'기생충': ['드라마', '스릴러'], '괴물': ['SF'], '살인의 추억': ['범죄'],
         '설국열차': ['SF'], '올드보이': ['스릴러'], '헤어질 결심': ['로맨스'], '추격자': ['스릴러']}
triples = ([(p, 'DIRECTED', m) for p, ms in DIRECTED.items() for m in ms]
           + [(a, 'ACTED_IN', m) for m, ps in ACTED_IN.items() for a in ps]
           + [(m, 'IN_GENRE', g) for m, gs in GENRE.items() for g in gs])
rels = pd.DataFrame(triples, columns=['source', 'type', 'target'])

# ① 사람별 참여 영화 수 (연결 중심성)
people = rels[rels['type'] != 'IN_GENRE']
top = people['source'].value_counts().head(6)
# ② 장르별 영화 수
genre_count = rels[rels['type'] == 'IN_GENRE']['target'].value_counts()

print('노드', len(set(rels['source']) | set(rels['target'])), '개 · 관계', len(rels), '개')
print('참여작 TOP 3:', top.head(3).to_dict())
print('장르별 영화 수:', genre_count.to_dict())

fig, axes = plt.subplots(1, 2, figsize=(10, 4))
axes[0].barh(top.index[::-1], top.values[::-1], color='#4C78A8')
axes[0].set_title('사람별 참여 영화 수 (연결 중심성)')
axes[1].bar(genre_count.index, genre_count.values, color='#F58518')
axes[1].set_title('장르별 영화 수')
plt.tight_layout()
plt.show()`,
            desc: '<code>value_counts()</code> 는 같은 값이 몇 번 나오는지 세어 많은 순으로 정렬합니다. 사람이 관계의 <code>source</code> 에 몇 번 나오는지 세면 그대로 <b>연결 중심성(차수)</b>이 됩니다. 가로 막대(<code>barh</code>)는 이름이 긴 항목을 보여 주기 좋고, <code>[::-1]</code> 로 뒤집어 1위가 위에 오게 했습니다.' },
          { type: 'table', head: ['점검 항목', '확인'], rows: [
            ['노드 20개 이상, 레이블 3개 이상, 관계 종류 3개 이상인가?', '☐'],
            ['스키마 그림에 클래스 · 관계 · 주요 속성이 모두 있는가?', '☐'],
            ['질문 3개가 각각 Cypher 질의와 결과 화면으로 연결되는가? (두 걸음 질의 1개 이상)', '☐'],
            ['분석 결과(중심성 · 추천 등) 그래프가 1개 이상 있는가?', '☐'],
            ['질의응답 봇이 질문 3개에 답하고, 모르는 질문에는 안내 문장을 내는가?', '☐'],
            ['데이터의 출처를 밝혔는가? (직접 조사 · 공공데이터 등)', '☐']
          ], caption: '표 8-7. 발표 전 점검표' },

          { type: 'h', text: '더 알아보기: 지식그래프 + 대규모 언어 모델 = GraphRAG' },
          { type: 'p', html: 'ChatGPT 같은 <b>대규모 언어 모델(LLM)</b> 은 자연스러운 문장을 잘 이해하고 잘 만들지만, 모르는 사실을 그럴듯하게 <b>지어내기도</b> 합니다(환각). 반대로 지식그래프는 문장 이해는 서툴지만 <b>정확한 사실</b>을 갖고 있지요. 둘을 합친 것이 <b>GraphRAG</b>(그래프 기반 검색 증강 생성)입니다. 질문과 관련된 사실을 지식그래프에서 <b>먼저 찾아(Retrieval)</b>, 그 사실을 LLM 에게 함께 건네주며 "<b>이 사실만 써서</b> 답해" 라고 부탁합니다.' },
          { type: 'figure', html: FIG_RAG, caption: '그림 8-10. GraphRAG 의 흐름. ① 질문에서 개체를 찾고 ② 지식그래프에서 주변 사실을 꺼내 ③ 질문과 함께 LLM 에 보내면, LLM 은 사실에 근거한 문장으로 답합니다.' },
          { type: 'code', title: '예제 8-12. GraphRAG 의 앞부분: 질문에 맞는 사실 꺼내 프롬프트 만들기', code: `ACTED_IN = {'기생충': ['송강호', '이선균', '조여정'], '괴물': ['송강호', '배두나', '박해일'],
            '살인의 추억': ['송강호', '김상경', '박해일'], '헤어질 결심': ['박해일', '탕웨이'],
            '올드보이': ['최민식', '유지태'], '추격자': ['김윤석', '하정우']}
GENRE = {'기생충': ['드라마', '스릴러'], '괴물': ['SF'], '살인의 추억': ['범죄'],
         '헤어질 결심': ['로맨스'], '올드보이': ['스릴러'], '추격자': ['스릴러']}
triples = ([(a, 'ACTED_IN', m) for m, ps in ACTED_IN.items() for a in ps]
           + [(m, 'IN_GENRE', g) for m, gs in GENRE.items() for g in gs])

question = '박해일이 나온 스릴러 영화가 있나요?'

# ① 질문에서 지식그래프의 개체 찾기
names = {s for s, p, o in triples} | {o for s, p, o in triples}
found = [n for n in sorted(names) if n in question]
print('① 찾은 개체:', found)

# ② 개체와 바로 이어진 사실(1 걸음 이웃) 꺼내기
facts = [(s, p, o) for s, p, o in triples if s in found or o in found]
print('② 꺼낸 사실', len(facts), '개')

# ③ LLM 에게 보낼 글(프롬프트) 만들기
print('③ [LLM 에게 보낼 글]')
print('아래 사실만 사용해서 질문에 답하세요. 사실에 없으면 모른다고 답하세요.')
for s, p, o in facts:
    if p == 'ACTED_IN':
        print(f'- {s}: {o}에 출연했다')
    else:
        print(f'- {s}: 장르는 {o}이다')
print('질문:', question)

# (참고) 사실만으로 확인한 정답
acted = {o for s, p, o in facts if s == '박해일'}
thriller = {s for s, p, o in facts if o == '스릴러'}
print('확인: 박해일 출연작 중 스릴러 =', acted & thriller or '없음')`,
            expect: "① 찾은 개체: ['박해일', '스릴러']\n② 꺼낸 사실 6 개\n③ [LLM 에게 보낼 글]\n아래 사실만 사용해서 질문에 답하세요. 사실에 없으면 모른다고 답하세요.\n- 박해일: 괴물에 출연했다\n- 박해일: 살인의 추억에 출연했다\n- 박해일: 헤어질 결심에 출연했다\n- 기생충: 장르는 스릴러이다\n- 올드보이: 장르는 스릴러이다\n- 추격자: 장르는 스릴러이다\n질문: 박해일이 나온 스릴러 영화가 있나요?\n확인: 박해일 출연작 중 스릴러 = 없음",
            desc: '이 예제는 GraphRAG 의 ①② (검색) 부분과 프롬프트 만들기까지입니다. 실제로는 ③ 의 글을 LLM API 에 보내면 "박해일이 출연한 괴물 · 살인의 추억 · 헤어질 결심은 스릴러가 아니므로, 제공된 정보로는 없습니다." 처럼 <b>근거를 대며</b> 답합니다. 지식그래프에 없는 영화를 지어내지 않게 하는 것이 핵심입니다. Neo4j 에서는 ② 가 <code>MATCH (n)-[r]-(x) WHERE n.name IN $names RETURN …</code> 한 줄입니다.' },
          { type: 'callout', kind: 'more', title: '더 알아보기: GraphRAG 를 더 깊이', html: '실제 GraphRAG 시스템은 ① 개체 찾기에 LLM 자체를 쓰거나, ② LLM 에게 <b>Cypher 를 직접 만들게</b>(Text2Cypher) 한 뒤 실행 결과를 답에 쓰기도 합니다. 이때 1교시의 스키마(그림 8-8)를 LLM 에 함께 알려 주면 정확도가 크게 올라갑니다 — 온톨로지가 사람뿐 아니라 <b>AI 에게도 지도</b> 역할을 하는 셈입니다. Neo4j 는 Python 용 <code>neo4j-graphrag</code> 꾸러미와 벡터 인덱스(문장 의미 검색)도 제공합니다. 이 강좌에서 배운 온톨로지 · Cypher · Python 이 바로 그 기초입니다.' },
          { type: 'callout', kind: 'info', teacher: true, title: '프로젝트 운영 · 평가 루브릭', html: '<b>운영</b>: 이 교시에서는 1 ~ 3단계(주제 · 질문 · 스키마 스케치)와 봇 실행까지 마치고, 4 ~ 7단계는 과제(1주)로 이어 가는 것을 권장합니다. 주제를 못 고르는 학생에게는 표 8-4 의 영화 예시를 자기 취향 영화로 바꾸게 합니다. Neo4j 가 없는 환경이면 Python 트리플 + 봇 + 분석 그래프만으로도 발표할 수 있게 허용합니다.<br><b>루브릭 (각 3점, 총 15점)</b>: ① 설계 — 질문에서 출발한 스키마, 클래스 · 관계 이름이 일관됨 ② 데이터 — 노드 20개 이상, 점검(중복 · 이름 충돌) 수행 ③ 질의 — 질문 3개 모두 정확한 Cypher, 두 걸음 질의 포함 ④ 봇 · 분석 — 봇이 3가지 유형에 답하고 분석 그래프 1개 이상 ⑤ 발표 — 스키마 · 질의 · 그래프를 5분 안에 명확히 설명.<br><b>자주 보는 실수</b>: 배우와 감독을 다른 레이블로 만들어 같은 사람이 두 노드가 됨 / 관계 방향이 섞임(Movie→Person) / 봇에서 "출연" 규칙이 "함께" 규칙보다 먼저 와서 엉뚱한 답.' }
        ],
        slides: [
          { layout: 'title', title: '미니 프로젝트: 나만의 지식그래프', subtitle: '2교시 · 주제 → 질문 → 온톨로지 → 데이터 → 적재 → 질의 · 분석 → 발표',
            notes: '<p>💬 "지금까지 배운 것 중 내 취미에 써 보고 싶은 것은?" 몇 명에게 주제를 물어보고 칠판에 적습니다. 오늘 목표: 주제 · 질문 · 스키마를 정하고 봇을 돌려 보기, 나머지는 과제. (3분)</p>' },
          { layout: 'diagram', title: '프로젝트 7단계', html: FIG_PIPE, caption: '질의가 안 되면 설계로 돌아가기',
            notes: '<p>표 8-3 · 8-4 를 함께 보여 주며 주제를 고르게 합니다(5분). 💬 "좋은 질문의 조건?" → 관계를 따라가야 답이 나오는 질문. 이어 그림 8-8 스키마로 "명사 = 노드, 동사 = 관계" 를 짚고, 예제 8-7 로 점검이 실수를 잡는 모습을 보여 줍니다. 적재(예제 8-8)는 7차시와 같으므로 짧게. (15분)</p>' },
          { layout: 'table', title: '질문 → Cypher 템플릿', head: ['질문 틀', 'Cypher 템플릿'], rows: [
            ['○○ 에 출연한 배우는?', '<code>(p:Person)-[:ACTED_IN]-&gt;(:Movie {title: $movie})</code>'],
            ['○○ 의 감독은?', '<code>(p:Person)-[:DIRECTED]-&gt;(:Movie {title: $movie})</code>'],
            ['○○ 장르 영화는?', '<code>(m:Movie)-[:IN_GENRE]-&gt;(:Genre {name: $genre})</code>'],
            ['○○ 와 함께 출연한 배우는?', '<code>(:Person {name: $person})-[:ACTED_IN]-&gt;()&lt;-[:ACTED_IN]-(co)</code>']
          ], lead: '바뀌는 부분 = 매개변수, 나머지는 고정',
            notes: '<p>예제 8-9 를 실행해 "질문 문장은 format, Cypher 는 $매개변수" 를 강조합니다. 💬 "Cypher 도 format 으로 채우면 안 되나요?" → 7차시의 주입 위험. 학생 주제로 템플릿 하나를 함께 만들어 봅니다. (10분)</p>' },
          { layout: 'code', title: '키워드 질의응답 봇의 핵심', code: `ACTED_IN = {'기생충': ['송강호', '이선균', '조여정'],
            '괴물': ['송강호', '배두나', '박해일'],
            '살인의 추억': ['송강호', '김상경', '박해일']}
people = {p for ps in ACTED_IN.values() for p in ps}

def find(names, text):
    for n in sorted(names, key=len, reverse=True):
        if n in text:
            return n

def answer(q):
    movie, person = find(ACTED_IN, q), find(people, q)
    if '함께' in q and person:
        co = {p for m, ps in ACTED_IN.items() if person in ps for p in ps}
        return sorted(co - {person})
    if '출연' in q and movie:
        return ACTED_IN[movie]
    return '예) 기생충에 출연한 배우는?'

for q in ['기생충에 출연한 배우는?', '박해일과 함께 출연한 배우는?', '안녕?']:
    print(q, '->', answer(q))`,
            points: ['① 키워드로 질문 유형 고르기', '② 그래프 속 이름 찾기 (긴 이름부터)', '구체적인 규칙("함께")을 먼저 검사'],
            notes: '<p>슬라이드에서 ▶ 실행한 뒤, 본문의 예제 8-10 으로 넘어가 input() 으로 직접 질문하게 합니다. 💬 "송강호와 함께 출연한 배우는? 에서 출연 규칙이 먼저 오면?" → 영화를 못 찾아 엉뚱한 답. 시간이 남으면 키워드 동의어 추가를 실습합니다. (12분)</p>' },
          { layout: 'summary', title: '정리 · 강좌를 마치며', bullets: ['프로젝트 7단계: 주제 → 질문 → 온톨로지 → 데이터 → 적재 → 질의 · 분석 → 발표', '질문을 먼저! 명사 = 노드, 동사 = 관계', '질문 틀 → Cypher 템플릿 + $매개변수', '키워드 봇: 유형 고르기 + 이름 찾기 + 그래프 따라가기', '발표: 스키마 그림 · 대표 질의 3개 · 분석 그래프', 'GraphRAG: 지식그래프의 사실 + LLM 의 문장'],
            notes: '<p>예제 8-11 로 발표용 그래프를 보여 주고 표 8-7 점검표를 나눠 줍니다. 그림 8-10 으로 GraphRAG 를 2분 정도 소개하고 "오늘 배운 온톨로지 · Cypher 가 AI 시대의 기초" 라는 말로 강좌를 마무리합니다. 과제: 1주 뒤 5분 발표. (10분)</p>' }
        ]
      }
    ]
  });
})();
