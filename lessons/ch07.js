/* 07차시 Python 으로 지식그래프 다루기와 추론 */
(function () {
  const ARROW = (id) => `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fill-arrow"/></marker></defs>`;

  /* 원 두 개 사이의 화살표 (원 테두리에서 시작 · 끝) */
  function edge(a, b, r, mk, label, cls, sw, dash) {
    const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / d, uy = dy / d;
    const x1 = (a[0] + ux * r).toFixed(1), y1 = (a[1] + uy * r).toFixed(1);
    const x2 = (b[0] - ux * (r + (mk ? 3 : 0))).toFixed(1), y2 = (b[1] - uy * (r + (mk ? 3 : 0))).toFixed(1);
    let s = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls || 'ln'}" stroke-width="${sw || 2}"${dash ? ' stroke-dasharray="6 4"' : ''}${mk ? ` marker-end="url(#${mk})"` : ''}/>`;
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

  /* 그림 7-1. Python 프로그램과 Neo4j 사이의 흐름 */
  const FIG_FLOW = `<svg viewBox="0 0 720 260" role="img" aria-label="왼쪽 내 PC 의 Python 프로그램이 .env 에서 접속 정보를 읽고, 드라이버가 Cypher 와 매개변수를 Neo4j 에 보내면, 레코드가 돌아와 DataFrame 과 그래프가 된다">
  ${ARROW('c07a1')}
  <rect x="10" y="10" width="440" height="240" rx="14" class="card-bg"/>
  <text x="230" y="34" text-anchor="middle" class="tx-b">내 PC 의 Python 프로그램</text>
  <rect x="26" y="50" width="120" height="56" rx="10" class="p2s"/>
  <text x="86" y="74" text-anchor="middle" class="tx-b">.env 파일</text>
  <text x="86" y="94" text-anchor="middle" class="tx-m">URI · 사용자 · 비번</text>
  <rect x="176" y="50" width="130" height="56" rx="10" class="p1"/>
  <text x="241" y="74" text-anchor="middle" class="tx-w">driver</text>
  <text x="241" y="94" text-anchor="middle" class="tx-w">(접속 담당)</text>
  <rect x="26" y="150" width="120" height="56" rx="10" class="p4s"/>
  <text x="86" y="174" text-anchor="middle" class="tx-b">records</text>
  <text x="86" y="194" text-anchor="middle" class="tx-m">결과 행 목록</text>
  <rect x="176" y="150" width="130" height="56" rx="10" class="p3"/>
  <text x="241" y="174" text-anchor="middle" class="tx-w">DataFrame</text>
  <text x="241" y="194" text-anchor="middle" class="tx-w">(pandas 표)</text>
  <rect x="330" y="150" width="105" height="56" rx="10" class="p5"/>
  <text x="382" y="174" text-anchor="middle" class="tx-w">막대그래프</text>
  <text x="382" y="194" text-anchor="middle" class="tx-w">matplotlib</text>
  <line x1="148" y1="78" x2="171" y2="78" class="ln" stroke-width="2" marker-end="url(#c07a1)"/>
  <line x1="148" y1="178" x2="171" y2="178" class="ln" stroke-width="2" marker-end="url(#c07a1)"/>
  <line x1="308" y1="178" x2="325" y2="178" class="ln" stroke-width="2" marker-end="url(#c07a1)"/>
  <rect x="540" y="70" width="170" height="120" rx="14" class="p2"/>
  <text x="625" y="118" text-anchor="middle" class="tx-w">Neo4j</text>
  <text x="625" y="142" text-anchor="middle" class="tx-w">AuraDB / Desktop</text>
  <path d="M308 70 L535 92" class="ln" stroke-width="2" fill="none" marker-end="url(#c07a1)"/>
  <text x="430" y="66" text-anchor="middle" class="tx-m">① Cypher + 매개변수</text>
  <path d="M535 170 L90 146" class="ln" stroke-width="2" stroke-dasharray="6 4" fill="none" marker-end="url(#c07a1)"/>
  <text x="470" y="146" text-anchor="middle" class="tx-m">② 결과 (records)</text>
  <text x="625" y="222" text-anchor="middle" class="tx-m">인터넷 너머의 데이터베이스</text>
</svg>`;

  /* 그림 7-2. 문자열 붙이기 vs 매개변수 */
  const FIG_PARAM = `<svg viewBox="0 0 720 250" role="img" aria-label="위쪽 문자열 붙이기에서는 사용자가 입력한 따옴표와 OR 이 명령의 일부가 되어 모든 영화가 나오고, 아래쪽 매개변수 방식에서는 입력 전체가 하나의 값으로만 취급된다">
  <rect x="10" y="10" width="700" height="110" rx="12" class="p2s"/>
  <text x="26" y="36" class="tx-b">✗ 문자열 붙이기:  "... WHERE m.title = '" + 입력 + "' ..."</text>
  <text x="26" y="64" class="tx">입력:  기생충' OR 1=1 OR m.title = '</text>
  <text x="26" y="94" class="tx">결과:  WHERE m.title = '기생충'</text>
  <rect x="262" y="78" width="150" height="24" rx="6" class="p2"/>
  <text x="337" y="95" text-anchor="middle" class="tx-w">OR 1=1</text>
  <text x="420" y="94" class="tx">OR m.title = ''  → 모든 영화!</text>
  <rect x="10" y="130" width="700" height="110" rx="12" class="p5s"/>
  <text x="26" y="156" class="tx-b">✓ 매개변수:  "... WHERE m.title = $title",  title=입력</text>
  <text x="26" y="184" class="tx">명령의 모양:  WHERE m.title = $title   (절대 바뀌지 않음)</text>
  <text x="26" y="214" class="tx">$title 의 값:</text>
  <rect x="140" y="198" width="290" height="24" rx="6" class="p5"/>
  <text x="285" y="215" text-anchor="middle" class="tx-w">"기생충' OR 1=1 OR m.title = '"</text>
  <text x="440" y="214" class="tx">→ 이런 제목은 없음 (0건)</text>
</svg>`;

  /* 그림 7-3. records → dict → DataFrame */
  const FIG_REC = `<svg viewBox="0 0 720 220" role="img" aria-label="Neo4j 가 돌려준 Record 객체 목록을 record.data() 로 딕셔너리 목록으로 바꾸고, pd.DataFrame 으로 표를 만든다">
  ${ARROW('c07a2')}
  <rect x="10" y="30" width="210" height="150" rx="12" class="card-bg"/>
  <text x="115" y="22" text-anchor="middle" class="tx-b">records (Record 목록)</text>
  <text x="22" y="64" class="tx">&lt;Record 장르='드라마'</text>
  <text x="40" y="84" class="tx">영화수=2 평균=9.25&gt;</text>
  <text x="22" y="114" class="tx">&lt;Record 장르='범죄'</text>
  <text x="40" y="134" class="tx">영화수=2 평균=8.75&gt;</text>
  <text x="22" y="164" class="tx-m">…</text>
  <rect x="255" y="30" width="210" height="150" rx="12" class="p4s"/>
  <text x="360" y="22" text-anchor="middle" class="tx-b">dict 목록</text>
  <text x="267" y="64" class="tx">{'장르': '드라마',</text>
  <text x="275" y="84" class="tx"> '영화수': 2, '평균': 9.25}</text>
  <text x="267" y="114" class="tx">{'장르': '범죄',</text>
  <text x="275" y="134" class="tx"> '영화수': 2, '평균': 8.75}</text>
  <text x="267" y="164" class="tx-m">…</text>
  <rect x="500" y="30" width="210" height="150" rx="12" class="p3s"/>
  <text x="605" y="22" text-anchor="middle" class="tx-b">DataFrame</text>
  <text x="512" y="64" class="tx-b">  장르   영화수  평균</text>
  <line x1="512" y1="74" x2="698" y2="74" class="ln"/>
  <text x="512" y="98" class="tx">0 드라마    2   9.25</text>
  <text x="512" y="124" class="tx">1 범죄      2   8.75</text>
  <text x="512" y="150" class="tx-m">…</text>
  <line x1="222" y1="105" x2="250" y2="105" class="ln" stroke-width="2" marker-end="url(#c07a2)"/>
  <line x1="467" y1="105" x2="495" y2="105" class="ln" stroke-width="2" marker-end="url(#c07a2)"/>
  <text x="237" y="205" text-anchor="middle" class="tx-m">record.data()</text>
  <text x="482" y="205" text-anchor="middle" class="tx-m">pd.DataFrame(…)</text>
</svg>`;

  /* 그림 7-4. 반복문 vs UNWIND $rows */
  const FIG_UNWIND = `<svg viewBox="0 0 720 230" role="img" aria-label="왼쪽 반복문 방식은 영화 8편마다 왕복 8번, 오른쪽 UNWIND 방식은 리스트 하나를 한 번 보내 Neo4j 안에서 8줄로 풀어 처리한다">
  ${ARROW('c07a3')}
  <rect x="10" y="10" width="345" height="210" rx="14" class="p2s"/>
  <rect x="365" y="10" width="345" height="210" rx="14" class="p5s"/>
  <text x="182" y="34" text-anchor="middle" class="tx-b">for 반복문: 한 줄마다 한 번씩</text>
  <text x="537" y="34" text-anchor="middle" class="tx-b">UNWIND $rows: 한 번에</text>
  <rect x="26" y="56" width="80" height="140" rx="10" class="card-bg"/>
  <text x="66" y="130" text-anchor="middle" class="tx">Python</text>
  <rect x="260" y="56" width="80" height="140" rx="10" class="p2"/>
  <text x="300" y="130" text-anchor="middle" class="tx-w">Neo4j</text>
  <line x1="108" y1="70" x2="255" y2="70" class="ln" stroke-width="1.5" marker-end="url(#c07a3)"/>
  <line x1="108" y1="92" x2="255" y2="92" class="ln" stroke-width="1.5" marker-end="url(#c07a3)"/>
  <line x1="108" y1="114" x2="255" y2="114" class="ln" stroke-width="1.5" marker-end="url(#c07a3)"/>
  <line x1="108" y1="136" x2="255" y2="136" class="ln" stroke-width="1.5" marker-end="url(#c07a3)"/>
  <text x="182" y="162" text-anchor="middle" class="tx-m">⋮</text>
  <line x1="108" y1="182" x2="255" y2="182" class="ln" stroke-width="1.5" marker-end="url(#c07a3)"/>
  <text x="182" y="212" text-anchor="middle" class="tx-m">8행 = 왕복 8번 (1만 행이면 1만 번)</text>
  <rect x="381" y="56" width="80" height="140" rx="10" class="card-bg"/>
  <text x="421" y="130" text-anchor="middle" class="tx">Python</text>
  <rect x="614" y="56" width="80" height="140" rx="10" class="p5"/>
  <text x="654" y="118" text-anchor="middle" class="tx-w">UNWIND</text>
  <text x="654" y="140" text-anchor="middle" class="tx-w">→ 8줄</text>
  <rect x="478" y="108" width="120" height="34" rx="8" class="p4s"/>
  <text x="538" y="130" text-anchor="middle" class="tx">rows = [8개]</text>
  <line x1="463" y1="125" x2="476" y2="125" class="ln" stroke-width="2"/>
  <line x1="600" y1="125" x2="609" y2="125" class="ln" stroke-width="2" marker-end="url(#c07a3)"/>
  <text x="537" y="212" text-anchor="middle" class="tx-m">리스트 하나 = 왕복 1번</text>
</svg>`;

  /* 그림 7-5. 추론: 사실 + 규칙 → 새 사실 */
  const FIG_INFER = `<svg viewBox="0 0 720 230" role="img" aria-label="명시된 사실 두 개, 추격자는 스릴러 영화이고 스릴러는 범죄의 하위 장르이다, 와 규칙이 합쳐져 추격자는 범죄 영화이다 라는 새 사실이 나온다">
  ${ARROW('c07a4')}
  <rect x="10" y="20" width="260" height="56" rx="10" class="card-bg"/>
  <text x="140" y="44" text-anchor="middle" class="tx-b">사실 ①  (적혀 있음)</text>
  <text x="140" y="66" text-anchor="middle" class="tx">추격자 —IN_GENRE→ 스릴러</text>
  <rect x="10" y="88" width="260" height="56" rx="10" class="card-bg"/>
  <text x="140" y="112" text-anchor="middle" class="tx-b">사실 ②  (적혀 있음)</text>
  <text x="140" y="134" text-anchor="middle" class="tx">스릴러 —SUBCLASS_OF→ 범죄</text>
  <rect x="10" y="156" width="260" height="62" rx="10" class="p4s"/>
  <text x="140" y="180" text-anchor="middle" class="tx-b">규칙</text>
  <text x="140" y="204" text-anchor="middle" class="tx">X 가 A 장르이고 A ⊂ B 이면 → X 는 B 장르</text>
  <rect x="320" y="80" width="110" height="70" rx="35" class="p1"/>
  <text x="375" y="112" text-anchor="middle" class="tx-w">추론</text>
  <text x="375" y="132" text-anchor="middle" class="tx-w">엔진</text>
  <line x1="272" y1="48" x2="322" y2="98" class="ln" stroke-width="2" marker-end="url(#c07a4)"/>
  <line x1="272" y1="116" x2="316" y2="116" class="ln" stroke-width="2" marker-end="url(#c07a4)"/>
  <line x1="272" y1="186" x2="322" y2="136" class="ln" stroke-width="2" marker-end="url(#c07a4)"/>
  <rect x="480" y="80" width="230" height="70" rx="10" class="p5"/>
  <text x="595" y="108" text-anchor="middle" class="tx-w">새 사실 (추론됨)</text>
  <text x="595" y="132" text-anchor="middle" class="tx-w">추격자 —IN_GENRE→ 범죄</text>
  <line x1="432" y1="115" x2="475" y2="115" class="ln" stroke-width="2" marker-end="url(#c07a4)"/>
  <text x="595" y="180" text-anchor="middle" class="tx-m">아무도 적지 않았지만 "참" 인 사실</text>
</svg>`;

  /* 그림 7-6. 장르 계층과 영화 */
  const FIG_TREE = (() => {
    const P = { 장르: [360, 40], 드라마: [90, 120], 범죄: [360, 120], 액션: [560, 120], SF: [660, 120], 스릴러: [270, 210], 누아르: [460, 210], 심리스릴러: [270, 295] };
    const CRIME = ['범죄', '스릴러', '누아르', '심리스릴러'];
    let s = `<svg viewBox="0 0 720 360" role="img" aria-label="장르 아래에 드라마, 범죄, 액션, SF 가 있고, 범죄 아래에 스릴러와 누아르, 스릴러 아래에 심리스릴러가 있다. 살인의 추억은 범죄, 추격자는 스릴러, 올드보이는 심리스릴러, 신세계는 누아르에 연결되어 있어 넷 모두 범죄 영화이다">${ARROW('c07a5')}`;
    [['드라마', '장르'], ['범죄', '장르'], ['액션', '장르'], ['SF', '장르'], ['스릴러', '범죄'], ['누아르', '범죄'], ['심리스릴러', '스릴러']].forEach(([a, b]) => { s += edge(P[a], P[b], 28, 'c07a5', ''); });
    Object.keys(P).forEach((k) => { s += circ(P[k], 28, k === '장르' ? 'p1' : (CRIME.includes(k) ? 'p2' : 'p4'), k === '심리스릴러' ? '' : k); });
    s += `<text x="270" y="292" text-anchor="middle" class="tx-w">심리</text><text x="270" y="308" text-anchor="middle" class="tx-w">스릴러</text>`;
    const M = [['살인의 추억', [200, 120], '범죄'], ['추격자', [130, 210], '스릴러'], ['올드보이', [130, 295], '심리스릴러'], ['신세계', [600, 210], '누아르']];
    M.forEach(([t, p, g]) => {
      s += `<rect x="${p[0] - 52}" y="${p[1] - 14}" width="104" height="28" rx="14" class="p3"/><text x="${p[0]}" y="${p[1] + 5}" text-anchor="middle" class="tx-w">${t}</text>`;
      const dir = P[g][0] > p[0] ? 1 : -1;
      s += `<line x1="${p[0] + dir * 54}" y1="${p[1]}" x2="${P[g][0] - dir * 31}" y2="${P[g][1]}" class="ln" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#c07a5)"/>`;
    });
    s += `<text x="360" y="345" text-anchor="middle" class="tx-m">실선 = SUBCLASS_OF (하위 → 상위) · 점선 = IN_GENRE (영화 → 장르) · 진한 원 = 범죄와 그 하위 장르</text></svg>`;
    return s;
  })();

  /* 그림 7-7. 위치 PART_OF 전이 */
  const FIG_PLACE = (() => {
    const P = { 역삼동: [70, 70], 강남구: [250, 70], 서울: [430, 70], 대한민국: [620, 140], 우동: [70, 210], 해운대구: [250, 210], 부산: [430, 210] };
    let s = `<svg viewBox="0 0 720 290" role="img" aria-label="역삼동은 강남구, 강남구는 서울, 서울은 대한민국의 일부이고, 우동은 해운대구, 해운대구는 부산, 부산은 대한민국의 일부이다. 점선은 추론으로 얻는 역삼동은 서울의 일부, 역삼동은 대한민국의 일부 같은 관계이다">${ARROW('c07a6')}`;
    [['역삼동', '강남구'], ['강남구', '서울'], ['서울', '대한민국'], ['우동', '해운대구'], ['해운대구', '부산'], ['부산', '대한민국']].forEach(([a, b]) => { s += edge(P[a], P[b], 32, 'c07a6', 'PART_OF'); });
    s += `<path d="M90 40 Q250 -5 405 45" class="ln" stroke-width="1.8" stroke-dasharray="6 4" fill="none" marker-end="url(#c07a6)"/>`;
    s += `<text x="250" y="22" text-anchor="middle" class="tx-m">추론: 역삼동 ⊂ 서울</text>`;
    s += `<path d="M90 245 Q360 300 600 172" class="ln" stroke-width="1.8" stroke-dasharray="6 4" fill="none" marker-end="url(#c07a6)"/>`;
    s += `<text x="360" y="282" text-anchor="middle" class="tx-m">추론: 우동 ⊂ 대한민국 (3단계)</text>`;
    Object.keys(P).forEach((k) => { s += circ(P[k], 32, k === '대한민국' ? 'p2' : (['서울', '부산'].includes(k) ? 'p1' : (['강남구', '해운대구'].includes(k) ? 'p4' : 'p5')), k); });
    s += `<text x="70" y="128" text-anchor="middle" class="tx-m">동네</text><text x="250" y="128" text-anchor="middle" class="tx-m">구</text><text x="430" y="128" text-anchor="middle" class="tx-m">시</text><text x="620" y="196" text-anchor="middle" class="tx-m">나라</text>`;
    s += `</svg>`;
    return s;
  })();

  /* 그림 7-8. 역관계와 대칭 관계 */
  const FIG_INV = `<svg viewBox="0 0 720 230" role="img" aria-label="왼쪽 역관계: 역삼동 PART_OF 강남구 가 있으면 강남구 HAS_PART 역삼동. 오른쪽 대칭 관계: 송강호와 이선균이 같은 영화에 출연했으면 서로 WORKED_WITH">
  ${ARROW('c07a7')}
  <rect x="10" y="10" width="345" height="210" rx="14" class="card-bg"/>
  <rect x="365" y="10" width="345" height="210" rx="14" class="card-bg"/>
  <text x="182" y="36" text-anchor="middle" class="tx-b">역관계 (inverse)</text>
  <text x="537" y="36" text-anchor="middle" class="tx-b">대칭 관계 (symmetric)</text>
  ${circ([80, 120], 34, 'p5', '역삼동')}
  ${circ([280, 120], 34, 'p4', '강남구')}
  <line x1="114" y1="108" x2="243" y2="108" class="ln" stroke-width="2" marker-end="url(#c07a7)"/>
  <text x="180" y="98" text-anchor="middle" class="tx-m">PART_OF</text>
  <line x1="246" y1="134" x2="117" y2="134" class="ln" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#c07a7)"/>
  <text x="180" y="156" text-anchor="middle" class="tx-m">HAS_PART (추론)</text>
  <text x="182" y="200" text-anchor="middle" class="tx-m">A →P→ B 이면 B →P⁻¹→ A</text>
  ${circ([440, 90], 30, 'p1', '송강호')}
  ${circ([640, 90], 30, 'p1', '이선균')}
  <rect x="490" y="150" width="100" height="28" rx="14" class="p3"/>
  <text x="540" y="169" text-anchor="middle" class="tx-w">기생충</text>
  <line x1="455" y1="116" x2="500" y2="148" class="ln" stroke-width="1.5" marker-end="url(#c07a7)"/>
  <line x1="625" y1="116" x2="580" y2="148" class="ln" stroke-width="1.5" marker-end="url(#c07a7)"/>
  <line x1="470" y1="90" x2="610" y2="90" class="ln" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="540" y="80" text-anchor="middle" class="tx-m">WORKED_WITH (추론)</text>
  <text x="537" y="205" text-anchor="middle" class="tx-m">A ~ B 이면 B ~ A (방향 없이 하나만 저장)</text>
</svg>`;

  /* 그림 7-9. 고정점까지 반복 */
  const FIG_FIX = `<svg viewBox="0 0 720 200" role="img" aria-label="0회차 명시된 사실에 규칙을 적용하면 1회차에 새 사실이 생기고, 2회차에 또 생기고, 3회차에 새 사실이 0개가 되면 멈춘다. 이것이 고정점이다">
  ${ARROW('c07a8')}
  <rect x="10" y="40" width="140" height="80" rx="12" class="card-bg"/>
  <text x="80" y="70" text-anchor="middle" class="tx-b">0회차</text>
  <text x="80" y="96" text-anchor="middle" class="tx">명시된 사실</text>
  <rect x="195" y="40" width="140" height="80" rx="12" class="p4s"/>
  <text x="265" y="70" text-anchor="middle" class="tx-b">1회차</text>
  <text x="265" y="96" text-anchor="middle" class="tx">새 사실 +a</text>
  <rect x="380" y="40" width="140" height="80" rx="12" class="p4s"/>
  <text x="450" y="70" text-anchor="middle" class="tx-b">2회차</text>
  <text x="450" y="96" text-anchor="middle" class="tx">새 사실 +b</text>
  <rect x="565" y="40" width="145" height="80" rx="12" class="p5"/>
  <text x="637" y="70" text-anchor="middle" class="tx-w">n회차</text>
  <text x="637" y="96" text-anchor="middle" class="tx-w">새 사실 0 → 멈춤</text>
  <line x1="152" y1="80" x2="190" y2="80" class="ln" stroke-width="2" marker-end="url(#c07a8)"/>
  <line x1="337" y1="80" x2="375" y2="80" class="ln" stroke-width="2" marker-end="url(#c07a8)"/>
  <line x1="522" y1="80" x2="560" y2="80" class="ln" stroke-width="2" marker-end="url(#c07a8)"/>
  <text x="171" y="70" text-anchor="middle" class="tx-m">규칙</text>
  <text x="356" y="70" text-anchor="middle" class="tx-m">규칙</text>
  <text x="541" y="70" text-anchor="middle" class="tx-m">규칙</text>
  <text x="360" y="160" text-anchor="middle" class="tx-b">고정점(fixed point) = 규칙을 다시 적용해도 사실 집합이 더 이상 변하지 않는 상태</text>
  <text x="360" y="184" text-anchor="middle" class="tx-m">새 사실이 다른 규칙의 재료가 되므로, 한 번이 아니라 "변화가 없을 때까지" 반복합니다</text>
</svg>`;

  PY_COURSE.addChapter({
    id: 'ch07', no: '07', title: 'Python 으로 지식그래프 다루기와 추론',
    subtitle: 'neo4j 드라이버 · 매개변수 · pandas/matplotlib · UNWIND 적재 · 클래스 계층 · 전이 관계 · 고정점 추론',
    summary: '지금까지는 Neo4j Browser 에 Cypher 를 직접 입력했습니다. 이번 차시에는 <b>Python 프로그램이 Neo4j 와 대화</b>하게 만듭니다. 공식 <code>neo4j</code> 드라이버로 Cypher 를 실행하고, <b>매개변수($name)</b> 로 안전하게 값을 넘기고, 결과를 <b>pandas DataFrame</b> 으로 바꿔 <b>matplotlib</b> 으로 그립니다. 이어서 2차시 온톨로지의 <b>클래스 계층(subClassOf)</b> 과 <b>전이 관계(partOf)</b> 를 이용해, 아무도 적지 않았지만 참인 <b>숨은 사실을 추론</b>합니다. Cypher 가변 길이 경로로 한 번, Python 규칙 엔진으로 한 번 — 같은 추론을 두 가지 방법으로 해 봅니다.',
    goals: [
      'pip 로 neo4j 드라이버를 설치하고, 접속 정보를 .env 파일로 안전하게 관리할 수 있다',
      'GraphDatabase.driver 와 execute_query 로 Cypher 를 실행하고, 매개변수로 값을 넘길 수 있다',
      '질의 결과를 레코드 → 딕셔너리 → DataFrame 으로 바꾸고 막대그래프로 나타낼 수 있다',
      'UNWIND $rows 로 Python 데이터를 한 번에 적재할 수 있다',
      '클래스 계층 · 전이 · 역관계 · 대칭 규칙으로 새 사실을 추론하고, Cypher 가변 길이 경로와 Python 고정점 반복으로 구현할 수 있다'
    ],
    sections: [
      /* ------------------------------------------------------------------ 1교시 */
      {
        id: 'ch07-1',
        title: 'neo4j 드라이버와 pandas 연동',
        minutes: 50,
        goals: ['neo4j 드라이버를 설치하고 .env 로 접속 정보를 관리한다', 'execute_query 로 Cypher 를 실행하고 매개변수로 값을 넘긴다', '결과를 DataFrame 으로 바꿔 막대그래프 · 그래프 그림을 그린다', 'UNWIND $rows 로 여러 행을 한 번에 적재한다'],
        flow: [['도입 · 왜 Python 에서?', 5], ['준비: 설치와 .env', 8], ['execute_query 와 매개변수', 12], ['결과 → DataFrame → 그래프', 15], ['UNWIND 로 쓰기 · 정리', 10]],
        content: [
          { type: 'p', html: '6차시까지 우리는 Neo4j Browser 라는 <b>창</b>에 Cypher 를 직접 입력했습니다. 질문 몇 개를 던지기에는 충분하지만, 이런 일은 어렵습니다.' },
          { type: 'list', items: [
            '매일 아침 "장르별 영화 수" 를 뽑아 <b>그래프로 보고서</b>를 만들기',
            '엑셀 · 웹에서 모은 데이터 수천 행을 <b>자동으로</b> 그래프에 넣기',
            '사용자가 검색창에 입력한 이름으로 <b>프로그램이</b> 질문하기'
          ] },
          { type: 'p', html: '이런 일은 프로그램이 해야 합니다. 그래서 Neo4j 는 여러 언어용 <b>드라이버(driver)</b> 를 제공합니다. 드라이버는 "내 Python 프로그램과 Neo4j 사이의 <b>전화선</b>" 이라고 생각하면 됩니다. Python 이 Cypher 문장을 전화로 말하면, Neo4j 가 결과를 들려 줍니다.' },
          { type: 'figure', html: FIG_FLOW, caption: '그림 7-1. 이번 교시의 전체 흐름. 접속 정보는 <code>.env</code> 에서 읽고, 드라이버가 Cypher 와 매개변수를 보내면, 돌아온 결과(records)를 DataFrame 과 그래프로 바꿉니다.' },
          { type: 'callout', kind: 'info', title: '이번 교시의 코드는 두 종류입니다', html: '이 웹 페이지의 파이썬(브라우저 파이썬)은 보안상 <b>인터넷 너머의 데이터베이스에 접속할 수 없습니다.</b> 그래서 ① Neo4j 에 실제로 접속하는 코드는 제목에 <b>"(로컬 PC 에서 실행)"</b> 이라고 표시했으니 내 PC 에서 실행하고, ② 결과를 표 · 그래프로 만드는 코드는 <b>미리 받아 둔 결과 데이터</b>로 이 페이지에서 바로 ▶ 실행해 볼 수 있게 했습니다. 두 코드의 뒷부분(DataFrame · 그래프)은 똑같습니다.' },

          { type: 'h', text: '준비 1: 설치하기 (pip install)' },
          { type: 'p', html: '내 PC 에 Python 이 설치되어 있다면, 명령 프롬프트(Windows) 또는 터미널(macOS)에서 아래 한 줄로 필요한 꾸러미를 설치합니다. 꾸러미 이름은 <b><code>neo4j</code></b> 입니다 (옛 이름 <code>neo4j-driver</code> 는 더 이상 쓰지 않습니다).' },
          { type: 'code', title: '터미널 7-1. 꾸러미 설치 (로컬 PC 에서 실행)', run: false, code: `pip install neo4j pandas matplotlib python-dotenv

# 설치 확인
python -c "import neo4j; print(neo4j.__version__)"`,
            desc: '<code>python-dotenv</code> 는 다음에 만들 <code>.env</code> 파일을 읽어 주는 작은 도구입니다. Jupyter · VS Code 어디서 실행해도 같습니다.' },

          { type: 'h', text: '준비 2: 접속 정보는 코드가 아니라 .env 파일에' },
          { type: 'p', html: 'Neo4j 에 접속하려면 3차시에 저장해 둔 <b>세 가지 정보</b>가 필요합니다.' },
          { type: 'table', head: ['정보', '뜻', 'AuraDB 예', 'Neo4j Desktop 예'], rows: [
            ['URI', '데이터베이스의 주소', '<code>neo4j+s://ab12cd34.databases.neo4j.io</code>', '<code>neo4j://localhost:7687</code>'],
            ['사용자', '로그인 이름', '<code>neo4j</code> (또는 인스턴스 id)', '<code>neo4j</code>'],
            ['비밀번호', '로그인 비밀번호', '인스턴스를 만들 때 내려받은 파일 안에', '설치 때 정한 비밀번호']
          ], caption: 'URI 의 <code>+s</code> 는 "암호화(보안) 연결" 이라는 뜻입니다. AuraDB 는 항상 <code>neo4j+s://</code> 를 씁니다.' },
          { type: 'p', html: '이 정보를 코드 안에 <code>password = "abcd1234"</code> 처럼 직접 적으면 안 됩니다. 코드를 친구에게 보내거나 GitHub 에 올리는 순간 <b>비밀번호도 함께 공개</b>되기 때문입니다. 대신 <b><code>.env</code></b> 라는 별도 파일에 적어 두고, 코드는 그 파일을 읽기만 합니다.' },
          { type: 'code', title: '파일 7-1. .env 와 .gitignore (로컬 PC 의 프로젝트 폴더에 만들기)', run: false, code: `# ---------- .env (비밀 정보 — 절대 공유 · 업로드 금지) ----------
NEO4J_URI=neo4j+s://ab12cd34.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=여기에-내-비밀번호

# ---------- .gitignore (git 이 .env 를 무시하게) ----------
.env`,
            desc: 'AuraDB 인스턴스를 만들 때 내려받은 <code>Neo4j-…-Created-….txt</code> 파일을 열어 보면 이미 이 모양(<code>NEO4J_URI=…</code>)으로 적혀 있습니다. 그대로 복사해 <code>.env</code> 로 저장하면 됩니다. <code>=</code> 양옆에 공백을 넣지 않습니다.' },
          { type: 'code', title: '예제 7-1. .env 읽고 접속 확인하기 (로컬 PC 에서 실행)', run: false, code: `import os
from dotenv import load_dotenv
from neo4j import GraphDatabase

load_dotenv()                                   # .env 내용을 환경 변수로 불러오기
URI = os.getenv('NEO4J_URI')
AUTH = (os.getenv('NEO4J_USERNAME'), os.getenv('NEO4J_PASSWORD'))

with GraphDatabase.driver(URI, auth=AUTH) as driver:
    driver.verify_connectivity()                # 접속이 되는지 확인 (안 되면 오류)
    print('접속 성공!', URI)`,
            desc: '<code>GraphDatabase.driver(주소, auth=(사용자, 비밀번호))</code> 가 드라이버(전화선)를 만듭니다. <code>with … as driver:</code> 로 쓰면 블록이 끝날 때 연결을 <b>자동으로 닫아</b> 줍니다. 드라이버는 만드는 데 시간이 걸리므로 <b>프로그램에서 한 번만 만들고</b> 여러 질의에 다시 씁니다.' },
          { type: 'callout', kind: 'warn', title: '접속이 안 될 때 확인할 것', html: '① <b>ServiceUnavailable</b> — URI 오타, 또는 AuraDB 인스턴스가 일시정지(Paused) 상태입니다. Aura 콘솔에서 Resume 을 누르세요. ② <b>AuthError</b> — 비밀번호가 틀렸습니다. .env 에 따옴표나 공백이 섞였는지 확인합니다. ③ <b>None 이 들어감</b> — <code>load_dotenv()</code> 가 .env 를 못 찾았습니다. .env 가 <b>실행하는 파이썬 파일과 같은 폴더</b>에 있는지 확인하세요. ④ 회사 · 학교 네트워크가 7687 포트를 막는 경우도 있습니다.' },

          { type: 'h', text: 'execute_query 로 Cypher 실행하기' },
          { type: 'p', html: '드라이버가 준비되면 <code>driver.execute_query(Cypher문, …)</code> 한 줄로 질문합니다. 돌려받는 값은 <b>세 개</b>입니다.' },
          { type: 'table', head: ['돌려받는 값', '뜻', '예'], rows: [
            ['<code>records</code>', '결과 <b>행</b>의 목록 (Record 객체)', '<code>records[0][\'title\']</code> → \'기생충\''],
            ['<code>summary</code>', '실행 요약 (걸린 시간, 만든 노드 수 등)', '<code>summary.counters.nodes_created</code>'],
            ['<code>keys</code>', 'RETURN 에 쓴 열 이름 목록', '<code>[\'title\', \'released\']</code>']
          ] },
          { type: 'code', title: '예제 7-2. 첫 질의: 영화 목록 가져오기 (로컬 PC 에서 실행)', run: false, code: `import os
from dotenv import load_dotenv
from neo4j import GraphDatabase

load_dotenv()
URI = os.getenv('NEO4J_URI')
AUTH = (os.getenv('NEO4J_USERNAME'), os.getenv('NEO4J_PASSWORD'))

with GraphDatabase.driver(URI, auth=AUTH) as driver:
    records, summary, keys = driver.execute_query(
        'MATCH (m:Movie) RETURN m.title AS title, m.released AS released '
        'ORDER BY released',
        database_='neo4j',
    )
    print('열 이름:', keys)
    for r in records:
        print(r['title'], r['released'])     # 열 이름으로 꺼내기
    print('걸린 시간(ms):', summary.result_available_after)`,
            desc: 'Cypher 문장은 Browser 에 쓰던 것과 <b>완전히 같습니다</b>. 긴 문장은 따옴표 문자열 두 개를 나란히 쓰면 Python 이 하나로 이어 줍니다. <code>database_=\'neo4j\'</code> 처럼 이름 끝에 밑줄(<code>_</code>)이 붙은 인자는 드라이버의 <b>설정</b>이고, 밑줄이 없는 인자는 Cypher 에 넘기는 <b>매개변수</b>입니다 (바로 다음에 배웁니다).' },

          { type: 'h', text: '매개변수($name) 로 안전하게 값 넘기기' },
          { type: 'p', html: '이번에는 사용자가 입력한 제목의 영화를 찾는다고 합시다. 가장 먼저 떠오르는 방법은 <b>문자열 붙이기</b>입니다: <code>"… WHERE m.title = \'" + 입력 + "\' …"</code>. 그런데 이 방법은 아주 위험합니다. 입력에 <b>따옴표와 Cypher 명령</b>을 섞어 넣으면, 그 글자가 <b>명령의 일부</b>가 되어 버리기 때문입니다. 이것을 <b>인젝션(injection, 끼워 넣기) 공격</b>이라고 합니다.' },
          { type: 'figure', html: FIG_PARAM, caption: '그림 7-2. 문자열 붙이기는 입력이 명령의 모양을 바꿀 수 있고, 매개변수는 입력을 언제나 "값 하나" 로만 다룹니다.' },
          { type: 'code', title: '예제 7-3. 문자열 붙이기가 위험한 이유 눈으로 보기', code: `titles = ['기생충', '괴물', '살인의 추억', '올드보이']

def build_query(user_input):
    # 나쁜 방법: 입력을 그대로 문장에 붙인다
    return "MATCH (m:Movie) WHERE m.title = '" + user_input + "' RETURN m.title"

print('[정상 입력]')
print(build_query('기생충'))
print()
attack = "기생충' OR 1=1 OR m.title = '"
print('[나쁜 입력]')
print(build_query(attack))
print('→ OR 1=1 은 언제나 참이라서 모든 영화가 나옵니다:', titles)
print()

# 매개변수 방식: 문장 모양은 고정, 입력은 값으로만 비교
query = 'MATCH (m:Movie) WHERE m.title = $title RETURN m.title'
params = {'title': attack}
found = [t for t in titles if t == params['title']]
print('[매개변수]', query)
print('$title 의 값:', repr(params['title']))
print('→ 찾은 영화:', found, '(그런 제목은 없음)')`,
            expect: "[정상 입력]\nMATCH (m:Movie) WHERE m.title = '기생충' RETURN m.title\n\n[나쁜 입력]\nMATCH (m:Movie) WHERE m.title = '기생충' OR 1=1 OR m.title = '' RETURN m.title\n→ OR 1=1 은 언제나 참이라서 모든 영화가 나옵니다: ['기생충', '괴물', '살인의 추억', '올드보이']\n\n[매개변수] MATCH (m:Movie) WHERE m.title = $title RETURN m.title\n$title 의 값: \"기생충' OR 1=1 OR m.title = '\"\n→ 찾은 영화: [] (그런 제목은 없음)",
            desc: '나쁜 입력을 붙이면 <code>WHERE</code> 조건이 <code>… OR 1=1 OR …</code> 로 바뀌어 "모든 영화" 를 돌려줍니다. 더 나쁜 입력이라면 <code>DETACH DELETE</code> 같은 지우기 명령까지 끼워 넣을 수 있습니다. 매개변수 방식에서는 Neo4j 가 문장 모양을 먼저 이해한 뒤 <code>$title</code> 자리에 <b>값만</b> 넣으므로, 입력이 무엇이든 "그런 제목이 있나?" 만 확인합니다.' },
          { type: 'code', title: '예제 7-4. 매개변수로 배우의 출연작 찾기 (로컬 PC 에서 실행)', run: false, code: `import os
from dotenv import load_dotenv
from neo4j import GraphDatabase

load_dotenv()
URI = os.getenv('NEO4J_URI')
AUTH = (os.getenv('NEO4J_USERNAME'), os.getenv('NEO4J_PASSWORD'))

QUERY = '''
MATCH (p:Person {name: $name})-[:ACTED_IN]->(m:Movie)
WHERE m.released >= $since
RETURN m.title AS title, m.released AS released
ORDER BY released
'''

with GraphDatabase.driver(URI, auth=AUTH) as driver:
    name = input('배우 이름: ')                 # 예: 송강호
    records, _, _ = driver.execute_query(QUERY, name=name, since=2000,
                                         database_='neo4j')
    for r in records:
        print(r['released'], r['title'])`,
            desc: 'Cypher 안에 <code>$name</code> · <code>$since</code> 자리를 만들고, <code>execute_query(…, name=…, since=…)</code> 처럼 <b>같은 이름의 인자</b>로 값을 넘깁니다. 숫자는 숫자로, 리스트는 리스트로 그대로 넘어갑니다. 딕셔너리로 한꺼번에 넘기려면 <code>parameters_={\'name\': name, \'since\': 2000}</code> 를 씁니다. 따옴표 세 개(<code>\'\'\'</code>)로 감싸면 여러 줄 문장을 Browser 에서처럼 보기 좋게 쓸 수 있습니다.' },
          { type: 'callout', kind: 'tip', title: '매개변수의 또 다른 장점: 빠르다', html: '문장 모양이 같으면 Neo4j 는 한 번 세운 <b>실행 계획을 재사용</b>합니다. 문자열 붙이기는 값이 바뀔 때마다 다른 문장이 되어 매번 새로 계획을 세웁니다. 그래서 매개변수는 <b>안전하면서 빠르기도</b> 합니다. Neo4j Browser 에서도 <code>:param name =&gt; \'송강호\'</code> 로 매개변수를 정해 같은 문장을 시험할 수 있습니다.' },

          { type: 'h', text: '결과를 레코드 → 딕셔너리 → DataFrame 으로' },
          { type: 'p', html: '<code>records</code> 의 원소인 <b>Record</b> 는 "열 이름으로 값을 꺼낼 수 있는 한 행" 입니다. pandas 로 분석하려면 세 단계를 거칩니다.' },
          { type: 'figure', html: FIG_REC, caption: '그림 7-3. <code>record.data()</code> 는 한 행을 딕셔너리로 바꾸고, 딕셔너리 목록은 <code>pd.DataFrame()</code> 에 바로 넣을 수 있습니다.' },
          { type: 'p', html: '아래 예제는 Neo4j 없이도 실행되도록, 드라이버가 돌려주는 Record 를 <b>흉내 낸 작은 클래스</b>를 만들어 같은 과정을 보여 줍니다. 데이터는 5차시의 영화 8편 그래프에서 <code>장르별 영화 수 · 평균 평점</code> 을 물었을 때의 결과입니다.' },
          { type: 'code', title: '예제 7-5. 레코드 → 딕셔너리 → DataFrame', code: `import pandas as pd

class Record(dict):                 # 드라이버의 Record 흉내 (진짜는 neo4j.Record)
    def data(self):
        return dict(self)

# driver.execute_query(...) 가 돌려준 records 라고 생각합니다
records = [
    Record(장르='드라마', 영화수=2, 평균평점=9.25),
    Record(장르='범죄', 영화수=2, 평균평점=8.75),
    Record(장르='스릴러', 영화수=2, 평균평점=8.25),
    Record(장르='SF', 영화수=1, 평균평점=8.0),
    Record(장르='액션', 영화수=1, 평균평점=7.5),
]
print('① 첫 레코드에서 값 꺼내기:', records[0]['장르'], records[0]['평균평점'])

rows = [r.data() for r in records]   # ② 레코드 -> 딕셔너리
print('② 딕셔너리:', rows[0])

df = pd.DataFrame(rows)              # ③ 딕셔너리 목록 -> 표
print('③ DataFrame 크기:', df.shape)
display(df)`,
            expect: "① 첫 레코드에서 값 꺼내기: 드라마 9.25\n② 딕셔너리: {'장르': '드라마', '영화수': 2, '평균평점': 9.25}\n③ DataFrame 크기: (5, 3)\n    장르  영화수  평균평점\n0  드라마    2  9.25\n1   범죄    2  8.75\n2  스릴러    2  8.25\n3   SF    1  8.00\n4   액션    1  7.50",
            desc: '<code>[r.data() for r in records]</code> 는 "모든 레코드를 딕셔너리로 바꿔 리스트에 담아라" 라는 뜻입니다. RETURN 에서 붙인 <b>별칭(AS 장르)</b> 이 그대로 DataFrame 의 <b>열 이름</b>이 되므로, Cypher 를 쓸 때 별칭을 알기 쉽게 붙이는 습관이 중요합니다.' },
          { type: 'code', title: '예제 7-6. result_transformer_ 로 바로 DataFrame 받기 (로컬 PC 에서 실행)', run: false, code: `import os
import neo4j
from dotenv import load_dotenv
from neo4j import GraphDatabase

load_dotenv()
URI = os.getenv('NEO4J_URI')
AUTH = (os.getenv('NEO4J_USERNAME'), os.getenv('NEO4J_PASSWORD'))

QUERY = '''
MATCH (m:Movie)-[:IN_GENRE]->(g:Genre)
RETURN g.name AS 장르, count(m) AS 영화수, round(avg(m.score), 2) AS 평균평점
ORDER BY 평균평점 DESC
'''

with GraphDatabase.driver(URI, auth=AUTH) as driver:
    df = driver.execute_query(QUERY, database_='neo4j',
                              result_transformer_=neo4j.Result.to_df)
print(df)`,
            desc: '<code>result_transformer_=neo4j.Result.to_df</code> 를 주면 records · summary · keys 대신 <b>DataFrame 하나</b>를 돌려받습니다. 예제 7-5 의 세 단계를 드라이버가 대신해 주는 것이지요. 이 기능은 pandas 가 설치되어 있어야 동작합니다.' },

          { type: 'h', text: '브라우저 실습: 받아 둔 결과로 막대그래프 그리기' },
          { type: 'p', html: '실제 업무에서는 질의 결과를 <b>JSON 이나 CSV 파일로 저장</b>해 두고 나중에 분석하는 일이 많습니다 (<code>df.to_csv(\'genre_stats.csv\', index=False)</code>). 아래 예제는 그렇게 저장해 둔 JSON 글자를 읽어 DataFrame 을 만들고, 막대그래프 두 개를 그립니다.' },
          { type: 'code', title: '예제 7-7. 장르별 영화 수 · 평균 평점 막대그래프', code: `import json
import pandas as pd
import matplotlib.pyplot as plt

# 로컬 PC 에서 받아 저장해 둔 질의 결과 (JSON)
saved = '''[
 {"장르": "드라마", "영화수": 2, "평균평점": 9.25},
 {"장르": "범죄",   "영화수": 2, "평균평점": 8.75},
 {"장르": "스릴러", "영화수": 2, "평균평점": 8.25},
 {"장르": "SF",     "영화수": 1, "평균평점": 8.0},
 {"장르": "액션",   "영화수": 1, "평균평점": 7.5}
]'''
df = pd.DataFrame(json.loads(saved))
print(df.to_string(index=False))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
ax1.bar(df['장르'], df['영화수'], color='#4C78A8')
ax1.set_title('장르별 영화 수')
ax1.set_ylabel('편')
ax2.bar(df['장르'], df['평균평점'], color='#F58518')
ax2.set_title('장르별 평균 평점')
ax2.set_ylim(7, 10)
for x, y in zip(df['장르'], df['평균평점']):
    ax2.text(x, y + 0.05, f'{y:.2f}', ha='center')
plt.tight_layout()
plt.show()`,
            desc: '<code>json.loads(글자)</code> 는 JSON 글자를 Python 리스트로 바꿉니다. 오른쪽 그래프의 세로축을 7 부터 시작(<code>set_ylim(7, 10)</code>)해서 차이가 잘 보이게 했습니다. 다만 축을 0 에서 시작하지 않으면 차이가 실제보다 커 보이므로, 보고서에는 <b>축 범위를 꼭 함께 밝혀</b> 주세요.' },
          { type: 'p', html: '막대그래프는 "숫자" 를 보여 주지만, 지식그래프의 매력은 <b>연결</b>입니다. 질의 결과가 <code>(배우, 영화)</code> 쌍이라면 matplotlib 만으로도 간단한 그래프 그림을 그릴 수 있습니다. 노드를 원 위에 늘어놓고 선으로 이으면 됩니다.' },
          { type: 'code', title: '예제 7-8. 질의 결과(관계 목록)로 그래프 그림 그리기', code: `import math
import pandas as pd
import matplotlib.pyplot as plt

# MATCH (p:Person)-[:ACTED_IN]->(m:Movie) WHERE m.title IN [...] RETURN p.name, m.title
rows = [('송강호', '기생충'), ('이선균', '기생충'), ('조여정', '기생충'),
        ('송강호', '괴물'), ('배두나', '괴물'), ('박해일', '괴물'),
        ('송강호', '살인의 추억'), ('김상경', '살인의 추억'), ('박해일', '살인의 추억')]
df = pd.DataFrame(rows, columns=['배우', '영화'])

movies = list(dict.fromkeys(df['영화']))
actors = list(dict.fromkeys(df['배우']))
pos = {}
for i, m in enumerate(movies):                       # 영화는 안쪽 원
    a = 2 * math.pi * i / len(movies)
    pos[m] = (math.cos(a), math.sin(a))
for i, p in enumerate(actors):                       # 배우는 바깥 원
    a = 2 * math.pi * i / len(actors) + 0.3
    pos[p] = (2.2 * math.cos(a), 2.2 * math.sin(a))

fig, ax = plt.subplots(figsize=(6, 6))
for p, m in rows:
    ax.plot([pos[p][0], pos[m][0]], [pos[p][1], pos[m][1]], color='gray', lw=1, zorder=1)
for n, (x, y) in pos.items():
    color = '#F58518' if n in movies else '#4C78A8'
    ax.scatter(x, y, s=1400, color=color, zorder=2)
    ax.text(x, y, n, ha='center', va='center', color='white', fontsize=9, zorder=3)
ax.set_title('출연 관계 그래프 (주황 = 영화, 파랑 = 배우)')
ax.axis('equal')
ax.axis('off')
plt.show()
print('노드', len(pos), '개 · 관계', len(rows), '개')
print('여러 영화에 나온 배우:', df['배우'].value_counts()[lambda s: s > 1].to_dict())`,
            desc: '<code>dict.fromkeys(…)</code> 는 순서를 지키면서 중복을 없애는 요령입니다. 그림에서 선이 많이 모이는 노드(송강호)가 바로 4차시에서 배운 "연결이 많은 중심 인물" 입니다. 그래프 그림을 더 예쁘게 자동 배치하는 도구는 다음 차시에서 분석과 함께 다룹니다.' },
          { type: 'callout', kind: 'tip', title: '노드 · 관계를 통째로 RETURN 하면?', html: '<code>RETURN m</code> 처럼 노드 자체를 돌려받으면 Record 안에 <b>Node 객체</b>가 들어 있습니다. <code>dict(r[\'m\'])</code> 로 속성을 딕셔너리로, <code>r[\'m\'].labels</code> 로 레이블을 꺼낼 수 있지만, 표로 분석할 때는 <code>RETURN m.title AS title, m.released AS released</code> 처럼 <b>필요한 속성만 별칭을 붙여</b> 돌려받는 것이 가장 편합니다.' },

          { type: 'h', text: 'Python 으로 데이터 쓰기: UNWIND $rows' },
          { type: 'p', html: '이번에는 반대로 Python 의 데이터를 Neo4j 에 <b>넣어</b> 봅시다. 가장 쉬운 생각은 "행마다 <code>execute_query</code> 를 한 번씩 부르기" 입니다. 하지만 이렇게 하면 행마다 인터넷을 <b>왕복</b>해야 해서, 1만 행이면 1만 번 왕복합니다. 대신 <b>리스트 전체를 매개변수 하나($rows)</b> 로 보내고, Neo4j 안에서 5차시에 배운 <code>UNWIND</code> 로 한 줄씩 풀게 합니다.' },
          { type: 'figure', html: FIG_UNWIND, caption: '그림 7-4. 반복문은 행 수만큼 왕복하고, UNWIND $rows 는 한 번만 왕복합니다. 행이 많을수록 차이가 수십~수백 배로 커집니다.' },
          { type: 'code', title: '예제 7-9. DataFrame 을 $rows 매개변수로 준비하기', code: `import json
import pandas as pd

movies = pd.DataFrame({
    'title':  ['기생충', '괴물', '살인의 추억', '올드보이', '쉬리', '택시운전사', '신세계', '추격자'],
    'released': [2019, 2006, 2003, 2003, 1999, 2017, 2013, 2008],
    'genre':  ['드라마', 'SF', '범죄', '스릴러', '액션', '드라마', '범죄', '스릴러'],
    'score':  [9.5, 8.0, 9.0, 8.5, 7.5, 9.0, 8.5, 8.0],
})

rows = movies.to_dict('records')      # DataFrame -> 딕셔너리 목록
print('행 수:', len(rows))
print('첫 행 :', rows[0])

QUERY = '''UNWIND $rows AS row
MERGE (m:Movie {title: row.title})
SET m.released = row.released, m.score = row.score
MERGE (g:Genre {name: row.genre})
MERGE (m)-[:IN_GENRE]->(g)'''
print()
print(QUERY)
print()
print('보낼 매개변수 크기:', len(json.dumps({'rows': rows}, ensure_ascii=False)), '글자 · 왕복 1번')`,
            expect: "행 수: 8\n첫 행 : {'title': '기생충', 'released': 2019, 'genre': '드라마', 'score': 9.5}\n\nUNWIND $rows AS row\nMERGE (m:Movie {title: row.title})\nSET m.released = row.released, m.score = row.score\nMERGE (g:Genre {name: row.genre})\nMERGE (m)-[:IN_GENRE]->(g)\n\n보낼 매개변수 크기: 538 글자 · 왕복 1번",
            desc: '<code>df.to_dict(\'records\')</code> 는 DataFrame 을 "행마다 딕셔너리" 인 리스트로 바꿉니다. 이것이 <code>$rows</code> 에 그대로 들어가고, Cypher 에서는 <code>row.title</code> 처럼 <b>점(.)</b>으로 칸을 꺼냅니다. 6차시 <code>LOAD CSV … AS row</code> 와 모양이 같지요? 차이는 값이 문자열이 아니라 <b>원래 자료형(정수 · 실수)</b> 그대로라는 점입니다.' },
          { type: 'code', title: '예제 7-10. UNWIND $rows 로 한 번에 적재하기 (로컬 PC 에서 실행)', run: false, code: `import os
import pandas as pd
from dotenv import load_dotenv
from neo4j import GraphDatabase

load_dotenv()
URI = os.getenv('NEO4J_URI')
AUTH = (os.getenv('NEO4J_USERNAME'), os.getenv('NEO4J_PASSWORD'))

movies = pd.DataFrame({
    'title':  ['기생충', '괴물', '살인의 추억', '올드보이', '쉬리', '택시운전사', '신세계', '추격자'],
    'released': [2019, 2006, 2003, 2003, 1999, 2017, 2013, 2008],
    'genre':  ['드라마', 'SF', '범죄', '스릴러', '액션', '드라마', '범죄', '스릴러'],
    'score':  [9.5, 8.0, 9.0, 8.5, 7.5, 9.0, 8.5, 8.0],
})

QUERY = '''
UNWIND $rows AS row
MERGE (m:Movie {title: row.title})
SET m.released = row.released, m.score = row.score
MERGE (g:Genre {name: row.genre})
MERGE (m)-[:IN_GENRE]->(g)
'''

with GraphDatabase.driver(URI, auth=AUTH) as driver:
    _, summary, _ = driver.execute_query(QUERY, rows=movies.to_dict('records'),
                                         database_='neo4j')
    c = summary.counters
    print('만든 노드', c.nodes_created, '· 만든 관계', c.relationships_created,
          '· 설정한 속성', c.properties_set)`,
            desc: '처음 실행하면 "만든 노드 13 · 만든 관계 8" 처럼 나오고, 한 번 더 실행하면 MERGE 덕분에 노드 · 관계는 0 이 됩니다 (속성은 SET 이므로 다시 설정됨). <code>summary.counters</code> 로 무엇이 바뀌었는지 확인하는 습관을 들이세요. 행이 수만 개라면 1000 행씩 잘라 여러 번 보내면 됩니다 (6차시의 "나눠 적재하기" 와 같은 생각).' },
          { type: 'callout', kind: 'warn', title: '흔한 실수: NaN 과 넘파이 숫자', html: 'pandas 의 빈칸(<code>NaN</code>)을 그대로 보내면 Neo4j 에 "숫자가 아님" 값이 저장됩니다. 보내기 전에 <code>df = df.astype(object).where(df.notna(), None)</code> 로 빈칸을 <code>None</code>(Cypher 의 null)으로 바꾸세요. 또 날짜 칸(Timestamp)은 <code>str()</code> 로 바꾸거나 Cypher 에서 <code>date(row.d)</code> 로 변환하는 것이 안전합니다.' },

          { type: 'h', text: '함께 해 보기: 장르 통계 보고서 스크립트 완성' },
          { type: 'p', html: '지금까지의 조각을 모으면 "접속 → 질의 → 표 → 그래프 → 저장" 하는 <b>완전한 보고서 스크립트</b>가 됩니다. 내 PC 에서는 예제 7-11 을, 이 페이지에서는 예제 7-7 을 실행하면 같은 그래프가 나옵니다.' },
          { type: 'code', title: '예제 7-11. 장르별 통계 보고서 스크립트 (로컬 PC 에서 실행)', run: false, code: `import os
import neo4j
import matplotlib.pyplot as plt
from dotenv import load_dotenv
from neo4j import GraphDatabase

plt.rcParams['font.family'] = 'Malgun Gothic'      # macOS 는 'AppleGothic'
load_dotenv()
URI = os.getenv('NEO4J_URI')
AUTH = (os.getenv('NEO4J_USERNAME'), os.getenv('NEO4J_PASSWORD'))

QUERY = '''
MATCH (m:Movie)-[:IN_GENRE]->(g:Genre)
WHERE m.released >= $since
RETURN g.name AS 장르, count(m) AS 영화수, round(avg(m.score), 2) AS 평균평점
ORDER BY 평균평점 DESC
'''

with GraphDatabase.driver(URI, auth=AUTH) as driver:
    df = driver.execute_query(QUERY, since=1990, database_='neo4j',
                              result_transformer_=neo4j.Result.to_df)

print(df)
df.to_csv('genre_stats.csv', index=False, encoding='utf-8-sig')   # 엑셀용 저장

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
ax1.bar(df['장르'], df['영화수'])
ax1.set_title('장르별 영화 수')
ax2.bar(df['장르'], df['평균평점'])
ax2.set_title('장르별 평균 평점')
plt.tight_layout()
plt.savefig('genre_stats.png', dpi=150)
plt.show()`,
            desc: '<code>encoding=\'utf-8-sig\'</code> 로 저장하면 엑셀에서 열어도 한글이 깨지지 않습니다. <code>$since</code> 값만 바꾸면 "2010년 이후 영화" 같은 다른 보고서가 됩니다 — 매개변수의 힘입니다.' },
          { type: 'callout', kind: 'info', teacher: true, title: '수업 준비 · 지도 팁', html: '① 학생 PC 에 Python 이 없거나 설치 권한이 없으면, 로컬 예제는 교사 화면으로 시연하고 학생은 브라우저 예제(7-3 · 7-5 · 7-7 · 7-8 · 7-9)로 진행합니다. ② 5차시의 영화 8편 데이터가 남아 있어야 예제 7-11 결과가 예제 7-7 과 같습니다. 지웠다면 예제 7-10 을 먼저 실행하게 하세요. ③ <code>.env</code> 를 GitHub 에 올리는 사고가 실제로 매우 흔합니다 — .gitignore 를 꼭 함께 만들게 합니다. ④ "밑줄 붙은 인자(database_) = 설정, 밑줄 없는 인자 = 매개변수" 를 칠판에 적어 두면 혼동이 줄어듭니다.' }
        ],
        slides: [
          { layout: 'title', title: 'Python 으로 지식그래프 다루기', subtitle: '1교시 · neo4j 드라이버와 pandas 연동',
            notes: '<p>💬 "매일 아침 장르별 통계 그래프를 만들어야 한다면 Browser 로 할 수 있을까요?" → 손으로 매번 해야 함. 프로그램이 Neo4j 와 대화하게 만드는 것이 오늘 목표라고 소개하고 그림 7-1 로 전체 흐름을 보여 줍니다. 브라우저 파이썬은 DB 에 접속할 수 없어 "로컬 코드 / 브라우저 코드" 두 종류가 있음을 먼저 알립니다. (5분)</p>' },
          { layout: 'bullets', title: '준비와 첫 질의', bullets: ['<code>pip install neo4j pandas matplotlib python-dotenv</code>', '.env 에 NEO4J_URI · NEO4J_USERNAME · NEO4J_PASSWORD — 코드에 비밀번호 금지', '<code>GraphDatabase.driver(URI, auth=AUTH)</code> → 프로그램에서 한 번만', '<code>records, summary, keys = driver.execute_query(Cypher, …)</code>', '밑줄 인자(<code>database_</code>) = 설정 · 밑줄 없는 인자 = 매개변수'],
            notes: '<p>교사 PC 에서 예제 7-1 · 7-2 를 실제로 실행해 보여 줍니다. Aura 에서 내려받은 txt 파일이 이미 .env 모양이라는 점을 보여 주면 학생들이 쉽게 따라 합니다. 접속 오류 네 가지(callout)를 미리 짚습니다. (10분)</p>' },
          { layout: 'diagram', title: '문자열 붙이기 vs 매개변수', html: FIG_PARAM, caption: '입력은 언제나 "값" 으로만 — $name 을 쓰자',
            notes: '<p>예제 7-3 을 실행해 OR 1=1 이 끼어드는 모습을 보여 줍니다. 💬 "웹 사이트 검색창에 이런 글자를 넣으면 무슨 일이 생길까요?" → 남의 데이터가 보이거나 지워질 수 있음. 매개변수는 안전하고 실행 계획 재사용으로 빠르기도 하다는 점을 덧붙입니다. (10분)</p>' },
          { layout: 'code', title: '레코드 → 딕셔너리 → DataFrame → 막대그래프', code: `import pandas as pd
import matplotlib.pyplot as plt

records = [  # execute_query 결과를 r.data() 로 바꾼 모습
    {'장르': '드라마', '영화수': 2, '평균평점': 9.25},
    {'장르': '범죄', '영화수': 2, '평균평점': 8.75},
    {'장르': '스릴러', '영화수': 2, '평균평점': 8.25},
    {'장르': 'SF', '영화수': 1, '평균평점': 8.0},
    {'장르': '액션', '영화수': 1, '평균평점': 7.5},
]
df = pd.DataFrame(records)
display(df)
plt.figure(figsize=(6, 4))
plt.bar(df['장르'], df['평균평점'])
plt.ylim(7, 10)
plt.title('장르별 평균 평점')
plt.show()`, points: ['RETURN 의 별칭(AS) = DataFrame 의 열 이름', '로컬에서는 <code>result_transformer_=neo4j.Result.to_df</code> 한 줄', '저장: <code>df.to_csv(…, encoding=\'utf-8-sig\')</code>'],
            notes: '<p>그림 7-3 을 말로 설명한 뒤 이 코드를 ▶ 실행합니다. 이어 예제 7-8 의 그래프 그림도 실행해 "숫자 → 막대, 연결 → 그래프 그림" 을 대비시킵니다. (15분)</p>' },
          { layout: 'summary', title: '정리', bullets: ['.env 로 접속 정보 관리, driver 는 한 번만', 'execute_query + 매개변수($name) — 문자열 붙이기 금지', 'records → r.data() → DataFrame → matplotlib', '쓰기는 UNWIND $rows 로 왕복 한 번', '보고서 스크립트: 접속 → 질의 → 표 → 그래프 → 저장'],
            notes: '<p>그림 7-4 로 반복문과 UNWIND 의 왕복 횟수 차이를 보여 주고, 예제 7-9 의 <code>to_dict(\'records\')</code> 를 실행합니다. 예제 7-11 을 교사 PC 에서 돌려 PNG 가 저장되는 것으로 마무리합니다. 다음 교시 예고: 그래프에 적히지 않은 사실을 "추론" 하기. (10분)</p>' }
        ]
      },

      /* ------------------------------------------------------------------ 2교시 */
      {
        id: 'ch07-2',
        title: '온톨로지 추론: 숨은 사실 찾기',
        minutes: 50,
        goals: ['추론이 무엇인지 사실 + 규칙 → 새 사실로 설명한다', 'SUBCLASS_OF*0.. 로 하위 클래스를 포함한 질의를 작성한다', 'PART_OF 전이 관계를 가변 길이 경로로 계산한다', '역관계 · 대칭 규칙의 결과를 MERGE 로 저장하고 inferred 로 구별한다', 'Python 으로 규칙을 고정점까지 반복 적용하는 추론기를 만든다'],
        flow: [['도입 · 추론이란?', 7], ['클래스 계층 추론', 10], ['전이 관계 추론', 10], ['역관계 · 대칭 · 저장', 8], ['Python 추론기 (고정점)', 12], ['정리 · n10s 소개', 3]],
        content: [
          { type: 'p', html: '친구가 "추격자는 스릴러야" 라고 말했고, 영화 사전에는 "스릴러는 범죄 영화의 한 갈래다" 라고 적혀 있습니다. 그럼 "추격자는 범죄 영화인가?" 라고 물으면 우리는 곧바로 "네" 라고 답합니다. 아무도 그렇게 말한 적은 없는데도요. 이처럼 <b>명시된 사실</b>과 <b>규칙</b>으로부터 <b>새 사실을 이끌어 내는 것</b>을 <b>추론(inference, reasoning)</b>이라고 합니다.' },
          { type: 'figure', html: FIG_INFER, caption: '그림 7-5. 추론 = 사실 + 규칙 → 새 사실. 2차시에서 배운 온톨로지의 <b>subClassOf</b> 가 바로 이런 규칙의 재료입니다.' },
          { type: 'p', html: '사람에게는 당연한 일이지만, 데이터베이스는 <b>적혀 있는 것만</b> 압니다. 그래프에 <code>(추격자)-[:IN_GENRE]-&gt;(범죄)</code> 가 없으면 "범죄 영화 목록" 에 추격자는 빠집니다. 온톨로지가 중요한 이유가 여기 있습니다. 개념 사이의 관계(규칙)를 함께 저장해 두면, 프로그램이 사람처럼 <b>숨은 사실</b>을 찾아낼 수 있습니다.' },
          { type: 'table', head: ['규칙 종류', '규칙 (말로)', '예'], rows: [
            ['클래스 계층 (상속)', 'X 가 A 이고 A ⊂ B 이면, X 는 B', '추격자는 스릴러, 스릴러 ⊂ 범죄 → 추격자는 범죄 영화'],
            ['전이 (transitive)', 'A → B 이고 B → C 이면, A → C', '역삼동 ⊂ 강남구 ⊂ 서울 → 역삼동 ⊂ 서울'],
            ['역관계 (inverse)', 'A –P→ B 이면, B –P의 반대→ A', '역삼동 PART_OF 강남구 → 강남구 HAS_PART 역삼동'],
            ['대칭 (symmetric)', 'A ~ B 이면, B ~ A', '송강호 WORKED_WITH 이선균 → 이선균 WORKED_WITH 송강호']
          ], caption: '이번 교시에 다루는 네 가지 추론 규칙. 모두 2차시 온톨로지 언어(OWL)에 정식으로 있는 규칙입니다.' },
          { type: 'code', title: '예제 7-12. 가장 작은 추론: 사실 두 개와 규칙 하나', code: `facts = {
    ('추격자', 'IN_GENRE', '스릴러'),
    ('스릴러', 'SUBCLASS_OF', '범죄'),
}

# 규칙: (X IN_GENRE A) 그리고 (A SUBCLASS_OF B) 이면 (X IN_GENRE B)
new = set()
for (x, p1, a) in facts:
    for (a2, p2, b) in facts:
        if p1 == 'IN_GENRE' and p2 == 'SUBCLASS_OF' and a == a2:
            new.add((x, 'IN_GENRE', b))

print('명시된 사실:', sorted(facts))
print('추론된 사실:', sorted(new - facts))
print('추격자는 범죄 영화인가?', ('추격자', 'IN_GENRE', '범죄') in (facts | new))`,
            expect: "명시된 사실: [('스릴러', 'SUBCLASS_OF', '범죄'), ('추격자', 'IN_GENRE', '스릴러')]\n추론된 사실: [('추격자', 'IN_GENRE', '범죄')]\n추격자는 범죄 영화인가? True",
            desc: '사실을 2차시의 <b>트리플(주어, 술어, 목적어)</b> 로 집합에 담고, 규칙은 "두 트리플이 이런 모양으로 이어지면 새 트리플을 만든다" 는 <b>for 문 두 개</b>로 표현했습니다. 규칙 엔진의 핵심은 이게 전부입니다.' },

          { type: 'h', text: '클래스 계층 추론: SUBCLASS_OF*0..' },
          { type: 'p', html: '5차시의 영화 8편 그래프에 <b>장르 계층</b>을 더해 봅시다. 장르를 더 잘게 나누고 (올드보이 → 심리스릴러, 신세계 → 누아르), 장르끼리 <code>(하위)-[:SUBCLASS_OF]-&gt;(상위)</code> 관계로 잇습니다. 이 분류는 수업용으로 정한 것입니다.' },
          { type: 'figure', html: FIG_TREE, caption: '그림 7-6. 장르 계층. 영화는 가장 구체적인 장르 하나에만 연결되어 있지만, 계층을 따라 올라가면 살인의 추억 · 추격자 · 올드보이 · 신세계 넷 다 "범죄 영화" 입니다.' },
          { type: 'code', title: 'Cypher 7-1. 장르 계층 만들기 (Neo4j Browser 에서 실행)', run: false, code: `// 장르 계층: [하위, 상위]
UNWIND [['드라마','장르'], ['범죄','장르'], ['액션','장르'], ['SF','장르'],
        ['스릴러','범죄'], ['누아르','범죄'], ['심리스릴러','스릴러']] AS pair
MERGE (c:Genre {name: pair[0]})
MERGE (p:Genre {name: pair[1]})
MERGE (c)-[:SUBCLASS_OF]->(p);

// 더 구체적인 장르로 바꾸기: 올드보이 → 심리스릴러, 신세계 → 누아르
MATCH (m:Movie {title: '올드보이'})-[r:IN_GENRE]->() DELETE r
WITH m MATCH (g:Genre {name: '심리스릴러'}) MERGE (m)-[:IN_GENRE]->(g);
MATCH (m:Movie {title: '신세계'})-[r:IN_GENRE]->() DELETE r
WITH m MATCH (g:Genre {name: '누아르'}) MERGE (m)-[:IN_GENRE]->(g);`,
            desc: '5차시 데이터(예제 7-10 으로 넣은 영화 8편)에 이어서 실행합니다. 장르 노드 "장르" 는 모든 장르의 꼭대기(루트) 역할입니다.' },
          { type: 'p', html: '이제 "범죄 영화를 모두 찾아라" 를 Cypher 로 써 봅시다. 5차시에서 배운 <b>가변 길이 경로</b> <code>*최소..최대</code> 를 쓰면, "SUBCLASS_OF 를 몇 번이든 따라 올라가서 범죄에 닿는 장르" 를 한 줄로 표현할 수 있습니다.' },
          { type: 'code', title: 'Cypher 7-2. 하위 장르를 포함한 "모든 범죄 영화" (Neo4j Browser 에서 실행)', run: false, code: `// 직접 연결만 — 추론 없음
MATCH (m:Movie)-[:IN_GENRE]->(:Genre {name: '범죄'})
RETURN m.title;                              // 살인의 추억 (1편)

// 계층 추론 — SUBCLASS_OF 를 0번 이상 따라 올라가기
MATCH (m:Movie)-[:IN_GENRE]->(g:Genre)-[:SUBCLASS_OF*0..]->(:Genre {name: '범죄'})
RETURN m.title AS 영화, g.name AS 실제장르
ORDER BY 영화;                               // 4편`,
            desc: '<code>*0..</code> 의 <b>0</b> 이 중요합니다. "0번 따라가기" 는 "제자리" 라는 뜻이라서, 범죄 장르에 <b>직접</b> 연결된 살인의 추억도 포함됩니다. <code>*1..</code> 로 쓰면 하위 장르 영화(3편)만 나옵니다. 끝(<code>..</code> 뒤)을 비워 두면 깊이 제한이 없지만, 계층이 아주 깊은 실제 데이터에서는 <code>*0..10</code> 처럼 상한을 두는 것이 안전합니다.' },
          { type: 'code', title: '예제 7-13. 같은 질문을 Python 으로: 상위 장르 따라 올라가기', code: `subclass_of = {            # 하위 -> 상위 (SUBCLASS_OF)
    '드라마': '장르', '범죄': '장르', '액션': '장르', 'SF': '장르',
    '스릴러': '범죄', '누아르': '범죄', '심리스릴러': '스릴러',
}
in_genre = {               # 영화 -> 가장 구체적인 장르 (IN_GENRE)
    '기생충': '드라마', '괴물': 'SF', '살인의 추억': '범죄', '올드보이': '심리스릴러',
    '쉬리': '액션', '택시운전사': '드라마', '신세계': '누아르', '추격자': '스릴러',
}

def ancestors(genre):
    """genre 자신 + 모든 상위 장르 (SUBCLASS_OF*0.. 와 같음)"""
    chain = [genre]
    while genre in subclass_of:
        genre = subclass_of[genre]
        chain.append(genre)
    return chain

for movie, g in in_genre.items():
    print(f'{movie:6} : {" → ".join(ancestors(g))}')

crime = [m for m, g in in_genre.items() if '범죄' in ancestors(g)]
print()
print('직접 범죄 :', [m for m, g in in_genre.items() if g == '범죄'])
print('추론 포함 :', sorted(crime))`,
            expect: "기생충    : 드라마 → 장르\n괴물     : SF → 장르\n살인의 추억 : 범죄 → 장르\n올드보이   : 심리스릴러 → 스릴러 → 범죄 → 장르\n쉬리     : 액션 → 장르\n택시운전사  : 드라마 → 장르\n신세계    : 누아르 → 범죄 → 장르\n추격자    : 스릴러 → 범죄 → 장르\n\n직접 범죄 : ['살인의 추억']\n추론 포함 : ['살인의 추억', '신세계', '올드보이', '추격자']",
            desc: '<code>ancestors()</code> 는 상위 장르가 없을 때까지 <code>while</code> 로 계속 올라갑니다. 결과 첫 줄의 "올드보이 : 심리스릴러 → 스릴러 → 범죄 → 장르" 가 바로 Cypher 의 <code>SUBCLASS_OF*0..</code> 가 따라간 경로입니다. 여기서는 장르마다 상위가 하나뿐이라 딕셔너리로 충분했습니다.' },
          { type: 'callout', kind: 'tip', title: '레이블 계층 vs 노드 계층', html: '3차시에는 "감독 ⊂ 사람" 을 <code>:Person:Director</code> 처럼 <b>레이블 두 개</b>로 표현했습니다. 계층이 얕고 바뀌지 않으면 그 방법이 간단합니다. 하지만 장르처럼 <b>단계가 많고 자주 늘어나는</b> 분류는 이번처럼 클래스를 <b>노드</b>로 만들고 <code>SUBCLASS_OF</code> 로 잇는 편이 좋습니다. 새 하위 장르가 생겨도 관계 하나만 추가하면 되고, 질의는 그대로 동작합니다.' },

          { type: 'h', text: '전이 관계 추론: 위치 PART_OF' },
          { type: 'p', html: '어떤 관계는 <b>건너뛰어도</b> 성립합니다. "역삼동은 강남구의 일부" 이고 "강남구는 서울의 일부" 이면 "역삼동은 서울의 일부" 입니다. 이런 성질을 <b>전이성(transitivity)</b>이라고 하고, 그런 관계를 <b>전이 관계</b>라고 합니다. SUBCLASS_OF 도 전이 관계입니다.' },
          { type: 'figure', html: FIG_PLACE, caption: '그림 7-7. 동네 → 구 → 시 → 나라. 실선은 저장된 PART_OF, 점선은 전이 규칙으로 추론되는 관계입니다. 우동 → 대한민국은 3단계를 건너뛴 추론입니다.' },
          { type: 'p', html: '반대로 모든 관계가 전이 관계는 아닙니다. "송강호는 이선균을 <b>안다</b>", "이선균은 조여정을 <b>안다</b>" 라고 해서 "송강호는 조여정을 안다" 가 반드시 참은 아니지요. <b>어떤 관계가 전이적인지는 온톨로지(설계자)가 정합니다.</b>' },
          { type: 'code', title: 'Cypher 7-3. 장소 계층과 "서울에 있는 극장" (Neo4j Browser 에서 실행)', run: false, code: `// 장소 계층 [작은 곳, 큰 곳]
UNWIND [['역삼동','강남구'], ['삼성동','강남구'], ['강남구','서울'], ['서울','대한민국'],
        ['우동','해운대구'], ['해운대구','부산'], ['부산','대한민국']] AS pair
MERGE (a:Place {name: pair[0]})
MERGE (b:Place {name: pair[1]})
MERGE (a)-[:PART_OF]->(b);

// 극장(수업용 가상 이름)은 가장 작은 장소에만 연결
UNWIND [['별빛극장','역삼동'], ['달빛극장','삼성동'], ['바다극장','우동']] AS pair
MERGE (t:Theater {name: pair[0]})
WITH t, pair MATCH (p:Place {name: pair[1]})
MERGE (t)-[:LOCATED_IN]->(p);

// 서울에 있는 극장: LOCATED_IN 한 번 + PART_OF 0번 이상
MATCH (t:Theater)-[:LOCATED_IN]->(:Place)-[:PART_OF*0..]->(:Place {name: '서울'})
RETURN t.name AS 극장;                               // 별빛극장, 달빛극장

// 역삼동이 속한 모든 상위 장소와 단계 수
MATCH path = (:Place {name: '역삼동'})-[:PART_OF*1..]->(up:Place)
RETURN up.name AS 상위, length(path) AS 단계 ORDER BY 단계;`,
            desc: '<code>length(path)</code> 는 경로의 관계 개수(단계 수)입니다. 결과: 강남구 1 · 서울 2 · 대한민국 3. 극장은 가장 작은 장소(동)에만 연결해 두었지만, 질의에서 PART_OF 를 따라 올라가면 "서울에 있는가" · "대한민국에 있는가" 를 모두 답할 수 있습니다. 이것도 <b>질의할 때 하는 추론</b>입니다.' },
          { type: 'code', title: '예제 7-14. 전이 닫힘(transitive closure) 계산하기', code: `part_of = {('역삼동', '강남구'), ('삼성동', '강남구'), ('강남구', '서울'), ('서울', '대한민국'),
           ('우동', '해운대구'), ('해운대구', '부산'), ('부산', '대한민국')}

# 규칙: (a, b) 와 (b, c) 가 있으면 (a, c) 도 참 — 새 쌍이 안 생길 때까지 반복
closure = set(part_of)
step = 0
while True:
    step += 1
    new = {(a, c) for (a, b) in closure for (b2, c) in closure if b == b2} - closure
    print(f'{step}회차: 새 사실 {len(new)}개', sorted(new))
    if not new:
        break
    closure |= new

print()
print('저장된 PART_OF:', len(part_of), '개 → 전이 닫힘:', len(closure), '개')
print('역삼동이 속한 곳:', sorted(b for a, b in closure if a == '역삼동'))
print('서울 안의 장소 :', sorted(a for a, b in closure if b == '서울'))`,
            expect: "1회차: 새 사실 5개 [('강남구', '대한민국'), ('삼성동', '서울'), ('역삼동', '서울'), ('우동', '부산'), ('해운대구', '대한민국')]\n2회차: 새 사실 3개 [('삼성동', '대한민국'), ('역삼동', '대한민국'), ('우동', '대한민국')]\n3회차: 새 사실 0개 []\n\n저장된 PART_OF: 7 개 → 전이 닫힘: 15 개\n역삼동이 속한 곳: ['강남구', '대한민국', '서울']\n서울 안의 장소 : ['강남구', '삼성동', '역삼동']",
            desc: '1회차에는 두 단계짜리 관계(역삼동 → 서울 등)가, 2회차에는 그것을 재료로 세 단계짜리(역삼동 → 대한민국)가 생깁니다. 3회차에 새 사실이 0개가 되어 멈춥니다. 저장된 7개가 15개로 늘었습니다. 이렇게 전이 규칙을 끝까지 적용해 얻은 집합을 <b>전이 닫힘</b>이라고 합니다. Cypher 의 <code>PART_OF*1..</code> 는 이 닫힘을 질의할 때마다 그 자리에서 계산해 주는 셈입니다.' },

          { type: 'h', text: '역관계 · 대칭 관계와 추론 결과 저장하기' },
          { type: 'p', html: '지금까지는 질의할 때마다 경로를 따라가는 방식(<b>질의 시점 추론</b>)이었습니다. 자주 묻는 질문이라면 추론 결과를 <b>관계로 저장</b>(물질화, materialization)해 두고 빠르게 꺼내 쓸 수도 있습니다. 이때 두 가지 규칙을 더 알아 둡시다.' },
          { type: 'list', items: [
            '<b>역관계(inverse)</b>: 한 관계를 반대 방향에서 부르는 이름. <code>PART_OF</code> 의 역관계는 <code>HAS_PART</code>, <code>DIRECTED</code> 의 역관계는 "감독됨(DIRECTED_BY)" 입니다.',
            '<b>대칭 관계(symmetric)</b>: 방향을 바꿔도 뜻이 같은 관계. "함께 일했다(WORKED_WITH)", "이웃이다" 같은 관계입니다. 같은 영화에 출연한 두 배우는 서로 함께 일한 사이입니다.'
          ] },
          { type: 'figure', html: FIG_INV, caption: '그림 7-8. 역관계는 화살표를 뒤집어 새 이름을 붙이고, 대칭 관계는 양쪽 모두에게 같은 관계가 성립합니다.' },
          { type: 'code', title: 'Cypher 7-4. 추론 결과를 MERGE 로 저장하기 (Neo4j Browser 에서 실행)', run: false, code: `// ① 전이 규칙: 2단계 이상 떨어진 PART_OF 를 직접 관계로 저장
MATCH (a:Place)-[:PART_OF*2..]->(c:Place)
MERGE (a)-[r:PART_OF]->(c)
ON CREATE SET r.inferred = true, r.rule = 'transitive';

// ② 역관계 규칙: PART_OF 를 뒤집어 HAS_PART 로 저장
MATCH (a:Place)-[:PART_OF]->(b:Place)
MERGE (b)-[r:HAS_PART]->(a)
ON CREATE SET r.inferred = true, r.rule = 'inverse';

// ③ 대칭 규칙: 같은 영화에 출연한 두 사람 → WORKED_WITH (한 번만 저장)
MATCH (a:Person)-[:ACTED_IN]->(:Movie)<-[:ACTED_IN]-(b:Person)
WHERE a.name < b.name
MERGE (a)-[r:WORKED_WITH]-(b)
ON CREATE SET r.inferred = true, r.rule = 'symmetric';

// 확인: 명시된 관계와 추론된 관계 개수
MATCH ()-[r]->()
RETURN type(r) AS 관계, coalesce(r.inferred, false) AS 추론, count(*) AS 개수
ORDER BY 관계, 추론;`,
            desc: '<code>ON CREATE SET r.inferred = true</code> 가 핵심입니다. 이미 있던 관계는 건드리지 않고, <b>새로 만든 관계에만</b> "추론으로 생겼음" 표시를 붙입니다. ③ 의 <code>WHERE a.name &lt; b.name</code> 은 (송강호, 이선균) 과 (이선균, 송강호) 가 두 번 처리되지 않게 하고, 방향 없는 <code>MERGE (a)-[r]-(b)</code> 는 어느 방향이든 이미 있으면 새로 만들지 않습니다. Neo4j 의 관계는 언제나 방향이 있지만, 대칭 관계는 <b>하나만 저장하고 질의할 때 방향 없이 <code>-[:WORKED_WITH]-</code></b> 로 찾는 것이 관례입니다.' },
          { type: 'callout', kind: 'warn', title: '추론 결과는 "되돌릴 수 있게" 저장하세요', html: '원래 사실이 바뀌면(예: 신세계의 장르를 고침) 저장해 둔 추론 결과는 <b>낡은 정보</b>가 됩니다. <code>inferred</code> 표시가 있으면 <code>MATCH ()-[r {inferred: true}]-&gt;() DELETE r</code> 로 추론 결과만 깨끗이 지우고 다시 계산할 수 있습니다. 표시 없이 섞어 저장하면 무엇이 원래 사실이고 무엇이 추론인지 영영 구별할 수 없게 됩니다. 또, PART_OF 를 저장한 뒤에는 <code>PART_OF*</code> 질의가 같은 답을 여러 경로로 찾으므로 <code>DISTINCT</code> 를 붙이거나 <code>WHERE r.inferred IS NULL</code> 로 명시된 관계만 따라가게 하세요.' },
          { type: 'callout', kind: 'tip', title: '질의할 때 추론할까, 저장해 둘까?', html: '<b>질의 시점 추론</b>(가변 길이 경로)은 항상 최신이고 저장 공간이 들지 않지만, 그래프가 크면 느릴 수 있습니다. <b>저장(물질화)</b>은 빠르지만 원래 사실이 바뀔 때마다 다시 계산해야 합니다. 처음에는 질의 시점 추론으로 시작하고, 정말 느린 질문만 저장하는 것이 좋습니다. 역관계는 Neo4j 에서 <b>화살표를 반대로 따라가면 되므로</b> 굳이 저장하지 않는 경우가 많습니다.' },

          { type: 'h', text: 'Python 으로 규칙 엔진 흉내 내기: 고정점까지 반복' },
          { type: 'p', html: '규칙이 여러 개이면 재미있는 일이 생깁니다. 한 규칙이 만든 새 사실이 <b>다른 규칙의 재료</b>가 됩니다. 예를 들어 전이 규칙이 "심리스릴러 ⊂ 범죄" 를 만들면, 상속 규칙이 그것을 써서 "올드보이는 범죄 영화" 를 만듭니다. 그래서 규칙 엔진은 <b>모든 규칙을 한 바퀴 적용 → 새 사실 추가</b>를 반복하다가, 한 바퀴를 돌아도 <b>새 사실이 하나도 없으면</b> 멈춥니다. 이 멈춘 상태를 <b>고정점(fixed point)</b>이라고 합니다.' },
          { type: 'figure', html: FIG_FIX, caption: '그림 7-9. 고정점 반복. 사실은 늘어나기만 하고 가능한 트리플 수에는 끝이 있으므로, 반복은 반드시 언젠가 멈춥니다.' },
          { type: 'code', title: '예제 7-15. 규칙 다섯 개를 가진 작은 추론기', code: `facts = {
    # 장르 계층과 영화
    ('스릴러', 'SUBCLASS_OF', '범죄'), ('심리스릴러', 'SUBCLASS_OF', '스릴러'),
    ('누아르', 'SUBCLASS_OF', '범죄'),
    ('올드보이', 'IN_GENRE', '심리스릴러'), ('신세계', 'IN_GENRE', '누아르'),
    # 장소 계층과 극장
    ('역삼동', 'PART_OF', '강남구'), ('강남구', 'PART_OF', '서울'), ('서울', 'PART_OF', '대한민국'),
    ('별빛극장', 'LOCATED_IN', '역삼동'),
    # 출연
    ('송강호', 'ACTED_IN', '기생충'), ('이선균', 'ACTED_IN', '기생충'),
}
TRANSITIVE = {'SUBCLASS_OF', 'PART_OF'}
INVERSE = {'PART_OF': 'HAS_PART'}

def apply_rules(F):
    new = set()
    for (a, p, b) in F:
        if p in INVERSE:                                       # 역관계
            new.add((b, INVERSE[p], a))
        for (b2, q, c) in F:
            if b != b2:
                continue
            if p == q and p in TRANSITIVE:                     # 전이
                new.add((a, p, c))
            if p == 'IN_GENRE' and q == 'SUBCLASS_OF':         # 계층 상속
                new.add((a, 'IN_GENRE', c))
            if p == 'LOCATED_IN' and q == 'PART_OF':           # 위치 전파
                new.add((a, 'LOCATED_IN', c))
    for (a, p, m) in F:                                        # 대칭: 함께 출연
        for (b, q, m2) in F:
            if p == q == 'ACTED_IN' and m == m2 and a != b:
                new.add((a, 'WORKED_WITH', b))
    return new - F

F = set(facts)
rnd = 0
while True:
    rnd += 1
    new = apply_rules(F)
    print(f'[{rnd}회차] 새 사실 {len(new)}개')
    for t in sorted(new):
        print('   ', t)
    if not new:
        break
    F |= new
print(f'고정점 도달: 명시 {len(facts)}개 + 추론 {len(F) - len(facts)}개 = {len(F)}개')`,
            expect: "[1회차] 새 사실 11개\n    ('강남구', 'HAS_PART', '역삼동')\n    ('강남구', 'PART_OF', '대한민국')\n    ('대한민국', 'HAS_PART', '서울')\n    ('별빛극장', 'LOCATED_IN', '강남구')\n    ('서울', 'HAS_PART', '강남구')\n    ('송강호', 'WORKED_WITH', '이선균')\n    ('신세계', 'IN_GENRE', '범죄')\n    ('심리스릴러', 'SUBCLASS_OF', '범죄')\n    ('역삼동', 'PART_OF', '서울')\n    ('올드보이', 'IN_GENRE', '스릴러')\n    ('이선균', 'WORKED_WITH', '송강호')\n[2회차] 새 사실 6개\n    ('대한민국', 'HAS_PART', '강남구')\n    ('별빛극장', 'LOCATED_IN', '대한민국')\n    ('별빛극장', 'LOCATED_IN', '서울')\n    ('서울', 'HAS_PART', '역삼동')\n    ('역삼동', 'PART_OF', '대한민국')\n    ('올드보이', 'IN_GENRE', '범죄')\n[3회차] 새 사실 1개\n    ('대한민국', 'HAS_PART', '역삼동')\n[4회차] 새 사실 0개\n고정점 도달: 명시 11개 + 추론 18개 = 29개",
            desc: '<code>apply_rules()</code> 는 지금 가진 사실 전체에 규칙 다섯 개(전이 · 역관계 · 상속 · 위치 전파 · 대칭)를 한 번씩 적용해 <b>새로 생긴 것만</b> 돌려줍니다. 결과를 보면 1회차에 "올드보이 IN_GENRE 스릴러" 가, 2회차에 그것을 재료로 "올드보이 IN_GENRE 범죄" 가 생기는 것처럼 <b>사실이 사실을 낳는</b> 모습을 볼 수 있습니다. 4회차에 새 사실이 0개가 되어 명시 11개 + 추론 18개에서 멈춥니다. 대칭 규칙은 (송강호, 이선균) 과 (이선균, 송강호) 를 모두 만듭니다 — 집합에서는 방향이 다른 두 트리플이 다른 원소이기 때문입니다.' },
          { type: 'callout', kind: 'info', title: '진짜 추론 엔진은 어떻게 다를까?', html: '예제 7-15 는 매 회차 <b>모든 사실 쌍</b>을 다시 비교하므로 사실이 많아지면 느려집니다. 실제 추론 엔진(OWL 추론기)은 "지난 회차에 <b>새로 생긴 사실</b>이 낀 조합만" 다시 계산하는 요령(세미 나이브 방식)과 색인을 써서 훨씬 빠릅니다. 하지만 "규칙을 고정점까지 반복 적용한다" 는 원리는 똑같습니다.' },

          { type: 'h', text: '함께 해 보기: Python 추론기 vs Cypher 가변 길이 경로' },
          { type: 'p', html: '이번 교시의 마무리로, 장르 계층과 지역 계층 트리플에 <b>subClassOf · partOf 전이 규칙</b>과 상속 규칙을 적용하는 추론기를 만들고, 같은 질문을 Cypher 로도 적어 비교해 봅시다. 결과를 그림으로 그려 명시된 사실과 추론된 사실의 양을 한눈에 비교합니다.' },
          { type: 'code', title: '예제 7-16. 장르 · 지역 계층 추론기와 결과 그래프', code: `import pandas as pd
import matplotlib.pyplot as plt

triples = {
    ('드라마', 'subClassOf', '장르'), ('범죄', 'subClassOf', '장르'), ('액션', 'subClassOf', '장르'),
    ('스릴러', 'subClassOf', '범죄'), ('누아르', 'subClassOf', '범죄'),
    ('심리스릴러', 'subClassOf', '스릴러'),
    ('올드보이', 'type', '심리스릴러'), ('추격자', 'type', '스릴러'),
    ('신세계', 'type', '누아르'), ('살인의 추억', 'type', '범죄'), ('기생충', 'type', '드라마'),
    ('역삼동', 'partOf', '강남구'), ('강남구', 'partOf', '서울'), ('서울', 'partOf', '대한민국'),
    ('우동', 'partOf', '해운대구'), ('해운대구', 'partOf', '부산'), ('부산', 'partOf', '대한민국'),
}

def infer(T):
    F = set(T)
    while True:
        new = set()
        for (a, p, b) in F:
            for (b2, q, c) in F:
                if b == b2 and p == q and p in ('subClassOf', 'partOf'):
                    new.add((a, p, c))                 # 전이 규칙
                if b == b2 and p == 'type' and q == 'subClassOf':
                    new.add((a, 'type', c))            # 상속 규칙
        new -= F
        if not new:
            return F
        F |= new

F = infer(triples)
inferred = sorted(F - triples)
print('새로 생긴 사실', len(inferred), '개')
for t in inferred:
    print('  ', t)

print()
print('Q1 범죄 영화 :', sorted(a for a, p, b in F if p == 'type' and b == '범죄'))
print('Q2 역삼동 ⊂  :', sorted(b for a, p, b in F if a == '역삼동' and p == 'partOf'))

df = pd.DataFrame([(p, '명시' if t in triples else '추론') for t in F for p in [t[1]]],
                  columns=['술어', '종류'])
table = pd.crosstab(df['술어'], df['종류'])
display(table)
table.plot(kind='bar', stacked=True, figsize=(6, 4), rot=0,
           title='술어별 명시된 사실 vs 추론된 사실')
plt.ylabel('트리플 수')
plt.show()`,
            desc: '두 규칙만으로 "기생충 type 장르", "우동 partOf 대한민국" 같은 사실이 자동으로 생겼습니다. 막대그래프에서 주황(추론) 부분이 <b>아무도 적지 않았지만 참인 사실</b>의 양입니다. 같은 질문을 Cypher 로 쓰면 아래와 같습니다 — Python 추론기는 "미리 다 계산해 두기", Cypher 가변 길이 경로는 "물어볼 때 그 자리에서 따라가기" 입니다.' },
          { type: 'code', title: 'Cypher 7-5. 같은 질문을 가변 길이 경로로 (Neo4j Browser 에서 실행)', run: false, code: `// Q1 범죄 영화 (상속 + subClassOf 전이)
MATCH (m:Movie)-[:IN_GENRE]->(:Genre)-[:SUBCLASS_OF*0..]->(:Genre {name: '범죄'})
RETURN m.title AS 범죄영화 ORDER BY 범죄영화;

// Q2 역삼동이 속한 모든 곳 (partOf 전이)
MATCH (:Place {name: '역삼동'})-[:PART_OF*1..]->(up:Place)
RETURN up.name AS 상위장소;

// Q3 기생충의 모든 장르 (자기 장르 + 상위 장르)
MATCH (:Movie {title: '기생충'})-[:IN_GENRE]->(:Genre)-[:SUBCLASS_OF*0..]->(g:Genre)
RETURN g.name AS 장르;`,
            desc: 'Python 결과의 Q1 · Q2 와 Cypher 결과가 같은지 비교해 보세요. 규칙(전이 · 상속)이 Cypher 에서는 <code>*0..</code> · <code>*1..</code> 라는 <b>경로 모양</b>으로 들어가 있습니다.' },

          { type: 'h', text: '더 알아보기: RDF/OWL 온톨로지를 Neo4j 로 — neosemantics(n10s)' },
          { type: 'p', html: '2차시에서 온톨로지의 표준 형식으로 <b>RDF</b>(트리플)와 <b>OWL</b>(클래스 · 관계 규칙)을 소개했습니다. 세상에는 이미 이 형식으로 만들어진 큰 온톨로지(예: 위키데이터, schema.org)가 많습니다. Neo4j 의 <b>neosemantics(줄여서 n10s)</b> 플러그인을 쓰면 이런 파일을 그래프로 가져오거나, 반대로 Neo4j 그래프를 RDF 로 내보낼 수 있습니다.' },
          { type: 'table', head: ['n10s 기능', '프로시저', '하는 일'], rows: [
            ['초기 설정', '<code>n10s.graphconfig.init()</code>', 'RDF 를 어떤 모양의 노드 · 관계로 바꿀지 정함'],
            ['온톨로지 가져오기', '<code>n10s.onto.import.fetch(주소, \'Turtle\')</code>', 'OWL 의 클래스 · subClassOf 를 노드 · 관계로'],
            ['데이터 가져오기', '<code>n10s.rdf.import.fetch(주소, \'Turtle\')</code>', 'RDF 트리플을 노드 · 관계 · 속성으로'],
            ['추론 도우미', '<code>n10s.inference.nodesLabelled(…)</code> 등', '클래스 계층을 고려해 노드 찾기'],
            ['내보내기', 'HTTP <code>/rdf/…</code> 엔드포인트', 'Neo4j 그래프를 RDF 로']
          ], caption: 'n10s 는 Neo4j Desktop · 자체 설치 서버에 플러그인으로 추가해 씁니다. AuraDB Free 에서는 설치할 수 없으니, 관심 있다면 Neo4j Desktop 에서 시험해 보세요.' },
          { type: 'callout', kind: 'more', title: 'n10s 맛보기 (Neo4j Desktop 에 플러그인 설치 후)', html: '<pre><code>CREATE CONSTRAINT n10s_unique_uri FOR (r:Resource) REQUIRE r.uri IS UNIQUE;\nCALL n10s.graphconfig.init();\nCALL n10s.onto.import.fetch(\'https://…/movie-ontology.ttl\', \'Turtle\');\nMATCH (c:Class)-[:SCO]-&gt;(p:Class) RETURN c.name, p.name;</code></pre>가져온 OWL 의 subClassOf 는 기본 설정에서 <code>SCO</code> 관계로 저장됩니다. 즉 이번 교시에 손으로 만든 <code>SUBCLASS_OF</code> 계층을 표준 파일에서 자동으로 얻는 셈이고, 질의는 똑같이 <code>[:SCO*0..]</code> 로 할 수 있습니다.' },
          { type: 'callout', kind: 'info', teacher: true, title: '수업 준비 · 오개념 지도 팁', html: '① "추론 = AI 가 추측하는 것" 이라는 오해가 많습니다. 여기서의 추론은 <b>규칙에 따라 반드시 참인 것만</b> 이끌어 내는 논리적 추론(연역)이며, 틀릴 확률이 없습니다 — 다만 규칙이나 사실이 틀리면 결과도 틀립니다. ② <code>*0..</code> 와 <code>*1..</code> 의 차이는 Cypher 7-2 를 두 번 실행해 1편 / 3편 / 4편 결과로 비교하면 확실히 기억합니다. ③ "아는 사이" 처럼 전이적이지 않은 관계에 전이 규칙을 쓰면 엉뚱한 사실이 쏟아진다는 점을 예로 들어 주세요. ④ 예제 7-15 는 회차별 출력이 핵심입니다. 2회차에만 생기는 사실(올드보이 IN_GENRE 범죄 등)을 짚어 "사실이 사실을 낳는다" 를 강조합니다. ⑤ Cypher 7-4 실습 후에는 <code>MATCH ()-[r {inferred: true}]-&gt;() DELETE r</code> 로 정리하게 해야 다음 차시 분석 결과가 달라지지 않습니다.' }
        ],
        slides: [
          { layout: 'title', title: '온톨로지 추론: 숨은 사실 찾기', subtitle: '2교시 · 클래스 계층 · 전이 관계 · 고정점',
            notes: '<p>💬 "추격자는 스릴러이고, 스릴러는 범죄 영화의 한 갈래입니다. 추격자는 범죄 영화일까요?" → 네. "데이터베이스도 그렇게 답할까요?" → 적혀 있지 않으면 모름. 이 차이를 메우는 것이 추론이라고 소개하고 그림 7-5 와 규칙 표를 보여 줍니다. (7분)</p>' },
          { layout: 'diagram', title: '클래스 계층 추론: SUBCLASS_OF*0..', html: FIG_TREE, caption: '직접 범죄 1편 → 하위 장르 포함 4편',
            notes: '<p>Cypher 7-1 로 계층을 만들고 Cypher 7-2 의 두 질의를 차례로 실행합니다. 💬 "*0.. 대신 *1.. 로 쓰면 몇 편?" → 3편 (살인의 추억이 빠짐). 예제 7-13 으로 Python 의 while 이 같은 경로를 따라감을 보여 줍니다. (10분)</p>' },
          { layout: 'two', title: '전이 관계와 추론 결과 저장', left: { title: '전이 (질의 시점)', bullets: ['역삼동 ⊂ 강남구 ⊂ 서울 → 역삼동 ⊂ 서울', '<code>-[:PART_OF*1..]-&gt;</code> 로 그 자리에서 계산', '모든 관계가 전이적이진 않음 (아는 사이 ✗)'] }, right: { title: '저장 (물질화)', bullets: ['<code>MERGE … ON CREATE SET r.inferred = true</code>', '역관계: PART_OF → HAS_PART', '대칭: WORKED_WITH 는 하나만 저장, 방향 없이 질의', '<code>MATCH ()-[r {inferred:true}]-&gt;() DELETE r</code>'] },
            notes: '<p>그림 7-7 을 보며 예제 7-14 를 실행해 회차별로 새 사실이 생기는 모습을 확인합니다. 이어 Cypher 7-4 를 실행하고 마지막 개수 질의로 추론 관계를 구별해 봅니다. 💬 "원래 사실이 바뀌면 저장한 추론 결과는?" → 낡은 정보가 됨 → inferred 로 지우고 다시 계산. (18분)</p>' },
          { layout: 'code', title: '고정점까지 반복하는 추론기', code: `facts = {('스릴러', 'subClassOf', '범죄'), ('심리스릴러', 'subClassOf', '스릴러'),
         ('올드보이', 'type', '심리스릴러'),
         ('역삼동', 'partOf', '강남구'), ('강남구', 'partOf', '서울')}
F, rnd = set(facts), 0
while True:
    rnd += 1
    new = set()
    for (a, p, b) in F:
        for (b2, q, c) in F:
            if b == b2 and p == q and p in ('subClassOf', 'partOf'):
                new.add((a, p, c))          # 전이
            if b == b2 and p == 'type' and q == 'subClassOf':
                new.add((a, 'type', c))     # 상속
    new -= F
    print(rnd, '회차 새 사실:', sorted(new))
    if not new:
        break
    F |= new`, points: ['새 사실이 다른 규칙의 재료가 됨', '새 사실 0개 = 고정점 → 멈춤', 'Cypher 는 같은 일을 <code>*0..</code> · <code>*1..</code> 경로로'],
            notes: '<p>슬라이드에서 바로 ▶ 실행합니다. 2회차에 "올드보이 type 범죄" 가 생기는 것을 짚어 "사실이 사실을 낳는다" 를 강조합니다. 이어 예제 7-16 으로 명시 vs 추론 막대그래프를 보여 주고, Cypher 7-5 와 결과를 비교합니다. (12분)</p>' },
          { layout: 'summary', title: '정리', bullets: ['추론 = 사실 + 규칙 → 새 사실', '계층 상속 · 전이 · 역관계 · 대칭', 'Cypher: SUBCLASS_OF*0.. · PART_OF*1.. (질의 시점 추론)', '저장할 때는 MERGE + inferred 표시로 되돌릴 수 있게', 'Python 규칙 엔진은 고정점까지 반복 · n10s 로 RDF/OWL 가져오기'],
            notes: '<p>n10s 표를 간단히 보여 주고 "표준 온톨로지 파일도 그래프로 가져올 수 있다" 정도만 소개합니다. 다음 차시 예고: 이 지식그래프를 분석하고 미니 프로젝트로 완성하기. 실습으로 만든 inferred 관계는 지우고 마치게 합니다. (3분)</p>' }
        ]
      }
    ]
  });
})();
