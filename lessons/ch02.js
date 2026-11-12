/* 02차시 온톨로지와 지식그래프 */
(function () {
  const ARROW = (id) => `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fill-arrow"/></marker></defs>`;

  /* 그림 2-1. 온톨로지(설계도)와 인스턴스(실제 사실) */
  const FIG_LAYER = `<svg viewBox="0 0 720 300" role="img" aria-label="위층은 감독, 영화, 배우 클래스와 감독했다, 출연했다 관계 규칙, 아래층은 봉준호, 기생충, 송강호 인스턴스와 실제 관계">
  ${ARROW('c02a1')}
  <rect x="10" y="10" width="700" height="125" rx="14" class="p1s"/>
  <rect x="10" y="165" width="700" height="125" rx="14" class="card-bg"/>
  <text x="26" y="34" class="tx-b">온톨로지 (설계도) — 클래스와 관계 규칙</text>
  <rect x="60" y="60" width="120" height="44" rx="10" class="p1"/><text x="120" y="88" text-anchor="middle" class="tx-w">감독</text>
  <rect x="300" y="60" width="120" height="44" rx="10" class="p3"/><text x="360" y="88" text-anchor="middle" class="tx-w">영화</text>
  <rect x="540" y="60" width="120" height="44" rx="10" class="p2"/><text x="600" y="88" text-anchor="middle" class="tx-w">배우</text>
  <line x1="182" y1="82" x2="296" y2="82" class="ln" stroke-width="2.5" marker-end="url(#c02a1)"/>
  <text x="240" y="74" text-anchor="middle" class="tx-m">감독했다</text>
  <line x1="538" y1="82" x2="424" y2="82" class="ln" stroke-width="2.5" marker-end="url(#c02a1)"/>
  <text x="480" y="74" text-anchor="middle" class="tx-m">출연했다</text>
  <text x="26" y="189" class="tx-b">인스턴스 (실제 사실)</text>
  <line x1="120" y1="106" x2="120" y2="210" class="ln" stroke-dasharray="5 4"/>
  <line x1="360" y1="106" x2="360" y2="210" class="ln" stroke-dasharray="5 4"/>
  <line x1="600" y1="106" x2="600" y2="210" class="ln" stroke-dasharray="5 4"/>
  <text x="128" y="150" class="tx-m">사례(instance of)</text>
  <circle cx="120" cy="240" r="30" class="p1s"/><text x="120" y="245" text-anchor="middle" class="tx">봉준호</text>
  <circle cx="360" cy="240" r="30" class="p3s"/><text x="360" y="245" text-anchor="middle" class="tx">기생충</text>
  <circle cx="600" cy="240" r="30" class="p2s"/><text x="600" y="245" text-anchor="middle" class="tx">송강호</text>
  <line x1="152" y1="240" x2="326" y2="240" class="ln" stroke-width="2.5" marker-end="url(#c02a1)"/>
  <text x="240" y="232" text-anchor="middle" class="tx-m">감독했다</text>
  <line x1="568" y1="240" x2="394" y2="240" class="ln" stroke-width="2.5" marker-end="url(#c02a1)"/>
  <text x="480" y="232" text-anchor="middle" class="tx-m">출연했다</text>
</svg>`;

  /* 그림 2-2. 클래스 계층 트리 */
  const FIG_TREE = `<svg viewBox="0 0 720 290" role="img" aria-label="사물 아래에 사람, 작품, 장르가 있고, 사람 아래에 감독과 배우, 작품 아래에 영화, 장르 아래에 스릴러와 코미디가 있는 클래스 계층 트리">
  ${ARROW('c02a2')}
  <line x1="150" y1="113" x2="340" y2="62" class="ln" stroke-width="2" marker-end="url(#c02a2)"/>
  <line x1="360" y1="113" x2="360" y2="64" class="ln" stroke-width="2" marker-end="url(#c02a2)"/>
  <line x1="570" y1="113" x2="380" y2="62" class="ln" stroke-width="2" marker-end="url(#c02a2)"/>
  <line x1="90" y1="213" x2="140" y2="152" class="ln" stroke-width="2" marker-end="url(#c02a2)"/>
  <line x1="210" y1="213" x2="160" y2="152" class="ln" stroke-width="2" marker-end="url(#c02a2)"/>
  <line x1="360" y1="213" x2="360" y2="154" class="ln" stroke-width="2" marker-end="url(#c02a2)"/>
  <line x1="520" y1="213" x2="560" y2="152" class="ln" stroke-width="2" marker-end="url(#c02a2)"/>
  <line x1="620" y1="213" x2="580" y2="152" class="ln" stroke-width="2" marker-end="url(#c02a2)"/>
  <rect x="310" y="22" width="100" height="36" rx="10" class="p5"/><text x="360" y="46" text-anchor="middle" class="tx-w">사물</text>
  <rect x="105" y="114" width="90" height="36" rx="10" class="p1"/><text x="150" y="138" text-anchor="middle" class="tx-w">사람</text>
  <rect x="315" y="114" width="90" height="36" rx="10" class="p3"/><text x="360" y="138" text-anchor="middle" class="tx-w">작품</text>
  <rect x="525" y="114" width="90" height="36" rx="10" class="p4"/><text x="570" y="138" text-anchor="middle" class="tx-w">장르</text>
  <rect x="45" y="214" width="90" height="36" rx="10" class="p1s"/><text x="90" y="238" text-anchor="middle" class="tx">감독</text>
  <rect x="165" y="214" width="90" height="36" rx="10" class="p1s"/><text x="210" y="238" text-anchor="middle" class="tx">배우</text>
  <rect x="315" y="214" width="90" height="36" rx="10" class="p3s"/><text x="360" y="238" text-anchor="middle" class="tx">영화</text>
  <rect x="475" y="214" width="90" height="36" rx="10" class="p4s"/><text x="520" y="238" text-anchor="middle" class="tx">스릴러</text>
  <rect x="575" y="214" width="90" height="36" rx="10" class="p4s"/><text x="620" y="238" text-anchor="middle" class="tx">코미디</text>
  <text x="360" y="278" text-anchor="middle" class="tx-m">화살표 = "~는 ~의 한 종류이다" (is-a, subClassOf) · 감독 ⊂ 사람 ⊂ 사물</text>
</svg>`;

  /* 그림 2-3. 데이터 속성과 관계, 정의역 · 치역 */
  const FIG_PROP = `<svg viewBox="0 0 720 270" role="img" aria-label="왼쪽은 영화 클래스에 붙은 제목, 개봉연도 데이터 속성, 오른쪽은 감독에서 영화로 가는 감독했다 관계와 정의역, 치역 표시">
  ${ARROW('c02a3')}
  <rect x="10" y="10" width="290" height="250" rx="14" class="card-bg"/>
  <rect x="320" y="10" width="390" height="250" rx="14" class="card-bg"/>
  <text x="155" y="38" text-anchor="middle" class="tx-b">데이터 속성 (값을 붙임)</text>
  <circle cx="155" cy="110" r="42" class="p3"/><text x="155" y="116" text-anchor="middle" class="tx-w">영화</text>
  <rect x="45" y="170" width="220" height="64" rx="10" class="p5s"/>
  <text x="60" y="196" class="tx">제목 → 문자열</text>
  <text x="60" y="222" class="tx">개봉연도 → 정수</text>
  <text x="515" y="38" text-anchor="middle" class="tx-b">관계 = 객체 속성 (노드를 이음)</text>
  <circle cx="400" cy="120" r="42" class="p1"/><text x="400" y="126" text-anchor="middle" class="tx-w">감독</text>
  <circle cx="630" cy="120" r="42" class="p3"/><text x="630" y="126" text-anchor="middle" class="tx-w">영화</text>
  <line x1="444" y1="120" x2="584" y2="120" class="ln" stroke-width="2.5" marker-end="url(#c02a3)"/>
  <text x="515" y="110" text-anchor="middle" class="tx-b">감독했다</text>
  <rect x="345" y="180" width="110" height="52" rx="10" class="p1s"/>
  <text x="400" y="202" text-anchor="middle" class="tx-b">정의역</text><text x="400" y="222" text-anchor="middle" class="tx-m">domain: 출발</text>
  <rect x="575" y="180" width="110" height="52" rx="10" class="p3s"/>
  <text x="630" y="202" text-anchor="middle" class="tx-b">치역</text><text x="630" y="222" text-anchor="middle" class="tx-m">range: 도착</text>
</svg>`;

  /* 그림 2-4. 트리플 = 주어 – 술어 – 목적어 */
  const FIG_TRIPLE = `<svg viewBox="0 0 720 220" role="img" aria-label="봉준호, 감독했다, 기생충을 주어, 술어, 목적어로 나누고 각각 노드, 관계, 노드에 대응시킨 그림">
  ${ARROW('c02a4')}
  <text x="110" y="34" text-anchor="middle" class="tx-m">주어 (subject)</text>
  <text x="360" y="34" text-anchor="middle" class="tx-m">술어 (predicate)</text>
  <text x="610" y="34" text-anchor="middle" class="tx-m">목적어 (object)</text>
  <rect x="30" y="48" width="160" height="56" rx="12" class="p1"/><text x="110" y="82" text-anchor="middle" class="tx-w">봉준호</text>
  <rect x="280" y="48" width="160" height="56" rx="12" class="p2s"/><text x="360" y="82" text-anchor="middle" class="tx-b">감독했다</text>
  <rect x="530" y="48" width="160" height="56" rx="12" class="p3"/><text x="610" y="82" text-anchor="middle" class="tx-w">기생충</text>
  <line x1="192" y1="76" x2="276" y2="76" class="ln" stroke-width="2.5" marker-end="url(#c02a4)"/>
  <line x1="442" y1="76" x2="526" y2="76" class="ln" stroke-width="2.5" marker-end="url(#c02a4)"/>
  <line x1="20" y1="130" x2="700" y2="130" class="ln" stroke-dasharray="4 4"/>
  <circle cx="110" cy="175" r="26" class="p1"/><text x="110" y="180" text-anchor="middle" class="tx-w">노드</text>
  <line x1="138" y1="175" x2="578" y2="175" class="ln" stroke-width="2.5" marker-end="url(#c02a4)"/>
  <text x="360" y="166" text-anchor="middle" class="tx-b">관계(화살표)</text>
  <circle cx="610" cy="175" r="26" class="p3"/><text x="610" y="180" text-anchor="middle" class="tx-w">노드</text>
  <text x="360" y="210" text-anchor="middle" class="tx-m">문장 하나 = 트리플 하나 = 그래프의 화살표 하나</text>
</svg>`;

  /* 그림 2-5. 트리플 목록이 모여 지식그래프가 됨 */
  const FIG_KG = `<svg viewBox="0 0 720 300" role="img" aria-label="왼쪽 트리플 다섯 개가 오른쪽에서 봉준호, 송강호, 배두나, 기생충, 괴물 노드로 이루어진 하나의 그래프로 합쳐지는 그림">
  ${ARROW('c02a5')}
  <rect x="10" y="10" width="260" height="280" rx="14" class="card-bg"/>
  <text x="140" y="38" text-anchor="middle" class="tx-b">트리플 목록</text>
  <text x="26" y="78" class="tx">(봉준호, 감독했다, 기생충)</text>
  <text x="26" y="114" class="tx">(봉준호, 감독했다, 괴물)</text>
  <text x="26" y="150" class="tx">(송강호, 출연했다, 기생충)</text>
  <text x="26" y="186" class="tx">(송강호, 출연했다, 괴물)</text>
  <text x="26" y="222" class="tx">(배두나, 출연했다, 괴물)</text>
  <text x="140" y="268" text-anchor="middle" class="tx-m">사실 5개</text>
  <text x="295" y="155" text-anchor="middle" class="tx-b">⇒</text>
  <rect x="320" y="10" width="390" height="280" rx="14" class="card-bg"/>
  <text x="515" y="38" text-anchor="middle" class="tx-b">지식그래프</text>
  <circle cx="380" cy="150" r="32" class="p1"/><text x="380" y="155" text-anchor="middle" class="tx-w">봉준호</text>
  <circle cx="520" cy="90" r="32" class="p3"/><text x="520" y="95" text-anchor="middle" class="tx-w">기생충</text>
  <circle cx="520" cy="215" r="32" class="p3"/><text x="520" y="220" text-anchor="middle" class="tx-w">괴물</text>
  <circle cx="655" cy="120" r="32" class="p2"/><text x="655" y="125" text-anchor="middle" class="tx-w">송강호</text>
  <circle cx="655" cy="235" r="32" class="p2"/><text x="655" y="240" text-anchor="middle" class="tx-w">배두나</text>
  <line x1="408" y1="135" x2="490" y2="102" class="ln" stroke-width="2" marker-end="url(#c02a5)"/>
  <line x1="408" y1="166" x2="490" y2="203" class="ln" stroke-width="2" marker-end="url(#c02a5)"/>
  <line x1="624" y1="112" x2="554" y2="96" class="ln" stroke-width="2" marker-end="url(#c02a5)"/>
  <line x1="630" y1="140" x2="547" y2="198" class="ln" stroke-width="2" marker-end="url(#c02a5)"/>
  <line x1="623" y1="231" x2="554" y2="220" class="ln" stroke-width="2" marker-end="url(#c02a5)"/>
  <text x="515" y="280" text-anchor="middle" class="tx-m">같은 이름은 노드 하나로 합쳐집니다</text>
</svg>`;

  /* 그림 2-6. RDF 방식 vs 속성 그래프 방식 */
  const FIG_RDF = `<svg viewBox="0 0 720 300" role="img" aria-label="왼쪽 RDF 방식은 역할을 표현하려고 출연 1이라는 중간 노드를 만들고, 오른쪽 속성 그래프 방식은 출연했다 관계에 역할 속성을 바로 붙이는 그림">
  ${ARROW('c02a6')}
  <rect x="10" y="10" width="345" height="280" rx="14" class="card-bg"/>
  <rect x="365" y="10" width="345" height="280" rx="14" class="card-bg"/>
  <text x="182" y="38" text-anchor="middle" class="tx-b">RDF 방식 (모든 것이 트리플)</text>
  <circle cx="182" cy="150" r="30" class="p5s"/><text x="182" y="155" text-anchor="middle" class="tx">출연#1</text>
  <circle cx="70" cy="80" r="30" class="p2"/><text x="70" y="85" text-anchor="middle" class="tx-w">송강호</text>
  <circle cx="295" cy="80" r="30" class="p3"/><text x="295" y="85" text-anchor="middle" class="tx-w">기생충</text>
  <rect x="140" y="225" width="84" height="34" rx="6" class="p4s"/><text x="182" y="247" text-anchor="middle" class="tx">"기택"</text>
  <line x1="157" y1="134" x2="96" y2="96" class="ln" stroke-width="2" marker-end="url(#c02a6)"/>
  <line x1="207" y1="134" x2="268" y2="96" class="ln" stroke-width="2" marker-end="url(#c02a6)"/>
  <line x1="182" y1="182" x2="182" y2="221" class="ln" stroke-width="2" marker-end="url(#c02a6)"/>
  <text x="100" y="130" text-anchor="middle" class="tx-m">배우</text>
  <text x="265" y="130" text-anchor="middle" class="tx-m">영화</text>
  <text x="200" y="206" class="tx-m">역할</text>
  <text x="182" y="280" text-anchor="middle" class="tx-m">역할을 붙이려면 중간 노드가 필요</text>
  <text x="537" y="38" text-anchor="middle" class="tx-b">속성 그래프 (Neo4j)</text>
  <circle cx="420" cy="130" r="34" class="p2"/><text x="420" y="135" text-anchor="middle" class="tx-w">송강호</text>
  <circle cx="650" cy="130" r="34" class="p3"/><text x="650" y="135" text-anchor="middle" class="tx-w">기생충</text>
  <line x1="456" y1="130" x2="612" y2="130" class="ln" stroke-width="2.5" marker-end="url(#c02a6)"/>
  <text x="535" y="120" text-anchor="middle" class="tx-b">출연했다</text>
  <text x="535" y="152" text-anchor="middle" class="tx-m">{역할: '기택'}</text>
  <rect x="375" y="190" width="125" height="50" rx="10" class="p5s"/>
  <text x="385" y="212" class="tx">출생연도: 1967</text><text x="385" y="232" class="tx-m">노드 속성</text>
  <rect x="580" y="190" width="125" height="50" rx="10" class="p5s"/>
  <text x="590" y="212" class="tx">개봉연도: 2019</text><text x="590" y="232" class="tx-m">노드 속성</text>
  <text x="537" y="280" text-anchor="middle" class="tx-m">값은 노드 · 관계 안에 바로 저장</text>
</svg>`;

  PY_COURSE.addChapter({
    id: 'ch02',
    no: '02',
    title: '온톨로지와 지식그래프',
    subtitle: '클래스 · 인스턴스 · 관계 · 트리플 · 지식그래프',
    summary: '어떤 분야에 <b>무엇이 있고 서로 어떤 관계인지</b>를 미리 약속해 두는 "지식의 설계도" <b>온톨로지</b>를 배웁니다. 클래스와 인스턴스, 클래스 계층, 속성과 관계(정의역 · 치역)를 Python 딕셔너리로 직접 정의하고, <b>트리플(주어 – 술어 – 목적어)</b>을 모아 <b>지식그래프</b>를 만든 뒤 온톨로지 규칙으로 잘못된 사실을 찾아 그림으로 그려 봅니다.',
    goals: [
      '온톨로지가 무엇이며 왜 필요한지 비유를 들어 설명할 수 있다',
      '클래스와 인스턴스, 클래스 계층(is-a)을 구분할 수 있다',
      '데이터 속성과 관계(객체 속성), 정의역 · 치역의 뜻을 말할 수 있다',
      '사실을 트리플로 표현하고 트리플 목록을 지식그래프로 바꿀 수 있다',
      'RDF 방식과 속성 그래프(Neo4j) 방식의 차이를 설명하고, 온톨로지로 트리플을 검사할 수 있다'
    ],
    sections: [
      {
        id: 'ch02-1',
        title: '온톨로지: 지식의 설계도',
        minutes: 50,
        goals: ['온톨로지 · 클래스 · 인스턴스의 뜻을 안다', '클래스 계층(is-a)을 트리로 그리고 상위 클래스를 따라갈 수 있다', '데이터 속성 · 관계 · 정의역 · 치역을 딕셔너리로 정의한다'],
        flow: [['도입 · 도서관 비유', 6], ['클래스와 인스턴스', 10], ['클래스 계층', 10], ['속성 · 관계 · 정의역/치역', 12], ['함께 해 보기: 학교 온톨로지', 12]],
        content: [
          { type: 'p', html: '도서관에 가면 책이 <b>총류 · 철학 · 사회과학 · 자연과학 …</b> 처럼 분류 번호에 따라 꽂혀 있습니다. 새 책이 들어와도 사서는 "이 책은 자연과학 &gt; 생물학이니 470번대"라고 정해진 자리에 꽂지요. 생물 시간에 배운 <b>계 · 문 · 강 · 목 · 과 · 속 · 종</b> 분류도 마찬가지입니다. "호랑이는 고양이과이고, 고양이과는 포유류이다"라는 약속이 있기 때문에 처음 보는 동물도 어디에 속하는지 말할 수 있습니다.' },
          { type: 'p', html: '이렇게 어떤 분야에 대해 <b>"무엇이 있고(개념), 그것들이 서로 어떤 관계인가"</b>를 미리 약속해 둔 설계도를 <b>온톨로지(ontology)</b>라고 합니다. 지난 차시에 노드와 관계로 그래프를 만들었다면, 온톨로지는 <b>"어떤 종류의 노드와 어떤 종류의 관계를 쓸지"</b> 정해 두는 규칙집입니다.' },
          { type: 'callout', kind: 'info', title: '왜 설계도가 필요할까요?', html: '여러 사람이 함께 데이터를 넣는데 누구는 "감독함", 누구는 "연출", 누구는 "만든 사람"이라고 쓰면 같은 사실을 찾을 수 없습니다. 온톨로지는 <b>쓰는 말(용어)과 연결 규칙을 하나로 맞추는 약속</b>입니다. 그래서 사람과 컴퓨터가 같은 뜻으로 데이터를 이해할 수 있습니다.' },
          { type: 'h', text: '클래스(개념)와 인스턴스(실제 사례)' },
          { type: 'p', html: '온톨로지의 가장 기본 재료는 <b>클래스</b>와 <b>인스턴스</b>입니다.' },
          { type: 'list', items: [
            '<b>클래스(class, 개념)</b> — 같은 종류의 것들을 묶은 이름. 예: <code>사람(Person)</code>, <code>영화(Movie)</code>, <code>장르(Genre)</code>.',
            '<b>인스턴스(instance, 사례)</b> — 클래스에 속하는 실제 하나하나. 예: <code>봉준호</code>는 사람의 인스턴스, <code>기생충</code>은 영화의 인스턴스.'
          ] },
          { type: 'figure', html: FIG_LAYER, caption: '그림 2-1. 위층(온톨로지)은 "감독은 영화를 감독할 수 있다"는 규칙, 아래층(인스턴스)은 "봉준호가 기생충을 감독했다"는 실제 사실입니다.' },
          { type: 'table', head: ['', '클래스 (설계도)', '인스턴스 (실제 사례)'], rows: [
            ['비유', '붕어빵 틀', '붕어빵 하나하나'],
            ['영화 분야', '사람, 영화, 장르', '봉준호, 송강호, 기생충, 스릴러'],
            ['학교 분야', '학생, 교사, 과목', '김민수, 이선생님, 수학'],
            ['그래프에서', '노드의 <b>레이블</b> (<code>:Person</code>)', '<b>노드</b> 하나']
          ], caption: '클래스는 "종류", 인스턴스는 그 종류에 속한 "실제 것"입니다.' },
          { type: 'callout', kind: 'tip', title: '지난 차시의 레이블과 연결하기', html: '1차시에서 본 속성 그래프의 <b>레이블</b>(<code>:Person</code>, <code>:City</code>)이 바로 클래스 역할을 합니다. 온톨로지는 "레이블로 무엇을 쓰고, 레이블끼리 어떤 관계로 이을 수 있는지"를 정리한 문서라고 생각하면 됩니다.' },
          { type: 'h', text: '클래스 계층: "~는 ~의 한 종류이다" (is-a)' },
          { type: 'p', html: '클래스끼리는 <b>큰 개념 – 작은 개념</b> 관계가 있습니다. "감독은 사람의 한 종류이다", "스릴러는 장르의 한 종류이다"처럼요. 이 관계를 <b>is-a</b> 또는 <b>subClassOf(하위 클래스)</b>라고 하고, 기호로 <code>감독 ⊂ 사람</code> 처럼 씁니다. 이것을 모두 그리면 생물 분류표와 같은 <b>트리(나무)</b> 모양이 됩니다.' },
          { type: 'figure', html: FIG_TREE, caption: '그림 2-2. 영화 온톨로지의 클래스 계층. 화살표는 아래(작은 개념)에서 위(큰 개념)를 가리킵니다.' },
          { type: 'p', html: '계층이 있으면 좋은 점은 <b>상속</b>입니다. "사람은 이름과 출생연도를 가진다"라고 한 번만 적어 두면, 감독과 배우도 사람이므로 자동으로 이름과 출생연도를 가집니다. 또 "봉준호는 감독이다"만 알아도 <b>"봉준호는 사람이다"</b>라는 사실을 컴퓨터가 스스로 끌어낼 수 있습니다.' },
          { type: 'p', html: '이제 Python 딕셔너리로 계층을 표현해 봅시다. <b>"클래스 이름 → 바로 위 클래스"</b>를 적으면 됩니다. 맨 위 클래스는 위가 없으므로 <code>None</code> 을 씁니다.' },
          { type: 'code', title: '예제 2-1. 클래스와 상위 클래스 정의하기', code: `# 클래스 이름 -> 바로 위(상위) 클래스. 맨 위는 None
classes = {
    '사물': None,
    '사람': '사물',
    '감독': '사람',
    '배우': '사람',
    '작품': '사물',
    '영화': '작품',
    '장르': '사물',
}

for c, parent in classes.items():
    if parent is None:
        print(c, ': 최상위 클래스')
    else:
        print(c, 'is-a', parent)`,
            expect: '사물 : 최상위 클래스\n사람 is-a 사물\n감독 is-a 사람\n배우 is-a 사람\n작품 is-a 사물\n영화 is-a 작품\n장르 is-a 사물',
            desc: '한 줄이 곧 그림 2-2 의 화살표 하나입니다. 상위 클래스를 하나만 적으면 되므로 딕셔너리가 아주 간단해집니다.' },
          { type: 'code', title: '예제 2-2. 계층을 트리 모양으로 출력하기', code: `classes = {
    '사물': None,
    '사람': '사물', '감독': '사람', '배우': '사람',
    '작품': '사물', '영화': '작품',
    '장르': '사물',
}

def children(c):
    # 상위 클래스가 c 인 클래스들 = c 의 하위 클래스
    return [k for k, v in classes.items() if v == c]

def show(c, depth=0):
    print('    ' * depth + '- ' + c)
    for child in children(c):
        show(child, depth + 1)   # 하위 클래스는 한 칸 더 들여쓰기

show('사물')`,
            expect: '- 사물\n    - 사람\n        - 감독\n        - 배우\n    - 작품\n        - 영화\n    - 장르',
            desc: '<code>show</code> 함수가 자기 자신을 다시 부르며(재귀) 아래로 내려갑니다. 들여쓰기 깊이가 곧 계층의 깊이입니다.' },
          { type: 'code', title: '예제 2-3. 인스턴스의 종류를 위로 따라가기', code: `classes = {
    '사물': None,
    '사람': '사물', '감독': '사람', '배우': '사람',
    '작품': '사물', '영화': '작품',
    '장르': '사물',
}
# 인스턴스 -> 직접 속한 클래스
instances = {'봉준호': '감독', '송강호': '배우', '기생충': '영화', '스릴러': '장르'}

def ancestors(c):
    # c 에서 시작해 맨 위까지 올라가며 모은 클래스 목록
    result = []
    while c is not None:
        result.append(c)
        c = classes[c]
    return result

def is_a(thing, cls):
    return cls in ancestors(instances[thing])

print('감독의 상위 클래스들:', ancestors('감독'))
print('봉준호는 사람인가?', is_a('봉준호', '사람'))
print('봉준호는 영화인가?', is_a('봉준호', '영화'))
print('기생충은 작품인가?', is_a('기생충', '작품'))`,
            expect: "감독의 상위 클래스들: ['감독', '사람', '사물']\n봉준호는 사람인가? True\n봉준호는 영화인가? False\n기생충은 작품인가? True",
            desc: '"봉준호는 사람이다"라는 사실은 어디에도 직접 적지 않았습니다. <b>봉준호 → 감독 → 사람</b> 으로 계층을 따라 올라가 알아낸 것입니다. 이렇게 규칙으로 새 사실을 끌어내는 것을 <b>추론</b>이라고 합니다.' },
          { type: 'callout', kind: 'more', title: '스릴러는 클래스일까, 인스턴스일까?', html: '그림 2-2 에서는 스릴러를 장르의 <b>하위 클래스</b>로 그렸지만, 예제 2-3 에서는 장르의 <b>인스턴스</b>로 두었습니다. 둘 다 틀린 것이 아닙니다. "스릴러에도 심리 스릴러 · 범죄 스릴러 같은 하위 분류가 필요한가?"에 따라 설계자가 고르면 됩니다. 온톨로지 설계에는 하나의 정답보다 <b>목적에 맞는 선택</b>이 중요합니다.' },
          { type: 'h', text: '속성과 관계, 정의역(domain)과 치역(range)' },
          { type: 'p', html: '클래스에 붙는 정보는 두 가지로 나눕니다.' },
          { type: 'list', items: [
            '<b>데이터 속성(data property)</b> — 숫자 · 글자 같은 <b>값</b>을 붙입니다. 예: 영화의 <code>개봉연도 = 2019</code>, 사람의 <code>출생연도 = 1969</code>.',
            '<b>관계(객체 속성, object property)</b> — 다른 <b>인스턴스(노드)</b>와 잇습니다. 예: 봉준호 <code>감독했다</code> 기생충.'
          ] },
          { type: 'p', html: '관계에는 "어디서 출발해 어디로 가야 하는지" 규칙을 정해 둡니다. 출발 쪽에 올 수 있는 클래스를 <b>정의역(domain)</b>, 도착 쪽에 올 수 있는 클래스를 <b>치역(range)</b>이라고 합니다. 수학 함수의 정의역 · 치역과 같은 말이지만, 여기서는 그냥 <b>"출발 자리 · 도착 자리에 앉을 수 있는 종류"</b>로 기억하면 충분합니다.' },
          { type: 'figure', html: FIG_PROP, caption: '그림 2-3. 데이터 속성은 노드에 값을 붙이고, 관계는 노드와 노드를 잇습니다. "감독했다"의 정의역은 감독, 치역은 영화입니다.' },
          { type: 'table', head: ['관계', '정의역 (출발)', '치역 (도착)', '읽는 법'], rows: [
            ['감독했다', '감독', '영화', '감독이 영화를 감독했다'],
            ['출연했다', '사람', '영화', '사람이 영화에 출연했다'],
            ['장르이다', '영화', '장르', '영화의 장르는 ○○이다']
          ], caption: '"출연했다"의 정의역을 배우가 아니라 사람으로 두면, 감독이 카메오로 출연한 경우도 담을 수 있습니다.' },
          { type: 'code', title: '예제 2-4. 데이터 속성과 관계 규칙 정의하기', code: `# 데이터 속성: 이름 -> (붙는 클래스, 값의 종류)
data_props = {
    '이름': ('사람', '문자열'),
    '출생연도': ('사람', '정수'),
    '제목': ('영화', '문자열'),
    '개봉연도': ('영화', '정수'),
}
# 관계: 이름 -> (정의역, 치역)
relations = {
    '감독했다': ('감독', '영화'),
    '출연했다': ('사람', '영화'),
    '장르이다': ('영화', '장르'),
}

print('[데이터 속성] 노드에 붙는 값')
for name, (d, r) in data_props.items():
    print(f'  {d}.{name} : {r}')
print('[관계] 노드와 노드를 잇는 선')
for name, (d, r) in relations.items():
    print(f'  ({d}) -[{name}]-> ({r})')`,
            expect: '[데이터 속성] 노드에 붙는 값\n  사람.이름 : 문자열\n  사람.출생연도 : 정수\n  영화.제목 : 문자열\n  영화.개봉연도 : 정수\n[관계] 노드와 노드를 잇는 선\n  (감독) -[감독했다]-> (영화)\n  (사람) -[출연했다]-> (영화)\n  (영화) -[장르이다]-> (장르)',
            desc: '튜플 <code>(정의역, 치역)</code> 하나로 관계 규칙을 적었습니다. 출력 모양 <code>(감독) -[감독했다]-> (영화)</code> 는 1차시에서 본 그래프 표기와 같습니다.' },
          { type: 'code', title: '예제 2-5. 영화 온톨로지 한데 묶기: 클래스마다 쓸 수 있는 관계', code: `ontology = {
    'classes': {
        '사물': None,
        '사람': '사물', '감독': '사람', '배우': '사람',
        '작품': '사물', '영화': '작품',
        '장르': '사물',
    },
    'relations': {
        '감독했다': ('감독', '영화'),
        '출연했다': ('사람', '영화'),
        '장르이다': ('영화', '장르'),
    },
}

def ancestors(c):
    result = []
    while c is not None:
        result.append(c)
        c = ontology['classes'][c]
    return result

# 정의역이 '나 또는 내 상위 클래스'이면 그 관계로 출발할 수 있음 (상속)
for c in ['사람', '감독', '배우', '영화']:
    usable = [name for name, (d, r) in ontology['relations'].items()
              if d in ancestors(c)]
    print(c, '->', usable)`,
            expect: "사람 -> ['출연했다']\n감독 -> ['감독했다', '출연했다']\n배우 -> ['출연했다']\n영화 -> ['장르이다']",
            desc: '감독은 "감독했다"뿐 아니라 상위 클래스인 사람의 관계 "출연했다"도 쓸 수 있습니다. <b>상위 클래스의 규칙은 하위 클래스에 물려줍니다.</b>' },
          { type: 'callout', kind: 'warn', title: '자주 하는 실수', html: '<b>is-a(하위 클래스)</b>와 <b>part-of(부분)</b>를 헷갈리지 마세요. "감독은 사람이다"는 is-a 이지만, "바퀴는 자동차이다"는 틀린 말입니다. 바퀴는 자동차의 <b>부분</b>이므로 계층이 아니라 <code>부분이다</code> 같은 <b>관계</b>로 표현해야 합니다.' },
          { type: 'h', text: '함께 해 보기: 학교 온톨로지 만들기' },
          { type: 'p', html: '이번에는 우리에게 익숙한 <b>학교</b> 분야의 설계도를 만들어 봅시다. 클래스는 <b>사람 · 학생 · 교사 · 과목 · 반</b>, 관계는 <b>가르친다 · 수강한다 · 소속된다</b> 입니다. 먼저 종이에 트리와 화살표를 그려 본 뒤 코드와 비교해 보세요.' },
          { type: 'code', title: '예제 2-6. 학교 온톨로지 정의하고 출력하기', code: `school = {
    'classes': {
        '사물': None,
        '사람': '사물', '학생': '사람', '교사': '사람',
        '과목': '사물',
        '반': '사물',
    },
    'relations': {
        '가르친다': ('교사', '과목'),
        '수강한다': ('학생', '과목'),
        '소속된다': ('사람', '반'),    # 학생도 교사(담임)도 반에 소속
    },
}

def children(c):
    return [k for k, v in school['classes'].items() if v == c]

def show(c, depth=0):
    print('    ' * depth + '- ' + c)
    for child in children(c):
        show(child, depth + 1)

def ancestors(c):
    result = []
    while c is not None:
        result.append(c)
        c = school['classes'][c]
    return result

print('[클래스 계층]')
show('사물')
print('[관계 규칙]')
for name, (d, r) in school['relations'].items():
    print(f'  ({d}) -[{name}]-> ({r})')
print('[클래스별로 쓸 수 있는 관계]')
for c in ['학생', '교사']:
    usable = [n for n, (d, r) in school['relations'].items() if d in ancestors(c)]
    print(' ', c, usable)`,
            expect: "[클래스 계층]\n- 사물\n    - 사람\n        - 학생\n        - 교사\n    - 과목\n    - 반\n[관계 규칙]\n  (교사) -[가르친다]-> (과목)\n  (학생) -[수강한다]-> (과목)\n  (사람) -[소속된다]-> (반)\n[클래스별로 쓸 수 있는 관계]\n  학생 ['수강한다', '소속된다']\n  교사 ['가르친다', '소속된다']",
            desc: '"소속된다"의 정의역을 <code>사람</code> 으로 두었기 때문에 학생과 교사 모두 이 관계를 물려받습니다. <code>동아리</code> 클래스와 <code>가입한다</code> 관계를 추가해 보고, 출력이 어떻게 바뀌는지 확인해 보세요.' },
          { type: 'callout', kind: 'tip', title: '좋은 온톨로지를 만드는 질문', html: '① 이 분야에서 <b>사람들이 묻고 싶은 질문</b>은 무엇인가? ("김민수가 듣는 과목을 가르치는 선생님은?") ② 그 질문에 답하려면 어떤 <b>클래스</b>와 <b>관계</b>가 필요한가? ③ 비슷한 클래스끼리 <b>공통 상위 클래스</b>로 묶을 수 있는가? — 질문에서 출발하면 꼭 필요한 것만 담은 설계도가 됩니다.' }
        ],
        slides: [
          { layout: 'title', title: '온톨로지와 지식그래프', subtitle: '온톨로지: 지식의 설계도',
            notes: '<p>💬 <b>발문:</b> "도서관에서 처음 보는 책을 어떻게 찾나요?" → 분류 번호. "모두가 같은 분류 약속을 쓰기 때문"이라는 점을 끌어냅니다. 오늘은 그 약속, 온톨로지를 만듭니다. (5분)</p>' },
          { layout: 'diagram', title: '클래스(설계도)와 인스턴스(실제 사례)', html: FIG_LAYER, caption: '붕어빵 틀 = 클래스, 붕어빵 = 인스턴스',
            notes: '<p>위층은 규칙, 아래층은 사실임을 강조합니다. 1차시의 레이블(:Person) = 클래스라고 연결해 줍니다. 💬 "송강호는 어느 클래스의 인스턴스일까?" → 배우(그리고 사람). (10분)</p>' },
          { layout: 'diagram', title: '클래스 계층: is-a (subClassOf)', html: FIG_TREE, caption: '감독 ⊂ 사람 ⊂ 사물',
            notes: '<p>생물 분류(호랑이 ⊂ 고양이과 ⊂ 포유류)와 비교합니다. is-a 와 part-of 를 혼동하는 오개념(바퀴 ⊂ 자동차?)을 꼭 짚습니다. 예제 2-2 · 2-3 을 실행해 "봉준호는 사람인가? True" 가 추론으로 나온다는 점을 보여 줍니다. (10분)</p>' },
          { layout: 'code', title: '관계 규칙: 정의역 → 치역', code: `relations = {
    '감독했다': ('감독', '영화'),
    '출연했다': ('사람', '영화'),
    '장르이다': ('영화', '장르'),
}
for name, (d, r) in relations.items():
    print(f'({d}) -[{name}]-> ({r})')`,
            points: ['정의역(domain) = 출발 자리', '치역(range) = 도착 자리', '데이터 속성은 값, 관계는 노드를 이음'],
            notes: '<p>그림 2-3 을 함께 보여 주며 "출발 자리 · 도착 자리"라는 쉬운 말로 설명합니다. 💬 "출연했다의 정의역을 배우가 아니라 사람으로 둔 이유는?" → 감독 카메오 출연도 가능. 이어서 예제 2-6 학교 온톨로지를 함께 만듭니다. (22분)</p>' },
          { layout: 'summary', title: '정리', bullets: ['온톨로지 = 분야의 <b>개념과 관계를 약속한 설계도</b>', '<b>클래스</b>(종류) vs <b>인스턴스</b>(실제 사례)', '클래스 계층 is-a → 상속과 추론', '데이터 속성(값) · 관계(정의역 → 치역)', '다음 교시: 사실을 <b>트리플</b>로 적고 지식그래프 만들기'],
            notes: '<p>출구 질문: "학교 온톨로지에 \'동아리\'를 넣는다면 어떤 클래스와 관계가 필요할까요?" (3분)</p>' }
        ]
      },
      {
        id: 'ch02-2',
        title: '트리플과 지식그래프',
        minutes: 50,
        goals: ['사실을 트리플(주어 – 술어 – 목적어)로 표현한다', '트리플 목록을 지식그래프로 바꾸고 그린다', 'RDF 와 속성 그래프의 차이를 알고, 온톨로지로 잘못된 트리플을 찾는다'],
        flow: [['도입 · 문장을 쪼개기', 5], ['트리플과 지식그래프', 12], ['RDF vs 속성 그래프', 10], ['온톨로지로 검사하기', 10], ['실제 사례 · 함께 해 보기', 13]],
        content: [
          { type: 'p', html: '국어 시간에 문장을 <b>주어 · 서술어 · 목적어</b>로 나누어 본 적이 있지요? "봉준호가 기생충을 감독했다"는 <b>누가(봉준호) – 무엇을 했다(감독했다) – 무엇을(기생충)</b> 으로 쪼갤 수 있습니다. 지식그래프는 세상의 사실을 이렇게 <b>세 조각짜리 문장</b>으로 잘게 나누어 저장합니다.' },
          { type: 'h', text: '트리플: 주어 – 술어 – 목적어' },
          { type: 'p', html: '사실 하나를 <b>(주어, 술어, 목적어)</b> 세 칸으로 적은 것을 <b>트리플(triple, 세 쌍)</b>이라고 합니다. 주어와 목적어는 <b>노드</b>, 술어는 둘을 잇는 <b>관계(화살표)</b>가 됩니다.' },
          { type: 'figure', html: FIG_TRIPLE, caption: '그림 2-4. 트리플 (봉준호, 감독했다, 기생충) 은 그래프에서 "봉준호 → 기생충" 화살표 하나입니다.' },
          { type: 'code', title: '예제 2-7. 트리플 목록 만들고 질문하기', code: `# 사실 하나 = (주어, 술어, 목적어) 튜플 하나
triples = [
    ('봉준호', '감독했다', '기생충'),
    ('봉준호', '감독했다', '괴물'),
    ('송강호', '출연했다', '기생충'),
    ('송강호', '출연했다', '괴물'),
    ('배두나', '출연했다', '괴물'),
    ('기생충', '장르이다', '드라마'),
]

for s, p, o in triples:
    print(f'({s}, {p}, {o})')

print('송강호에 대한 사실:', [(p, o) for s, p, o in triples if s == '송강호'])
print('괴물에 출연한 사람:', [s for s, p, o in triples if p == '출연했다' and o == '괴물'])
print('봉준호가 감독한 영화 수:', sum(1 for s, p, o in triples if s == '봉준호' and p == '감독했다'))`,
            expect: "(봉준호, 감독했다, 기생충)\n(봉준호, 감독했다, 괴물)\n(송강호, 출연했다, 기생충)\n(송강호, 출연했다, 괴물)\n(배두나, 출연했다, 괴물)\n(기생충, 장르이다, 드라마)\n송강호에 대한 사실: [('출연했다', '기생충'), ('출연했다', '괴물')]\n괴물에 출연한 사람: ['송강호', '배두나']\n봉준호가 감독한 영화 수: 2",
            desc: '트리플은 모양이 모두 같아서, 주어 · 술어 · 목적어 중 <b>아무 칸에나 조건을 걸어</b> 사실을 골라낼 수 있습니다.' },
          { type: 'h', text: '트리플을 모으면 지식그래프가 된다' },
          { type: 'p', html: '트리플 하나하나는 짧은 문장이지만, <b>같은 이름이 여러 트리플에 등장</b>하면 그 이름이 하나의 노드로 합쳐지면서 사실들이 서로 이어집니다. 이렇게 사실(트리플)들을 연결한 그래프를 <b>지식그래프(knowledge graph)</b>라고 합니다.' },
          { type: 'figure', html: FIG_KG, caption: '그림 2-5. 트리플 5개가 모여 노드 5개 · 관계 5개의 지식그래프가 됩니다. 송강호와 봉준호는 "기생충", "괴물"을 통해 이어집니다.' },
          { type: 'code', title: '예제 2-8. 트리플을 그래프로: 함께 출연한 사람 찾기', code: `triples = [
    ('봉준호', '감독했다', '기생충'),
    ('봉준호', '감독했다', '괴물'),
    ('송강호', '출연했다', '기생충'),
    ('송강호', '출연했다', '괴물'),
    ('배두나', '출연했다', '괴물'),
    ('조여정', '출연했다', '기생충'),
]

# 나가는 화살표: 노드 -> [(관계, 도착 노드)]
out_edges = {}
# 들어오는 화살표: 노드 -> [(관계, 출발 노드)]
in_edges = {}
for s, p, o in triples:
    out_edges.setdefault(s, []).append((p, o))
    in_edges.setdefault(o, []).append((p, s))

nodes = sorted(set(out_edges) | set(in_edges))
print('노드', len(nodes), '개:', nodes)
print('괴물로 들어오는 화살표:', in_edges['괴물'])

# 송강호 -> (출연한 영화) -> 그 영화에 출연한 다른 사람  (2단계 따라가기)
partners = set()
for p, movie in out_edges['송강호']:
    for p2, person in in_edges[movie]:
        if p2 == '출연했다' and person != '송강호':
            partners.add(person)
print('송강호와 함께 출연한 사람:', sorted(partners))`,
            expect: "노드 6 개: ['괴물', '기생충', '배두나', '봉준호', '송강호', '조여정']\n괴물로 들어오는 화살표: [('감독했다', '봉준호'), ('출연했다', '송강호'), ('출연했다', '배두나')]\n송강호와 함께 출연한 사람: ['배두나', '조여정']",
            desc: '1차시의 "친구의 친구" 찾기와 같은 방법입니다. 트리플을 <b>나가는 화살표 · 들어오는 화살표</b> 두 방향으로 정리해 두면 화살표를 앞뒤로 따라갈 수 있습니다.' },
          { type: 'code', title: '예제 2-9. 트리플 목록을 그래프 그림으로 그리기', code: `import matplotlib.pyplot as plt
plt.rcParams['font.family'] = 'Malgun Gothic'

triples = [
    ('봉준호', '감독했다', '기생충'),
    ('봉준호', '감독했다', '괴물'),
    ('송강호', '출연했다', '기생충'),
    ('송강호', '출연했다', '괴물'),
    ('배두나', '출연했다', '괴물'),
]
pos = {'봉준호': (0, 1), '기생충': (2, 2), '괴물': (2, 0),
       '송강호': (4, 1.5), '배두나': (4, 0)}

plt.figure(figsize=(7, 4))
for s, p, o in triples:
    plt.annotate('', xy=pos[o], xytext=pos[s],
                 arrowprops=dict(arrowstyle='->', color='gray', lw=1.5,
                                 shrinkA=22, shrinkB=22))
    mx = (pos[s][0] + pos[o][0]) / 2
    my = (pos[s][1] + pos[o][1]) / 2
    plt.text(mx, my, p, fontsize=9, color='dimgray', ha='center')
for name, (x, y) in pos.items():
    plt.text(x, y, name, ha='center', va='center', color='white', fontsize=12,
             bbox=dict(boxstyle='round,pad=0.5', fc='tab:blue', ec='none'))
plt.xlim(-0.8, 4.8)
plt.ylim(-0.6, 2.6)
plt.axis('off')
plt.title('트리플 5개로 만든 지식그래프')
plt.show()`,
            desc: '<code>plt.annotate</code> 의 <code>arrowprops</code> 로 화살표를 그리고, 화살표 가운데에 술어를 적었습니다. <code>shrinkA · shrinkB</code> 는 화살표 양 끝을 이름 상자에서 조금 떨어뜨리는 값입니다.' },
          { type: 'h', text: 'RDF 방식 vs 속성 그래프(Neo4j) 방식' },
          { type: 'p', html: '지식그래프를 저장하는 대표적인 방식은 두 가지입니다.' },
          { type: 'list', items: [
            '<b>RDF 방식</b> — 웹 표준(W3C). <b>모든 것을 트리플</b>로 적습니다. "기생충의 개봉연도는 2019" 도 <code>(기생충, 개봉연도, 2019)</code> 라는 트리플 하나입니다.',
            '<b>속성 그래프 방식</b> — Neo4j 가 쓰는 방식. 값은 <b>노드나 관계 안에 속성(키: 값)</b>으로 넣고, 노드끼리의 연결만 관계로 그립니다.'
          ] },
          { type: 'figure', html: FIG_RDF, caption: '그림 2-6. "송강호가 기생충에서 기택 역으로 출연했다". RDF 는 중간 노드(출연#1)를 만들어야 하지만, 속성 그래프는 관계에 <code>역할</code> 속성을 바로 붙입니다.' },
          { type: 'table', head: ['', 'RDF 방식', '속성 그래프 (Neo4j)'], rows: [
            ['기본 단위', '트리플', '노드 · 관계 · 속성'],
            ['값(개봉연도 등)', '트리플 하나 (목적어가 값)', '노드 속성 <code>{개봉연도: 2019}</code>'],
            ['관계에 정보 붙이기', '중간 노드를 만들어 풀어 씀', '관계 속성 <code>{역할: \'기택\'}</code>'],
            ['질의 언어', 'SPARQL', 'Cypher'],
            ['잘하는 일', '웹에서 데이터 공유 · 표준 온톨로지(OWL)', '빠른 연결 탐색 · 직관적인 모델링']
          ] },
          { type: 'code', title: '예제 2-10. RDF 식 트리플을 속성 그래프로 바꾸기', code: `# RDF 처럼 '값'도 트리플로 적은 목록
triples = [
    ('기생충', '개봉연도', 2019),
    ('괴물', '개봉연도', 2006),
    ('봉준호', '출생연도', 1969),
    ('봉준호', '감독했다', '기생충'),
    ('봉준호', '감독했다', '괴물'),
]
known_nodes = {'기생충', '괴물', '봉준호'}

nodes = {n: {} for n in sorted(known_nodes)}   # 노드 -> 속성 딕셔너리
rels = []                                        # (출발, 관계, 도착)
for s, p, o in triples:
    if o in known_nodes:
        rels.append((s, p, o))      # 목적어가 노드 -> 관계
    else:
        nodes[s][p] = o             # 목적어가 값 -> 노드 속성

print('트리플', len(triples), '개 -> 노드', len(nodes), '개 + 관계', len(rels), '개')
for n, props in nodes.items():
    print(' ', n, props)
for r in rels:
    print(' ', r)`,
            expect: "트리플 5 개 -> 노드 3 개 + 관계 2 개\n  괴물 {'개봉연도': 2006}\n  기생충 {'개봉연도': 2019}\n  봉준호 {'출생연도': 1969}\n  ('봉준호', '감독했다', '기생충')\n  ('봉준호', '감독했다', '괴물')",
            desc: '목적어가 <b>다른 노드</b>이면 관계, <b>값</b>이면 속성으로 나눴습니다. RDF 에서는 트리플 5개였지만 속성 그래프에서는 노드 3개와 관계 2개로 더 간단해집니다.' },
          { type: 'code', title: '예제 2-11. 관계에 속성 붙이기: 역할과 연도', code: `# 속성 그래프: 관계 하나가 속성을 가질 수 있음
acted = [
    {'start': '송강호', 'type': '출연했다', 'end': '기생충', '역할': '기택', '연도': 2019},
    {'start': '송강호', 'type': '출연했다', 'end': '괴물', '역할': '강두', '연도': 2006},
]
for r in acted:
    print(f"{r['start']} -[{r['type']} {{역할: {r['역할']}, 연도: {r['연도']}}}]-> {r['end']}")

# 같은 내용을 RDF 트리플로 풀면 관계 하나마다 중간 노드 + 트리플 4개
rdf = []
for i, r in enumerate(acted, start=1):
    mid = '출연#' + str(i)
    rdf += [(mid, '배우', r['start']), (mid, '영화', r['end']),
            (mid, '역할', r['역할']), (mid, '연도', r['연도'])]
print('RDF 트리플 수:', len(rdf))
for t in rdf[:4]:
    print(' ', t)`,
            expect: "송강호 -[출연했다 {역할: 기택, 연도: 2019}]-> 기생충\n송강호 -[출연했다 {역할: 강두, 연도: 2006}]-> 괴물\nRDF 트리플 수: 8\n  ('출연#1', '배우', '송강호')\n  ('출연#1', '영화', '기생충')\n  ('출연#1', '역할', '기택')\n  ('출연#1', '연도', 2019)",
            desc: 'f-string 안에서 중괄호 글자 자체를 찍으려면 <code>{{ }}</code> 처럼 두 번 씁니다. 관계에 정보가 붙는 경우가 많을수록 속성 그래프 방식이 간결합니다.' },
          { type: 'callout', kind: 'info', title: '어느 쪽이 더 좋을까요?', html: '정답은 없습니다. 공공 데이터 · 웹 표준처럼 <b>여러 기관이 데이터를 공유</b>할 때는 RDF 가, 하나의 서비스 안에서 <b>빠르게 연결을 따라가며 질문</b>할 때는 속성 그래프가 많이 쓰입니다. 이 강좌는 속성 그래프(Neo4j)를 사용하지만, 온톨로지와 트리플로 생각하는 습관은 그대로 도움이 됩니다.' },
          { type: 'h', text: '온톨로지로 트리플 검사하기' },
          { type: 'p', html: '지식그래프에 사실을 많이 넣다 보면 실수가 생깁니다. 주어와 목적어를 거꾸로 넣거나, 엉뚱한 관계를 쓰는 것이지요. 이때 1교시에 만든 온톨로지가 <b>검사관</b> 역할을 합니다. 트리플 <code>(s, p, o)</code> 가 올바르려면 다음 두 가지를 만족해야 합니다.' },
          { type: 'list', ordered: true, items: [
            '주어 <code>s</code> 의 클래스가 관계 <code>p</code> 의 <b>정의역</b>(또는 그 하위 클래스)이다.',
            '목적어 <code>o</code> 의 클래스가 관계 <code>p</code> 의 <b>치역</b>(또는 그 하위 클래스)이다.'
          ] },
          { type: 'code', title: '예제 2-12. 정의역 · 치역을 어긴 트리플 찾기', code: `classes = {'사물': None, '사람': '사물', '감독': '사람', '배우': '사람',
           '작품': '사물', '영화': '작품', '장르': '사물'}
relations = {'감독했다': ('감독', '영화'),
             '출연했다': ('사람', '영화'),
             '장르이다': ('영화', '장르')}
types = {'봉준호': '감독', '송강호': '배우', '기생충': '영화',
         '괴물': '영화', '드라마': '장르'}

def is_a(thing, cls):
    c = types[thing]
    while c is not None:
        if c == cls:
            return True
        c = classes[c]
    return False

def check(s, p, o):
    domain, rng = relations[p]
    problems = []
    if not is_a(s, domain):
        problems.append(f'주어 {s}({types[s]}) 는 {domain} 이 아님')
    if not is_a(o, rng):
        problems.append(f'목적어 {o}({types[o]}) 는 {rng} 이 아님')
    return problems

triples = [
    ('봉준호', '감독했다', '기생충'),
    ('봉준호', '출연했다', '괴물'),     # 감독도 사람이므로 OK
    ('기생충', '감독했다', '봉준호'),   # 주어 · 목적어가 거꾸로!
    ('송강호', '장르이다', '드라마'),   # 사람에게 장르?
]
for t in triples:
    problems = check(*t)
    print('OK  ' if not problems else '오류', t, problems)`,
            expect: "OK   ('봉준호', '감독했다', '기생충') []\nOK   ('봉준호', '출연했다', '괴물') []\n오류 ('기생충', '감독했다', '봉준호') ['주어 기생충(영화) 는 감독 이 아님', '목적어 봉준호(감독) 는 영화 이 아님']\n오류 ('송강호', '장르이다', '드라마') ['주어 송강호(배우) 는 영화 이 아님']",
            desc: '두 번째 트리플은 봉준호가 "감독" 클래스여도 <b>감독 ⊂ 사람</b> 이므로 "출연했다"의 정의역(사람)을 통과합니다. 계층을 따라 올라가는 <code>is_a</code> 덕분입니다.' },
          { type: 'callout', kind: 'warn', title: '검사를 통과해도 "사실"인 것은 아니에요', html: '온톨로지 검사는 <b>모양(종류)이 맞는지</b>만 봅니다. <code>(봉준호, 감독했다, 올드보이)</code> 는 감독 → 영화이므로 검사를 통과하지만, 실제로는 박찬욱 감독의 작품이므로 틀린 사실입니다. 내용이 맞는지는 출처를 확인해야 합니다.' },
          { type: 'h', text: '실제 지식그래프 사례' },
          { type: 'table', head: ['사례', '무엇을 담고 있나', '우리가 보는 모습'], rows: [
            ['<b>구글 지식 그래프</b>', '인물 · 장소 · 작품 등 수십억 개의 사실 (2012년 공개)', '검색 결과 오른쪽의 <b>지식 패널</b> (감독, 출연진, 개봉일 …)'],
            ['<b>위키데이터</b> (Wikidata)', '누구나 편집하는 공개 지식그래프. 항목은 <code>Q</code> 번호, 관계는 <code>P</code> 번호', '위키백과의 정보 상자, 여러 앱의 데이터 출처'],
            ['<b>쇼핑 · 영화 추천</b>', '사용자 – 상품 – 분류 – 브랜드 사이의 관계', '"이 영화를 본 사람이 좋아한 작품"'],
            ['<b>AI 챗봇의 지식 보강</b>', '회사 문서 속 개념 · 담당자 · 제품의 관계', '근거가 있는 답변 (GraphRAG)']
          ] },
          { type: 'p', html: '위키데이터는 이번 차시에 배운 개념을 그대로 씁니다. <code>P31</code> 은 "~의 인스턴스이다(instance of)", <code>P279</code> 는 "~의 하위 클래스이다(subclass of)", <code>P57</code> 은 "감독"이라는 관계입니다. 즉 위키데이터도 <b>클래스 · 인스턴스 · 계층 · 트리플</b>로 이루어진 거대한 지식그래프입니다.' },
          { type: 'h', text: '함께 해 보기: 영화 지식그래프 만들고 검사하기' },
          { type: 'p', html: '영화 5편과 인물 8명에 대한 트리플 20개를 만들고, 온톨로지 규칙으로 <b>잘못된 트리플을 걸러 낸 뒤</b> 올바른 사실만 그림으로 그려 봅시다. 일부러 틀린 트리플 3개를 섞어 두었습니다.' },
          { type: 'code', title: '예제 2-13. 트리플 20개 → 검사 → 지식그래프 그리기', code: `import matplotlib.pyplot as plt
plt.rcParams['font.family'] = 'Malgun Gothic'

# 1) 온톨로지
classes = {'사물': None, '사람': '사물', '감독': '사람', '배우': '사람',
           '작품': '사물', '영화': '작품', '장르': '사물'}
relations = {'감독했다': ('감독', '영화'), '출연했다': ('사람', '영화'),
             '장르이다': ('영화', '장르')}
types = {'봉준호': '감독', '박찬욱': '감독',
         '송강호': '배우', '조여정': '배우', '배두나': '배우',
         '박해일': '배우', '최민식': '배우', '탕웨이': '배우',
         '기생충': '영화', '괴물': '영화', '살인의 추억': '영화',
         '올드보이': '영화', '헤어질 결심': '영화',
         '드라마': '장르', '스릴러': '장르'}

# 2) 트리플 20개 (틀린 것 3개 포함)
triples = [
    ('봉준호', '감독했다', '기생충'), ('봉준호', '감독했다', '괴물'),
    ('봉준호', '감독했다', '살인의 추억'), ('박찬욱', '감독했다', '올드보이'),
    ('박찬욱', '감독했다', '헤어질 결심'),
    ('송강호', '출연했다', '기생충'), ('송강호', '출연했다', '괴물'),
    ('송강호', '출연했다', '살인의 추억'), ('조여정', '출연했다', '기생충'),
    ('배두나', '출연했다', '괴물'), ('박해일', '출연했다', '괴물'),
    ('박해일', '출연했다', '살인의 추억'), ('박해일', '출연했다', '헤어질 결심'),
    ('최민식', '출연했다', '올드보이'), ('탕웨이', '출연했다', '헤어질 결심'),
    ('기생충', '장르이다', '드라마'), ('올드보이', '장르이다', '스릴러'),
    ('기생충', '감독했다', '봉준호'), ('송강호', '장르이다', '드라마'),
    ('최민식', '출연했다', '박찬욱'),
]

def is_a(thing, cls):
    c = types[thing]
    while c is not None:
        if c == cls:
            return True
        c = classes[c]
    return False

# 3) 검사
good = []
for s, p, o in triples:
    d, r = relations[p]
    if is_a(s, d) and is_a(o, r):
        good.append((s, p, o))
    else:
        print('규칙 위반:', (s, p, o))
print('트리플', len(triples), '개 중 올바른 것', len(good), '개')

# 4) 그리기: 감독(왼쪽) - 영화(가운데) - 배우(오른쪽), 장르는 위 · 아래
pos = {'봉준호': (0, 3), '박찬욱': (0, 0),
       '기생충': (3, 4), '괴물': (3, 3), '살인의 추억': (3, 2),
       '올드보이': (3, 1), '헤어질 결심': (3, 0),
       '조여정': (6, 4.5), '송강호': (6, 3.5), '배두나': (6, 2.5),
       '박해일': (6, 1.5), '최민식': (6, 0.5), '탕웨이': (6, -0.5),
       '드라마': (1.5, 5), '스릴러': (1.5, -1)}
color = {'감독': 'tab:orange', '배우': 'tab:blue', '영화': 'tab:green', '장르': 'tab:purple'}
style = {'감독했다': '-', '출연했다': '-', '장르이다': '--'}

plt.figure(figsize=(9, 5))
for s, p, o in good:
    plt.annotate('', xy=pos[o], xytext=pos[s],
                 arrowprops=dict(arrowstyle='->', color='gray', lw=1.2,
                                 linestyle=style[p], shrinkA=20, shrinkB=24))
for name, (x, y) in pos.items():
    plt.text(x, y, name, ha='center', va='center', color='white', fontsize=10,
             bbox=dict(boxstyle='round,pad=0.4', fc=color[types[name]], ec='none'))
for cls, c in color.items():
    plt.scatter([], [], color=c, s=80, label=cls)
plt.legend(loc='upper left', fontsize=9)
plt.xlim(-1, 7)
plt.ylim(-1.6, 5.6)
plt.axis('off')
plt.title('영화 지식그래프 (규칙을 통과한 트리플 ' + str(len(good)) + '개)')
plt.show()`,
            expect: "규칙 위반: ('기생충', '감독했다', '봉준호')\n규칙 위반: ('송강호', '장르이다', '드라마')\n규칙 위반: ('최민식', '출연했다', '박찬욱')\n트리플 20 개 중 올바른 것 17 개",
            desc: '검사를 통과한 17개만 그림에 그렸습니다. 그림에서 <b>송강호 · 박해일</b>처럼 여러 영화에 연결된 배우, <b>봉준호 – 괴물 – 박해일</b>처럼 감독과 배우를 잇는 경로를 찾아보세요. 장르 트리플(점선)이나 다른 영화 · 배우를 추가해 그래프를 키워 보아도 좋습니다.' },
          { type: 'callout', kind: 'tip', title: '다음 차시 예고', html: '오늘은 지식그래프를 Python 리스트와 딕셔너리로 만들었습니다. 다음 차시에는 실제 그래프 데이터베이스 <b>Neo4j</b> 를 준비하고, 오늘 만든 영화 지식그래프를 데이터베이스에 담을 준비를 합니다.' }
        ],
        slides: [
          { layout: 'title', title: '트리플과 지식그래프', subtitle: '사실을 세 조각으로 쪼개고 이어 붙이기',
            notes: '<p>💬 <b>발문:</b> "\'봉준호가 기생충을 감독했다\'를 세 조각으로 나누면?" → 봉준호 / 감독했다 / 기생충. 국어 시간의 주어 · 서술어 · 목적어와 연결합니다. (5분)</p>' },
          { layout: 'diagram', title: '트리플 → 지식그래프', html: FIG_KG, caption: '같은 이름은 노드 하나로 합쳐진다',
            notes: '<p>그림 2-4(트리플 하나 = 화살표 하나)를 먼저 보여 준 뒤 이 그림으로 넘어갑니다. 예제 2-7 · 2-8 · 2-9 를 실행하며 "송강호와 함께 출연한 사람"을 2단계 따라가기로 찾습니다. (12분)</p>' },
          { layout: 'diagram', title: 'RDF vs 속성 그래프(Neo4j)', html: FIG_RDF, caption: '관계에 속성을 붙일 수 있는가?',
            notes: '<p>RDF 는 값도 트리플, 관계 정보는 중간 노드 필요. 속성 그래프는 노드 · 관계에 속성을 바로 저장. 예제 2-10 · 2-11 로 트리플 수 차이를 확인합니다. 💬 "출연 역할 정보를 RDF 로 담으려면 트리플이 몇 개 필요할까?" → 4개. (10분)</p>' },
          { layout: 'code', title: '온톨로지로 트리플 검사', code: `classes = {'사물': None, '사람': '사물', '감독': '사람', '영화': '사물'}
relations = {'감독했다': ('감독', '영화')}
types = {'봉준호': '감독', '기생충': '영화'}

def is_a(thing, cls):
    c = types[thing]
    while c is not None:
        if c == cls:
            return True
        c = classes[c]
    return False

for s, p, o in [('봉준호', '감독했다', '기생충'), ('기생충', '감독했다', '봉준호')]:
    d, r = relations[p]
    print((s, p, o), 'OK' if is_a(s, d) and is_a(o, r) else '규칙 위반')`,
            points: ['주어 → 정의역, 목적어 → 치역', '상위 클래스까지 따라가며 확인', '검사 통과 ≠ 사실 (내용은 출처 확인)'],
            notes: '<p>거꾸로 넣은 트리플이 걸리는 것을 확인합니다. 이어서 위키데이터(P31 · P279 · P57)와 구글 지식 패널을 화면으로 보여 주고, 예제 2-13 으로 트리플 20개를 검사 · 시각화합니다. (20분)</p>' },
          { layout: 'summary', title: '정리', bullets: ['트리플 = (주어, 술어, 목적어) = 화살표 하나', '트리플을 모으면 <b>지식그래프</b>', 'RDF: 모두 트리플 / 속성 그래프: 노드 · 관계에 속성', '온톨로지의 정의역 · 치역으로 잘못된 사실 걸러내기', '다음 차시: <b>Neo4j 시작하기</b>'],
            notes: '<p>출구 질문: "(서울, 수도이다, 대한민국) 트리플이 맞는 방향인지 어떻게 검사할 수 있을까요?" → 관계의 정의역 · 치역 확인. (3분)</p>' }
        ]
      }
    ]
  });
})();
