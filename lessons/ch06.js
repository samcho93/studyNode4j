/* 06차시 데이터를 지식그래프로 */
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

  /* 그림 6-1. 원본 CSV 세 개와 그 안의 문제들 */
  const FIG_RAW = `<svg viewBox="0 0 720 370" role="img" aria-label="movies.csv, people.csv, roles.csv 세 파일의 일부 행과, 공백 · 중복 · 빈칸 · 한 칸에 여러 값 · 잘못된 id 같은 문제를 표시한 그림">
  <rect x="10" y="10" width="700" height="140" rx="12" class="card-bg"/>
  <text x="26" y="36" class="tx-b">movies.csv</text>
  <text x="150" y="36" class="tx-m">movie_id, title, released, genres, director_id</text>
  <text x="26" y="62" class="tx">m01,기생충,2019,드라마|스릴러,p04</text>
  <rect x="440" y="47" width="262" height="22" rx="6" class="p4s"/><text x="450" y="63" class="tx">← 한 칸에 장르 두 개</text>
  <text x="26" y="88" class="tx">m03,살인의 추억,2003,범죄 | 드라마, p04</text>
  <rect x="440" y="73" width="262" height="22" rx="6" class="p2s"/><text x="450" y="89" class="tx">← 값 앞뒤에 공백</text>
  <text x="26" y="114" class="tx">m01,기생충,2019,드라마|스릴러,p04</text>
  <rect x="440" y="99" width="262" height="22" rx="6" class="p2s"/><text x="450" y="115" class="tx">← 첫 줄과 똑같은 행 (중복)</text>
  <text x="26" y="140" class="tx">m07,설국열차,,SF|액션,p04</text>
  <rect x="440" y="125" width="262" height="22" rx="6" class="p2s"/><text x="450" y="141" class="tx">← 개봉연도가 빈칸</text>
  <rect x="10" y="160" width="700" height="96" rx="12" class="card-bg"/>
  <text x="26" y="186" class="tx-b">people.csv</text>
  <text x="150" y="186" class="tx-m">person_id, name, born</text>
  <text x="26" y="212" class="tx">p02, 이선균 ,1975</text>
  <rect x="440" y="197" width="262" height="22" rx="6" class="p2s"/><text x="450" y="213" class="tx">← 이름 앞뒤에 공백</text>
  <text x="26" y="238" class="tx">p10,,1990</text>
  <rect x="440" y="223" width="262" height="22" rx="6" class="p2s"/><text x="450" y="239" class="tx">← 필수 속성 name 이 빈칸</text>
  <rect x="10" y="266" width="700" height="96" rx="12" class="card-bg"/>
  <text x="26" y="292" class="tx-b">roles.csv</text>
  <text x="150" y="292" class="tx-m">person_id, movie_id, role   (누가 · 어느 영화에 · 무슨 역으로)</text>
  <text x="26" y="318" class="tx">m02,m01,괴물</text>
  <rect x="440" y="303" width="262" height="22" rx="6" class="p2s"/><text x="450" y="319" class="tx">← 영화가 영화에 출연?!</text>
  <text x="26" y="344" class="tx">p13,m04,</text>
  <rect x="440" y="329" width="262" height="22" rx="6" class="p2s"/><text x="450" y="345" class="tx">← people 에 없는 사람</text>
</svg>`;

  /* 그림 6-2. split 과 explode */
  const FIG_EXPLODE = `<svg viewBox="0 0 720 230" role="img" aria-label="장르 칸 드라마|스릴러 를 split 으로 리스트로 나누고, explode 로 한 행을 두 행으로 펼치는 과정">
  ${ARROW('c06a1')}
  <rect x="10" y="30" width="200" height="34" rx="6" class="card-bg"/>
  <text x="110" y="20" text-anchor="middle" class="tx-b">원본 (1행)</text>
  <text x="22" y="52" class="tx">m01 │ 드라마|스릴러</text>
  <rect x="260" y="30" width="200" height="34" rx="6" class="p4s"/>
  <text x="360" y="20" text-anchor="middle" class="tx-b">split('|') (여전히 1행)</text>
  <text x="272" y="52" class="tx">m01 │ [드라마, 스릴러]</text>
  <rect x="510" y="30" width="200" height="34" rx="6" class="p5s"/>
  <rect x="510" y="68" width="200" height="34" rx="6" class="p5s"/>
  <text x="610" y="20" text-anchor="middle" class="tx-b">explode (2행)</text>
  <text x="522" y="52" class="tx">m01 │ 드라마</text>
  <text x="522" y="90" class="tx">m01 │ 스릴러</text>
  <line x1="212" y1="47" x2="255" y2="47" class="ln" stroke-width="2" marker-end="url(#c06a1)"/>
  <line x1="462" y1="47" x2="505" y2="47" class="ln" stroke-width="2" marker-end="url(#c06a1)"/>
  <line x1="462" y1="55" x2="505" y2="82" class="ln" stroke-width="2" marker-end="url(#c06a1)"/>
  <text x="360" y="140" text-anchor="middle" class="tx">펼친 두 행이 그대로 관계 두 개가 됩니다</text>
  ${circ([250, 195], 28, 'p3', '기생충')}
  ${circ([470, 172], 26, 'p4', '드라마')}
  ${circ([470, 210], 18, 'p4s', '')}
  <text x="470" y="215" text-anchor="middle" class="tx-m">스릴러</text>
  ${edge([250, 195], [470, 172], 28, 'c06a1', '')}
  ${edge([250, 195], [470, 210], 28, 'c06a1', '')}
  <text x="580" y="178" class="tx-m">:IN_GENRE × 2</text>
</svg>`;

  /* 그림 6-3. 표 → 그래프 변환 규칙 */
  const FIG_MAP = `<svg viewBox="0 0 720 330" role="img" aria-label="movies 행은 Movie 노드, people 행은 Person 노드, director_id 외래키는 DIRECTED 관계, genres 여러 값 칸은 Genre 노드와 IN_GENRE 관계, roles 행은 ACTED_IN 관계와 role 속성이 된다">
  ${ARROW('c06a2')}
  <text x="140" y="22" text-anchor="middle" class="tx-b">표 (CSV) 의 무엇이</text>
  <text x="560" y="22" text-anchor="middle" class="tx-b">그래프의 무엇이 되나</text>
  <rect x="10" y="36" width="260" height="46" rx="10" class="card-bg"/>
  <text x="140" y="64" text-anchor="middle" class="tx">movies.csv 의 행 하나</text>
  <rect x="400" y="36" width="310" height="46" rx="10" class="p3"/>
  <text x="555" y="64" text-anchor="middle" class="tx-w">(:Movie {id, title, released})</text>
  <rect x="10" y="94" width="260" height="46" rx="10" class="card-bg"/>
  <text x="140" y="122" text-anchor="middle" class="tx">people.csv 의 행 하나</text>
  <rect x="400" y="94" width="310" height="46" rx="10" class="p1"/>
  <text x="555" y="122" text-anchor="middle" class="tx-w">(:Person {id, name, born})</text>
  <rect x="10" y="152" width="260" height="46" rx="10" class="p4s"/>
  <text x="140" y="180" text-anchor="middle" class="tx">movies.director_id (외래키)</text>
  <rect x="400" y="152" width="310" height="46" rx="10" class="p2"/>
  <text x="555" y="180" text-anchor="middle" class="tx-w">(Person)-[:DIRECTED]→(Movie)</text>
  <rect x="10" y="210" width="260" height="46" rx="10" class="p4s"/>
  <text x="140" y="238" text-anchor="middle" class="tx">movies.genres (여러 값 칸)</text>
  <rect x="400" y="210" width="310" height="46" rx="10" class="p4"/>
  <text x="555" y="230" text-anchor="middle" class="tx-w">(:Genre {id, name}) 노드 +</text>
  <text x="555" y="249" text-anchor="middle" class="tx-w">(Movie)-[:IN_GENRE]→(Genre)</text>
  <rect x="10" y="268" width="260" height="46" rx="10" class="p4s"/>
  <text x="140" y="290" text-anchor="middle" class="tx">roles.csv 의 행 하나</text>
  <text x="140" y="307" text-anchor="middle" class="tx-m">(외래키 두 개 + role 칸)</text>
  <rect x="400" y="268" width="310" height="46" rx="10" class="p5"/>
  <text x="555" y="296" text-anchor="middle" class="tx-w">(Person)-[:ACTED_IN {role}]→(Movie)</text>
  <line x1="274" y1="59" x2="394" y2="59" class="ln" stroke-width="2" marker-end="url(#c06a2)"/><text x="334" y="52" text-anchor="middle" class="tx-m">노드</text>
  <line x1="274" y1="117" x2="394" y2="117" class="ln" stroke-width="2" marker-end="url(#c06a2)"/><text x="334" y="110" text-anchor="middle" class="tx-m">노드</text>
  <line x1="274" y1="175" x2="394" y2="175" class="ln" stroke-width="2" marker-end="url(#c06a2)"/><text x="334" y="168" text-anchor="middle" class="tx-m">관계</text>
  <line x1="274" y1="233" x2="394" y2="233" class="ln" stroke-width="2" marker-end="url(#c06a2)"/><text x="334" y="226" text-anchor="middle" class="tx-m">노드 + 관계</text>
  <line x1="274" y1="291" x2="394" y2="291" class="ln" stroke-width="2" marker-end="url(#c06a2)"/><text x="334" y="284" text-anchor="middle" class="tx-m">관계 + 속성</text>
</svg>`;

  /* 그림 6-4. LOAD CSV 가 일하는 순서 */
  const FIG_LOAD = `<svg viewBox="0 0 720 200" role="img" aria-label="CSV 파일을 한 줄씩 읽어 row 라는 맵으로 만들고, 문자열 값을 형 변환한 뒤, MERGE 로 노드와 관계를 만든다">
  ${ARROW('c06a3')}
  <rect x="10" y="40" width="150" height="90" rx="12" class="card-bg"/>
  <text x="85" y="72" text-anchor="middle" class="tx-b">CSV 파일</text>
  <text x="85" y="96" text-anchor="middle" class="tx-m">URL 또는</text>
  <text x="85" y="114" text-anchor="middle" class="tx-m">import 폴더</text>
  <rect x="195" y="40" width="160" height="90" rx="12" class="p4s"/>
  <text x="275" y="66" text-anchor="middle" class="tx-b">row (한 줄 = 맵)</text>
  <text x="275" y="90" text-anchor="middle" class="tx">{id: 'm01',</text>
  <text x="275" y="110" text-anchor="middle" class="tx"> released: '2019'}</text>
  <rect x="390" y="40" width="150" height="90" rx="12" class="p2s"/>
  <text x="465" y="72" text-anchor="middle" class="tx-b">형 변환</text>
  <text x="465" y="96" text-anchor="middle" class="tx-m">toInteger · toFloat</text>
  <text x="465" y="114" text-anchor="middle" class="tx-m">split · date · trim</text>
  <rect x="575" y="40" width="135" height="90" rx="12" class="p5"/>
  <text x="642" y="72" text-anchor="middle" class="tx-w">MERGE</text>
  <text x="642" y="96" text-anchor="middle" class="tx-w">노드 · 관계</text>
  <text x="642" y="114" text-anchor="middle" class="tx-w">만들기</text>
  <line x1="162" y1="85" x2="190" y2="85" class="ln" stroke-width="2" marker-end="url(#c06a3)"/>
  <line x1="357" y1="85" x2="385" y2="85" class="ln" stroke-width="2" marker-end="url(#c06a3)"/>
  <line x1="542" y1="85" x2="570" y2="85" class="ln" stroke-width="2" marker-end="url(#c06a3)"/>
  <path d="M642 132 L642 170 L85 170 L85 134" class="ln" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#c06a3)"/>
  <text x="363" y="190" text-anchor="middle" class="tx-m">다음 줄로 — 파일 끝까지 반복 (row 의 값은 언제나 문자열!)</text>
</svg>`;

  /* 그림 6-5. 적재 순서 네 단계 */
  const FIG_ORDER = `<svg viewBox="0 0 720 190" role="img" aria-label="적재 순서: 1 제약 조건 만들기, 2 노드 적재, 3 관계 적재, 4 개수와 스키마 확인">
  ${ARROW('c06a4')}
  <rect x="10" y="20" width="160" height="80" rx="12" class="p2"/>
  <text x="90" y="52" text-anchor="middle" class="tx-w">① 제약 조건</text>
  <text x="90" y="76" text-anchor="middle" class="tx-w">id IS UNIQUE</text>
  <rect x="190" y="20" width="160" height="80" rx="12" class="p3"/>
  <text x="270" y="52" text-anchor="middle" class="tx-w">② 노드 적재</text>
  <text x="270" y="76" text-anchor="middle" class="tx-w">MERGE (n {id})</text>
  <rect x="370" y="20" width="160" height="80" rx="12" class="p1"/>
  <text x="450" y="52" text-anchor="middle" class="tx-w">③ 관계 적재</text>
  <text x="450" y="76" text-anchor="middle" class="tx-w">MATCH · MATCH · MERGE</text>
  <rect x="550" y="20" width="160" height="80" rx="12" class="p5"/>
  <text x="630" y="52" text-anchor="middle" class="tx-w">④ 확인</text>
  <text x="630" y="76" text-anchor="middle" class="tx-w">개수 · 스키마</text>
  <line x1="172" y1="60" x2="186" y2="60" class="ln" stroke-width="2" marker-end="url(#c06a4)"/>
  <line x1="352" y1="60" x2="366" y2="60" class="ln" stroke-width="2" marker-end="url(#c06a4)"/>
  <line x1="532" y1="60" x2="546" y2="60" class="ln" stroke-width="2" marker-end="url(#c06a4)"/>
  <text x="90" y="128" text-anchor="middle" class="tx-m">중복을 막고</text>
  <text x="90" y="146" text-anchor="middle" class="tx-m">찾기를 빠르게</text>
  <text x="270" y="128" text-anchor="middle" class="tx-m">관계의 양 끝이</text>
  <text x="270" y="146" text-anchor="middle" class="tx-m">먼저 있어야 하니까</text>
  <text x="450" y="128" text-anchor="middle" class="tx-m">id 로 두 노드를 찾아</text>
  <text x="450" y="146" text-anchor="middle" class="tx-m">사이에 화살표</text>
  <text x="630" y="128" text-anchor="middle" class="tx-m">설계도(3차시)와</text>
  <text x="630" y="146" text-anchor="middle" class="tx-m">같은지 비교</text>
  <text x="360" y="180" text-anchor="middle" class="tx-b">순서가 바뀌면? ③ 을 먼저 하면 MATCH 할 노드가 없어 관계가 0개!</text>
</svg>`;

  /* 그림 6-6. 설계도와 적재 결과의 스키마 비교 */
  const FIG_SCHEMA = `<svg viewBox="0 0 720 270" role="img" aria-label="왼쪽은 3차시의 설계도로 Person, Movie, Genre 와 ACTED_IN, DIRECTED, IN_GENRE 관계, 오른쪽은 db.schema.visualization 결과로 같은 모양에 Director 레이블이 더 보인다">
  ${ARROW('c06a5')}
  <rect x="10" y="10" width="345" height="250" rx="14" class="card-bg"/>
  <rect x="365" y="10" width="345" height="250" rx="14" class="p5s"/>
  <text x="182" y="36" text-anchor="middle" class="tx-b">3차시 설계도 (데이터를 넣기 전)</text>
  <text x="537" y="36" text-anchor="middle" class="tx-b">db.schema.visualization() (넣은 뒤)</text>
  ${circ([70, 130], 34, 'p1', 'Person')}
  ${circ([220, 130], 34, 'p3', 'Movie')}
  ${circ([220, 220], 28, 'p4', 'Genre')}
  ${edge([70, 130], [220, 130], 34, 'c06a5', 'ACTED_IN')}
  <path d="M90 158 Q145 200 195 158" class="ln" stroke-width="2" fill="none" marker-end="url(#c06a5)"/>
  <text x="140" y="200" text-anchor="middle" class="tx-m">DIRECTED</text>
  ${edge([220, 130], [220, 220], 34, 'c06a5', '')}
  <text x="280" y="182" class="tx-m">IN_GENRE</text>
  ${circ([425, 130], 34, 'p1', 'Person')}
  ${circ([425, 220], 26, 'p2', 'Director')}
  ${circ([580, 130], 34, 'p3', 'Movie')}
  ${circ([580, 220], 28, 'p4', 'Genre')}
  ${edge([425, 130], [580, 130], 34, 'c06a5', 'ACTED_IN')}
  ${edge([425, 220], [580, 130], 26, 'c06a5', '')}
  <text x="520" y="200" class="tx-m">DIRECTED</text>
  ${edge([580, 130], [580, 220], 34, 'c06a5', '')}
  <text x="640" y="182" class="tx-m">IN_GENRE</text>
  <text x="537" y="80" text-anchor="middle" class="tx-m">감독은 Person 이면서 Director (다중 레이블)</text>
</svg>`;

  PY_COURSE.addChapter({
    id: 'ch06', no: '06', title: '데이터를 지식그래프로',
    subtitle: 'CSV 정제 · 표 → 노드/관계 변환 · 온톨로지 검증 · LOAD CSV · 제약 조건 · 인덱스',
    summary: '지금까지는 Cypher 문장을 손으로 써서 그래프를 만들었습니다. 하지만 실제 데이터는 대부분 <b>엑셀 · CSV 같은 표</b>로 존재합니다. 이번 차시에는 영화 · 인물 · 출연 CSV 를 pandas 로 <b>정제</b>하고, <b>행 → 노드, 외래키 · 여러 값 칸 → 관계</b> 규칙으로 바꾼 뒤, 2차시의 온톨로지 규칙(domain/range, 필수 속성)으로 <b>검증</b>합니다. 이어서 Neo4j 의 <code>LOAD CSV</code> 로 적재하고, <b>제약 조건 · 인덱스</b>로 중복을 막고 검색을 빠르게 한 다음, <code>db.schema.visualization()</code> 으로 3차시 설계도와 같은 지식그래프가 완성되었는지 확인합니다.',
    goals: [
      'pandas 로 CSV 를 읽고 결측값 · 공백 · 중복 · 한 칸의 여러 값을 정제할 수 있다',
      '표의 행 · 외래키 · 여러 값 칸을 노드와 관계로 바꾸는 규칙을 설명하고 적용할 수 있다',
      '온톨로지의 domain/range · 필수 속성 규칙으로 변환 결과를 검증하고 위반 행을 골라낼 수 있다',
      'LOAD CSV 와 형 변환 함수, MERGE 로 노드 → 관계 순서로 데이터를 적재할 수 있다',
      '고유 제약 조건과 인덱스를 만들고, 스키마 시각화로 결과를 설계도와 비교할 수 있다'
    ],
    sections: [
      /* ------------------------------------------------------------------ 1교시 */
      {
        id: 'ch06-1',
        title: 'CSV 를 트리플로: 데이터 정제와 변환',
        minutes: 50,
        goals: ['원본 CSV 를 pandas 로 읽고 문제(빈칸 · 공백 · 중복)를 찾아낸다', 'strip · dropna · drop_duplicates · split · explode 로 정제한다', '행 → 노드, 외래키 · 여러 값 칸 → 관계 규칙으로 노드 표와 관계 표를 만든다', '온톨로지 규칙으로 위반 행을 골라내고 nodes.csv · rels.csv 와 Cypher 문을 만든다'],
        flow: [['도입 · 원본 표 살펴보기', 7], ['정제: 공백 · 빈칸 · 중복 · 여러 값', 12], ['변환 규칙: 행 → 노드, 외래키 → 관계', 10], ['온톨로지 검증', 8], ['함께 해 보기: 저장과 Cypher 자동 생성', 13]],
        content: [
          { type: 'p', html: '5차시까지 우리는 <code>CREATE</code> · <code>MERGE</code> 문장을 한 줄씩 손으로 써서 그래프를 만들었습니다. 영화 몇 편이면 괜찮지만, 영화가 1만 편이고 배우가 5만 명이라면 손으로는 불가능합니다. 실제 세상의 데이터는 대부분 <b>엑셀 · CSV 같은 표</b>에 들어 있습니다. 그래서 지식그래프를 만드는 일의 대부분은 사실 <b>"표를 깨끗하게 다듬어 노드와 관계로 바꾸는 일"</b> 입니다.' },
          { type: 'p', html: '이번 교시에는 Python(pandas)으로 그 일을 해 봅니다. 2차시에서 배운 <b>트리플(주어 – 술어 – 목적어)</b>을 떠올려 보세요. 표의 한 칸 한 칸을 <code>(송강호) –출연했다→ (기생충)</code> 같은 트리플로 바꾸는 것이 목표입니다.' },

          { type: 'h', text: '원본 표 살펴보기: 영화 · 인물 · 출연 CSV' },
          { type: 'p', html: '강좌에 작은 예제 파일 세 개가 들어 있습니다. 실행 결과 창의 작업 폴더에 자동으로 복사되므로 파일 이름만으로 바로 읽을 수 있습니다.' },
          { type: 'table', head: ['파일', '한 행의 뜻', '칸 (열)'], rows: [
            ['<code>movies.csv</code>', '영화 한 편', 'movie_id · title(제목) · released(개봉연도) · genres(장르들) · director_id(감독 id)'],
            ['<code>people.csv</code>', '사람 한 명', 'person_id · name(이름) · born(출생연도)'],
            ['<code>roles.csv</code>', '"누가 어느 영화에 무슨 역으로 출연했다" 한 건', 'person_id · movie_id · role(배역)']
          ], caption: '예제 CSV 세 개. roles.csv 처럼 두 표를 이어 주는 표를 <b>연결 표</b>라고 합니다.' },
          { type: 'p', html: '이 파일들은 일부러 <b>조금 지저분하게</b> 만들어 두었습니다. 실제 데이터는 늘 이렇습니다. 사람이 손으로 입력하다 보면 공백이 섞이고, 같은 줄을 두 번 붙여 넣고, 모르는 칸은 비워 둡니다.' },
          { type: 'figure', html: FIG_RAW, caption: '그림 6-1. 원본 CSV 에 숨어 있는 문제들. 이대로 그래프에 넣으면 "이선균" 과 " 이선균 " 이 다른 사람이 되고, 기생충이 두 번 생기고, 영화가 영화에 출연하는 이상한 관계가 생깁니다.' },
          { type: 'code', title: '예제 6-1. CSV 세 개를 pandas 로 읽기', code: `import pandas as pd

movies = pd.read_csv('movies.csv')
people = pd.read_csv('people.csv')
roles = pd.read_csv('roles.csv')

for name, df in [('movies', movies), ('people', people), ('roles', roles)]:
    print(f'{name:6} : {df.shape[0]:2}행 {df.shape[1]}열  {list(df.columns)}')

print()
print('released 칸의 자료형:', movies['released'].dtype)
display(movies)`,
            desc: '<code>pd.read_csv(파일)</code> 한 줄이면 CSV 가 표(DataFrame)가 됩니다. 결과 창의 movies 표를 보면 개봉연도가 <code>2019.0</code> 처럼 소수로 보입니다. 숫자 칸에 <b>빈칸이 하나라도 있으면</b> pandas 는 빈칸을 <code>NaN</code>(숫자가 아님)으로 채우면서 칸 전체를 실수(float)로 바꾸기 때문입니다. 이것도 정제가 필요하다는 신호입니다.' },
          { type: 'p', html: '눈으로 표를 훑는 것만으로는 문제를 다 찾기 어렵습니다. 문제의 종류별로 <b>개수를 세는 코드</b>를 먼저 돌려 보는 습관을 들이세요.' },
          { type: 'code', title: '예제 6-2. 문제 찾기: 빈칸 · 중복 · 앞뒤 공백', code: `import pandas as pd

tables = {'movies': pd.read_csv('movies.csv', dtype=str),
          'people': pd.read_csv('people.csv', dtype=str),
          'roles': pd.read_csv('roles.csv', dtype=str)}

print('[1] 칸별 빈칸 개수')
for name, df in tables.items():
    print(f'  {name:6}', df.isna().sum().to_dict())

print('[2] 완전히 똑같은 행의 개수')
for name, df in tables.items():
    print(f'  {name:6}', df.duplicated().sum())

print('[3] 앞뒤에 공백이 붙은 값')
for name, df in tables.items():
    for col in df.columns:
        s = df[col].dropna()
        for v in s[s != s.str.strip()]:
            print(f'  {name}.{col}: {v!r}')`,
            expect: "[1] 칸별 빈칸 개수\n  movies {'movie_id': 0, 'title': 0, 'released': 1, 'genres': 0, 'director_id': 0}\n  people {'person_id': 0, 'name': 1, 'born': 0}\n  roles  {'person_id': 0, 'movie_id': 0, 'role': 1}\n[2] 완전히 똑같은 행의 개수\n  movies 1\n  people 1\n  roles  1\n[3] 앞뒤에 공백이 붙은 값\n  movies.director_id: ' p04'\n  people.name: ' 이선균 '",
            desc: '<code>dtype=str</code> 은 "모든 칸을 글자로 읽어라" 라는 뜻입니다. 정제 단계에서는 숫자로 바꾸기 전에 글자 그대로 살펴보는 편이 안전합니다. <code>{v!r}</code> 은 값을 따옴표와 함께 보여 주어 공백이 눈에 보이게 합니다. <code>\'범죄 | 드라마\'</code> 는 바깥 공백은 없지만 <code>|</code> 양옆에 공백이 있어서, 나중에 장르를 나눈 뒤 한 번 더 다듬어야 합니다.' },

          { type: 'h', text: '정제 1: 공백 · 빈칸 · 중복 처리' },
          { type: 'p', html: '찾은 문제를 하나씩 고칩니다. 순서가 중요합니다. <b>공백을 먼저 지워야</b> <code>"p01,송강호"</code> 와 <code>"p01, 송강호"</code> 같은 행이 똑같아져서 중복 제거가 제대로 됩니다.' },
          { type: 'table', head: ['문제', 'pandas 도구', '뜻'], rows: [
            ['값 앞뒤의 공백', '<code>df[칸].str.strip()</code>', '글자 양 끝의 공백을 지움'],
            ['꼭 있어야 할 칸이 빈칸', '<code>df.dropna(subset=[칸])</code>', '그 칸이 빈 행을 뺌 (또는 따로 모아 확인)'],
            ['빈칸을 기본값으로', '<code>df[칸].fillna(값)</code>', '빈칸을 정한 값으로 채움'],
            ['똑같은 행', '<code>df.drop_duplicates()</code>', '두 번째부터 나오는 똑같은 행을 뺌'],
            ['같은 id 가 다른 내용으로 여러 번', '<code>df[칸].duplicated(keep=False)</code>', '같은 id 를 가진 행을 모두 표시 → 사람이 판단'],
            ['글자 → 숫자', '<code>df[칸].astype(int)</code>', '"1967" → 1967 (빈칸이 없을 때만)']
          ], caption: '정제에 자주 쓰는 pandas 도구.' },
          { type: 'code', title: '예제 6-3. people.csv 정제하기', code: `import pandas as pd

people = pd.read_csv('people.csv', dtype=str)
print('정제 전:', len(people), '행')

# ① 모든 칸의 앞뒤 공백 지우기
people = people.apply(lambda col: col.str.strip())

# ② 필수 칸(name)이 빈 행은 따로 모아 두고 빼기
missing = people[people['name'].isna()]
people = people.dropna(subset=['name'])
print('이름이 빈 행:', missing['person_id'].tolist())

# ③ 똑같은 행 지우기
people = people.drop_duplicates()

# ④ id 가 겹치는지 마지막으로 확인 → 없어야 정상
print('같은 id 가 남았나?', people['person_id'].duplicated().any())

# ⑤ 출생연도를 숫자로
people['born'] = people['born'].astype(int)
print('정제 후:', len(people), '행')
display(people)`,
            desc: '<code>apply(lambda col: col.str.strip())</code> 는 "모든 칸(col)에 strip 을 적용하라" 는 뜻입니다. 빼 버린 행(<code>missing</code>)은 버리지 말고 따로 모아 두었다가 데이터를 준 사람에게 확인을 부탁하는 것이 좋습니다.' },
          { type: 'callout', kind: 'warn', title: '"중복 이름" 과 "중복 행" 은 다릅니다', html: 'people.csv 에는 <code>p01,송강호,1967</code> 이 두 번 있습니다. id 까지 똑같으니 <b>같은 사람을 두 번 적은 실수</b>이고 지워도 됩니다. 하지만 <b>이름만 같고 id 가 다르다면</b> 동명이인일 수 있습니다. 실제로 "김철수" 같은 이름은 수백 명입니다. 그래서 그래프에서는 사람을 <b>이름이 아니라 id 로</b> 구별합니다. 이름이 같은 행을 발견하면 지우지 말고 <code>duplicated(keep=False)</code> 로 표시해 사람이 확인하게 하세요.' },

          { type: 'h', text: '정제 2: 한 칸에 여러 값 나누기 (split · explode)' },
          { type: 'p', html: 'movies.csv 의 genres 칸에는 <code>드라마|스릴러</code> 처럼 <b>한 칸에 값이 여러 개</b> 들어 있습니다. 표에서는 이렇게 적는 일이 흔하지만, 그래프에서는 장르 하나하나가 <b>따로 연결될 노드</b>여야 합니다. 그래서 두 단계로 나눕니다.' },
          { type: 'list', ordered: true, items: [
            '<b>split</b> — <code>str.split(\'|\')</code> 로 글자를 <b>리스트</b>로 나눕니다: <code>\'드라마|스릴러\'</code> → <code>[\'드라마\', \'스릴러\']</code> (아직 1행)',
            '<b>explode</b> — 리스트 칸을 <b>폭발</b>시켜 원소마다 한 행으로 펼칩니다: 1행 → 2행 (나머지 칸은 그대로 복사)'
          ] },
          { type: 'figure', html: FIG_EXPLODE, caption: '그림 6-2. split 은 한 칸을 리스트로, explode 는 리스트를 여러 행으로. 펼친 행 하나가 곧 <code>IN_GENRE</code> 관계 하나입니다.' },
          { type: 'code', title: '예제 6-4. 장르 칸을 split · explode 로 펼치기', code: `import pandas as pd

movies = pd.read_csv('movies.csv', dtype=str)
movies = movies.apply(lambda c: c.str.strip()).drop_duplicates()

g = movies[['movie_id', 'title', 'genres']].copy()
g['genre'] = g['genres'].str.split('|')        # ① 글자 -> 리스트
print('split 뒤 (아직', len(g), '행)')
print(g[['title', 'genre']].head(3).to_string(index=False))

g = g.explode('genre')                          # ② 리스트 -> 여러 행
g['genre'] = g['genre'].str.strip()             # ③ '범죄 ' 같은 공백 정리
g = g[['movie_id', 'title', 'genre']].reset_index(drop=True)
print()
print('explode 뒤:', len(g), '행')
display(g)
print('장르 종류:', sorted(g['genre'].unique()))`,
            desc: '7편의 영화가 13행으로 펼쳐졌습니다. ③ 의 strip 이 없으면 <code>\'범죄 \'</code> 와 <code>\'범죄\'</code> 가 서로 다른 장르가 되어 Genre 노드가 두 개 생깁니다. 마지막 줄의 장르 종류 6개가 곧 만들어질 <b>Genre 노드 6개</b>입니다.' },

          { type: 'h', text: '변환 규칙: 표의 무엇이 그래프의 무엇이 되나' },
          { type: 'p', html: '이제 깨끗해진 표를 노드와 관계로 바꿉니다. 3차시의 "명사 → 노드, 동사 → 관계" 를 표에 적용하면 아래 <b>네 가지 규칙</b>이 됩니다.' },
          { type: 'list', items: [
            '<b>규칙 ① 행 → 노드</b>: 무언가 하나를 나타내는 표(movies · people)의 행 하나는 노드 하나입니다. 표 이름이 레이블, 칸이 속성이 됩니다.',
            '<b>규칙 ② 외래키 → 관계</b>: 다른 표의 id 를 가리키는 칸(<b>외래키</b>, 예: director_id = p04)은 두 노드 사이의 화살표입니다.',
            '<b>규칙 ③ 여러 값 칸 → 노드 + 관계</b>: 장르처럼 여러 값을 담은 칸은 값마다 노드를 만들고 관계로 잇습니다.',
            '<b>규칙 ④ 연결 표 → 관계 (+ 관계 속성)</b>: roles.csv 처럼 외래키 두 개로 된 표의 행은 관계 하나이고, 나머지 칸(role)은 관계의 속성입니다.'
          ] },
          { type: 'figure', html: FIG_MAP, caption: '그림 6-3. 표 → 그래프 변환 대응표. 노드에는 원본 id 를 <code>id</code> 속성으로 꼭 남겨 둡니다. 관계를 이을 때 이 id 로 양 끝 노드를 찾기 때문입니다.' },
          { type: 'p', html: '변환 결과는 <b>두 개의 표</b>로 모읍니다. 노드 표(<code>id, label, 속성들</code>)와 관계 표(<code>start, type, end, 속성들</code>)입니다. 관계 표의 한 행이 바로 트리플 <code>(start) –type→ (end)</code> 입니다.' },
          { type: 'code', title: '예제 6-5. 노드 표와 관계 표 만들기', code: `import pandas as pd

def load(name):                       # 읽기 + 공백 제거 + 중복 제거
    df = pd.read_csv(name, dtype=str)
    return df.apply(lambda c: c.str.strip()).drop_duplicates()

movies, people, roles = load('movies.csv'), load('people.csv'), load('roles.csv')
mg = movies.assign(genre=movies['genres'].str.split('|')).explode('genre')
mg['genre'] = mg['genre'].str.strip()
genres = mg['genre'].unique()

# 규칙 ① · ③ : 노드 표
nodes = pd.concat([
    pd.DataFrame({'id': movies['movie_id'], 'label': 'Movie',
                  'title': movies['title'], 'released': movies['released']}),
    pd.DataFrame({'id': people['person_id'], 'label': 'Person',
                  'name': people['name'], 'born': people['born']}),
    pd.DataFrame({'id': genres, 'label': 'Genre', 'name': genres}),
], ignore_index=True)

# 규칙 ② · ③ · ④ : 관계 표 (한 행 = 트리플 하나)
rels = pd.concat([
    pd.DataFrame({'start': roles['person_id'], 'type': 'ACTED_IN',
                  'end': roles['movie_id'], 'role': roles['role']}),
    pd.DataFrame({'start': movies['director_id'], 'type': 'DIRECTED',
                  'end': movies['movie_id']}),
    pd.DataFrame({'start': mg['movie_id'], 'type': 'IN_GENRE', 'end': mg['genre']}),
], ignore_index=True)

print('노드', len(nodes), '개:', nodes['label'].value_counts().to_dict())
print('관계', len(rels), '개:', rels['type'].value_counts().to_dict())
display(nodes.head(8))
display(rels.head(5))`,
            desc: '<code>pd.concat</code> 은 여러 표를 위아래로 이어 붙입니다. 레이블마다 속성 칸이 달라서 Movie 행의 name · born 칸은 비어(NaN) 있습니다 — 정상입니다. 아직 p10(이름 없음) · 설국열차(개봉연도 없음) · 이상한 출연 행이 섞여 있습니다. 다음 단계에서 골라냅니다.' },

          { type: 'h', text: '온톨로지 규칙으로 변환 결과 검증하기' },
          { type: 'p', html: '2차시에서 온톨로지는 <b>"무엇이 올바른 데이터인가"</b> 를 정한 설계도라고 했습니다. 이 규칙을 그대로 <b>검사기</b>로 쓸 수 있습니다. 검사할 것은 세 가지입니다.' },
          { type: 'table', head: ['규칙', '온톨로지 (2차시)', '검사 방법', '위반 예'], rows: [
            ['필수 속성', '클래스마다 꼭 있어야 하는 데이터 속성', '해당 칸이 빈칸인 노드', 'p10 (name 없음), 설국열차 (released 없음)'],
            ['정의역 (domain)', '관계의 출발 쪽에 올 수 있는 클래스', 'start 노드의 레이블', '<code>(m02:Movie)-[:ACTED_IN]→</code> 영화가 출연?'],
            ['치역 (range)', '관계의 도착 쪽에 올 수 있는 클래스', 'end 노드의 레이블', '<code>(m01)-[:DIRECTED]→(p04)</code> 방향이 거꾸로'],
            ['참조 (존재)', '가리키는 대상이 있어야 함', 'start · end 가 노드 표에 있는가', '<code>p13</code> 은 people 에 없음']
          ], caption: '검증 규칙. 위반 행은 지우지 말고 이유와 함께 따로 모아 둡니다.' },
          { type: 'code', title: '예제 6-6. 온톨로지 규칙으로 위반 행 골라내기', code: `# 작은 노드 표 · 관계 표 (예제 6-5 결과의 일부를 옮겨 적음)
nodes = [
    {'id': 'm01', 'label': 'Movie',  'title': '기생충',   'released': '2019'},
    {'id': 'm07', 'label': 'Movie',  'title': '설국열차', 'released': None},
    {'id': 'p01', 'label': 'Person', 'name': '송강호', 'born': '1967'},
    {'id': 'p04', 'label': 'Person', 'name': '봉준호', 'born': '1969'},
    {'id': 'p10', 'label': 'Person', 'name': None,     'born': '1990'},
    {'id': '드라마', 'label': 'Genre', 'name': '드라마'},
]
rels = [('p01', 'ACTED_IN', 'm01'), ('p04', 'DIRECTED', 'm01'),
        ('m01', 'IN_GENRE', '드라마'), ('m01', 'DIRECTED', 'p04'),
        ('p13', 'ACTED_IN', 'm01'), ('p01', 'ACTED_IN', 'm07'),
        ('p01', 'LIKES', 'm01')]

# 온톨로지 규칙
REQUIRED = {'Movie': ['title', 'released'], 'Person': ['name', 'born'], 'Genre': ['name']}
DOMAIN_RANGE = {'ACTED_IN': ('Person', 'Movie'), 'DIRECTED': ('Person', 'Movie'),
                'IN_GENRE': ('Movie', 'Genre')}

label_of, good = {}, set()
for n in nodes:
    label_of[n['id']] = n['label']
    missing = [p for p in REQUIRED[n['label']] if n.get(p) is None]
    if missing:
        print(f"✗ 노드 {n['id']}: 필수 속성 {missing} 없음")
    else:
        good.add(n['id'])

for s, t, e in rels:
    if t not in DOMAIN_RANGE:
        why = '온톨로지에 없는 관계 타입'
    elif s not in label_of or e not in label_of:
        why = '없는 id 를 가리킴'
    elif (label_of[s], label_of[e]) != DOMAIN_RANGE[t]:
        dom, rng = DOMAIN_RANGE[t]
        why = f'{label_of[s]}→{label_of[e]} (규칙은 {dom}→{rng})'
    elif s not in good or e not in good:
        why = '제외된 노드와 연결됨'
    else:
        print(f'✓ ({s})-[:{t}]->({e})')
        continue
    print(f'✗ ({s})-[:{t}]->({e}): {why}')`,
            expect: "✗ 노드 m07: 필수 속성 ['released'] 없음\n✗ 노드 p10: 필수 속성 ['name'] 없음\n✓ (p01)-[:ACTED_IN]->(m01)\n✓ (p04)-[:DIRECTED]->(m01)\n✓ (m01)-[:IN_GENRE]->(드라마)\n✗ (m01)-[:DIRECTED]->(p04): Movie→Person (규칙은 Person→Movie)\n✗ (p13)-[:ACTED_IN]->(m01): 없는 id 를 가리킴\n✗ (p01)-[:ACTED_IN]->(m07): 제외된 노드와 연결됨\n✗ (p01)-[:LIKES]->(m01): 온톨로지에 없는 관계 타입",
            desc: '노드를 먼저 검사하고, 그 결과(<code>good</code>)를 써서 관계를 검사합니다. 설국열차가 필수 속성 때문에 빠지면 <b>설국열차에 걸린 관계도 함께 빠져야</b> 합니다. 이렇게 하지 않으면 Neo4j 에 적재할 때 끝 노드를 찾지 못해 관계가 조용히 사라집니다.' },
          { type: 'callout', kind: 'tip', title: '고칠까, 뺄까?', html: '위반 행을 만났을 때 정답은 하나가 아닙니다. 설국열차의 개봉연도(2013)처럼 <b>확실히 아는 값</b>이면 채워 넣고, <code>m02,m01,괴물</code> 처럼 <b>무엇을 뜻하는지 모르는 행</b>은 빼서 "확인 필요" 목록에 남깁니다. 중요한 것은 <b>조용히 버리지 않는 것</b>입니다. 몇 행을 왜 뺐는지 기록이 남아야 나중에 지식그래프를 믿을 수 있습니다.' },

          { type: 'h', text: '변환 결과 저장하고 Cypher 문 자동 생성하기' },
          { type: 'p', html: '검증을 통과한 노드 표와 관계 표를 <code>nodes.csv</code> · <code>rels.csv</code> 로 저장합니다. 2교시에 Neo4j 의 <code>LOAD CSV</code> 가 이 파일을 그대로 읽습니다. 저장할 때는 꼭 <b>UTF-8</b> 인코딩을 쓰세요 (pandas 의 기본값).' },
          { type: 'code', title: '예제 6-7. nodes.csv · rels.csv 로 저장하고 다시 열어 보기', code: `import pandas as pd

nodes = pd.DataFrame([
    {'id': 'm01', 'label': 'Movie', 'title': '기생충', 'released': '2019'},
    {'id': 'p01', 'label': 'Person', 'name': '송강호', 'born': '1967'},
    {'id': '드라마', 'label': 'Genre', 'name': '드라마'},
])
rels = pd.DataFrame([
    {'start': 'p01', 'type': 'ACTED_IN', 'end': 'm01', 'role': '기택'},
    {'start': 'm01', 'type': 'IN_GENRE', 'end': '드라마'},
])

nodes.to_csv('nodes.csv', index=False, encoding='utf-8')
rels.to_csv('rels.csv', index=False, encoding='utf-8')

for f in ['nodes.csv', 'rels.csv']:
    print('──', f)
    print(open(f, encoding='utf-8').read())`,
            desc: '<code>index=False</code> 를 빼면 0, 1, 2 같은 행 번호가 첫 칸에 함께 저장되니 꼭 넣으세요. 비어 있는 칸은 <code>,,</code> 처럼 아무것도 없이 저장되고, Neo4j 의 LOAD CSV 는 이것을 <code>null</code>(값 없음)로 읽습니다. 개봉연도를 숫자 <code>2019</code> 가 아니라 글자 <code>\'2019\'</code> 로 둔 이유가 있습니다. 빈칸(NaN)이 섞인 숫자 칸은 실수가 되어 <code>2019.0</code> 으로 저장되기 때문입니다 (숫자로 바꿔 실행해 보세요). 어차피 CSV 에는 모두 글자로 저장되니, 숫자로 바꾸는 일은 2교시에 적재하면서 합니다.' },
          { type: 'p', html: 'LOAD CSV 를 쓰지 않고, Python 으로 <b>Cypher 문장 자체를 만들어</b> Neo4j Browser 에 붙여 넣는 방법도 있습니다. 표의 한 행을 문자열 하나로 바꾸기만 하면 됩니다.' },
          { type: 'code', title: '예제 6-8. 노드 표 · 관계 표로 Cypher MERGE 문 만들기', code: `import json

nodes = [
    {'id': 'm01', 'label': 'Movie', 'title': '기생충', 'released': 2019},
    {'id': 'p01', 'label': 'Person', 'name': '송강호', 'born': 1967},
    {'id': 'p02', 'label': 'Person', 'name': "샘 오'브라이언", 'born': 1980},
]
rels = [{'start': 'p01', 'type': 'ACTED_IN', 'end': 'm01', 'role': '기택'}]

def lit(v):
    # 숫자는 그대로, 글자는 따옴표 · 특수문자를 안전하게 감싸기
    return str(v) if isinstance(v, int) else json.dumps(v, ensure_ascii=False)

label_of = {n['id']: n['label'] for n in nodes}
lines = []
for n in nodes:
    props = ', '.join(f'{k}: {lit(v)}' for k, v in n.items() if k not in ('id', 'label'))
    lines.append(f"MERGE (n:{n['label']} {{id: {lit(n['id'])}}}) SET n += {{{props}}};")
for r in rels:
    a, b = label_of[r['start']], label_of[r['end']]
    lines.append(f"MATCH (a:{a} {{id: {lit(r['start'])}}}), (b:{b} {{id: {lit(r['end'])}}}) "
                 f"MERGE (a)-[r:{r['type']}]->(b) SET r.role = {lit(r['role'])};")

for line in lines:
    print(line)
open('load.cypher', 'w', encoding='utf-8').write('\\n'.join(lines))`,
            expect: 'MERGE (n:Movie {id: "m01"}) SET n += {title: "기생충", released: 2019};\nMERGE (n:Person {id: "p01"}) SET n += {name: "송강호", born: 1967};\nMERGE (n:Person {id: "p02"}) SET n += {name: "샘 오\'브라이언", born: 1980};\nMATCH (a:Person {id: "p01"}), (b:Movie {id: "m01"}) MERGE (a)-[r:ACTED_IN]->(b) SET r.role = "기택";',
            desc: 'f-string 안에서 중괄호 글자 <code>{</code> 를 쓰려면 <code>{{</code> 처럼 두 번 씁니다. <code>json.dumps</code> 는 글자를 큰따옴표로 감싸 주는데, Cypher 도 큰따옴표 문자열을 쓸 수 있어서 이름에 작은따옴표(<code>오\'브라이언</code>)가 있어도 문장이 깨지지 않습니다. 5차시에 배운 대로 <b>노드를 먼저 MERGE 하고, 관계는 MATCH 로 찾은 뒤 MERGE</b> 하는 순서를 그대로 지켰습니다.' },
          { type: 'callout', kind: 'more', title: 'Cypher 문 생성 vs LOAD CSV', html: 'Cypher 문을 만들어 붙여 넣는 방법은 원리를 이해하기 좋고 수십~수백 행까지는 편리합니다. 하지만 행이 수천 개를 넘으면 문장도 수천 개가 되어 느리고 관리하기 어렵습니다. 그때는 <b>파일을 한 번에 읽는 LOAD CSV</b>(2교시)나, Python 에서 Neo4j 에 직접 접속하는 드라이버(7차시)를 씁니다.' },

          { type: 'h', text: '함께 해 보기: 원본 CSV → 정제 → 검증 → nodes.csv · rels.csv · Cypher' },
          { type: 'p', html: '지금까지의 단계를 하나로 이어 봅시다. 아래 코드는 원본 CSV 세 개를 읽어 <b>정제 → 변환 → 온톨로지 검증 → 저장 → Cypher 생성</b>까지 한 번에 합니다. 실행한 뒤 위반 목록과 최종 개수를 확인하세요. 이 결과 파일을 2교시에 Neo4j 로 적재합니다.' },
          { type: 'code', title: '예제 6-9. 전체 변환 파이프라인', code: `import json
import pandas as pd

# ① 읽기 + 정제
def load(name):
    df = pd.read_csv(name, dtype=str)
    return df.apply(lambda c: c.str.strip()).drop_duplicates()

movies, people, roles = load('movies.csv'), load('people.csv'), load('roles.csv')
mg = movies.assign(genre=movies['genres'].str.split('|')).explode('genre')
mg['genre'] = mg['genre'].str.strip()
genres = mg['genre'].unique()

# ② 변환: 행 → 노드, 외래키 · 여러 값 칸 → 관계
nodes = pd.concat([
    pd.DataFrame({'id': movies['movie_id'], 'label': 'Movie',
                  'title': movies['title'], 'released': movies['released']}),
    pd.DataFrame({'id': people['person_id'], 'label': 'Person',
                  'name': people['name'], 'born': people['born']}),
    pd.DataFrame({'id': genres, 'label': 'Genre', 'name': genres}),
], ignore_index=True)
rels = pd.concat([
    pd.DataFrame({'start': roles['person_id'], 'type': 'ACTED_IN',
                  'end': roles['movie_id'], 'role': roles['role']}),
    pd.DataFrame({'start': movies['director_id'], 'type': 'DIRECTED', 'end': movies['movie_id']}),
    pd.DataFrame({'start': mg['movie_id'], 'type': 'IN_GENRE', 'end': mg['genre']}),
], ignore_index=True)

# ③ 온톨로지 검증
REQUIRED = {'Movie': ['title', 'released'], 'Person': ['name', 'born'], 'Genre': ['name']}
DOMAIN_RANGE = {'ACTED_IN': ('Person', 'Movie'), 'DIRECTED': ('Person', 'Movie'),
                'IN_GENRE': ('Movie', 'Genre')}
problems = []
node_ok = [all(pd.notna(n[p]) for p in REQUIRED[n['label']]) for _, n in nodes.iterrows()]
for (_, n), ok in zip(nodes.iterrows(), node_ok):
    if not ok:
        problems.append(f"노드 {n['id']}: 필수 속성 없음")
label_of = dict(zip(nodes['id'], nodes['label']))
good = set(nodes[node_ok]['id'])
rel_ok = []
for _, r in rels.iterrows():
    s, t, e = r['start'], r['type'], r['end']
    if s not in label_of or e not in label_of:
        why = '없는 id'
    elif (label_of[s], label_of[e]) != DOMAIN_RANGE[t]:
        why = f'{label_of[s]}→{label_of[e]} domain/range 위반'
    elif s not in good or e not in good:
        why = '제외된 노드와 연결'
    else:
        why = ''
    if why:
        problems.append(f'관계 ({s})-[:{t}]->({e}): {why}')
    rel_ok.append(why == '')
nodes_ok, rels_ok = nodes[node_ok], rels[rel_ok]

# ④ 저장 + Cypher 생성
nodes_ok.to_csv('nodes.csv', index=False)
rels_ok.to_csv('rels.csv', index=False)
def lit(v):
    return v if str(v).isdigit() else json.dumps(v, ensure_ascii=False)
cypher = []
for _, n in nodes_ok.iterrows():
    props = ', '.join(f'{k}: {lit(n[k])}' for k in REQUIRED[n['label']])
    cypher.append(f"MERGE (n:{n['label']} {{id: {lit(n['id'])}}}) SET n += {{{props}}};")

print('[확인 필요 목록]')
for p in problems:
    print(' ✗', p)
print('[최종] 노드', len(nodes_ok), nodes_ok['label'].value_counts().to_dict())
print('[최종] 관계', len(rels_ok), rels_ok['type'].value_counts().to_dict())
print('[Cypher 앞부분]')
for line in cypher[:3]:
    print(' ', line)`,
            expect: "[확인 필요 목록]\n ✗ 노드 m07: 필수 속성 없음\n ✗ 노드 p10: 필수 속성 없음\n ✗ 관계 (p01)-[:ACTED_IN]->(m07): 제외된 노드와 연결\n ✗ 관계 (m02)-[:ACTED_IN]->(m01): Movie→Movie domain/range 위반\n ✗ 관계 (p13)-[:ACTED_IN]->(m04): 없는 id\n ✗ 관계 (p04)-[:DIRECTED]->(m07): 제외된 노드와 연결\n ✗ 관계 (m07)-[:IN_GENRE]->(SF): 제외된 노드와 연결\n ✗ 관계 (m07)-[:IN_GENRE]->(액션): 제외된 노드와 연결\n[최종] 노드 22 {'Person': 10, 'Movie': 6, 'Genre': 6}\n[최종] 관계 30 {'ACTED_IN': 13, 'IN_GENRE': 11, 'DIRECTED': 6}\n[Cypher 앞부분]\n  MERGE (n:Movie {id: \"m01\"}) SET n += {title: \"기생충\", released: 2019};\n  MERGE (n:Movie {id: \"m02\"}) SET n += {title: \"괴물\", released: 2006};\n  MERGE (n:Movie {id: \"m03\"}) SET n += {title: \"살인의 추억\", released: 2003};",
            desc: '원본 37행(8 + 12 + 17)이 <b>노드 22개 · 관계 30개</b>의 깨끗한 지식그래프 재료가 되었고, 문제 행 8개는 이유와 함께 목록으로 남았습니다. <code>movies.csv</code> 의 설국열차 행에 개봉연도 <code>2013</code> 을 채운 것처럼 바꿔 생각해 보세요 — 어떤 줄이 목록에서 사라지고 개수가 어떻게 달라질까요? (예제 안에서 <code>movies.loc[movies[\'movie_id\'] == \'m07\', \'released\'] = \'2013\'</code> 를 ① 바로 뒤에 넣어 확인할 수 있습니다.)' },
          { type: 'callout', kind: 'info', teacher: true, title: '수업 준비 · 오개념 지도 팁', html: '① 예제 CSV(<code>movies.csv · people.csv · roles.csv</code>)는 결과 창 작업 폴더에 자동 복사됩니다. 학생이 파일을 열어 보고 싶어 하면 <code>print(open(\'movies.csv\', encoding=\'utf-8\').read())</code> 를 알려 주세요. ② "빈칸이 있는 행은 무조건 지운다" 는 오해가 많습니다 — role 이 빈 출연 관계는 필수 속성이 아니므로 남겨도 됩니다. <b>필수인지 아닌지는 온톨로지가 정합니다.</b> ③ split 과 explode 를 헷갈리면 그림 6-2 를 다시 보여 주고 "split = 칸 안에서 나누기, explode = 행을 늘리기" 로 정리합니다. ④ 예제 6-9 의 개수(노드 22 · 관계 30)는 2교시 적재 결과 확인에 다시 쓰이니 칠판에 적어 두세요.' }
        ],
        slides: [
          { layout: 'title', title: '데이터를 지식그래프로', subtitle: '1교시 · CSV 를 트리플로: 데이터 정제와 변환',
            notes: '<p>💬 <b>발문:</b> "영화 1만 편을 CREATE 문으로 손으로 넣을 수 있을까요?" → 불가능. 실제 데이터는 대부분 표(CSV · 엑셀)로 있다는 점에서 출발합니다. 그림 6-1 을 띄워 원본 CSV 의 문제를 함께 찾아봅니다. (7분)</p>' },
          { layout: 'code', title: '정제: 공백 → 빈칸 → 중복 → 여러 값', code: `import pandas as pd

movies = pd.read_csv('movies.csv', dtype=str)
print('정제 전:', len(movies), '행')
movies = movies.apply(lambda c: c.str.strip())   # 공백
movies = movies.drop_duplicates()                # 중복
print('빈칸:', movies.isna().sum().to_dict())

g = movies.assign(genre=movies['genres'].str.split('|'))
g = g.explode('genre')                           # 여러 값
g['genre'] = g['genre'].str.strip()
print('영화', len(movies), '편 → 장르 연결', len(g), '행')
print(g[['title', 'genre']].head(6).to_string(index=False))`,
            points: ['strip 을 먼저 해야 중복 제거가 정확', 'dtype=str 로 읽고 나중에 숫자로', 'split = 칸 안에서 나누기, explode = 행 늘리기'],
            notes: '<p>예제 6-2 로 문제 개수를 먼저 세고, 이 코드로 정제합니다. 💬 "strip 과 drop_duplicates 의 순서를 바꾸면?" → 공백 때문에 같은 행이 다르게 보여 중복이 남을 수 있음. 동명이인 callout 도 짚어 줍니다. (12분)</p>' },
          { layout: 'diagram', title: '표의 무엇이 그래프의 무엇이 되나', html: FIG_MAP, caption: '행 → 노드 · 외래키 → 관계 · 여러 값 칸 → 노드 + 관계 · 연결 표 → 관계 + 속성',
            notes: '<p>3차시 "명사 → 노드, 동사 → 관계" 를 다시 떠올리게 한 뒤 네 규칙을 설명합니다. 노드에 원본 id 를 꼭 남기는 이유(관계를 이을 때 찾기 위해)를 강조합니다. 예제 6-5 를 실행해 노드 24 · 관계 36 을 확인합니다. (10분)</p>' },
          { layout: 'table', title: '온톨로지로 검증하기', head: ['규칙', '검사', '위반 예'], rows: [
            ['필수 속성', '빈칸인 노드', 'p10 이름 없음 · 설국열차 개봉연도 없음'],
            ['domain', 'start 의 레이블', '영화(m02)가 ACTED_IN'],
            ['range', 'end 의 레이블', '(m01)-[:DIRECTED]→(p04)'],
            ['존재', 'id 가 노드 표에 있나', 'p13 은 없는 사람'],
            ['연쇄', '제외된 노드에 걸린 관계', '설국열차의 출연 · 장르 관계']
          ], lead: '위반 행은 조용히 버리지 말고 이유와 함께 기록',
            notes: '<p>예제 6-6 을 실행하며 ✓/✗ 를 하나씩 읽습니다. 💬 "설국열차를 빼면 송강호의 설국열차 출연 관계는?" → 함께 빠져야 함. 고칠지 뺄지 판단 기준(tip callout)도 이야기합니다. (8분)</p>' },
          { layout: 'summary', title: '정리 · 함께 해 보기', bullets: ['원본 표 → 문제 세기 → 정제(strip · dropna · drop_duplicates · split · explode)', '행 → 노드, 외래키 · 여러 값 칸 · 연결 표 → 관계', '온톨로지(필수 속성 · domain/range)로 위반 행 골라내기', 'nodes.csv · rels.csv 저장, Cypher MERGE 문 자동 생성', '실습: 예제 6-9 → 노드 22 · 관계 30 · 확인 필요 8건'],
            notes: '<p>예제 6-8 로 Cypher 문 생성을 보여 준 뒤 예제 6-9 를 함께 실행합니다. 설국열차 개봉연도를 채우면 숫자가 어떻게 바뀌는지 예측하게 하고 확인합니다 (노드 23 · 관계 34). 다음 교시 예고: 이 파일을 LOAD CSV 로 AuraDB 에 적재. (13분)</p>' }
        ]
      },
      /* ------------------------------------------------------------------ 2교시 */
      {
        id: 'ch06-2',
        title: 'LOAD CSV · 제약 조건 · 인덱스',
        minutes: 50,
        goals: ['LOAD CSV WITH HEADERS 로 URL 의 CSV 를 한 줄씩 읽는다', 'toInteger · toFloat · split · date 로 문자열 값을 알맞은 형으로 바꾼다', '제약 조건 → 노드 → 관계 순서로 MERGE 해 적재한다', '고유 제약 조건과 인덱스를 만들고 SHOW 명령으로 확인한다', 'db.schema.visualization() 결과를 3차시 설계도와 비교한다'],
        flow: [['도입 · LOAD CSV 기본', 8], ['형 변환 함수', 7], ['제약 조건 → 노드 → 관계 적재', 13], ['인덱스 · IN TRANSACTIONS', 7], ['함께 해 보기: AuraDB 에 적재하고 스키마 비교', 15]],
        content: [
          { type: 'p', html: '1교시에 만든 <code>nodes.csv</code> · <code>rels.csv</code> 를 이제 Neo4j 에 넣습니다. Neo4j 에는 CSV 파일을 직접 읽는 명령 <code>LOAD CSV</code> 가 있어서, 파일이 수만 줄이어도 Cypher 문장 몇 개로 적재할 수 있습니다. 이번 교시에는 LOAD CSV 와 함께, 데이터가 많아질수록 꼭 필요한 <b>제약 조건</b>과 <b>인덱스</b>를 배웁니다.' },

          { type: 'h', text: 'LOAD CSV: CSV 를 한 줄씩 읽는 Cypher' },
          { type: 'p', html: '기본 모양은 다음과 같습니다.' },
          { type: 'code', title: 'Cypher 6-1. CSV 미리 보기와 줄 수 세기 (Neo4j Browser 에서 실행)', run: false, code: `// 처음 3줄만 미리 보기
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/<아이디>/<저장소>/main/nodes.csv' AS row
RETURN row
LIMIT 3;

// 전체 줄 수 세기 (첫 줄 제목은 빼고)
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/<아이디>/<저장소>/main/nodes.csv' AS row
RETURN count(row);`,
            desc: '결과는 <code>{id: "m01", label: "Movie", title: "기생충", released: "2019", name: null, born: null}</code> 처럼 보입니다. <code>&lt;아이디&gt;/&lt;저장소&gt;</code> 는 자신이 파일을 올린 GitHub 주소로 바꿉니다. 줄 수는 1교시 결과와 같은 <b>22</b> 가 나와야 합니다.' },
          { type: 'list', items: [
            '<code>LOAD CSV</code> — CSV 파일을 한 줄씩 읽습니다.',
            '<code>WITH HEADERS</code> — 첫 줄을 <b>칸 이름(제목)</b>으로 씁니다. 그러면 각 줄이 <code>row.id</code> · <code>row.title</code> 처럼 이름으로 꺼낼 수 있는 <b>맵(딕셔너리)</b>이 됩니다. 이 말을 빼면 <code>row[0]</code> · <code>row[1]</code> 처럼 번호로 꺼내는 리스트가 됩니다.',
            '<code>FROM \'주소\'</code> — 파일 위치입니다. 아래 표처럼 두 종류가 있습니다.',
            '<code>AS row</code> — 한 줄을 담을 변수 이름입니다. <code>line</code> 등 아무 이름이나 됩니다.'
          ] },
          { type: 'table', head: ['파일 위치', '주소 예', '쓸 수 있는 곳'], rows: [
            ['인터넷 주소 (https)', '<code>https://raw.githubusercontent.com/아이디/저장소/main/nodes.csv</code>', 'AuraDB · Desktop 모두'],
            ['import 폴더 (내 PC)', '<code>file:///nodes.csv</code>', 'Neo4j Desktop · 직접 설치한 서버만 (AuraDB 는 불가)']
          ], caption: 'AuraDB 는 클라우드에 있어서 내 PC 의 파일을 볼 수 없습니다. 파일을 GitHub 등에 올려 <b>인터넷 주소</b>로 읽어야 합니다.' },
          { type: 'callout', kind: 'tip', title: 'GitHub 에 CSV 올리고 raw 주소 얻기', html: '① GitHub 에 로그인해 새 저장소(public)를 만들고 <b>Add file → Upload files</b> 로 <code>nodes.csv</code> · <code>rels.csv</code> 를 올립니다. ② 올린 파일을 클릭한 뒤 오른쪽 위 <b>Raw</b> 버튼을 누릅니다. ③ 주소창의 <code>https://raw.githubusercontent.com/…</code> 주소를 복사해 FROM 뒤에 붙입니다. 일반 주소(<code>github.com/…/blob/…</code>)를 쓰면 CSV 가 아니라 웹 페이지가 읽혀 이상한 결과가 나오니 주의하세요. Neo4j Desktop 이라면 데이터베이스의 <b>… → Open folder → Import</b> 로 연 폴더에 파일을 넣고 <code>file:///nodes.csv</code> 로 읽어도 됩니다.' },
          { type: 'figure', html: FIG_LOAD, caption: '그림 6-4. LOAD CSV 는 파일을 한 줄씩 읽어 row 맵을 만들고, 그 아래 Cypher 를 줄마다 반복합니다. row 의 값은 <b>언제나 문자열</b>입니다.' },
          { type: 'p', html: 'LOAD CSV 가 만드는 <code>row</code> 는 Python 의 <code>csv.DictReader</code> 가 만드는 딕셔너리와 똑같은 모양입니다. 직접 확인해 봅시다.' },
          { type: 'code', title: '예제 6-10. LOAD CSV 의 row 를 Python 으로 흉내 내기', code: `import csv

with open('movies.csv', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))      # WITH HEADERS 와 같음

print('줄 수:', len(rows))
for row in rows[:2]:
    print(row)

# LOAD CSV 는 빈칸을 null 로 읽습니다 → Python 에서는 None 으로
last = {k: (v if v != '' else None) for k, v in rows[-1].items()}
print(last)
print("row['released'] 의 자료형:", type(rows[0]['released']).__name__)`,
            expect: "줄 수: 8\n{'movie_id': 'm01', 'title': '기생충', 'released': '2019', 'genres': '드라마|스릴러', 'director_id': 'p04'}\n{'movie_id': 'm02', 'title': '괴물', 'released': '2006', 'genres': 'SF|드라마', 'director_id': 'p04'}\n{'movie_id': 'm07', 'title': '설국열차', 'released': None, 'genres': 'SF|액션', 'director_id': 'p04'}\nrow['released'] 의 자료형: str",
            desc: '<code>\'2019\'</code> 에 따옴표가 붙어 있습니다 — 숫자가 아니라 <b>글자</b>입니다. CSV 파일에는 "자료형" 이라는 정보가 없기 때문에, LOAD CSV 도 모든 값을 글자로 가져옵니다.' },

          { type: 'h', text: 'row 의 값 형 변환: toInteger · toFloat · split · date' },
          { type: 'p', html: '글자 그대로 넣으면 문제가 생깁니다. 예를 들어 개봉연도가 글자 <code>"2019"</code> 이면 <code>WHERE m.released &gt; 2010</code> 이 숫자와 글자를 비교하게 되어 아무것도 찾지 못합니다. 그래서 적재할 때 알맞은 형으로 바꿉니다.' },
          { type: 'table', head: ['함수', '하는 일', '예', '결과'], rows: [
            ['<code>toInteger(s)</code>', '정수로', '<code>toInteger(\'2019\')</code>', '<code>2019</code>'],
            ['<code>toFloat(s)</code>', '실수로', '<code>toFloat(\'8.5\')</code>', '<code>8.5</code>'],
            ['<code>split(s, 구분자)</code>', '리스트로 나누기', '<code>split(\'드라마|스릴러\', \'|\')</code>', '<code>[\'드라마\', \'스릴러\']</code>'],
            ['<code>date(s)</code>', '날짜로', '<code>date(\'2019-05-30\')</code>', '<code>2019-05-30</code> (날짜형)'],
            ['<code>trim(s)</code>', '앞뒤 공백 지우기', '<code>trim(\' p04\')</code>', '<code>\'p04\'</code>'],
            ['<code>coalesce(a, b)</code>', 'a 가 null 이면 b', '<code>coalesce(row.role, \'미상\')</code>', '<code>\'미상\'</code>']
          ], caption: '자주 쓰는 형 변환 함수. 변환할 수 없는 값(빈칸 · 글자)을 toInteger · toFloat 에 넣으면 오류 대신 <code>null</code> 이 됩니다.' },
          { type: 'code', title: 'Cypher 6-2. 형 변환 함수 시험해 보기 (Neo4j Browser 에서 실행)', run: false, code: `RETURN toInteger('2019')            AS 정수,
       toFloat('8.5')               AS 실수,
       split('드라마|스릴러', '|')    AS 목록,
       date('2019-05-30')           AS 날짜,
       date('2019-05-30').year      AS 연도,
       toInteger('abc')             AS 잘못된값,
       toInteger(null)              AS 빈칸;`,
            desc: '마지막 두 칸은 오류가 아니라 <code>null</code> 입니다. 편리하지만, 잘못된 값이 <b>조용히 null 이 된다</b>는 뜻이기도 합니다. 그래서 1교시처럼 적재 전에 Python 으로 미리 검증해 두는 것이 중요합니다.' },
          { type: 'code', title: '예제 6-11. 형 변환을 하지 않으면 생기는 일', code: `def to_integer(s):          # Cypher toInteger 흉내: 안 되면 None(null)
    try:
        return int(s)
    except (TypeError, ValueError):
        return None

released = ['2019', '2006', '2003', '2022', '987']

print('글자로 정렬:', sorted(released))
print('숫자로 정렬:', sorted(to_integer(s) for s in released))

print("글자 '987' > '2019' ?", '987' > '2019')
print('숫자  987  >  2019  ?', 987 > 2019)

for s in ['2019', '', 'abc', None]:
    print(f'to_integer({s!r}) ->', to_integer(s))

genres = '범죄 | 드라마'
print('split 만:', genres.split('|'))
print('split + trim:', [g.strip() for g in genres.split('|')])`,
            expect: "글자로 정렬: ['2003', '2006', '2019', '2022', '987']\n숫자로 정렬: [987, 2003, 2006, 2019, 2022]\n글자 '987' > '2019' ? True\n숫자  987  >  2019  ? False\nto_integer('2019') -> 2019\nto_integer('') -> None\nto_integer('abc') -> None\nto_integer(None) -> None\nsplit 만: ['범죄 ', ' 드라마']\nsplit + trim: ['범죄', '드라마']",
            desc: '글자는 첫 글자부터 하나씩 비교하므로 <code>\'9\'</code> 로 시작하는 <code>\'987\'</code> 이 <code>\'2019\'</code> 보다 "큽니다". 숫자 데이터를 글자로 넣으면 정렬 · 비교 · 합계가 모두 틀어집니다. Cypher 에서도 <code>split</code> 뒤에 <code>trim</code> 을 함께 써야 공백이 남지 않습니다.' },

          { type: 'h', text: '적재 순서: 제약 조건 → 노드 → 관계' },
          { type: 'figure', html: FIG_ORDER, caption: '그림 6-5. 적재 네 단계. 관계는 양 끝 노드를 MATCH 로 찾아 잇기 때문에 노드가 먼저 있어야 합니다.' },
          { type: 'p', html: '<b>① 제약 조건 먼저.</b> 데이터를 넣기 전에 "id 는 레이블 안에서 하나뿐이어야 한다" 는 규칙을 데이터베이스에 걸어 둡니다. 이것을 <b>고유 제약 조건(uniqueness constraint)</b>이라고 합니다.' },
          { type: 'code', title: 'Cypher 6-3. 고유 제약 조건 만들기 (Neo4j Browser 에서 실행)', run: false, code: `CREATE CONSTRAINT movie_id IF NOT EXISTS
FOR (m:Movie) REQUIRE m.id IS UNIQUE;

CREATE CONSTRAINT person_id IF NOT EXISTS
FOR (p:Person) REQUIRE p.id IS UNIQUE;

CREATE CONSTRAINT genre_id IF NOT EXISTS
FOR (g:Genre) REQUIRE g.id IS UNIQUE;`,
            desc: '<code>movie_id</code> 는 제약 조건의 이름(아무 이름이나 가능), <code>FOR (m:Movie)</code> 는 적용할 레이블, <code>REQUIRE m.id IS UNIQUE</code> 는 규칙입니다. <code>IF NOT EXISTS</code> 를 붙이면 여러 번 실행해도 오류가 나지 않습니다. Neo4j Browser 는 <code>;</code> 로 나뉜 여러 문장을 차례로 실행합니다.' },
          { type: 'p', html: '<b>② 노드 적재.</b> nodes.csv 에는 레이블이 다른 행이 섞여 있으므로 <code>WITH row WHERE row.label = \'Movie\'</code> 로 한 레이블씩 골라 넣습니다. MERGE 의 괄호에는 5차시에 배운 대로 <b>식별 속성(id)만</b> 적고, 나머지는 SET 으로 붙입니다.' },
          { type: 'code', title: 'Cypher 6-4. nodes.csv 로 노드 적재 (Neo4j Browser 에서 실행)', run: false, code: `// 영화
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/<아이디>/<저장소>/main/nodes.csv' AS row
WITH row WHERE row.label = 'Movie'
MERGE (m:Movie {id: row.id})
SET m.title = row.title, m.released = toInteger(row.released);

// 사람
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/<아이디>/<저장소>/main/nodes.csv' AS row
WITH row WHERE row.label = 'Person'
MERGE (p:Person {id: row.id})
SET p.name = row.name, p.born = toInteger(row.born);

// 장르
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/<아이디>/<저장소>/main/nodes.csv' AS row
WITH row WHERE row.label = 'Genre'
MERGE (g:Genre {id: row.id})
SET g.name = row.name;`,
            desc: '실행하면 각각 "Added 6 labels, created 6 nodes" · "created 10 nodes" · "created 6 nodes" 처럼 나옵니다. MERGE 이므로 한 번 더 실행해도 노드가 늘지 않습니다 — 직접 확인해 보세요.' },
          { type: 'p', html: '<b>③ 관계 적재.</b> 관계 한 줄마다 <code>start</code> · <code>end</code> id 로 두 노드를 MATCH 하고, 그 사이를 MERGE 로 잇습니다. 이때 제약 조건이 만들어 준 인덱스 덕분에 id 로 노드를 아주 빨리 찾습니다.' },
          { type: 'code', title: 'Cypher 6-5. rels.csv 로 관계 적재 (Neo4j Browser 에서 실행)', run: false, code: `// 출연 (관계 속성 role 포함)
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/<아이디>/<저장소>/main/rels.csv' AS row
WITH row WHERE row.type = 'ACTED_IN'
MATCH (p:Person {id: row.start})
MATCH (m:Movie {id: row.end})
MERGE (p)-[r:ACTED_IN]->(m)
SET r.role = row.role;

// 감독
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/<아이디>/<저장소>/main/rels.csv' AS row
WITH row WHERE row.type = 'DIRECTED'
MATCH (p:Person {id: row.start})
MATCH (m:Movie {id: row.end})
MERGE (p)-[:DIRECTED]->(m);

// 장르
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/<아이디>/<저장소>/main/rels.csv' AS row
WITH row WHERE row.type = 'IN_GENRE'
MATCH (m:Movie {id: row.start})
MATCH (g:Genre {id: row.end})
MERGE (m)-[:IN_GENRE]->(g);

// 감독한 사람에게 Director 레이블 더하기 (3차시의 다중 레이블)
MATCH (p:Person)-[:DIRECTED]->(:Movie)
SET p:Director;`,
            desc: '관계 13 · 6 · 11 개가 생겨야 합니다. 마지막 문장은 3차시 설계도의 <code>:Person:Director</code> 를 데이터로부터 자동으로 붙입니다.' },
          { type: 'p', html: '관계를 노드보다 먼저 적재하면 어떻게 될까요? MATCH 가 아무것도 찾지 못하면 그 줄은 <b>오류 없이 그냥 건너뜁니다</b>. 그래서 "관계가 0개 생겼는데 오류도 없는" 당황스러운 상황이 됩니다. Python 으로 흉내 내 봅시다.' },
          { type: 'code', title: '예제 6-12. 적재 순서 흉내 내기: 관계 먼저 vs 노드 먼저', code: `node_rows = [('m01', 'Movie'), ('p01', 'Person'), ('p02', 'Person')]
rel_rows = [('p01', 'ACTED_IN', 'm01'), ('p02', 'ACTED_IN', 'm01'),
            ('p01', 'ACTED_IN', 'm01')]       # 마지막 줄은 중복

def load_nodes(db):
    for nid, label in node_rows:
        db['nodes'].setdefault(nid, label)    # MERGE: 있으면 그대로

def load_rels(db):
    for s, t, e in rel_rows:
        if s not in db['nodes'] or e not in db['nodes']:
            continue                          # MATCH 실패 → 조용히 건너뜀
        db['rels'].add((s, t, e))             # MERGE: 집합이라 중복 없음

wrong = {'nodes': {}, 'rels': set()}
load_rels(wrong)
load_nodes(wrong)
print('관계 먼저:', len(wrong['nodes']), '노드 /', len(wrong['rels']), '관계')

right = {'nodes': {}, 'rels': set()}
load_nodes(right)
load_rels(right)
print('노드 먼저:', len(right['nodes']), '노드 /', len(right['rels']), '관계')

load_nodes(right)
load_rels(right)                              # 한 번 더 실행해도
print('다시 실행:', len(right['nodes']), '노드 /', len(right['rels']), '관계')`,
            expect: '관계 먼저: 3 노드 / 0 관계\n노드 먼저: 3 노드 / 2 관계\n다시 실행: 3 노드 / 2 관계',
            desc: '노드 → 관계 순서를 지키고 MERGE 를 쓰면 몇 번을 실행해도 결과가 같습니다. 이런 성질 덕분에 적재 중간에 실패해도 <b>처음부터 다시 실행</b>하면 됩니다.' },
          { type: 'callout', kind: 'more', title: '원본 CSV 를 바로 불러올 수도 있습니다', html: '1교시처럼 Python 으로 미리 정제하지 않고, 원본 movies.csv 를 바로 읽어 Cypher 안에서 <code>trim</code> · <code>split</code> · <code>UNWIND</code> 로 처리할 수도 있습니다.<pre><code>LOAD CSV WITH HEADERS FROM \'…/movies.csv\' AS row\nWITH row WHERE row.released IS NOT NULL\nMERGE (m:Movie {id: trim(row.movie_id)})\nSET m.title = trim(row.title), m.released = toInteger(row.released)\nWITH m, row\nUNWIND split(row.genres, \'|\') AS g\nMERGE (genre:Genre {id: trim(g)})\nSET genre.name = trim(g)\nMERGE (m)-[:IN_GENRE]-&gt;(genre);</code></pre>간단한 데이터라면 이쪽이 빠르지만, 정제 · 검증 규칙이 복잡할수록 Python 으로 먼저 다듬고 확인 목록을 남기는 편이 안전합니다.' },

          { type: 'h', text: '고유 제약 조건과 중복 방지' },
          { type: 'p', html: '제약 조건을 걸어 두면 누군가 실수로 <code>CREATE</code> 를 써서 같은 id 의 노드를 하나 더 만들려 할 때 Neo4j 가 <b>거부</b>합니다. MERGE 를 아무리 조심해서 써도 생길 수 있는 중복을 데이터베이스가 대신 막아 주는 것입니다.' },
          { type: 'code', title: 'Cypher 6-6. 제약 조건이 중복을 막는 모습 (Neo4j Browser 에서 실행)', run: false, code: `// 이미 m01 이 있는데 CREATE 로 하나 더 → 오류!
CREATE (:Movie {id: 'm01', title: '복제 기생충'});

// MERGE 는 찾아서 쓰므로 문제없음
MERGE (m:Movie {id: 'm01'})
RETURN m.title;`,
            desc: '첫 문장은 <code>Node(…) already exists with label `Movie` and property `id` = \'m01\'</code> 같은 오류를 내고 아무것도 만들지 않습니다. 반대로, <b>이미 중복이 있는 상태</b>에서 제약 조건을 만들려고 하면 제약 조건 만들기 자체가 실패합니다. 그래서 제약 조건은 데이터를 넣기 <b>전에</b> 거는 것이 좋습니다.' },
          { type: 'code', title: '예제 6-13. 고유 제약 조건 흉내 내기', code: `class Graph:
    def __init__(self):
        self.nodes = []
        self.unique = {}                    # 레이블 -> 이미 쓰인 id 집합

    def create_constraint(self, label):
        ids = [n['id'] for n in self.nodes if n['label'] == label]
        if len(ids) != len(set(ids)):
            raise ValueError(f'{label} 에 이미 중복 id 가 있어 제약 조건을 만들 수 없음')
        self.unique[label] = set(ids)

    def create(self, label, **props):
        used = self.unique.get(label)
        if used is not None:
            if props['id'] in used:
                raise ValueError(f"{label} 의 id = {props['id']!r} 가 이미 있음")
            used.add(props['id'])
        self.nodes.append({'label': label, **props})

g = Graph()
g.create_constraint('Movie')
g.create('Movie', id='m01', title='기생충')
try:
    g.create('Movie', id='m01', title='복제 기생충')
except ValueError as err:
    print('거부:', err)
print('Movie 노드 수:', len(g.nodes))

h = Graph()                                  # 제약 조건 없이 먼저 넣으면
h.create('Movie', id='m01', title='기생충')
h.create('Movie', id='m01', title='복제 기생충')
try:
    h.create_constraint('Movie')
except ValueError as err:
    print('실패:', err)`,
            expect: "거부: Movie 의 id = 'm01' 가 이미 있음\nMovie 노드 수: 1\n실패: Movie 에 이미 중복 id 가 있어 제약 조건을 만들 수 없음",
            desc: '두 번째 그래프처럼 중복이 이미 들어간 뒤에는 제약 조건을 걸 수 없습니다. 그때는 5차시에 배운 집계(<code>MATCH (m:Movie) WITH m.id AS id, count(*) AS n WHERE n &gt; 1 RETURN id, n</code>)로 중복을 먼저 찾아 정리해야 합니다.' },
          { type: 'callout', kind: 'info', title: '다른 종류의 제약 조건', html: '고유 제약 조건 말고도 "이 속성은 반드시 있어야 한다" 는 <b>존재 제약 조건</b>(<code>REQUIRE m.title IS NOT NULL</code>)이나 "이 속성은 정수여야 한다" 는 <b>형 제약 조건</b>(<code>REQUIRE m.released IS :: INTEGER</code>)도 있습니다. 1교시의 필수 속성 검증을 데이터베이스가 직접 해 주는 셈입니다. 다만 이것들은 <b>Enterprise 에디션 · 유료 Aura</b> 등에서만 쓸 수 있어서, 무료 환경에서는 1교시처럼 적재 전에 Python 으로 검증하는 방법이 중요합니다.' },

          { type: 'h', text: '인덱스와 빠른 검색' },
          { type: 'p', html: '<b>인덱스</b>는 책 뒤의 "찾아보기" 와 같습니다. 찾아보기가 없으면 "송강호" 가 나오는 쪽을 찾으려고 책 전체를 넘겨야 하지만, 찾아보기가 있으면 ㅅ 칸에서 바로 쪽 번호를 찾습니다. Neo4j 도 인덱스가 없으면 <code>MATCH (p:Person {name: \'송강호\'})</code> 를 위해 모든 Person 노드를 하나씩 확인합니다(전체 훑기). 인덱스가 있으면 곧장 찾아갑니다.' },
          { type: 'code', title: 'Cypher 6-7. 인덱스 만들기와 확인 (Neo4j Browser 에서 실행)', run: false, code: `// 이름으로 자주 찾으니 인덱스를 만들어 둔다
CREATE INDEX person_name IF NOT EXISTS
FOR (p:Person) ON (p.name);

CREATE INDEX movie_title IF NOT EXISTS
FOR (m:Movie) ON (m.title);

// 지금 걸린 제약 조건과 인덱스 보기
SHOW CONSTRAINTS;
SHOW INDEXES;`,
            desc: '<code>SHOW INDEXES</code> 결과에는 직접 만든 person_name · movie_title 말고도 <b>movie_id · person_id · genre_id</b> 가 보입니다. 고유 제약 조건을 만들면 Neo4j 가 같은 이름의 인덱스를 <b>자동으로</b> 만들기 때문입니다. 그래서 id 에는 따로 인덱스를 만들 필요가 없습니다. 상태(state)가 <code>ONLINE</code> 이면 사용할 준비가 끝난 것입니다.' },
          { type: 'code', title: '예제 6-14. 전체 훑기 vs 인덱스: 몇 번 확인해야 찾을까?', code: `import random

random.seed(42)
N = 20000
people = [{'id': f'p{i:05d}', 'name': f'사람{i}'} for i in range(N)]
random.shuffle(people)
targets = ['사람7', '사람12345', '사람19999']

# 인덱스 없음: 앞에서부터 하나씩 확인
def scan(name):
    for count, p in enumerate(people, start=1):
        if p['name'] == name:
            return count
    return N

# 인덱스: 이름 -> 노드 를 미리 정리해 둔 찾아보기 (딕셔너리)
index = {p['name']: p for p in people}

for t in targets:
    hit = index[t]
    print(f'{t:10} 전체 훑기 {scan(t):6,}번 확인 / 인덱스 1번에 찾음 -> {hit["id"]}')

total = sum(scan(f'사람{i}') for i in range(0, N, 100))
print(f'200명을 찾을 때 전체 훑기 평균: {total / 200:,.0f}번')`,
            desc: '노드가 2만 개면 전체 훑기는 평균 1만 번쯤 확인해야 하지만, 인덱스는 거의 한 번에 찾습니다. 노드가 많아질수록 차이는 더 커집니다. 대신 인덱스는 저장 공간을 쓰고 데이터를 넣을 때마다 갱신해야 하므로, <b>자주 찾는 속성에만</b> 만듭니다.' },

          { type: 'h', text: '대용량 적재: CALL { } IN TRANSACTIONS' },
          { type: 'p', html: 'LOAD CSV 는 기본적으로 파일 전체를 <b>하나의 트랜잭션</b>(한 번에 성공하거나 한 번에 취소되는 작업 묶음)으로 처리합니다. 수십만 줄이 넘으면 메모리가 부족해질 수 있어서, 몇천 줄씩 <b>나눠서 저장</b>하도록 감쌉니다.' },
          { type: 'code', title: 'Cypher 6-8. 1000줄씩 나눠 적재하기 (Neo4j Browser 에서 실행)', run: false, code: `:auto
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/<아이디>/<저장소>/main/rels.csv' AS row
CALL (row) {
  WITH row WHERE row.type = 'ACTED_IN'
  MATCH (p:Person {id: row.start})
  MATCH (m:Movie {id: row.end})
  MERGE (p)-[r:ACTED_IN]->(m)
  SET r.role = row.role
} IN TRANSACTIONS OF 1000 ROWS;`,
            desc: 'Neo4j Browser 에서는 맨 앞에 <code>:auto</code> 를 붙여야 실행됩니다. <code>CALL (row) { … }</code> 는 Neo4j 5.21 이후의 문법이고, 이전 버전에서는 <code>CALL { WITH row … }</code> 로 씁니다. 우리 예제는 30줄뿐이라 필요 없지만, 실제 공공데이터처럼 큰 파일을 다룰 때 기억해 두세요.' },
          { type: 'code', title: '예제 6-15. IN TRANSACTIONS 흉내: 1000줄씩 묶어 저장', code: `rows = [f'row{i}' for i in range(2350)]
BATCH = 1000

saved = 0
for start in range(0, len(rows), BATCH):
    chunk = rows[start:start + BATCH]
    # 여기서 chunk 의 줄마다 MATCH · MERGE 를 하고, 끝나면 한 번 저장(커밋)
    saved += len(chunk)
    print(f'트랜잭션 {start // BATCH + 1}: {len(chunk):4}줄 저장 (누적 {saved})')`,
            expect: '트랜잭션 1: 1000줄 저장 (누적 1000)\n트랜잭션 2: 1000줄 저장 (누적 2000)\n트랜잭션 3:  350줄 저장 (누적 2350)',
            desc: '2,350줄이 세 번에 나뉘어 저장됩니다. 중간에 실패해도 이미 저장된 묶음은 남아 있고, MERGE 로 썼다면 처음부터 다시 실행해도 중복이 생기지 않습니다.' },

          { type: 'h', text: '완성된 스키마 확인: db.schema.visualization()' },
          { type: 'p', html: '마지막 단계는 <b>확인</b>입니다. 넣은 데이터를 거꾸로 요약해 그린 스키마가 3차시에 그렸던 설계도와 같은지 비교합니다. 다르다면 변환이나 적재 어딘가에 실수가 있다는 뜻입니다.' },
          { type: 'code', title: 'Cypher 6-9. 개수와 스키마 확인 (Neo4j Browser 에서 실행)', run: false, code: `// 스키마 그림
CALL db.schema.visualization();

// 레이블별 노드 수
MATCH (n) RETURN labels(n) AS 레이블, count(*) AS 개수;

// 관계 타입별 개수
MATCH ()-[r]->() RETURN type(r) AS 관계, count(*) AS 개수;

// 실제로 나타난 (출발 레이블)-[관계]->(도착 레이블) 조합
MATCH (a)-[r]->(b)
RETURN DISTINCT labels(a) AS 출발, type(r) AS 관계, labels(b) AS 도착;`,
            desc: '레이블별 개수는 Movie 6 · Person 10 · Genre 6 (그중 감독 3명은 <code>["Person", "Director"]</code>) 이고, 관계는 ACTED_IN 13 · IN_GENRE 11 · DIRECTED 6 이어야 1교시 결과와 일치합니다. 마지막 질의 결과에 <code>Movie → Movie</code> 같은 조합이 보인다면 domain/range 위반이 들어간 것입니다.' },
          { type: 'figure', html: FIG_SCHEMA, caption: '그림 6-6. 왼쪽은 데이터를 넣기 전에 그린 설계도, 오른쪽은 넣은 뒤 Neo4j 가 그려 준 스키마. 모양이 같으면 지식그래프가 설계대로 만들어진 것입니다.' },
          { type: 'p', html: '마지막 질의(<code>RETURN DISTINCT labels(a), type(r), labels(b)</code>)의 결과를 Python 으로 옮겨 설계도와 자동으로 비교하고, 스키마 그림도 그려 봅시다.' },
          { type: 'code', title: '예제 6-16. 적재 결과 스키마와 3차시 설계도 비교하기', code: `import matplotlib.pyplot as plt

# 3차시 설계도: (출발, 관계, 도착)
design = {('Person', 'ACTED_IN', 'Movie'), ('Person', 'DIRECTED', 'Movie'),
          ('Movie', 'IN_GENRE', 'Genre')}

# Neo4j 에서 RETURN DISTINCT labels(a), type(r), labels(b) 로 얻은 결과
loaded = [(['Person'], 'ACTED_IN', ['Movie']),
          (['Person', 'Director'], 'DIRECTED', ['Movie']),
          (['Movie'], 'IN_GENRE', ['Genre'])]

found = set()
for a, t, b in loaded:
    found.add((a[0], t, b[0]))         # 첫 레이블(대표 클래스)로 비교
print('설계도에만 있음 :', design - found or '없음')
print('결과에만 있음   :', found - design or '없음')
print('일치?', design == found)

pos = {'Person': (0, 1), 'Movie': (3, 1), 'Genre': (3, -0.6)}
fig, ax = plt.subplots(figsize=(7, 4))
for name, (x, y) in pos.items():
    ax.add_patch(plt.Circle((x, y), 0.45, alpha=0.3))
    ax.text(x, y, name, ha='center', va='center', fontsize=12)
for (a, t, b), rad in zip(sorted(found), [0.0, -0.4, 0.0]):
    ax.annotate('', xy=pos[b], xytext=pos[a],
                arrowprops=dict(arrowstyle='->', lw=1.5, shrinkA=30, shrinkB=30,
                                connectionstyle=f'arc3,rad={rad}'))
    mx, my = (pos[a][0] + pos[b][0]) / 2, (pos[a][1] + pos[b][1]) / 2
    ax.text(mx + (0.35 if a == 'Movie' else 0), my + (0.15 if rad == 0 else -0.75), t,
            ha='center', fontsize=10)
ax.set_xlim(-1, 4.2); ax.set_ylim(-1.4, 2); ax.set_aspect('equal'); ax.axis('off')
ax.set_title('적재된 지식그래프의 스키마')
plt.show()`,
            expect: '설계도에만 있음 : 없음\n결과에만 있음   : 없음\n일치? True',
            desc: '집합의 빼기(<code>design - found</code>)로 "설계도에는 있는데 데이터에는 없는 관계" 와 그 반대를 한 번에 찾습니다. <code>loaded</code> 에 <code>([\'Movie\'], \'ACTED_IN\', [\'Movie\'])</code> 를 한 줄 넣어 다시 실행해 보세요 — 결과에만 있는 조합으로 바로 드러납니다.' },

          { type: 'h', text: '함께 해 보기: AuraDB 에 적재하고 설계도와 비교하기' },
          { type: 'p', html: '이제 처음부터 끝까지 직접 해 봅니다. 3차시에 만든 AuraDB(또는 Neo4j Desktop)를 열고 아래 순서대로 진행하세요.' },
          { type: 'list', ordered: true, items: [
            '1교시 <b>예제 6-9</b> 를 실행해 <code>nodes.csv</code> · <code>rels.csv</code> 를 만들고, 결과 창의 파일 목록에서 내려받습니다. (또는 예제 6-9 의 결과와 같은 내용을 직접 만들어도 됩니다.)',
            'GitHub 저장소에 두 파일을 올리고 <b>Raw</b> 주소를 복사합니다.',
            'Neo4j Browser 에서 <code>MATCH (n) DETACH DELETE n</code> 으로 이전 차시 데이터를 비웁니다.',
            '<b>Cypher 6-3</b>(제약 조건) → <b>6-4</b>(노드) → <b>6-5</b>(관계) 순서로 실행합니다. 주소는 내 Raw 주소로 바꿉니다.',
            '<b>Cypher 6-9</b> 로 개수(노드 22 · 관계 30)와 스키마 그림을 확인하고, 그림 6-6 · 3차시 설계도와 비교합니다.',
            'Cypher 6-4 · 6-5 를 한 번 더 실행해 개수가 그대로인지(MERGE 의 효과), Cypher 6-6 으로 중복 CREATE 가 거부되는지 확인합니다.'
          ] },
          { type: 'code', title: 'Cypher 6-10. 적재가 잘 되었는지 질문으로 확인하기 (Neo4j Browser 에서 실행)', run: false, code: `// 봉준호 감독 영화와 장르 — 설계도의 경로를 그대로 따라가기
MATCH (d:Director {name: '봉준호'})-[:DIRECTED]->(m:Movie)-[:IN_GENRE]->(g:Genre)
RETURN m.title AS 영화, m.released AS 개봉, collect(g.name) AS 장르
ORDER BY 개봉;

// 송강호의 배역 — 관계 속성 role 확인
MATCH (:Person {name: '송강호'})-[r:ACTED_IN]->(m:Movie)
RETURN m.title AS 영화, r.role AS 배역
ORDER BY m.released;`,
            desc: '봉준호 감독 영화는 살인의 추억 · 괴물 · 기생충 3편이 나와야 합니다 (설국열차는 1교시 검증에서 빠졌습니다). <code>ORDER BY 개봉</code> 이 숫자 순서로 정렬된다면 toInteger 형 변환도 잘 된 것입니다.' },
          { type: 'code', title: '예제 6-17. 적재 결과 점검표 만들기', code: `# 1교시 예제 6-9 의 결과 (기대값)
expected = {'Movie': 6, 'Person': 10, 'Genre': 6,
            'ACTED_IN': 13, 'DIRECTED': 6, 'IN_GENRE': 11}

# Neo4j 에서 Cypher 6-9 로 센 결과를 옮겨 적기 (예: DIRECTED 를 깜빡한 경우)
neo4j = {'Movie': 6, 'Person': 10, 'Genre': 6,
         'ACTED_IN': 13, 'DIRECTED': 0, 'IN_GENRE': 11}

print(f"{'항목':10}{'기대':>6}{'실제':>6}  결과")
for key, want in expected.items():
    got = neo4j.get(key, 0)
    mark = '✓' if got == want else '✗ 확인 필요'
    print(f'{key:10}{want:6}{got:6}  {mark}')
print('노드 합계:', sum(neo4j[k] for k in ['Movie', 'Person', 'Genre']),
      '/ 관계 합계:', sum(neo4j[k] for k in ['ACTED_IN', 'DIRECTED', 'IN_GENRE']))`,
            expect: '항목            기대    실제  결과\nMovie          6     6  ✓\nPerson        10    10  ✓\nGenre          6     6  ✓\nACTED_IN      13    13  ✓\nDIRECTED       6     0  ✗ 확인 필요\nIN_GENRE      11    11  ✓\n노드 합계: 22 / 관계 합계: 24',
            desc: '<code>neo4j</code> 딕셔너리의 숫자를 내가 실제로 얻은 값으로 바꿔 실행하세요. ✗ 가 나온 항목은 해당 Cypher 문(주소 · WHERE 조건 · MATCH 레이블)을 다시 확인합니다. 이렇게 "기대값과 실제값을 비교하는 점검표" 는 큰 데이터를 다룰 때 아주 중요한 습관입니다.' },
          { type: 'callout', kind: 'warn', title: '자주 만나는 LOAD CSV 문제', html: '① <b>Couldn\'t load the external resource</b> — 주소가 틀렸거나 GitHub 저장소가 비공개입니다. 주소를 브라우저 주소창에 붙여 CSV 글자가 보이는지 확인하세요. ② <b>관계가 0개</b> — 노드를 먼저 넣지 않았거나, MATCH 의 레이블 · 속성 이름(<code>row.start</code> 등)이 CSV 제목과 다릅니다. ③ <b>한글이 깨짐</b> — 파일이 UTF-8 이 아닙니다. 엑셀에서 저장했다면 "CSV UTF-8" 형식으로 다시 저장하세요. ④ <b>숫자 비교가 이상함</b> — toInteger 를 빼먹어 글자로 들어갔습니다.' },
          { type: 'callout', kind: 'info', teacher: true, title: '수업 준비 · 오개념 지도 팁', html: '① 수업 전에 교사용 GitHub 저장소에 nodes.csv · rels.csv 를 미리 올려 두고 Raw 주소를 공유하면, GitHub 계정이 없는 학생도 실습할 수 있습니다. ② AuraDB 에서 <code>file:///</code> 를 쓰려는 학생이 많습니다 — 클라우드 서버는 내 PC 를 볼 수 없다는 점을 그림 6-4 로 설명합니다. ③ "제약 조건 = 인덱스" 로 혼동하기 쉽습니다. 제약 조건은 <b>규칙</b>, 인덱스는 <b>찾아보기</b>이고, 고유 제약 조건이 인덱스를 함께 만들어 줄 뿐입니다. ④ 관계 0개 문제는 일부러 Cypher 6-5 를 먼저 실행해 보여 주면 오래 기억합니다. ⑤ 다음 차시(7차시)에는 이 그래프를 Python 드라이버로 다루므로, 적재한 데이터베이스를 지우지 말고 남겨 두게 하세요.' }
        ],
        slides: [
          { layout: 'title', title: 'LOAD CSV · 제약 조건 · 인덱스', subtitle: '2교시 · 표를 Neo4j 지식그래프로 적재하기',
            notes: '<p>1교시의 nodes.csv · rels.csv 를 다시 보여 주고 "이제 이 파일을 Neo4j 에 넣습니다" 로 시작합니다. Cypher 6-1 로 미리 보기를 실행해 row 가 맵이고 값이 모두 문자열임을 함께 확인합니다. AuraDB 는 file:/// 를 못 쓴다는 점을 먼저 짚습니다. (8분)</p>' },
          { layout: 'table', title: 'row 의 값은 언제나 문자열 → 형 변환', head: ['함수', '예', '결과'], rows: [
            ['toInteger', "toInteger('2019')", '2019'], ['toFloat', "toFloat('8.5')", '8.5'],
            ['split', "split('드라마|스릴러', '|')", "['드라마', '스릴러']"], ['date', "date('2019-05-30')", '날짜형'],
            ['trim', "trim(' p04')", "'p04'"], ['잘못된 값', "toInteger('abc')", 'null (오류 아님!)']
          ], lead: "글자 '987' > '2019' 는 참 — 형 변환을 빼먹으면 비교 · 정렬이 틀어짐",
            notes: '<p>예제 6-11 을 실행해 글자 정렬과 숫자 정렬의 차이를 보여 줍니다. 💬 "toInteger 가 오류 대신 null 을 주면 좋은 점과 나쁜 점은?" → 적재가 멈추지 않지만, 잘못된 값이 조용히 사라짐. (7분)</p>' },
          { layout: 'diagram', title: '적재 순서: 제약 조건 → 노드 → 관계 → 확인', html: FIG_ORDER, caption: '관계를 먼저 넣으면 MATCH 실패 → 관계 0개 (오류도 없음)',
            notes: '<p>Cypher 6-3 → 6-4 → 6-5 를 차례로 실행하며 매번 "created N nodes/relationships" 숫자를 1교시 결과와 맞춰 봅니다. 예제 6-12 로 순서를 바꾸면 관계가 0개가 되는 것을 보여 주고, Cypher 6-6 으로 중복 CREATE 가 거부되는 오류 메시지를 함께 읽습니다. (13분)</p>' },
          { layout: 'two', title: '제약 조건 vs 인덱스', left: { title: '고유 제약 조건 = 규칙', bullets: ['CREATE CONSTRAINT … REQUIRE m.id IS UNIQUE', '중복 CREATE 를 거부', '데이터를 넣기 전에 걸기', '인덱스를 자동으로 함께 만듦'] }, right: { title: '인덱스 = 찾아보기', bullets: ['CREATE INDEX … ON (p.name)', '전체 훑기 대신 바로 찾기', '자주 찾는 속성에만', 'SHOW CONSTRAINTS · SHOW INDEXES'] },
            notes: '<p>예제 6-14 로 전체 훑기 확인 횟수와 인덱스를 비교합니다. 💬 "모든 속성에 인덱스를 만들면?" → 저장 공간과 쓰기 시간이 늘어남. 대용량은 CALL { } IN TRANSACTIONS 로 나눠 적재한다는 것만 소개합니다(예제 6-15). (7분)</p>' },
          { layout: 'summary', title: '정리 · 함께 해 보기', bullets: ['LOAD CSV WITH HEADERS FROM \'https://…\' AS row — row 는 문자열 맵', 'toInteger · toFloat · split · date · trim 으로 형 변환', '제약 조건 → 노드 MERGE → 관계 MATCH·MATCH·MERGE', 'SHOW CONSTRAINTS · SHOW INDEXES · db.schema.visualization()', '실습: AuraDB 에 적재 → 노드 22 · 관계 30 → 설계도와 비교'],
            notes: '<p>함께 해 보기 6단계를 진행합니다. 교사용 Raw 주소를 공유해 두면 시간이 절약됩니다. 스키마 그림을 그림 6-6 과 나란히 띄워 비교하고, 예제 6-17 점검표로 개수를 맞춰 봅니다. 다음 차시 예고: Python 드라이버로 이 지식그래프를 다루고 추론하기 — 데이터베이스를 지우지 말 것. (15분)</p>' }
        ]
      }
    ]
  });
})();
