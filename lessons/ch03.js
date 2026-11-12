/* 03차시 Neo4j 시작하기 */
(function () {
  const ARROW = (id) => `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fill-arrow"/></marker></defs>`;

  /* 그림 3-1. Neo4j 제품 구성 */
  const FIG_PRODUCTS = `<svg viewBox="0 0 720 300" role="img" aria-label="가운데 Neo4j 데이터베이스, 왼쪽에 설치 위치인 AuraDB 클라우드와 Desktop 로컬, 오른쪽에 사용 도구인 Browser, Bloom, Python 드라이버">
  ${ARROW('c03a1')}
  <rect x="10" y="10" width="200" height="280" rx="14" class="card-bg"/>
  <rect x="510" y="10" width="200" height="280" rx="14" class="card-bg"/>
  <text x="110" y="38" text-anchor="middle" class="tx-b">어디에 둘까? (설치 위치)</text>
  <rect x="30" y="60" width="160" height="90" rx="12" class="p1"/>
  <text x="110" y="92" text-anchor="middle" class="tx-w">☁ AuraDB</text>
  <text x="110" y="116" text-anchor="middle" class="tx-w">클라우드 · 설치 없음</text>
  <text x="110" y="136" text-anchor="middle" class="tx-w">이 강좌 기본</text>
  <rect x="30" y="175" width="160" height="90" rx="12" class="p2"/>
  <text x="110" y="207" text-anchor="middle" class="tx-w">💻 Desktop</text>
  <text x="110" y="231" text-anchor="middle" class="tx-w">내 PC 에 설치</text>
  <text x="110" y="251" text-anchor="middle" class="tx-w">인터넷 없이도 사용</text>
  <ellipse cx="360" cy="95" rx="90" ry="22" class="p3"/>
  <rect x="270" y="95" width="180" height="110" class="p3"/>
  <ellipse cx="360" cy="205" rx="90" ry="22" class="p3"/>
  <ellipse cx="360" cy="95" rx="90" ry="22" class="p3s"/>
  <text x="360" y="100" text-anchor="middle" class="tx-b">Neo4j</text>
  <text x="360" y="140" text-anchor="middle" class="tx-w">그래프 데이터베이스</text>
  <text x="360" y="164" text-anchor="middle" class="tx-w">노드 · 관계 저장</text>
  <text x="360" y="188" text-anchor="middle" class="tx-w">Cypher 실행</text>
  <line x1="192" y1="110" x2="266" y2="135" class="ln" stroke-width="2" marker-end="url(#c03a1)"/>
  <line x1="192" y1="215" x2="266" y2="180" class="ln" stroke-width="2" marker-end="url(#c03a1)"/>
  <text x="610" y="38" text-anchor="middle" class="tx-b">무엇으로 쓸까? (도구)</text>
  <rect x="530" y="55" width="160" height="66" rx="12" class="p4s"/>
  <text x="610" y="83" text-anchor="middle" class="tx-b">Browser (Query)</text>
  <text x="610" y="105" text-anchor="middle" class="tx-m">Cypher 입력 → 결과</text>
  <rect x="530" y="135" width="160" height="66" rx="12" class="p4s"/>
  <text x="610" y="163" text-anchor="middle" class="tx-b">Bloom (Explore)</text>
  <text x="610" y="185" text-anchor="middle" class="tx-m">클릭으로 탐색</text>
  <rect x="530" y="215" width="160" height="66" rx="12" class="p5s"/>
  <text x="610" y="243" text-anchor="middle" class="tx-b">Python 드라이버</text>
  <text x="610" y="265" text-anchor="middle" class="tx-m">프로그램에서 접속 (7차시)</text>
  <line x1="526" y1="88" x2="454" y2="120" class="ln" stroke-width="2" marker-end="url(#c03a1)"/>
  <line x1="526" y1="168" x2="454" y2="160" class="ln" stroke-width="2" marker-end="url(#c03a1)"/>
  <line x1="526" y1="248" x2="454" y2="195" class="ln" stroke-width="2" marker-end="url(#c03a1)"/>
</svg>`;

  /* 그림 3-2. AuraDB Free 인스턴스 만들기 5단계 */
  const FIG_STEPS = `<svg viewBox="0 0 720 200" role="img" aria-label="AuraDB Free 만들기 다섯 단계: 가입 로그인, 새 인스턴스 Free 선택, 비밀번호 파일 내려받기, Running 상태 기다리기, Query 도구로 접속">
  ${ARROW('c03a2')}
  <rect x="10" y="40" width="124" height="110" rx="12" class="p1s"/>
  <rect x="156" y="40" width="124" height="110" rx="12" class="p1s"/>
  <rect x="302" y="40" width="124" height="110" rx="12" class="p2"/>
  <rect x="448" y="40" width="124" height="110" rx="12" class="p1s"/>
  <rect x="594" y="40" width="116" height="110" rx="12" class="p3"/>
  <text x="72" y="74" text-anchor="middle" class="tx-b">① 가입</text>
  <text x="72" y="100" text-anchor="middle" class="tx-m">console.neo4j.io</text>
  <text x="72" y="122" text-anchor="middle" class="tx-m">구글 계정 가능</text>
  <text x="218" y="74" text-anchor="middle" class="tx-b">② 새 인스턴스</text>
  <text x="218" y="100" text-anchor="middle" class="tx-m">New instance</text>
  <text x="218" y="122" text-anchor="middle" class="tx-m">→ AuraDB Free</text>
  <text x="364" y="74" text-anchor="middle" class="tx-w">③ 비밀번호</text>
  <text x="364" y="100" text-anchor="middle" class="tx-w">Download and</text>
  <text x="364" y="122" text-anchor="middle" class="tx-w">continue ⚠</text>
  <text x="510" y="74" text-anchor="middle" class="tx-b">④ 기다리기</text>
  <text x="510" y="100" text-anchor="middle" class="tx-m">Creating →</text>
  <text x="510" y="122" text-anchor="middle" class="tx-m">Running (몇 분)</text>
  <text x="652" y="74" text-anchor="middle" class="tx-w">⑤ 접속</text>
  <text x="652" y="100" text-anchor="middle" class="tx-w">Connect →</text>
  <text x="652" y="122" text-anchor="middle" class="tx-w">Query</text>
  <line x1="136" y1="95" x2="152" y2="95" class="ln" stroke-width="2" marker-end="url(#c03a2)"/>
  <line x1="282" y1="95" x2="298" y2="95" class="ln" stroke-width="2" marker-end="url(#c03a2)"/>
  <line x1="428" y1="95" x2="444" y2="95" class="ln" stroke-width="2" marker-end="url(#c03a2)"/>
  <line x1="574" y1="95" x2="590" y2="95" class="ln" stroke-width="2" marker-end="url(#c03a2)"/>
  <text x="364" y="182" text-anchor="middle" class="tx-m">③ 비밀번호는 이때 한 번만 보여 줍니다 — 꼭 파일로 내려받아 두세요</text>
</svg>`;

  /* 그림 3-3. Neo4j Browser 화면 구성 */
  const FIG_BROWSER = `<svg viewBox="0 0 720 330" role="img" aria-label="Neo4j Browser 화면: 왼쪽 사이드바에 노드 레이블과 관계 타입 목록, 위쪽 명령줄, 아래 결과 창에 그래프, 표, 텍스트 보기 탭">
  <rect x="10" y="10" width="700" height="310" rx="12" class="card-bg"/>
  <rect x="10" y="10" width="170" height="310" rx="12" class="p5s"/>
  <text x="24" y="38" class="tx-b">④ 사이드바</text>
  <text x="24" y="66" class="tx-m">Node labels</text>
  <rect x="24" y="74" width="66" height="22" rx="11" class="p1"/><text x="57" y="90" text-anchor="middle" class="tx-w">Person</text>
  <rect x="96" y="74" width="66" height="22" rx="11" class="p3"/><text x="129" y="90" text-anchor="middle" class="tx-w">Movie</text>
  <text x="24" y="124" class="tx-m">Relationship types</text>
  <rect x="24" y="132" width="72" height="22" rx="4" class="p4s"/><text x="60" y="148" text-anchor="middle" class="tx">LIKES</text>
  <text x="24" y="182" class="tx-m">Property keys</text>
  <text x="24" y="204" class="tx">name · title</text>
  <text x="24" y="226" class="tx">released</text>
  <rect x="196" y="22" width="500" height="40" rx="8" class="p4s"/>
  <text x="210" y="47" class="tx">neo4j$  MATCH (n) RETURN n</text>
  <circle cx="676" cy="42" r="12" class="p3"/><text x="676" y="47" text-anchor="middle" class="tx-w">▶</text>
  <text x="560" y="80" class="tx-b">① 명령줄 (Cypher 입력)</text>
  <rect x="196" y="92" width="500" height="216" rx="8" class="card-bg" stroke-width="1"/>
  <line x1="196" y1="92" x2="696" y2="92" class="ln"/>
  <rect x="196" y="100" width="54" height="34" class="p1s"/><text x="223" y="122" text-anchor="middle" class="tx">Graph</text>
  <rect x="196" y="136" width="54" height="34" class="card-bg"/><text x="223" y="158" text-anchor="middle" class="tx-m">Table</text>
  <rect x="196" y="172" width="54" height="34" class="card-bg"/><text x="223" y="194" text-anchor="middle" class="tx-m">Text</text>
  <line x1="250" y1="92" x2="250" y2="308" class="ln"/>
  <text x="200" y="232" class="tx-b">③ 보기</text>
  <text x="200" y="252" class="tx-m">바꾸기</text>
  <circle cx="380" cy="200" r="32" class="p1"/><text x="380" y="205" text-anchor="middle" class="tx-w">나</text>
  <circle cx="560" cy="150" r="32" class="p3"/><text x="560" y="155" text-anchor="middle" class="tx-w">기생충</text>
  <circle cx="560" cy="260" r="32" class="p3"/><text x="560" y="257" text-anchor="middle" class="tx-w">인사이드</text><text x="560" y="273" text-anchor="middle" class="tx-w">아웃</text>
  <line x1="410" y1="190" x2="528" y2="160" class="ln" stroke-width="2"/>
  <line x1="410" y1="212" x2="528" y2="248" class="ln" stroke-width="2"/>
  <text x="470" y="166" text-anchor="middle" class="tx-m">LIKES</text>
  <text x="470" y="246" text-anchor="middle" class="tx-m">LIKES</text>
  <text x="600" y="118" class="tx-b">② 결과 창</text>
</svg>`;

  /* 그림 3-4. 첫 Cypher 문장 뜯어보기 */
  const FIG_CYPHER = `<svg viewBox="0 0 720 250" role="img" aria-label="CREATE (:Person {name:'홍길동'}) 문장을 명령어, 괄호는 노드, 콜론 Person 은 레이블, 중괄호는 속성으로 나누어 설명한 그림">
  <text x="360" y="40" text-anchor="middle" class="tx-b">CREATE  ( :Person  {name: '홍길동'} )</text>
  <rect x="40" y="70" width="130" height="64" rx="10" class="p2"/>
  <text x="105" y="98" text-anchor="middle" class="tx-w">CREATE</text>
  <text x="105" y="120" text-anchor="middle" class="tx-w">만들어라</text>
  <rect x="200" y="70" width="130" height="64" rx="32" class="p1"/>
  <text x="265" y="98" text-anchor="middle" class="tx-w">( … )</text>
  <text x="265" y="120" text-anchor="middle" class="tx-w">노드 (동그라미)</text>
  <rect x="360" y="70" width="130" height="64" rx="10" class="p3"/>
  <text x="425" y="98" text-anchor="middle" class="tx-w">:Person</text>
  <text x="425" y="120" text-anchor="middle" class="tx-w">레이블 (종류)</text>
  <rect x="520" y="70" width="160" height="64" rx="10" class="p5s"/>
  <text x="600" y="98" text-anchor="middle" class="tx-b">{name: '홍길동'}</text>
  <text x="600" y="120" text-anchor="middle" class="tx-m">속성 (키: 값)</text>
  <line x1="20" y1="160" x2="700" y2="160" class="ln" stroke-dasharray="4 4"/>
  <text x="360" y="190" text-anchor="middle" class="tx-b">MATCH (n) RETURN n</text>
  <text x="360" y="220" text-anchor="middle" class="tx-m">MATCH = 그래프에서 찾아라 · (n) = 아무 노드나, 찾은 것에 n 이라는 이름표 · RETURN n = n 을 보여 줘라</text>
</svg>`;

  /* 그림 3-5. 질문 문장에서 명사 · 동사 · 형용사 찾기 */
  const FIG_NVA = `<svg viewBox="0 0 720 270" role="img" aria-label="봉준호가 2019년에 개봉한 기생충을 감독했다 문장에서 명사는 노드, 동사는 관계, 형용사와 수식어는 속성으로 바뀌는 그림">
  ${ARROW('c03a5')}
  <text x="360" y="36" text-anchor="middle" class="tx-b">"봉준호가  2019년에 개봉한  기생충을  감독했다"</text>
  <rect x="70" y="56" width="120" height="34" rx="8" class="p1"/><text x="130" y="78" text-anchor="middle" class="tx-w">명사 · 봉준호</text>
  <rect x="220" y="56" width="150" height="34" rx="8" class="p5s"/><text x="295" y="78" text-anchor="middle" class="tx">수식어 · 2019년</text>
  <rect x="400" y="56" width="120" height="34" rx="8" class="p3"/><text x="460" y="78" text-anchor="middle" class="tx-w">명사 · 기생충</text>
  <rect x="550" y="56" width="120" height="34" rx="8" class="p2"/><text x="610" y="78" text-anchor="middle" class="tx-w">동사 · 감독했다</text>
  <line x1="130" y1="92" x2="130" y2="150" class="ln" stroke-dasharray="4 3" marker-end="url(#c03a5)"/>
  <line x1="460" y1="92" x2="520" y2="150" class="ln" stroke-dasharray="4 3" marker-end="url(#c03a5)"/>
  <line x1="295" y1="92" x2="540" y2="222" class="ln" stroke-dasharray="4 3" marker-end="url(#c03a5)"/>
  <line x1="610" y1="92" x2="330" y2="160" class="ln" stroke-dasharray="4 3" marker-end="url(#c03a5)"/>
  <circle cx="130" cy="190" r="38" class="p1"/><text x="130" y="186" text-anchor="middle" class="tx-w">:Person</text><text x="130" y="204" text-anchor="middle" class="tx-w">봉준호</text>
  <circle cx="560" cy="190" r="38" class="p3"/><text x="560" y="186" text-anchor="middle" class="tx-w">:Movie</text><text x="560" y="204" text-anchor="middle" class="tx-w">기생충</text>
  <line x1="170" y1="190" x2="518" y2="190" class="ln" stroke-width="2.5" marker-end="url(#c03a5)"/>
  <text x="330" y="182" text-anchor="middle" class="tx-b">:DIRECTED</text>
  <rect x="600" y="222" width="110" height="34" rx="8" class="p5s"/><text x="655" y="244" text-anchor="middle" class="tx">released: 2019</text>
  <text x="200" y="250" class="tx-m">명사 → 노드 · 동사 → 관계 · 형용사/수식어 → 속성</text>
</svg>`;

  /* 그림 3-6. 온톨로지 → Neo4j 대응 */
  const FIG_MAP = `<svg viewBox="0 0 720 270" role="img" aria-label="온톨로지의 클래스는 레이블, 객체 속성은 관계 타입, 데이터 속성은 노드 속성으로 대응하는 그림">
  ${ARROW('c03a6')}
  <rect x="10" y="10" width="270" height="250" rx="14" class="p1s"/>
  <rect x="440" y="10" width="270" height="250" rx="14" class="p3s"/>
  <text x="145" y="38" text-anchor="middle" class="tx-b">온톨로지 (2차시)</text>
  <text x="575" y="38" text-anchor="middle" class="tx-b">Neo4j 그래프 모델</text>
  <rect x="30" y="60" width="230" height="52" rx="10" class="card-bg"/>
  <text x="145" y="82" text-anchor="middle" class="tx-b">클래스</text><text x="145" y="102" text-anchor="middle" class="tx-m">사람, 감독, 영화</text>
  <rect x="30" y="130" width="230" height="52" rx="10" class="card-bg"/>
  <text x="145" y="152" text-anchor="middle" class="tx-b">객체 속성 (관계)</text><text x="145" y="172" text-anchor="middle" class="tx-m">감독했다, 출연했다</text>
  <rect x="30" y="200" width="230" height="52" rx="10" class="card-bg"/>
  <text x="145" y="222" text-anchor="middle" class="tx-b">데이터 속성</text><text x="145" y="242" text-anchor="middle" class="tx-m">이름, 개봉연도</text>
  <rect x="460" y="60" width="230" height="52" rx="10" class="card-bg"/>
  <text x="575" y="82" text-anchor="middle" class="tx-b">레이블 (Label)</text><text x="575" y="102" text-anchor="middle" class="tx-m">:Person, :Director, :Movie</text>
  <rect x="460" y="130" width="230" height="52" rx="10" class="card-bg"/>
  <text x="575" y="152" text-anchor="middle" class="tx-b">관계 타입 (Type)</text><text x="575" y="172" text-anchor="middle" class="tx-m">:DIRECTED, :ACTED_IN</text>
  <rect x="460" y="200" width="230" height="52" rx="10" class="card-bg"/>
  <text x="575" y="222" text-anchor="middle" class="tx-b">속성 (Property)</text><text x="575" y="242" text-anchor="middle" class="tx-m">name, released</text>
  <line x1="264" y1="86" x2="456" y2="86" class="ln" stroke-width="2.5" marker-end="url(#c03a6)"/>
  <line x1="264" y1="156" x2="456" y2="156" class="ln" stroke-width="2.5" marker-end="url(#c03a6)"/>
  <line x1="264" y1="226" x2="456" y2="226" class="ln" stroke-width="2.5" marker-end="url(#c03a6)"/>
  <text x="360" y="78" text-anchor="middle" class="tx-m">PascalCase</text>
  <text x="360" y="148" text-anchor="middle" class="tx-m">UPPER_SNAKE</text>
  <text x="360" y="218" text-anchor="middle" class="tx-m">camelCase</text>
</svg>`;

  /* 그림 3-7. 다중 레이블로 클래스 계층 표현 */
  const FIG_MULTI = `<svg viewBox="0 0 720 260" role="img" aria-label="왼쪽 클래스 계층 사람 아래 감독과 배우, 오른쪽 봉준호 노드는 Person 과 Director 레이블을, 송강호 노드는 Person 과 Actor 레이블을 함께 가짐">
  ${ARROW('c03a7')}
  <rect x="10" y="10" width="300" height="240" rx="14" class="card-bg"/>
  <text x="160" y="38" text-anchor="middle" class="tx-b">온톨로지 계층</text>
  <rect x="110" y="60" width="100" height="36" rx="10" class="p1"/><text x="160" y="84" text-anchor="middle" class="tx-w">사람</text>
  <rect x="40" y="170" width="100" height="36" rx="10" class="p1s"/><text x="90" y="194" text-anchor="middle" class="tx">감독</text>
  <rect x="180" y="170" width="100" height="36" rx="10" class="p1s"/><text x="230" y="194" text-anchor="middle" class="tx">배우</text>
  <line x1="90" y1="168" x2="145" y2="100" class="ln" stroke-width="2" marker-end="url(#c03a7)"/>
  <line x1="230" y1="168" x2="175" y2="100" class="ln" stroke-width="2" marker-end="url(#c03a7)"/>
  <text x="160" y="236" text-anchor="middle" class="tx-m">감독 ⊂ 사람, 배우 ⊂ 사람</text>
  <text x="345" y="135" text-anchor="middle" class="tx-b">⇒</text>
  <rect x="380" y="10" width="330" height="240" rx="14" class="card-bg"/>
  <text x="545" y="38" text-anchor="middle" class="tx-b">Neo4j 노드 (레이블 여러 개)</text>
  <circle cx="465" cy="130" r="46" class="p1"/><text x="465" y="126" text-anchor="middle" class="tx-w">봉준호</text><text x="465" y="146" text-anchor="middle" class="tx-w">name</text>
  <rect x="415" y="190" width="100" height="26" rx="13" class="p1s"/><text x="465" y="208" text-anchor="middle" class="tx">:Person</text>
  <rect x="415" y="220" width="100" height="26" rx="13" class="p2s"/><text x="465" y="238" text-anchor="middle" class="tx">:Director</text>
  <circle cx="625" cy="130" r="46" class="p1"/><text x="625" y="126" text-anchor="middle" class="tx-w">송강호</text><text x="625" y="146" text-anchor="middle" class="tx-w">name</text>
  <rect x="575" y="190" width="100" height="26" rx="13" class="p1s"/><text x="625" y="208" text-anchor="middle" class="tx">:Person</text>
  <rect x="575" y="220" width="100" height="26" rx="13" class="p4s"/><text x="625" y="238" text-anchor="middle" class="tx">:Actor</text>
  <text x="545" y="68" text-anchor="middle" class="tx-m">(:Person:Director)   (:Person:Actor)</text>
</svg>`;

  /* 그림 3-8. 흔한 모델링 실수 */
  const FIG_MISTAKE = `<svg viewBox="0 0 720 320" role="img" aria-label="위쪽은 장르를 속성 문자열로 둔 경우와 Genre 노드로 둔 경우 비교, 아래쪽은 개봉연도를 Year 노드로 만든 경우와 속성으로 둔 경우 비교">
  ${ARROW('c03a8')}
  <rect x="10" y="10" width="345" height="145" rx="12" class="card-bg"/>
  <rect x="365" y="10" width="345" height="145" rx="12" class="p3s"/>
  <text x="182" y="34" text-anchor="middle" class="tx-b">✗ 장르를 속성으로 (노드로 둘 것)</text>
  <circle cx="90" cy="95" r="36" class="p3"/><text x="90" y="100" text-anchor="middle" class="tx-w">기생충</text>
  <rect x="140" y="70" width="200" height="50" rx="8" class="p5s"/>
  <text x="150" y="92" class="tx">genres:</text><text x="150" y="112" class="tx">['드라마','스릴러']</text>
  <text x="182" y="145" text-anchor="middle" class="tx-m">"스릴러 영화들"을 잇는 선이 없음</text>
  <text x="537" y="34" text-anchor="middle" class="tx-b">✓ 장르를 노드로</text>
  <circle cx="420" cy="95" r="34" class="p3"/><text x="420" y="100" text-anchor="middle" class="tx-w">기생충</text>
  <circle cx="650" cy="65" r="28" class="p4"/><text x="650" y="70" text-anchor="middle" class="tx-w">드라마</text>
  <circle cx="650" cy="125" r="28" class="p4"/><text x="650" y="130" text-anchor="middle" class="tx-w">스릴러</text>
  <line x1="454" y1="88" x2="618" y2="68" class="ln" stroke-width="2" marker-end="url(#c03a8)"/>
  <line x1="454" y1="102" x2="618" y2="122" class="ln" stroke-width="2" marker-end="url(#c03a8)"/>
  <text x="540" y="96" text-anchor="middle" class="tx-m">IN_GENRE</text>
  <rect x="10" y="165" width="345" height="145" rx="12" class="card-bg"/>
  <rect x="365" y="165" width="345" height="145" rx="12" class="p3s"/>
  <text x="182" y="189" text-anchor="middle" class="tx-b">✗ 개봉연도를 노드로 (속성으로 둘 것)</text>
  <circle cx="80" cy="250" r="34" class="p3"/><text x="80" y="255" text-anchor="middle" class="tx-w">기생충</text>
  <circle cx="290" cy="250" r="34" class="p5"/><text x="290" y="255" text-anchor="middle" class="tx-w">2019</text>
  <line x1="114" y1="250" x2="252" y2="250" class="ln" stroke-width="2" marker-end="url(#c03a8)"/>
  <text x="183" y="240" text-anchor="middle" class="tx-m">RELEASED_IN</text>
  <text x="182" y="300" text-anchor="middle" class="tx-m">숫자 비교(2015년 이후)가 번거로움</text>
  <text x="537" y="189" text-anchor="middle" class="tx-b">✓ 개봉연도를 속성으로</text>
  <circle cx="460" cy="250" r="38" class="p3"/><text x="460" y="255" text-anchor="middle" class="tx-w">기생충</text>
  <rect x="520" y="230" width="170" height="40" rx="8" class="p5s"/>
  <text x="605" y="256" text-anchor="middle" class="tx">released: 2019</text>
  <text x="537" y="300" text-anchor="middle" class="tx-m">값 하나 = 노드 안에 바로</text>
</svg>`;

  PY_COURSE.addChapter({
    id: 'ch03',
    no: '03',
    title: 'Neo4j 시작하기',
    subtitle: 'AuraDB · Neo4j Browser · 첫 노드와 관계 · 그래프 모델링',
    summary: '진짜 그래프 데이터베이스 <b>Neo4j</b> 를 준비합니다. 무료 클라우드 <b>AuraDB Free</b>(또는 내 PC 의 <b>Neo4j Desktop</b>)를 만들고, <b>Neo4j Browser</b> 에서 첫 노드와 관계를 만들어 그래프 화면으로 확인합니다. 이어서 2차시의 영화 온톨로지를 <b>레이블 · 관계 타입 · 속성</b>으로 옮기는 <b>그래프 모델링</b>을 연습하고, Python 으로 설계도(스키마) 그림을 그려 봅니다.',
    goals: [
      'Neo4j 제품 구성(데이터베이스 · Browser · Bloom · AuraDB · Desktop)을 구분해 말할 수 있다',
      'AuraDB Free 인스턴스를 만들고 접속 정보(URI · 사용자 · 비밀번호)를 안전하게 보관할 수 있다',
      'Neo4j Browser 에서 첫 노드와 관계를 만들고 그래프 · 표 · 텍스트 보기로 확인할 수 있다',
      '질문에서 출발해 명사 · 동사 · 형용사를 노드 · 관계 · 속성으로 바꿀 수 있다',
      '온톨로지를 Neo4j 그래프 모델(레이블 · 관계 타입 · 속성 대응표)로 옮기고 이름 짓기 규칙을 지킬 수 있다'
    ],
    sections: [
      {
        id: 'ch03-1',
        title: 'Neo4j 설치와 Browser 둘러보기',
        minutes: 50,
        goals: ['Neo4j 제품 구성을 안다', 'AuraDB Free(또는 Desktop)에 접속한다', 'Browser 에서 첫 노드와 관계를 만들고 확인한다', '예제 그래프를 불러오고 안전하게 지운다'],
        flow: [['도입 · 제품 구성', 7], ['AuraDB 만들기', 13], ['Browser 둘러보기 · 첫 Cypher', 12], ['영화 예제 · 지우기', 8], ['함께 해 보기: 나와 영화', 10]],
        content: [
          { type: 'p', html: '1 · 2차시에서는 그래프와 지식그래프를 <b>Python 리스트와 딕셔너리</b>로 만들었습니다. 연습하기에는 좋지만, 프로그램을 끄면 데이터가 사라지고, 사실이 수십만 개로 늘어나면 원하는 것을 빨리 찾기도 어렵습니다. 그래서 데이터를 <b>안전하게 저장하고 빠르게 찾아 주는 전문 프로그램</b>, 즉 <b>데이터베이스</b>가 필요합니다.' },
          { type: 'p', html: '<b>Neo4j(네오포제이)</b>는 노드와 관계를 그대로 저장하는 대표적인 <b>그래프 데이터베이스</b>입니다. 엑셀처럼 표를 쓰는 데이터베이스가 "칸 맞춰 정리하는 서랍장"이라면, Neo4j 는 <b>"사람 · 영화 카드를 실로 이어 둔 코르크 보드"</b>와 같습니다. 실을 따라가며 찾는 일에 특히 강합니다.' },
          { type: 'h', text: 'Neo4j 제품 구성: 무엇이 무엇일까?' },
          { type: 'p', html: '"Neo4j" 라는 이름 아래 여러 제품이 있어서 처음에는 헷갈립니다. <b>"데이터를 어디에 둘까?(설치 위치)"</b>와 <b>"무엇으로 다룰까?(도구)"</b> 두 가지로 나누면 쉽습니다.' },
          { type: 'figure', html: FIG_PRODUCTS, caption: '그림 3-1. 가운데의 Neo4j 데이터베이스가 핵심입니다. 왼쪽은 데이터베이스를 놓을 곳, 오른쪽은 데이터베이스를 다루는 도구입니다.' },
          { type: 'table', head: ['이름', '무엇인가요?', '이 강좌에서'], rows: [
            ['<b>Neo4j 데이터베이스</b>', '노드 · 관계를 저장하고 Cypher 질의를 실행하는 본체', '모든 차시'],
            ['<b>AuraDB</b>', 'Neo4j 회사가 인터넷(클라우드)에서 대신 운영해 주는 데이터베이스. <b>Free</b> 등급은 무료', '<b>기본 실습 환경</b>'],
            ['<b>Neo4j Desktop</b>', '내 PC 에 데이터베이스를 설치 · 관리하는 프로그램', 'AuraDB 를 못 쓸 때 대안'],
            ['<b>Neo4j Browser</b>', 'Cypher 를 입력하고 결과를 그래프 · 표로 보는 화면. AuraDB 에서는 <b>Query</b> 도구라는 이름으로 들어 있음', '3 ~ 6차시'],
            ['<b>Bloom</b>', '코드 없이 클릭 · 검색으로 그래프를 탐색하는 도구. AuraDB 에서는 <b>Explore</b>', '맛보기'],
            ['<b>Cypher</b>', 'Neo4j 에 명령하는 언어 (표 데이터베이스의 SQL 과 같은 역할)', '4 · 5차시에서 본격적으로']
          ], caption: '데이터베이스 = 창고, Browser · Bloom = 창고를 들여다보는 창문, Cypher = 창고 관리인에게 하는 말' },
          { type: 'callout', kind: 'info', title: '왜 AuraDB Free 를 기본으로 할까요?', html: '설치가 필요 없고, 학교 · 집 어느 컴퓨터에서나 웹 브라우저만 있으면 같은 데이터베이스에 접속할 수 있기 때문입니다. 무료 등급은 노드 약 20만 개 · 관계 약 40만 개까지 저장할 수 있어 이 강좌에는 충분합니다. (제한 · 화면 모양은 회사 정책에 따라 바뀔 수 있습니다.)' },
          { type: 'h', text: 'AuraDB Free 인스턴스 만들기' },
          { type: 'p', html: '클라우드에 만든 데이터베이스 하나를 <b>인스턴스(instance)</b>라고 부릅니다. 아래 다섯 단계를 차례로 따라 하세요.' },
          { type: 'figure', html: FIG_STEPS, caption: '그림 3-2. AuraDB Free 인스턴스를 만드는 다섯 단계. 가장 중요한 것은 ③ 비밀번호 저장입니다.' },
          { type: 'list', ordered: true, items: [
            '웹 브라우저에서 <b>console.neo4j.io</b> 에 들어가 회원 가입 또는 로그인합니다. 구글 계정으로도 가입할 수 있습니다.',
            '<b>New instance</b>(새 인스턴스) 버튼을 누르고 <b>AuraDB Free</b> 를 고른 뒤 <b>Create</b> 를 누릅니다. (유료 등급을 고르지 않도록 "Free" 글자를 꼭 확인하세요.)',
            '<b>접속 정보 창</b>이 뜨면 사용자 이름(<code>neo4j</code>)과 자동으로 만들어진 비밀번호가 보입니다. <b>Download and continue</b> 를 눌러 접속 정보가 담긴 <code>.txt</code> 파일을 내려받습니다.',
            '인스턴스 상태가 <b>Creating</b> → <b>Running</b> 으로 바뀔 때까지 몇 분 기다립니다.',
            '<b>Connect</b> → <b>Query</b> 를 눌러 Browser 화면을 엽니다. 처음 접속할 때 비밀번호를 물으면 내려받은 파일의 비밀번호를 붙여 넣습니다.'
          ] },
          { type: 'callout', kind: 'warn', title: '비밀번호는 딱 한 번만 보여 줍니다', html: '③ 단계의 비밀번호는 창을 닫으면 <b>다시 볼 수 없습니다.</b> 잃어버리면 비밀번호를 새로 만들거나 인스턴스를 다시 만들어야 합니다. 내려받은 파일은 <b>"Neo4j 접속정보"</b> 같은 폴더에 보관하고, 비밀번호를 친구에게 보내거나 인터넷 게시판 · 깃허브에 올리지 마세요.' },
          { type: 'p', html: '내려받은 파일을 메모장으로 열면 아래와 같은 줄이 들어 있습니다. 이 중 <b>URI(접속 주소) · USERNAME(사용자) · PASSWORD(비밀번호)</b> 세 가지가 7차시에 Python 으로 접속할 때도 꼭 필요합니다. 파일을 읽어 세 값을 꺼내는 연습을 해 봅시다. (아래 값은 연습용 가짜입니다.)' },
          { type: 'code', title: '예제 3-1. 접속 정보 파일에서 URI · 사용자 · 비밀번호 꺼내기', code: `# AuraDB 에서 내려받은 접속 정보 파일 내용 (연습용 가짜 값)
text = """
NEO4J_URI=neo4j+s://1a2b3c4d.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=abcdEFGH1234ijklMNOP5678qrst
AURA_INSTANCEID=1a2b3c4d
AURA_INSTANCENAME=Instance01
"""

info = {}
for line in text.strip().splitlines():
    key, value = line.split('=', 1)     # 첫 번째 = 에서만 자르기
    info[key] = value

uri = info['NEO4J_URI']
scheme, address = uri.split('://')
print('접속 주소 :', uri)
print('  방식    :', scheme, '(+s = 암호화된 안전한 접속)')
print('  서버    :', address)
print('사용자    :', info['NEO4J_USERNAME'])

pw = info['NEO4J_PASSWORD']
print('비밀번호  :', pw[:4] + '*' * (len(pw) - 4), f'({len(pw)}자)')`,
            expect: '접속 주소 : neo4j+s://1a2b3c4d.databases.neo4j.io\n  방식    : neo4j+s (+s = 암호화된 안전한 접속)\n  서버    : 1a2b3c4d.databases.neo4j.io\n사용자    : neo4j\n비밀번호  : abcd************************ (28자)',
            desc: '<code>split(\'=\', 1)</code> 은 첫 번째 <code>=</code> 에서만 자릅니다. 비밀번호 안에 <code>=</code> 가 있어도 안전하지요. 화면에 비밀번호를 그대로 출력하지 않고 앞 4글자만 보여 주는 습관도 함께 익혀 두세요.' },
          { type: 'callout', kind: 'more', title: 'Neo4j Desktop 으로 내 PC 에 설치하기', html: '인터넷이 불안정하거나 학교 방화벽 때문에 AuraDB 에 접속이 안 되면 <b>neo4j.com/download</b> 에서 <b>Neo4j Desktop</b> 을 내려받아 설치합니다. 프로그램에서 <b>새 인스턴스(로컬 DBMS) 만들기</b> → 이름과 비밀번호 정하기 → <b>Start</b>(시작) → <b>Open</b>(Browser 열기) 순서로 진행합니다. 접속 주소는 <code>neo4j://localhost:7687</code>(또는 <code>bolt://localhost:7687</code>), 사용자는 <code>neo4j</code>, 비밀번호는 내가 정한 값입니다. 메뉴 이름은 버전에 따라 조금 다를 수 있지만, <b>"만들기 → 시작 → 열기"</b> 순서는 같습니다.' },
          { type: 'table', head: ['', 'AuraDB Free', 'Neo4j Desktop'], rows: [
            ['설치', '없음 (웹 브라우저)', 'PC 에 프로그램 설치'],
            ['접속 주소', '<code>neo4j+s://xxxx.databases.neo4j.io</code>', '<code>neo4j://localhost:7687</code>'],
            ['비밀번호', '자동 생성 (파일로 보관)', '내가 정함'],
            ['주의', '오래 안 쓰면 <b>일시 정지(Paused)</b> → 콘솔에서 Resume', 'PC 를 켜고 DB 를 Start 해야 함']
          ], caption: '두 방법 모두 Browser 화면과 Cypher 는 똑같습니다. 이후 실습은 어느 쪽에서 해도 됩니다.' },
          { type: 'h', text: 'Neo4j Browser 화면 구성' },
          { type: 'p', html: 'Browser 를 열면 처음에는 빈 화면이라 막막할 수 있습니다. 네 부분만 기억하면 됩니다.' },
          { type: 'figure', html: FIG_BROWSER, caption: '그림 3-3. Neo4j Browser 의 네 부분. ① 명령줄에 Cypher 를 쓰고 ▶(또는 Ctrl+Enter)를 누르면 ② 결과 창이 생깁니다.' },
          { type: 'list', items: [
            '<b>① 명령줄(에디터)</b> — Cypher 를 입력하는 곳입니다. <code>Ctrl + Enter</code>(맥은 <code>⌘ + Enter</code>) 또는 ▶ 버튼으로 실행합니다. 여러 줄을 쓰려면 <code>Shift + Enter</code> 로 줄을 바꿉니다.',
            '<b>② 결과 창(프레임)</b> — 명령을 실행할 때마다 결과 카드가 하나씩 위에 쌓입니다. 오른쪽 위 ✕ 로 닫을 수 있습니다.',
            '<b>③ 보기 바꾸기</b> — 같은 결과를 <b>Graph</b>(동그라미와 화살표), <b>Table</b>(표), <b>Text</b>(글자) 로 바꿔 볼 수 있습니다. 노드를 클릭하면 속성이 보이고, 두 번 클릭하면 이웃 노드가 펼쳐집니다.',
            '<b>④ 사이드바(데이터베이스 정보)</b> — 지금 데이터베이스에 있는 <b>노드 레이블 · 관계 타입 · 속성 키</b> 목록입니다. 레이블을 클릭하면 그 레이블의 노드를 보여 주는 Cypher 가 자동으로 실행됩니다.'
          ] },
          { type: 'callout', kind: 'tip', title: '화면 모양이 조금 달라도 괜찮아요', html: 'AuraDB 의 <b>Query</b> 도구와 Desktop 의 <b>Browser</b> 는 버튼 위치나 색이 조금 다릅니다. 하지만 <b>명령줄 · 결과 창 · 보기 바꾸기 · 레이블 목록</b> 네 가지는 어디에나 있습니다. 이 네 가지만 찾으면 됩니다.' },
          { type: 'h', text: '첫 Cypher: 노드 하나 만들고 찾아보기' },
          { type: 'p', html: '<b>Cypher(사이퍼)</b>는 그래프를 <b>그림 그리듯</b> 쓰는 언어입니다. 동그라미는 괄호 <code>( )</code>, 화살표는 <code>--&gt;</code> 로 씁니다. 1차시에서 본 <code>(봉준호)-[감독했다]-&gt;(기생충)</code> 표기와 거의 같지요. 오늘은 딱 두 문장만 써 봅니다. 자세한 문법은 4차시에서 배웁니다.' },
          { type: 'figure', html: FIG_CYPHER, caption: '그림 3-4. 괄호 = 노드, 콜론 뒤 = 레이블(종류), 중괄호 = 속성. MATCH 는 찾기, RETURN 은 보여 주기입니다.' },
          { type: 'code', title: 'Cypher 3-1. 노드 하나 만들기 (Neo4j Browser 에서 실행)', run: false, code: `CREATE (:Person {name: '홍길동'})`,
            expect: 'Added 1 label, created 1 node, set 1 property, completed after 12 ms.',
            desc: '실행하면 "레이블 1개 추가, 노드 1개 생성, 속성 1개 설정" 이라는 알림이 나옵니다. 아직 화면에 동그라미는 보이지 않습니다. <b>만들기만 하고 보여 달라고는 하지 않았기</b> 때문입니다.' },
          { type: 'code', title: 'Cypher 3-2. 모든 노드 찾아서 보여 주기 (Neo4j Browser 에서 실행)', run: false, code: `MATCH (n) RETURN n`,
            desc: '이제 Graph 보기에 <b>홍길동</b> 동그라미가 나타납니다. 사이드바의 Node labels 에도 <code>Person</code> 이 생겼는지 확인하세요. Table · Text 보기로 바꾸면 <code>{"name": "홍길동"}</code> 같은 속성 글자를 볼 수 있습니다.' },
          { type: 'p', html: '데이터베이스 안에서는 어떤 일이 일어났을까요? Python 으로 아주 작은 "가짜 Neo4j" 를 만들어 흉내 내 보겠습니다. <code>CREATE</code> 는 목록에 노드를 <b>추가</b>하고, <code>MATCH (n) RETURN n</code> 은 목록 전체를 <b>꺼내 보여 주는</b> 일입니다.' },
          { type: 'code', title: '예제 3-2. CREATE 와 MATCH 를 Python 으로 흉내 내기', code: `nodes = []          # 데이터베이스에 저장된 노드들

def create(label, **props):
    # CREATE (:label {props}) 흉내
    node = {'id': len(nodes), 'labels': [label], 'props': props}
    nodes.append(node)
    print('노드 1개 생성 · 레이블', label, '· 속성', len(props), '개')

def match_all():
    # MATCH (n) RETURN n 흉내
    return nodes

create('Person', name='홍길동')
create('Person', name='홍길동')     # 같은 문장을 한 번 더 실행하면?

print('--- MATCH (n) RETURN n ---')
for n in match_all():
    print(n)
print('노드 수:', len(match_all()))`,
            expect: "노드 1개 생성 · 레이블 Person · 속성 1 개\n노드 1개 생성 · 레이블 Person · 속성 1 개\n--- MATCH (n) RETURN n ---\n{'id': 0, 'labels': ['Person'], 'props': {'name': '홍길동'}}\n{'id': 1, 'labels': ['Person'], 'props': {'name': '홍길동'}}\n노드 수: 2",
            desc: '같은 <code>CREATE</code> 를 두 번 실행했더니 <b>홍길동이 두 명</b>이 되었습니다! 진짜 Neo4j 도 똑같습니다. 이름이 같아도 컴퓨터는 서로 다른 노드로 보고, 안쪽 번호(<code>id</code>)로 구분합니다.' },
          { type: 'callout', kind: 'warn', title: 'CREATE 는 실행할 때마다 새로 만듭니다', html: '실습하다가 ▶ 를 여러 번 누르면 같은 노드가 여러 개 생깁니다. <code>MATCH (n) RETURN n</code> 으로 수시로 확인하는 습관을 들이세요. "이미 있으면 만들지 않기"(<code>MERGE</code>)는 4차시에서 배웁니다.' },
          { type: 'h', text: '내장 예제: 영화 그래프 둘러보기 (:play movies)' },
          { type: 'p', html: 'Neo4j 에는 연습용 <b>영화 그래프</b>가 들어 있습니다. 명령줄에 아래 명령을 입력하면 안내 슬라이드(가이드)가 열립니다. 슬라이드를 넘기다 보면 긴 <code>CREATE</code> 문장이 나오는데, 그 코드 상자를 클릭하면 명령줄로 복사되고, ▶ 를 누르면 영화 · 배우 노드가 한꺼번에 만들어집니다.' },
          { type: 'code', title: 'Cypher 3-3. 영화 예제 가이드 열기 (Neo4j Browser 에서 실행)', run: false, code: `:play movies`,
            desc: '<code>:</code> 로 시작하는 명령은 Cypher 가 아니라 <b>Browser 자체 명령</b>입니다. 사용 중인 도구에서 <code>:play</code> 가 동작하지 않으면 AuraDB 콘솔의 <b>Learn / Guides</b> 메뉴에서 영화(Movies) 예제를 찾아 실행하세요.' },
          { type: 'code', title: 'Cypher 3-4. 영화 그래프 25개만 살짝 보기 (Neo4j Browser 에서 실행)', run: false, code: `MATCH (n) RETURN n LIMIT 25`,
            desc: '영화 그래프에는 노드가 170개 정도 있습니다. <code>LIMIT 25</code> 는 "25개까지만 보여 줘" 라는 뜻으로, 화면이 너무 복잡해지는 것을 막아 줍니다. 노드를 두 번 클릭해 이웃을 펼쳐 보세요.' },
          { type: 'p', html: '영화 그래프에는 <code>Person</code> · <code>Movie</code> 두 레이블과 <code>ACTED_IN</code>(출연), <code>DIRECTED</code>(감독), <code>PRODUCED</code>(제작), <code>WROTE</code>(각본) 같은 관계 타입이 있습니다. 2차시에 만든 우리 영화 온톨로지와 아주 비슷하지요? 아래는 그 일부를 Python 으로 옮겨, 사이드바처럼 레이블 · 관계 타입을 세고 그래프 보기처럼 그린 것입니다.' },
          { type: 'code', title: '예제 3-3. 영화 그래프 일부를 세고 그려 보기', code: `import matplotlib.pyplot as plt
from collections import Counter

# (이름, 레이블) 과 (출발, 관계 타입, 도착) — 내장 영화 그래프의 일부
nodes = {'The Matrix': 'Movie', 'The Matrix Reloaded': 'Movie',
         'Keanu Reeves': 'Person', 'Carrie-Anne Moss': 'Person',
         'Laurence Fishburne': 'Person', 'Lana Wachowski': 'Person',
         'Joel Silver': 'Person'}
rels = [('Keanu Reeves', 'ACTED_IN', 'The Matrix'),
        ('Keanu Reeves', 'ACTED_IN', 'The Matrix Reloaded'),
        ('Carrie-Anne Moss', 'ACTED_IN', 'The Matrix'),
        ('Laurence Fishburne', 'ACTED_IN', 'The Matrix'),
        ('Lana Wachowski', 'DIRECTED', 'The Matrix'),
        ('Lana Wachowski', 'DIRECTED', 'The Matrix Reloaded'),
        ('Joel Silver', 'PRODUCED', 'The Matrix')]

print('Node labels       :', dict(Counter(nodes.values())))
print('Relationship types:', dict(Counter(p for s, p, o in rels)))

pos = {'The Matrix': (3, 2), 'The Matrix Reloaded': (3, 0),
       'Keanu Reeves': (0, 1), 'Carrie-Anne Moss': (0, 3),
       'Laurence Fishburne': (1.5, 4), 'Lana Wachowski': (6, 1),
       'Joel Silver': (5, 4)}
color = {'Person': 'tab:blue', 'Movie': 'tab:orange'}
plt.figure(figsize=(8, 4.5))
for s, p, o in rels:
    plt.annotate('', xy=pos[o], xytext=pos[s],
                 arrowprops=dict(arrowstyle='->', color='gray', shrinkA=22, shrinkB=26))
    mx, my = (pos[s][0] + pos[o][0]) / 2, (pos[s][1] + pos[o][1]) / 2
    plt.text(mx, my, p, fontsize=7, color='dimgray', ha='center')
for name, (x, y) in pos.items():
    plt.text(x, y, name, ha='center', va='center', color='white', fontsize=9,
             bbox=dict(boxstyle='round,pad=0.5', fc=color[nodes[name]], ec='none'))
plt.xlim(-1.2, 7.2)
plt.ylim(-0.8, 4.8)
plt.axis('off')
plt.title('영화 그래프 일부 (Person = 파랑, Movie = 주황)')
plt.show()`,
            expect: "Node labels       : {'Movie': 2, 'Person': 5}\nRelationship types: {'ACTED_IN': 4, 'DIRECTED': 2, 'PRODUCED': 1}",
            desc: 'Browser 의 사이드바는 바로 이런 "레이블별 · 관계 타입별 목록"을 보여 주는 것입니다. Keanu Reeves 처럼 화살표가 많이 모인 노드가 그래프의 중심 인물이라는 것도 그림으로 바로 보이지요.' },
          { type: 'h', text: '모두 지우기: MATCH (n) DETACH DELETE n' },
          { type: 'p', html: '연습이 끝나면 데이터베이스를 깨끗이 비우고 싶을 때가 있습니다. 이때 쓰는 문장이 아래와 같습니다. 읽는 법은 <b>"모든 노드 n 을 찾아서(MATCH), 연결된 관계를 끊고(DETACH), 지워라(DELETE)"</b> 입니다.' },
          { type: 'code', title: 'Cypher 3-5. 데이터베이스 모두 지우기 (Neo4j Browser 에서 실행 — 주의!)', run: false, code: `MATCH (n) DETACH DELETE n`,
            expect: 'Deleted 171 nodes, deleted 253 relationships, completed after 45 ms.',
            desc: '영화 예제를 불러온 상태라면 노드 약 170개와 관계 약 250개가 한꺼번에 사라집니다. <b>되돌리기(Ctrl+Z)가 없습니다.</b>' },
          { type: 'p', html: '왜 그냥 <code>DELETE</code> 가 아니라 <code>DETACH DELETE</code> 일까요? Neo4j 는 관계가 붙어 있는 노드를 지우려 하면 "<b>관계가 남아 있어서 지울 수 없습니다</b>" 라는 오류를 냅니다. 한쪽 끝이 없는 화살표가 생기면 안 되기 때문입니다. Python 으로 그 규칙을 흉내 내 봅시다.' },
          { type: 'code', title: '예제 3-4. DELETE 와 DETACH DELETE 의 차이 흉내 내기', code: `nodes = {0: '나', 1: '기생충', 2: '인사이드 아웃'}
rels = [(0, 'LIKES', 1), (0, 'LIKES', 2)]

def delete(n):
    # 관계가 붙어 있으면 지우지 않는다 (진짜 Neo4j 의 DELETE 규칙)
    for a, t, b in rels:
        if n in (a, b):
            raise ValueError(f'노드 {n} 에 관계가 남아 있어 지울 수 없습니다')
    del nodes[n]

def detach_delete(n):
    # 붙어 있는 관계를 먼저 끊고(DETACH) 노드를 지운다
    for r in [r for r in rels if n in (r[0], r[2])]:
        rels.remove(r)
    del nodes[n]

try:
    delete(0)
except ValueError as e:
    print('DELETE 실패 :', e)

detach_delete(0)
print('DETACH DELETE 후 노드:', nodes)
print('DETACH DELETE 후 관계:', rels)`,
            expect: "DELETE 실패 : 노드 0 에 관계가 남아 있어 지울 수 없습니다\nDETACH DELETE 후 노드: {1: '기생충', 2: '인사이드 아웃'}\nDETACH DELETE 후 관계: []",
            desc: '<b>"나"</b> 노드를 지우자 나에게서 나가던 LIKES 화살표 두 개도 함께 사라졌습니다. 영화 노드는 그대로 남아 있습니다.' },
          { type: 'callout', kind: 'warn', title: 'DETACH DELETE 를 쓰기 전에 세 가지 확인', html: '① <b>정말 모두 지워도 되는지</b> — 다른 실습 데이터까지 사라집니다. ② <b>어느 데이터베이스에 접속했는지</b> — 여러 인스턴스를 쓴다면 이름을 확인하세요. ③ <b>먼저 개수 세어 보기</b> — <code>MATCH (n) RETURN count(n)</code> 으로 몇 개가 지워질지 확인한 뒤 실행하면 실수를 줄일 수 있습니다.' },
          { type: 'h', text: '함께 해 보기: 나와 좋아하는 영화 2편' },
          { type: 'p', html: '이제 직접 해 볼 차례입니다. <b>나</b>를 <code>Person</code> 노드로, 좋아하는 영화 2편을 <code>Movie</code> 노드로 만들고 <code>LIKES</code> 관계로 잇습니다. 아래 Python 예제의 이름과 영화만 바꿔 실행하면, Browser 에 붙여 넣을 Cypher 문장이 만들어집니다.' },
          { type: 'code', title: '예제 3-5. 내 정보로 Cypher 문장 만들기', code: `me = '김민수'                                   # 내 이름으로 바꾸기
movies = [('기생충', 2019), ('인사이드 아웃', 2015)]   # 좋아하는 영화 2편

parts = [f"(me:Person {{name: '{me}'}})"]
for i, (title, year) in enumerate(movies, start=1):
    parts.append(f"(m{i}:Movie {{title: '{title}', released: {year}}})")
for i in range(1, len(movies) + 1):
    parts.append(f'(me)-[:LIKES]->(m{i})')

print('CREATE')
print(',\\n'.join('  ' + p for p in parts))
print('RETURN *')`,
            expect: "CREATE\n  (me:Person {name: '김민수'}),\n  (m1:Movie {title: '기생충', released: 2019}),\n  (m2:Movie {title: '인사이드 아웃', released: 2015}),\n  (me)-[:LIKES]->(m1),\n  (me)-[:LIKES]->(m2)\nRETURN *",
            desc: 'f-문자열에서 중괄호 <code>{{ }}</code> 를 두 번 쓰면 글자 그대로의 <code>{ }</code> 가 출력됩니다. <code>me</code> · <code>m1</code> · <code>m2</code> 는 이 문장 안에서만 쓰는 <b>임시 이름표</b>(변수)이고, <code>RETURN *</code> 은 "이름표 붙은 것 모두 보여 줘" 입니다.' },
          { type: 'code', title: 'Cypher 3-6. 출력된 문장을 Browser 에 붙여 넣고 실행 (Neo4j Browser 에서 실행)', run: false, code: `CREATE
  (me:Person {name: '김민수'}),
  (m1:Movie {title: '기생충', released: 2019}),
  (m2:Movie {title: '인사이드 아웃', released: 2015}),
  (me)-[:LIKES]->(m1),
  (me)-[:LIKES]->(m2)
RETURN *`,
            expect: 'Added 3 labels, created 3 nodes, set 5 properties, created 2 relationships',
            desc: 'Graph 보기에 나 → 영화 두 편으로 향하는 화살표가 그려지면 성공입니다. 노드를 클릭해 속성을 확인하고, 화면을 캡처(Windows: <code>Win + Shift + S</code>)해 두세요.' },
          { type: 'p', html: 'Browser 화면에서 보게 될 모습을 미리 Python 으로 그려 보면 다음과 같습니다.' },
          { type: 'code', title: '예제 3-6. 완성된 그래프 미리 그려 보기', code: `import matplotlib.pyplot as plt

me = '김민수'
movies = [('기생충', 2019), ('인사이드 아웃', 2015)]

pos = {me: (0, 0)}
for i, (title, year) in enumerate(movies):
    pos[title] = (3, 1 - 2 * i)          # 영화는 오른쪽 위 · 아래

plt.figure(figsize=(6, 4))
for title, year in movies:
    plt.annotate('', xy=pos[title], xytext=pos[me],
                 arrowprops=dict(arrowstyle='->', lw=1.5, color='gray', shrinkA=28, shrinkB=34))
    mx, my = pos[title][0] / 2, pos[title][1] / 2
    plt.text(mx, my + 0.15, 'LIKES', ha='center', fontsize=9, color='dimgray')
    plt.text(pos[title][0], pos[title][1] - 0.45, 'released: ' + str(year),
             ha='center', fontsize=8, color='dimgray')
plt.text(0, 0, me, ha='center', va='center', color='white', fontsize=11,
         bbox=dict(boxstyle='circle,pad=0.6', fc='tab:blue', ec='none'))
for title, year in movies:
    x, y = pos[title]
    plt.text(x, y, title, ha='center', va='center', color='white', fontsize=10,
             bbox=dict(boxstyle='round,pad=0.6', fc='tab:orange', ec='none'))
plt.xlim(-1, 4.2)
plt.ylim(-1.8, 1.8)
plt.axis('off')
plt.title('(:Person)-[:LIKES]->(:Movie)')
plt.show()
print('노드', 1 + len(movies), '개, 관계', len(movies), '개')`,
            expect: '노드 3 개, 관계 2 개',
            desc: '실제 Browser 에서는 레이블마다 색이 자동으로 정해지고, 노드를 끌어서 위치를 옮길 수 있습니다.' },
          { type: 'callout', kind: 'tip', title: '친구들과 비교해 보기', html: '각자 만든 그래프를 캡처해 비교해 보세요. 같은 영화를 좋아하는 친구가 있다면, 나중에 모든 데이터를 한 데이터베이스에 모았을 때 <b>그 영화 노드를 통해 친구와 내가 연결</b>됩니다. 이것이 5 · 8차시에서 만들 "추천" 의 출발점입니다.' },
          { type: 'callout', kind: 'info', teacher: true, title: '수업 전 준비 체크리스트', html: '① 학생 계정 가입에 이메일 인증이 필요할 수 있으니 <b>과제로 미리 가입</b>시키면 수업 시간이 절약됩니다. ② 학교망에서 <code>console.neo4j.io</code> · <code>*.databases.neo4j.io</code> 접속이 막혀 있지 않은지 미리 확인합니다(막히면 Desktop 사용). ③ 학생이 비밀번호 파일을 잃어버리는 일이 가장 흔합니다 — 인스턴스 메뉴의 비밀번호 재설정(Reset password) 위치를 미리 알아 두세요. ④ 영화 예제를 여러 번 실행해 노드가 중복되면 <code>MATCH (n) DETACH DELETE n</code> 후 다시 실행하게 합니다.' }
        ],
        slides: [
          { layout: 'title', title: 'Neo4j 시작하기', subtitle: 'Neo4j 설치와 Browser 둘러보기',
            notes: '<p>💬 <b>발문:</b> "지난 시간 Python 딕셔너리로 만든 지식그래프, 프로그램을 끄면 어떻게 될까요?" → 사라진다. 그래서 데이터베이스가 필요하다는 흐름으로 시작합니다. (3분)</p>' },
          { layout: 'diagram', title: 'Neo4j 제품 구성', html: FIG_PRODUCTS, caption: '설치 위치(AuraDB · Desktop) + 도구(Browser · Bloom · Python)',
            notes: '<p>"창고(데이터베이스)와 창문(도구)" 비유로 설명합니다. 이 강좌는 AuraDB Free 를 기본으로, 막히면 Desktop 을 쓴다고 안내합니다. (4분)</p>' },
          { layout: 'diagram', title: 'AuraDB Free 만들기 5단계', html: FIG_STEPS, caption: '③ 비밀번호 파일 꼭 내려받기!',
            notes: '<p>교사 화면으로 실제 console.neo4j.io 를 함께 따라 합니다. ③ 단계에서 반드시 멈추고 모두 파일을 내려받았는지 손을 들어 확인합니다. Running 을 기다리는 동안 예제 3-1(접속 정보 읽기)을 실행합니다. (13분)</p>' },
          { layout: 'diagram', title: 'Browser 화면과 첫 Cypher', html: FIG_CYPHER, caption: 'CREATE 로 만들고, MATCH … RETURN 으로 본다',
            notes: '<p>그림 3-3 으로 네 부분(명령줄 · 결과 창 · 보기 · 사이드바)을 짚은 뒤 CREATE → MATCH 를 시연합니다. 일부러 CREATE 를 두 번 눌러 홍길동이 둘이 되는 장면을 보여 주고 예제 3-2 와 연결합니다. 이어 :play movies → LIMIT 25 → DETACH DELETE 를 주의 사항과 함께 시연합니다. (20분)</p>' },
          { layout: 'summary', title: '정리', bullets: ['Neo4j = 그래프 데이터베이스, AuraDB(클라우드) · Desktop(로컬)', '접속 정보 = <b>URI · 사용자 · 비밀번호</b> (파일로 보관)', 'Browser: 명령줄 · 결과 창(Graph/Table/Text) · 사이드바', '<code>CREATE</code> 는 실행할 때마다 새로 만든다', '<code>MATCH (n) DETACH DELETE n</code> 은 되돌릴 수 없다'],
            notes: '<p>함께 해 보기(나 + 영화 2편 + LIKES)를 완성한 학생의 화면을 2~3개 띄워 비교합니다. 💬 "같은 영화를 좋아하는 두 사람을 한 데이터베이스에 넣으면 그래프가 어떻게 될까요?" → 영화 노드에서 만난다. (10분)</p>' }
        ]
      },
      {
        id: 'ch03-2',
        title: '그래프 모델링: 온톨로지를 Neo4j 로',
        minutes: 50,
        goals: ['질문에서 출발해 명사 · 동사 · 형용사를 노드 · 관계 · 속성으로 바꾼다', '온톨로지를 레이블 · 관계 타입 · 속성 대응표로 옮긴다', '다중 레이블과 이름 짓기 규칙을 적용한다', '흔한 모델링 실수를 구별하고 스키마 그림을 그린다'],
        flow: [['도입 · 모델링 순서', 7], ['온톨로지 대응표', 12], ['다중 레이블 · 이름 규칙', 10], ['흔한 실수', 8], ['스키마 그림 · 질문 5개', 13]],
        content: [
          { type: 'p', html: '집을 지을 때 벽돌부터 쌓지 않고 <b>설계도</b>를 먼저 그리듯, 데이터베이스에 데이터를 넣기 전에도 <b>"어떤 노드 · 관계 · 속성을 쓸지"</b> 먼저 정해야 합니다. 이 작업을 <b>그래프 모델링</b>이라고 하고, 완성된 설계도를 <b>그래프 모델</b> 또는 <b>스키마</b>라고 합니다. 화이트보드나 종이에 동그라미와 화살표를 그려 가며 하는 일이라 <b>화이트보드 모델링</b>이라고도 부릅니다.' },
          { type: 'h', text: '모델링 순서: 질문 먼저, 그다음 명사 · 동사 · 형용사' },
          { type: 'p', html: '좋은 모델은 <b>"이 데이터베이스로 어떤 질문에 답하고 싶은가?"</b>에서 시작합니다. 질문을 먼저 적어 두면 꼭 필요한 것만 넣고, 빠뜨린 것도 쉽게 찾을 수 있습니다. 질문 문장을 적었다면 다음 규칙으로 바꿉니다.' },
          { type: 'list', ordered: true, items: [
            '<b>질문 먼저 정하기</b> — 예: "봉준호 감독이 만든 영화는?", "송강호가 출연한 2015년 이후 영화는?"',
            '<b>명사 → 노드</b> (그리고 명사의 종류 → 레이블): 봉준호 · 송강호 → <code>:Person</code>, 기생충 → <code>:Movie</code>',
            '<b>동사 → 관계</b>: 감독했다 → <code>:DIRECTED</code>, 출연했다 → <code>:ACTED_IN</code>',
            '<b>형용사 · 수식어(값) → 속성</b>: 2019년에 개봉한 → <code>released: 2019</code>, 이름이 … 인 → <code>name</code>'
          ] },
          { type: 'figure', html: FIG_NVA, caption: '그림 3-5. 문장 하나를 노드 · 관계 · 속성으로 나누기. 2차시의 트리플(주어 – 술어 – 목적어)과 같은 생각입니다.' },
          { type: 'p', html: '질문 여러 개를 표시해 두고, Python 으로 노드 레이블 · 관계 타입 · 속성을 자동으로 모아 봅시다. 각 질문을 <b>(출발 명사의 종류, 동사, 도착 명사의 종류, 필요한 값)</b> 으로 미리 나눠 두었습니다.' },
          { type: 'code', title: '예제 3-7. 질문에서 노드 · 관계 · 속성 뽑아내기', code: `# 질문 -> (출발 종류, 동사, 도착 종류, 필요한 값들)
questions = {
    '봉준호 감독이 만든 영화는?':          ('Person', 'DIRECTED', 'Movie', ['name']),
    '송강호가 출연한 2015년 이후 영화는?': ('Person', 'ACTED_IN', 'Movie', ['name', 'released']),
    '기생충의 장르는?':                    ('Movie', 'IN_GENRE', 'Genre', ['title']),
    '기생충에서 송강호가 맡은 역할은?':    ('Person', 'ACTED_IN', 'Movie', ['title', 'role']),
}

labels, rel_types, props = set(), set(), set()
for q, (start, verb, end, values) in questions.items():
    labels.update([start, end])     # 명사의 종류 -> 레이블
    rel_types.add(verb)             # 동사 -> 관계 타입
    props.update(values)            # 값 -> 속성

print('노드 레이블 :', sorted(labels))
print('관계 타입   :', sorted(rel_types))
print('속성        :', sorted(props))`,
            expect: "노드 레이블 : ['Genre', 'Movie', 'Person']\n관계 타입   : ['ACTED_IN', 'DIRECTED', 'IN_GENRE']\n속성        : ['name', 'released', 'role', 'title']",
            desc: '질문 네 개만으로 모델의 뼈대가 거의 나왔습니다. 질문에 나오지 않는 것(예: 영화 상영 시간)은 지금 당장 넣지 않아도 됩니다. 필요해지면 그때 추가하면 됩니다.' },
          { type: 'callout', kind: 'tip', title: '"역할" 은 어디에 붙일까요?', html: '"송강호가 기생충에서 맡은 역할(기택)" 은 송강호 혼자의 정보도, 기생충 혼자의 정보도 아닙니다. <b>"출연했다" 라는 사건에 딸린 정보</b>입니다. 그래서 Neo4j 에서는 <b>관계에 속성</b>을 붙입니다: <code>(송강호)-[:ACTED_IN {role: \'기택\'}]-&gt;(기생충)</code>. 2차시에서 본 속성 그래프의 장점이 바로 이것입니다.' },
          { type: 'h', text: '온톨로지 → Neo4j 대응표' },
          { type: 'p', html: '2차시에 만든 영화 온톨로지가 이미 있다면 모델링이 훨씬 쉬워집니다. 온톨로지의 세 가지 재료가 Neo4j 의 세 가지 재료에 <b>하나씩 짝지어지기</b> 때문입니다.' },
          { type: 'figure', html: FIG_MAP, caption: '그림 3-6. 클래스 → 레이블, 객체 속성(관계) → 관계 타입, 데이터 속성 → 속성. 가운데 글자는 각각의 이름 짓기 규칙입니다.' },
          { type: 'table', head: ['온톨로지 (2차시)', 'Neo4j', '영화 예시', '그래프에서 모양'], rows: [
            ['클래스 (Class)', '노드 <b>레이블</b>', '사람 → <code>:Person</code>, 영화 → <code>:Movie</code>', '동그라미의 색 · 종류'],
            ['하위 클래스 (subClassOf)', '<b>레이블 하나 더</b> (다중 레이블)', '감독 → <code>:Person:Director</code>', '레이블이 두 개인 동그라미'],
            ['인스턴스 (Instance)', '<b>노드</b> 하나', '봉준호, 기생충', '동그라미 하나'],
            ['객체 속성 (Object property)', '<b>관계 타입</b>', '감독했다 → <code>:DIRECTED</code>', '화살표의 이름'],
            ['정의역 → 치역', '관계의 <b>방향</b>', '<code>(:Director)-[:DIRECTED]-&gt;(:Movie)</code>', '화살표의 출발 → 도착'],
            ['데이터 속성 (Data property)', '노드 · 관계 <b>속성</b>', '개봉연도 → <code>released</code>', '동그라미 안의 키: 값']
          ], caption: '온톨로지 – Neo4j 대응표. 이 표 하나만 있으면 2차시의 설계도를 그대로 데이터베이스로 옮길 수 있습니다.' },
          { type: 'p', html: '2차시 예제의 영화 온톨로지를 그대로 가져와, 우리말 이름을 Neo4j 이름으로 바꾸는 대응표를 Python 으로 만들어 봅시다.' },
          { type: 'code', title: '예제 3-8. 영화 온톨로지를 Neo4j 그래프 모델로 바꾸기', code: `# 2차시의 영화 온톨로지
classes = {'사물': None, '사람': '사물', '감독': '사람', '배우': '사람',
           '작품': '사물', '영화': '작품', '장르': '사물'}
relations = {'감독했다': ('감독', '영화'), '출연했다': ('사람', '영화'),
             '장르이다': ('영화', '장르')}
data_props = {'이름': '사람', '출생연도': '사람', '제목': '영화', '개봉연도': '영화'}

# 우리말 -> Neo4j 이름 (레이블 PascalCase · 관계 UPPER_SNAKE_CASE · 속성 camelCase)
label = {'사람': 'Person', '감독': 'Director', '배우': 'Actor',
         '영화': 'Movie', '장르': 'Genre'}
rel_type = {'감독했다': 'DIRECTED', '출연했다': 'ACTED_IN', '장르이다': 'IN_GENRE'}
prop = {'이름': 'name', '출생연도': 'born', '제목': 'title', '개봉연도': 'released'}

print('[레이블]')
for c in classes:
    print(f'  {c:4} -> ' + (':' + label[c] if c in label else '(쓰지 않음: 너무 넓은 분류)'))
print('[관계 타입]')
for r, (d, g) in relations.items():
    print(f'  {r:4} -> (:{label[d]})-[:{rel_type[r]}]->(:{label[g]})')
print('[속성]')
for p, c in data_props.items():
    print(f'  {p:4} -> :{label[c]}.{prop[p]}')`,
            expect: "[레이블]\n  사물   -> (쓰지 않음: 너무 넓은 분류)\n  사람   -> :Person\n  감독   -> :Director\n  배우   -> :Actor\n  작품   -> (쓰지 않음: 너무 넓은 분류)\n  영화   -> :Movie\n  장르   -> :Genre\n[관계 타입]\n  감독했다 -> (:Director)-[:DIRECTED]->(:Movie)\n  출연했다 -> (:Person)-[:ACTED_IN]->(:Movie)\n  장르이다 -> (:Movie)-[:IN_GENRE]->(:Genre)\n[속성]\n  이름   -> :Person.name\n  출생연도 -> :Person.born\n  제목   -> :Movie.title\n  개봉연도 -> :Movie.released",
            desc: '<code>사물</code> · <code>작품</code> 처럼 너무 넓은 클래스는 레이블로 만들지 않았습니다. 모든 노드에 <code>:Thing</code> 을 붙여도 질문에 답하는 데 도움이 되지 않기 때문입니다. 영어 이름은 Neo4j 내장 영화 그래프와 똑같이 맞췄습니다 (<code>born</code>, <code>released</code>, <code>ACTED_IN</code> …).' },
          { type: 'callout', kind: 'info', title: '레이블 · 관계 이름을 한글로 써도 될까요?', html: 'Neo4j 는 <code>:사람</code>, <code>:감독했다</code> 처럼 한글 이름도 받아 줍니다. 하지만 Cypher 예제 · 문서 · 다른 도구 대부분이 영어 이름을 쓰고, 영어 자판에서 입력하기도 편하므로 이 강좌에서는 <b>이름은 영어, 값(name · title)은 한글</b>로 씁니다.' },
          { type: 'h', text: '다중 레이블로 클래스 계층 표현하기' },
          { type: 'p', html: 'Neo4j 의 노드는 레이블을 <b>여러 개</b> 가질 수 있습니다. 그래서 온톨로지의 "감독은 사람의 한 종류이다(is-a)" 를 <b>레이블 두 개</b>로 표현합니다. 봉준호 노드에 <code>:Person</code> 과 <code>:Director</code> 를 함께 붙이면, "사람 찾기" 에도 "감독 찾기" 에도 봉준호가 나옵니다.' },
          { type: 'figure', html: FIG_MULTI, caption: '그림 3-7. 왼쪽 계층(감독 ⊂ 사람)이 오른쪽에서는 레이블 두 개 (:Person:Director) 로 바뀝니다.' },
          { type: 'code', title: '예제 3-9. 계층을 따라 올라가 다중 레이블 만들기', code: `classes = {'사물': None, '사람': '사물', '감독': '사람', '배우': '사람',
           '작품': '사물', '영화': '작품', '장르': '사물'}
label = {'사람': 'Person', '감독': 'Director', '배우': 'Actor',
         '영화': 'Movie', '장르': 'Genre'}

def labels_of(c):
    # c 에서 맨 위까지 올라가며, 레이블로 쓰는 클래스만 모으기
    result = []
    while c is not None:
        if c in label:
            result.insert(0, label[c])   # 큰 분류가 앞에 오도록
        c = classes[c]
    return result

instances = {'봉준호': '감독', '송강호': '배우', '기생충': '영화', '스릴러': '장르'}
for name, c in instances.items():
    print(f"(:{':'.join(labels_of(c))} {{name: '{name}'}})")`,
            expect: "(:Person:Director {name: '봉준호'})\n(:Person:Actor {name: '송강호'})\n(:Movie {name: '기생충'})\n(:Genre {name: '스릴러'})",
            desc: '2차시 예제 2-3 의 <code>ancestors</code> 와 같은 방법입니다. "봉준호는 사람이다" 라는 추론 결과를 <b>레이블로 미리 붙여 두는</b> 셈입니다. (영화는 보통 <code>name</code> 대신 <code>title</code> 을 쓰지만, 여기서는 출력을 간단히 하려고 통일했습니다.)' },
          { type: 'callout', kind: 'warn', title: '다중 레이블은 2 ~ 3개까지만', html: '<code>:Person:Director:Writer:Producer:Korean</code> 처럼 레이블을 너무 많이 붙이면 오히려 헷갈립니다. "국적" 처럼 값이 여러 가지인 것은 레이블보다 속성(<code>nationality</code>)이나 관계(<code>-[:FROM]-&gt;(:Country)</code>)로 두는 것이 좋습니다. 레이블은 <b>"이 노드는 무엇인가?"</b>에 대한 대답일 때만 씁니다.' },
          { type: 'h', text: '이름 짓기 규칙' },
          { type: 'p', html: 'Neo4j 는 이름의 <b>대소문자를 구별</b>합니다. <code>:Person</code> 과 <code>:person</code> 은 다른 레이블이어서, 한 번 섞이면 찾던 노드가 안 나오는 문제가 생깁니다. 그래서 모두가 지키는 약속이 있습니다.' },
          { type: 'table', head: ['대상', '규칙', '좋은 예', '나쁜 예'], rows: [
            ['노드 레이블', '<b>PascalCase</b> — 단어 첫 글자만 대문자, 붙여 쓰기', '<code>Person</code>, <code>MovieGenre</code>', '<code>person</code>, <code>movie_genre</code>'],
            ['관계 타입', '<b>UPPER_SNAKE_CASE</b> — 모두 대문자, 단어 사이 밑줄', '<code>ACTED_IN</code>, <code>DIRECTED</code>', '<code>actedIn</code>, <code>Acted In</code>'],
            ['속성 키', '<b>camelCase</b> — 첫 단어 소문자, 다음 단어 첫 글자 대문자', '<code>name</code>, <code>releaseYear</code>', '<code>Name</code>, <code>release_year</code>']
          ], caption: '레이블은 "명사(사람 이름처럼)", 관계는 "외치는 동사", 속성은 "변수 이름처럼" 이라고 기억하세요.' },
          { type: 'code', title: '예제 3-10. 이름 짓기 규칙 검사기', code: `def is_pascal(s):      # 레이블: Person, MovieGenre
    return s[:1].isupper() and s.isalnum() and not s.isupper()

def is_upper_snake(s): # 관계: ACTED_IN
    return s[:1].isalpha() and s == s.upper() and s.replace('_', '').isalnum()

def is_camel(s):       # 속성: name, releaseYear
    return s[:1].islower() and s.isalnum()

model = {
    '레이블': (['Person', 'movie', 'Genre', 'Movie_Genre'], is_pascal),
    '관계':   (['ACTED_IN', 'directed', 'IN_GENRE', 'Likes'], is_upper_snake),
    '속성':   (['name', 'releaseYear', 'Title', 'born_year'], is_camel),
}
for kind, (names, check) in model.items():
    for n in names:
        print(f'{kind:3} {n:12}', 'OK' if check(n) else '규칙 위반')`,
            expect: '레이블 Person       OK\n레이블 movie        규칙 위반\n레이블 Genre        OK\n레이블 Movie_Genre  규칙 위반\n관계  ACTED_IN     OK\n관계  directed     규칙 위반\n관계  IN_GENRE     OK\n관계  Likes        규칙 위반\n속성  name         OK\n속성  releaseYear  OK\n속성  Title        규칙 위반\n속성  born_year    규칙 위반',
            desc: '문자열 메서드 <code>isupper()</code> · <code>islower()</code> · <code>isalnum()</code>(글자 · 숫자로만 이루어졌나?) 만으로 간단한 검사기를 만들었습니다. 설계한 이름을 넣어 직접 검사해 보세요.' },
          { type: 'h', text: '흔한 모델링 실수: 노드일까, 속성일까?' },
          { type: 'p', html: '초보자가 가장 많이 고민하는 것은 <b>"이것을 노드로 만들까, 속성으로 둘까?"</b> 입니다. 판단 기준은 간단합니다.' },
          { type: 'list', items: [
            '<b>노드로</b> — 여러 노드가 <b>함께 가리키는</b> 대상이거나, 그 자체에 또 다른 정보 · 관계가 붙는 것. 예: 장르(여러 영화가 공유), 감독, 국가',
            '<b>속성으로</b> — 그 노드 하나에만 딸린 <b>단순한 값</b>이고, 주로 비교 · 정렬에 쓰는 것. 예: 개봉연도, 상영 시간, 별점'
          ] },
          { type: 'figure', html: FIG_MISTAKE, caption: '그림 3-8. 위: 장르를 속성 목록으로 두면 "같은 장르의 영화" 를 잇는 선이 없습니다. 아래: 연도를 노드로 만들면 "2015년 이후" 같은 숫자 비교가 번거로워집니다.' },
          { type: 'p', html: '장르를 속성으로 둔 모델과 노드로 둔 모델에서, <b>"스릴러" 라는 장르 이름을 "서스펜스" 로 바꾸는 일</b>을 비교해 봅시다.' },
          { type: 'code', title: '예제 3-11. 장르를 속성으로 둘 때 vs 노드로 둘 때', code: `# 모델 A: 장르를 영화의 속성(목록)으로
movies_A = {'기생충': ['드라마', '스릴러'], '살인의 추억': ['스릴러', '범죄'],
            '마더': ['드라마', '스릴러'], '괴물': ['SF', '스릴러'],
            '인사이드 아웃': ['애니메이션']}

# 모델 B: 장르를 노드로, 영화는 IN_GENRE 관계로 연결
genres_B = {'g1': '드라마', 'g2': '스릴러', 'g3': '범죄', 'g4': 'SF', 'g5': '애니메이션'}
in_genre = [('기생충', 'g1'), ('기생충', 'g2'), ('살인의 추억', 'g2'), ('살인의 추억', 'g3'),
            ('마더', 'g1'), ('마더', 'g2'), ('괴물', 'g4'), ('괴물', 'g2'),
            ('인사이드 아웃', 'g5')]

# 이름 바꾸기: A 는 영화마다 고쳐야 함
count_A = 0
for title, gs in movies_A.items():
    if '스릴러' in gs:
        gs[gs.index('스릴러')] = '서스펜스'
        count_A += 1
# B 는 장르 노드 하나만 고치면 끝
genres_B['g2'] = '서스펜스'
count_B = 1

print('모델 A 에서 고친 곳:', count_A, '개')
print('모델 B 에서 고친 곳:', count_B, '개')
same = [m for m, g in in_genre if g == 'g2']
print('B: 서스펜스 노드에 연결된 영화 =', same)`,
            expect: "모델 A 에서 고친 곳: 4 개\n모델 B 에서 고친 곳: 1 개\nB: 서스펜스 노드에 연결된 영화 = ['기생충', '살인의 추억', '마더', '괴물']",
            desc: '모델 B 에서는 서스펜스 노드 하나에서 출발해 화살표만 따라가면 같은 장르의 영화가 모두 나옵니다. 반대로 개봉연도처럼 <b>영화마다 하나뿐이고 크기 비교에 쓰는 값</b>은 속성으로 두어야 <code>released &gt;= 2015</code> 같은 조건을 바로 쓸 수 있습니다.' },
          { type: 'table', head: ['정보', '노드? 속성?', '이유'], rows: [
            ['장르', '<b>노드</b> <code>:Genre</code>', '여러 영화가 함께 가리킴, 장르끼리 비교 · 추천에 사용'],
            ['개봉연도', '<b>속성</b> <code>released</code>', '영화마다 하나, 크기 비교 · 정렬'],
            ['감독', '<b>노드</b> <code>:Person:Director</code>', '감독도 다른 정보(출생연도, 다른 작품)를 가짐'],
            ['출연 역할', '<b>관계 속성</b> <code>role</code>', '배우와 영화 "사이" 의 정보'],
            ['별점(내가 준 점수)', '<b>관계 속성</b> <code>rating</code>', '"나" 와 "영화" 사이의 정보 — <code>-[:LIKES {rating: 5}]-&gt;</code>']
          ], caption: '"다른 것과 공유되거나 이어지면 노드, 혼자만의 단순한 값이면 속성, 둘 사이의 값이면 관계 속성"' },
          { type: 'h', text: 'Python 으로 설계도(스키마) 그림 그리기' },
          { type: 'p', html: '모델이 정해지면 <b>레이블을 상자로, 관계 타입을 화살표로</b> 그린 한 장짜리 그림을 만들어 둡니다. 이 그림이 있으면 친구 · 선생님과 설계를 이야기하기 쉽고, 4차시 이후 Cypher 를 쓸 때 "어느 방향 화살표였지?" 를 바로 확인할 수 있습니다. 노드 하나하나가 아니라 <b>종류(레이블)</b>만 그린다는 점이 1 · 2차시의 그림과 다릅니다.' },
          { type: 'code', title: '예제 3-12. 영화 그래프 모델(스키마) 그림', code: `import matplotlib.pyplot as plt

# 레이블 -> (위치, 속성 목록)
boxes = {'Person': ((0, 2), ['name', 'born']),
         'Movie':  ((4, 2), ['title', 'released']),
         'Genre':  ((8, 2), ['name'])}
# (출발, 관계 타입, 도착, 관계 속성, 화살표 높이 조정)
arrows = [('Person', 'DIRECTED', 'Movie', '', 0.45),
          ('Person', 'ACTED_IN', 'Movie', '{role}', -0.45),
          ('Movie', 'IN_GENRE', 'Genre', '', 0)]

fig, ax = plt.subplots(figsize=(9, 4))
for name, ((x, y), props) in boxes.items():
    ax.add_patch(plt.Rectangle((x - 1, y - 0.6), 2, 1.2, fc='tab:blue', alpha=0.85))
    ax.text(x, y + 0.2, ':' + name, ha='center', va='center', color='white',
            fontsize=12, fontweight='bold')
    ax.text(x, y - 0.25, ', '.join(props), ha='center', va='center',
            color='white', fontsize=9)
for s, t, e, p, dy in arrows:
    (x1, y1), (x2, y2) = boxes[s][0], boxes[e][0]
    ax.annotate('', xy=(x2 - 1, y2 + dy), xytext=(x1 + 1, y1 + dy),
                arrowprops=dict(arrowstyle='->', lw=1.8, color='dimgray'))
    ax.text((x1 + x2) / 2, y1 + dy + 0.12, ':' + t + ' ' + p, ha='center', fontsize=9)
ax.text(0, 0.9, '+ 레이블 Director / Actor (다중 레이블)', ha='center', fontsize=9,
        color='dimgray')
ax.set_xlim(-1.5, 9.5)
ax.set_ylim(0.5, 3.3)
ax.axis('off')
ax.set_title('영화 지식그래프 모델 (레이블 = 상자, 관계 타입 = 화살표)')
plt.show()

for s, t, e, p, dy in arrows:
    print(f'(:{s})-[:{t}]->(:{e})')`,
            expect: '(:Person)-[:DIRECTED]->(:Movie)\n(:Person)-[:ACTED_IN]->(:Movie)\n(:Movie)-[:IN_GENRE]->(:Genre)',
            desc: '상자에 속성 이름을, 화살표에 관계 타입과 관계 속성(<code>{role}</code>)을 적었습니다. <code>boxes</code> 와 <code>arrows</code> 에 <code>(:Person)-[:LIKES]-&gt;(:Movie)</code> 를 추가하거나 <code>:Country</code> 상자를 넣어 그림을 키워 보세요.' },
          { type: 'callout', kind: 'more', title: 'Neo4j 에서 실제 스키마 보기', html: '데이터가 들어 있는 Neo4j Browser 에서 <code>CALL db.schema.visualization()</code> 을 실행하면, 지금 데이터베이스에 있는 레이블과 관계 타입을 위 그림처럼 자동으로 그려 줍니다. 영화 예제를 불러온 상태에서 실행해 보면 <code>Person</code> 과 <code>Movie</code> 사이에 여러 화살표가 그려집니다. 다만 이것은 "들어 있는 데이터로 거꾸로 그린 그림" 이고, 우리가 하는 모델링은 "데이터를 넣기 전에 그리는 설계도" 라는 점이 다릅니다.' },
          { type: 'h', text: '함께 해 보기: 모델로 답할 질문 5개' },
          { type: 'p', html: '모델링이 끝나면 처음 정한 질문으로 돌아가 <b>"이 모델로 정말 답할 수 있는가?"</b> 를 확인합니다. 질문마다 따라갈 경로를 적어 보고, 모델에 없는 레이블 · 관계 · 속성이 필요하면 모델을 고칩니다.' },
          { type: 'code', title: '예제 3-13. 질문 5개가 모델로 답해지는지 점검하기', code: `model = {
    'labels': {'Person': ['name', 'born'], 'Movie': ['title', 'released'],
               'Genre': ['name']},
    'rels': {'DIRECTED': ('Person', 'Movie'), 'ACTED_IN': ('Person', 'Movie'),
             'IN_GENRE': ('Movie', 'Genre')},
}

# 질문 -> (따라갈 관계들, 필요한 속성들)
questions = {
    '1. 봉준호 감독이 만든 영화는?':           (['DIRECTED'], ['name']),
    '2. 송강호가 출연한 2015년 이후 영화는?':  (['ACTED_IN'], ['name', 'released']),
    '3. 기생충과 같은 장르의 영화는?':         (['IN_GENRE'], ['title']),
    '4. 봉준호 영화에 출연한 배우는?':         (['DIRECTED', 'ACTED_IN'], ['name']),
    '5. 내가 좋아하는 영화의 장르는?':         (['LIKES', 'IN_GENRE'], ['name']),
}

all_props = {p for ps in model['labels'].values() for p in ps}
for q, (rels, props) in questions.items():
    missing = [r for r in rels if r not in model['rels']]
    missing += [p for p in props if p not in all_props]
    print(q, '-> OK' if not missing else f'-> 모델에 없음: {missing}')`,
            expect: "1. 봉준호 감독이 만든 영화는? -> OK\n2. 송강호가 출연한 2015년 이후 영화는? -> OK\n3. 기생충과 같은 장르의 영화는? -> OK\n4. 봉준호 영화에 출연한 배우는? -> OK\n5. 내가 좋아하는 영화의 장르는? -> 모델에 없음: ['LIKES']",
            desc: '5번 질문은 1교시에 만든 <code>LIKES</code> 관계가 모델에 없어서 답할 수 없습니다. <code>model[\'rels\']</code> 에 <code>\'LIKES\': (\'Person\', \'Movie\')</code> 를 추가하고 다시 실행해 모두 OK 가 되는지 확인하세요. 이렇게 <b>질문 → 모델 → 다시 질문</b> 을 반복하며 모델을 다듬습니다.' },
          { type: 'callout', kind: 'tip', title: '내 모델 정리하기', html: '자신의 영화 모델을 <b>① 대응표</b>(온톨로지 이름 → 레이블 · 관계 타입 · 속성), <b>② 스키마 그림</b>(예제 3-12), <b>③ 답할 질문 5개</b> 세 가지로 정리해 두세요. 4차시에 이 설계도대로 Cypher 로 데이터를 넣고, 질문을 하나씩 Cypher 로 바꿔 답해 봅니다.' },
          { type: 'callout', kind: 'info', teacher: true, title: '오개념 지도 팁', html: '① "레이블 = 노드 이름" 으로 오해하는 학생이 많습니다 — 레이블은 <b>종류</b>, 이름은 <code>name</code> <b>속성</b>임을 그림 3-4 로 다시 짚어 주세요. ② 모든 명사를 노드로 만들려는 경향이 있으므로 "여러 개가 함께 가리키는가?" 기준을 반복합니다. ③ 모델에 정답은 하나가 아닙니다. 학생 모델을 평가할 때는 <b>질문 5개에 답할 수 있는지 · 이름 규칙 · 관계 방향</b> 세 가지를 봅니다.' }
        ],
        slides: [
          { layout: 'title', title: '그래프 모델링', subtitle: '온톨로지를 Neo4j 로',
            notes: '<p>💬 <b>발문:</b> "집을 지을 때 무엇부터 할까요?" → 설계도. 데이터베이스도 데이터를 넣기 전에 설계도를 그린다고 연결합니다. (3분)</p>' },
          { layout: 'diagram', title: '질문 → 명사 · 동사 · 형용사', html: FIG_NVA, caption: '명사 → 노드 · 동사 → 관계 · 수식어 → 속성',
            notes: '<p>칠판에 질문 하나를 적고 학생들과 함께 명사 · 동사 · 값에 밑줄을 칩니다. 예제 3-7 을 실행해 질문 목록에서 레이블 · 관계 · 속성이 모이는 것을 보여 줍니다. "역할" 이 관계 속성인 이유를 짚습니다. (8분)</p>' },
          { layout: 'table', title: '온톨로지 → Neo4j 대응표', head: ['온톨로지', 'Neo4j', '예시'], rows: [
            ['클래스', '레이블 (PascalCase)', ':Person, :Movie'],
            ['하위 클래스', '다중 레이블', ':Person:Director'],
            ['객체 속성', '관계 타입 (UPPER_SNAKE_CASE)', ':DIRECTED'],
            ['데이터 속성', '속성 (camelCase)', 'released']
          ], lead: '2차시 설계도를 그대로 옮긴다',
            notes: '<p>예제 3-8 · 3-9 로 2차시 온톨로지가 대응표와 다중 레이블로 바뀌는 것을 실행합니다. 이어 예제 3-10 이름 규칙 검사기로 "movie" · "directed" 가 왜 규칙 위반인지 확인합니다. (20분)</p>' },
          { layout: 'diagram', title: '노드일까, 속성일까?', html: FIG_MISTAKE, caption: '공유되면 노드, 혼자만의 값이면 속성',
            notes: '<p>💬 "국적은 노드? 속성?" → 국가별로 모아 보고 싶다면 노드, 단순 표시라면 속성. 정답이 질문에 따라 달라진다는 점을 강조합니다. 예제 3-11 로 이름 바꾸기 비용을 비교합니다. (8분)</p>' },
          { layout: 'summary', title: '정리', bullets: ['모델링은 <b>질문</b>에서 시작', '클래스 → 레이블, 관계 → 관계 타입, 값 → 속성', '하위 클래스 → 다중 레이블 <code>(:Person:Director)</code>', 'Person · ACTED_IN · releaseYear 이름 규칙', '다음 차시: 설계도대로 <b>Cypher 로 만들고 찾기</b>'],
            notes: '<p>예제 3-12 스키마 그림과 3-13 질문 점검을 함께 실행하고, LIKES 를 추가해 5번 질문이 OK 가 되는 것을 보여 주며 마칩니다. 각자 모델(대응표 · 그림 · 질문 5개)을 정리해 오게 합니다. (11분)</p>' }
        ]
      }
    ]
  });
})();
