/* 01차시 머신러닝이란 무엇인가? */
(function () {
  const ARROW = (id) => `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fill-arrow"/></marker></defs>`;

  const FIG_AIMLDL = `<svg viewBox="0 0 640 330" role="img" aria-label="AI가 가장 큰 원, 그 안에 머신러닝, 그 안에 딥러닝이 있는 포함 관계 그림">
  <ellipse cx="320" cy="170" rx="300" ry="150" class="p1s"/>
  <ellipse cx="370" cy="190" rx="215" ry="115" class="p2s"/>
  <ellipse cx="420" cy="210" rx="125" ry="72" class="p3s"/>
  <text x="70" y="120" class="tx-b">인공지능 (AI)</text>
  <text x="70" y="142" class="tx-m">규칙 기반 전문가 시스템,</text>
  <text x="70" y="158" class="tx-m">탐색 알고리즘 등 포함</text>
  <text x="190" y="190" class="tx-b">머신러닝 (ML)</text>
  <text x="190" y="212" class="tx-m">데이터에서 규칙을 학습</text>
  <text x="190" y="228" class="tx-m">회귀·트리·군집 …</text>
  <text x="365" y="205" class="tx-b">딥러닝 (DL)</text>
  <text x="352" y="227" class="tx-m">다층 신경망 · CNN ·</text>
  <text x="352" y="243" class="tx-m">트랜스포머</text>
</svg>`;

  const FIG_PROG = `<svg viewBox="0 0 680 300" role="img" aria-label="전통적 프로그래밍은 데이터와 규칙을 넣어 정답을 얻고, 머신러닝은 데이터와 정답을 넣어 규칙을 얻는다">
  ${ARROW('m01a1')}
  <text x="20" y="30" class="tx-b">전통적 프로그래밍</text>
  <rect x="20" y="45" width="140" height="44" rx="10" class="p1s"/><text x="90" y="72" text-anchor="middle" class="tx">데이터</text>
  <rect x="20" y="100" width="140" height="44" rx="10" class="p3s"/><text x="90" y="127" text-anchor="middle" class="tx">규칙 (사람이 작성)</text>
  <rect x="260" y="68" width="160" height="56" rx="12" class="p1"/><text x="340" y="101" text-anchor="middle" class="tx-w">프로그램</text>
  <rect x="520" y="72" width="140" height="48" rx="10" class="p5s"/><text x="590" y="101" text-anchor="middle" class="tx">정답 (출력)</text>
  <line x1="162" y1="67" x2="256" y2="90" class="ln" stroke-width="2" marker-end="url(#m01a1)"/>
  <line x1="162" y1="122" x2="256" y2="104" class="ln" stroke-width="2" marker-end="url(#m01a1)"/>
  <line x1="422" y1="96" x2="516" y2="96" class="ln" stroke-width="2" marker-end="url(#m01a1)"/>
  <text x="20" y="185" class="tx-b">머신러닝</text>
  <rect x="20" y="200" width="140" height="44" rx="10" class="p1s"/><text x="90" y="227" text-anchor="middle" class="tx">데이터</text>
  <rect x="20" y="255" width="140" height="44" rx="10" class="p5s"/><text x="90" y="282" text-anchor="middle" class="tx">정답 (레이블)</text>
  <rect x="260" y="223" width="160" height="56" rx="12" class="p2"/><text x="340" y="256" text-anchor="middle" class="tx-w">학습 알고리즘</text>
  <rect x="520" y="227" width="140" height="48" rx="10" class="p3s"/><text x="590" y="256" text-anchor="middle" class="tx">규칙 = 모델</text>
  <line x1="162" y1="222" x2="256" y2="245" class="ln" stroke-width="2" marker-end="url(#m01a1)"/>
  <line x1="162" y1="277" x2="256" y2="259" class="ln" stroke-width="2" marker-end="url(#m01a1)"/>
  <line x1="422" y1="251" x2="516" y2="251" class="ln" stroke-width="2" marker-end="url(#m01a1)"/>
</svg>`;

  const FIG_TYPES = `<svg viewBox="0 0 720 290" role="img" aria-label="지도 학습, 비지도 학습, 강화 학습 비교 그림">
  ${ARROW('m01a2')}
  <rect x="10" y="10" width="220" height="270" rx="14" class="card-bg"/>
  <rect x="250" y="10" width="220" height="270" rx="14" class="card-bg"/>
  <rect x="490" y="10" width="220" height="270" rx="14" class="card-bg"/>
  <text x="120" y="42" text-anchor="middle" class="tx-b">지도 학습</text>
  <text x="120" y="62" text-anchor="middle" class="tx-m">정답(레이블)이 있음</text>
  <line x1="40" y1="230" x2="200" y2="90" class="s4" stroke-width="2" stroke-dasharray="6 4"/>
  <circle cx="60" cy="110" r="7" class="p1"/><circle cx="85" cy="130" r="7" class="p1"/><circle cx="70" cy="150" r="7" class="p1"/><circle cx="100" cy="100" r="7" class="p1"/><circle cx="55" cy="180" r="7" class="p1"/>
  <rect x="140" y="190" width="13" height="13" class="p3"/><rect x="170" y="170" width="13" height="13" class="p3"/><rect x="160" y="215" width="13" height="13" class="p3"/><rect x="190" y="200" width="13" height="13" class="p3"/><rect x="125" y="225" width="13" height="13" class="p3"/>
  <text x="120" y="265" text-anchor="middle" class="tx-m">예: 스팸 분류, 집값 예측</text>
  <text x="360" y="42" text-anchor="middle" class="tx-b">비지도 학습</text>
  <text x="360" y="62" text-anchor="middle" class="tx-m">정답 없이 구조를 찾음</text>
  <circle cx="310" cy="120" r="42" class="p2s"/><circle cx="410" cy="190" r="45" class="p5s"/>
  <circle cx="300" cy="110" r="6" class="p2"/><circle cx="320" cy="130" r="6" class="p2"/><circle cx="295" cy="135" r="6" class="p2"/><circle cx="325" cy="105" r="6" class="p2"/>
  <circle cx="400" cy="180" r="6" class="p5"/><circle cx="420" cy="200" r="6" class="p5"/><circle cx="395" cy="205" r="6" class="p5"/><circle cx="430" cy="175" r="6" class="p5"/><circle cx="415" cy="220" r="6" class="p5"/>
  <text x="360" y="265" text-anchor="middle" class="tx-m">예: 고객 군집, 차원 축소</text>
  <text x="600" y="42" text-anchor="middle" class="tx-b">강화 학습</text>
  <text x="600" y="62" text-anchor="middle" class="tx-m">보상을 받으며 시행착오</text>
  <rect x="540" y="95" width="120" height="44" rx="10" class="p1"/><text x="600" y="122" text-anchor="middle" class="tx-w">에이전트</text>
  <rect x="540" y="185" width="120" height="44" rx="10" class="p3s"/><text x="600" y="212" text-anchor="middle" class="tx">환경</text>
  <path d="M665 117 C700 130 700 190 665 205" class="ln" stroke-width="2" marker-end="url(#m01a2)"/>
  <path d="M535 205 C500 190 500 130 535 117" class="ln" stroke-width="2" marker-end="url(#m01a2)"/>
  <text x="704" y="165" class="tx-m" text-anchor="end">행동</text>
  <text x="500" y="165" class="tx-m">보상</text>
  <text x="600" y="265" text-anchor="middle" class="tx-m">예: 게임 AI, 로봇 제어</text>
</svg>`;

  const FIG_TABLE = `<svg viewBox="0 0 680 250" role="img" aria-label="붓꽃 데이터 표에서 특성 X와 레이블 y를 구분한 그림">
  <rect x="20" y="30" width="470" height="200" rx="10" class="p1s" opacity=".55"/>
  <rect x="500" y="30" width="160" height="200" rx="10" class="p3s" opacity=".75"/>
  <text x="255" y="22" text-anchor="middle" class="tx-b">특성 X (입력)</text>
  <text x="580" y="22" text-anchor="middle" class="tx-b">레이블 y (정답)</text>
  <text x="35" y="60" class="tx-b" font-size="13">꽃받침 길이</text><text x="150" y="60" class="tx-b" font-size="13">꽃받침 너비</text><text x="265" y="60" class="tx-b" font-size="13">꽃잎 길이</text><text x="375" y="60" class="tx-b" font-size="13">꽃잎 너비</text><text x="520" y="60" class="tx-b" font-size="13">품종</text>
  <text x="55" y="100" class="tx">5.1</text><text x="170" y="100" class="tx">3.5</text><text x="285" y="100" class="tx">1.4</text><text x="395" y="100" class="tx">0.2</text><text x="520" y="100" class="tx">setosa</text>
  <text x="55" y="140" class="tx">7.0</text><text x="170" y="140" class="tx">3.2</text><text x="285" y="140" class="tx">4.7</text><text x="395" y="140" class="tx">1.4</text><text x="520" y="140" class="tx">versicolor</text>
  <text x="55" y="180" class="tx">6.3</text><text x="170" y="180" class="tx">3.3</text><text x="285" y="180" class="tx">6.0</text><text x="395" y="180" class="tx">2.5</text><text x="520" y="180" class="tx">virginica</text>
  <text x="55" y="215" class="tx-m">⋮</text><text x="520" y="215" class="tx-m">⋮</text>
  <line x1="20" y1="75" x2="660" y2="75" class="ln"/>
  <line x1="20" y1="115" x2="660" y2="115" class="ln" stroke-dasharray="3 3"/>
  <line x1="20" y1="155" x2="660" y2="155" class="ln" stroke-dasharray="3 3"/>
  <line x1="20" y1="195" x2="660" y2="195" class="ln" stroke-dasharray="3 3"/>
</svg>`;

  const FIG_FLOW = `<svg viewBox="0 0 720 230" role="img" aria-label="데이터 수집, 학습/테스트 분할, 모델 학습, 테스트 평가, 예측의 다섯 단계 흐름">
  ${ARROW('m01a3')}
  <rect x="10" y="80" width="110" height="60" rx="12" class="p1s"/><text x="65" y="108" text-anchor="middle" class="tx-b">① 데이터</text><text x="65" y="127" text-anchor="middle" class="tx-m">수집·정리</text>
  <rect x="160" y="30" width="120" height="50" rx="10" class="p2s"/><text x="220" y="60" text-anchor="middle" class="tx">학습용 80%</text>
  <rect x="160" y="140" width="120" height="50" rx="10" class="p3s"/><text x="220" y="170" text-anchor="middle" class="tx">테스트용 20%</text>
  <text x="220" y="116" text-anchor="middle" class="tx-m">② 분할</text>
  <rect x="320" y="30" width="130" height="50" rx="10" class="p2"/><text x="385" y="60" text-anchor="middle" class="tx-w">③ 모델 학습 fit</text>
  <rect x="490" y="140" width="130" height="50" rx="10" class="p3"/><text x="555" y="170" text-anchor="middle" class="tx-w">④ 평가 score</text>
  <rect x="490" y="30" width="130" height="50" rx="10" class="p1"/><text x="555" y="60" text-anchor="middle" class="tx-w">학습된 모델</text>
  <rect x="640" y="80" width="75" height="60" rx="12" class="p5s"/><text x="677" y="108" text-anchor="middle" class="tx-b">⑤ 예측</text><text x="677" y="127" text-anchor="middle" class="tx-m">새 데이터</text>
  <line x1="122" y1="100" x2="156" y2="62" class="ln" stroke-width="2" marker-end="url(#m01a3)"/>
  <line x1="122" y1="120" x2="156" y2="160" class="ln" stroke-width="2" marker-end="url(#m01a3)"/>
  <line x1="282" y1="55" x2="316" y2="55" class="ln" stroke-width="2" marker-end="url(#m01a3)"/>
  <line x1="452" y1="55" x2="486" y2="55" class="ln" stroke-width="2" marker-end="url(#m01a3)"/>
  <line x1="555" y1="82" x2="555" y2="136" class="ln" stroke-width="2" marker-end="url(#m01a3)"/>
  <line x1="282" y1="165" x2="486" y2="165" class="ln" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#m01a3)"/>
  <line x1="622" y1="55" x2="660" y2="78" class="ln" stroke-width="2" marker-end="url(#m01a3)"/>
  <text x="385" y="185" text-anchor="middle" class="tx-m">학습 때는 절대 보지 않은 데이터!</text>
</svg>`;

  /* k-최근접 이웃 체험: 클릭한 위치의 품종을 가까운 이웃 k개의 투표로 결정 */
  const KNN_HTML = `<canvas></canvas>
  <div class="controls">
    <label>이웃 수 k <input type="range" min="1" max="15" step="2" value="3" data-k> <b data-kv>3</b></label>
    <span class="readout" data-out>그래프를 클릭하세요</span>
  </div>`;
  function knnInit(root, MLB) {
    const cv = root.querySelector('canvas');
    const { ctx, w, h } = MLB.setupCanvas(cv, 640, 340);
    const r = MLB.rng(7);
    const centers = [[170, 110], [430, 120], [320, 260]];
    const pts = [];
    centers.forEach((c, k) => { for (let i = 0; i < 22; i++) pts.push({ x: c[0] + MLB.gauss(r) * 55, y: c[1] + MLB.gauss(r) * 42, k }); });
    let q = { x: 300, y: 170 }, K = 3;
    const names = ['setosa', 'versicolor', 'virginica'];
    const out = root.querySelector('[data-out]');
    function draw() {
      const P = MLB.palette(), cols = [P.p1, P.p2, P.p3];
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, w, h);
      const near = pts.map((p) => ({ p, d: Math.hypot(p.x - q.x, p.y - q.y) })).sort((a, b) => a.d - b.d).slice(0, K);
      ctx.strokeStyle = P.line; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.arc(q.x, q.y, near[near.length - 1].d, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      near.forEach(({ p }) => { ctx.strokeStyle = cols[p.k]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(p.x, p.y); ctx.stroke(); });
      pts.forEach((p) => { ctx.fillStyle = cols[p.k]; ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fill(); });
      ctx.font = '13px Pretendard, sans-serif';
      names.forEach((n, i) => { ctx.fillStyle = cols[i]; ctx.fillRect(14, 14 + i * 20, 12, 12); ctx.fillStyle = P.text; ctx.fillText(n, 32, 25 + i * 20); });
      const votes = [0, 0, 0]; near.forEach(({ p }) => votes[p.k]++);
      const win = votes.indexOf(Math.max(...votes));
      ctx.fillStyle = cols[win]; ctx.strokeStyle = P.text; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.rect(q.x - 9, q.y - 9, 18, 18); ctx.fill(); ctx.stroke();
      out.textContent = `이웃 ${K}개 투표: ` + names.map((n, i) => `${n} ${votes[i]}`).join(', ') + ` → 예측: ${names[win]}`;
    }
    cv.addEventListener('pointerdown', (e) => { q = MLB.pointer(cv, e, w, h); draw(); });
    const kIn = root.querySelector('[data-k]');
    kIn.addEventListener('input', () => { K = +kIn.value; root.querySelector('[data-kv]').textContent = K; draw(); });
    MLB.onTheme(draw, cv);
    draw();
  }

  const QUIZ1 = [
    { q: '다음 중 포함 관계를 바르게 나타낸 것은?', options: ['머신러닝 ⊃ AI ⊃ 딥러닝', '딥러닝 ⊃ 머신러닝 ⊃ AI', 'AI ⊃ 머신러닝 ⊃ 딥러닝', '셋은 서로 관련 없는 분야이다'], answer: 2,
      explain: 'AI가 가장 넓은 개념이고, 그 안에 데이터로 학습하는 머신러닝, 그 안에 다층 신경망을 쓰는 딥러닝이 있습니다.' },
    { q: '정답이 붙은 고양이/개 사진 1만 장으로 학습시켜 새 사진의 동물을 맞히게 했다. 이 방식은?', options: ['비지도 학습', '지도 학습 (분류)', '지도 학습 (회귀)', '강화 학습'], answer: 1,
      explain: '정답(레이블)이 있고, 맞히려는 값이 “고양이/개”라는 범주이므로 지도 학습 중 분류입니다.' },
    { q: '쇼핑몰 고객 데이터를 정답 없이 비슷한 성향끼리 묶었다. 이 방식은?', options: ['지도 학습 (분류)', '비지도 학습 (군집)', '강화 학습', '전통적 프로그래밍'], answer: 1,
      explain: '정답 그룹이 주어지지 않았고 데이터끼리의 유사성으로 묶었으므로 비지도 학습의 군집입니다.' }
  ];
  const QUIZ2 = [
    { q: '테스트 데이터를 따로 떼어 두는 가장 중요한 이유는?', options: ['학습 속도를 빠르게 하려고', '저장 공간을 아끼려고', '모델이 더 많이 외우게 하려고', '처음 보는 데이터에서의 실제 성능을 공정하게 측정하려고'], answer: 3,
      explain: '학습에 쓴 데이터로 평가하면 “외운 답”을 맞히는 것일 수 있습니다. 처음 보는 데이터에서의 성능(일반화 성능)이 진짜 실력입니다.' },
    { q: '붓꽃 데이터에서 ‘꽃잎 길이’는 무엇에 해당할까?', options: ['특성 (feature)', '레이블 (label)', '모델 (model)', '샘플 (sample)'], answer: 0,
      explain: '꽃잎 길이는 품종을 맞히기 위한 입력 정보이므로 특성입니다. 품종이 레이블입니다.' },
    { q: '다음 코드에서 <code>X_test</code> 의 행(샘플) 수는?<pre><code>X, y = load_iris(return_X_y=True)   # 150개\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42)</code></pre>', options: ['20', '30', '120', '150'], answer: 1,
      explain: '<code>test_size=0.2</code> 이므로 150 × 0.2 = 30개가 테스트용, 나머지 120개가 학습용입니다.' },
    { q: 'scikit-learn 모델을 학습시키는 메서드는?', options: ['<code>model.predict(X)</code>', '<code>model.fit(X, y)</code>', '<code>model.score(X, y)</code>', '<code>model.train(X)</code>'], answer: 1,
      explain: '<code>fit</code> 으로 학습, <code>predict</code> 로 예측, <code>score</code> 로 평가합니다. scikit-learn 의 모든 모델이 같은 사용법을 공유합니다.' }
  ];

  PY_COURSE.addChapter({
    id: 'ml01',
    no: '01',
    title: '머신러닝이란 무엇인가?',
    subtitle: 'AI · 머신러닝 · 딥러닝 · 학습과 테스트',
    summary: '사람이 규칙을 일일이 알려주는 대신 <b>데이터에서 규칙을 스스로 찾아내는 프로그램</b>, 머신러닝의 큰 그림을 그림으로 이해하고 붓꽃 데이터로 첫 번째 모델을 만들어 학습 → 테스트해 봅니다.',
    goals: [
      '인공지능(AI), 머신러닝(ML), 딥러닝(DL)의 관계를 설명할 수 있다',
      '전통적인 프로그래밍과 머신러닝의 차이를 “데이터 · 규칙 · 정답”으로 설명할 수 있다',
      '지도 학습, 비지도 학습, 강화 학습을 예시와 함께 구분할 수 있다',
      '특성(feature), 레이블(label), 학습(train), 테스트(test)의 의미를 알고 첫 분류 모델을 학습 · 평가할 수 있다'
    ],
    sections: [
      {
        id: 'ml01-1',
        title: '머신러닝의 큰 그림',
        minutes: 50,
        goals: ['AI ⊃ 머신러닝 ⊃ 딥러닝의 포함 관계를 설명한다', '전통적 프로그래밍과 머신러닝의 차이를 안다', '학습의 세 가지 종류를 예시로 구분한다'],
        flow: [['도입 · 생활 속 AI', 8], ['AI · ML · DL', 10], ['규칙 vs 학습 (코드)', 14], ['학습의 세 종류', 12], ['퀴즈 · 정리', 6]],
        content: [
          { type: 'p', html: '스마트폰 사진 앱이 사람별로 사진을 모아 주고, 동영상 앱이 내 취향의 영상을 추천하고, 번역기가 문장을 번역합니다. 이 모든 기능 뒤에는 <b>머신러닝(Machine Learning)</b>이 있습니다. 이번 시간에는 머신러닝이 무엇이고, 기존 프로그래밍과 무엇이 다른지 큰 그림을 그려 봅니다.' },
          { type: 'h', text: 'AI, 머신러닝, 딥러닝의 관계' },
          { type: 'p', html: '세 단어는 서로 <b>포함 관계</b>입니다. <b>인공지능(AI)</b>은 사람처럼 똑똑하게 행동하는 기계를 만드는 모든 기술, <b>머신러닝</b>은 그중에서 <b>데이터로부터 배우는</b> 방법, <b>딥러닝</b>은 머신러닝 중에서 <b>여러 층의 인공 신경망</b>을 쓰는 방법입니다.' },
          { type: 'figure', html: FIG_AIMLDL, caption: '그림 1-1. AI ⊃ 머신러닝 ⊃ 딥러닝. 이 강좌는 머신러닝(Part 1~3)에서 출발해 딥러닝(Part 4~5)까지 나아갑니다.' },
          { type: 'h', text: '전통적 프로그래밍 vs 머신러닝' },
          { type: 'p', html: '스팸 메일 걸러내기를 예로 들어 봅시다. 전통적인 방식에서는 프로그래머가 “‘무료’, ‘당첨’이라는 단어가 있으면 스팸”처럼 <b>규칙을 직접 작성</b>합니다. 하지만 스패머가 ‘무.료’처럼 바꿔 쓰면 규칙은 금세 쓸모없어집니다.' },
          { type: 'p', html: '머신러닝은 방향이 반대입니다. <b>데이터(메일)와 정답(스팸 여부)</b>을 잔뜩 보여주면 컴퓨터가 둘 사이의 규칙을 스스로 찾아냅니다. 이렇게 찾아낸 규칙 덩어리를 <b>모델(model)</b>이라고 부릅니다.' },
          { type: 'figure', html: FIG_PROG, caption: '그림 1-2. 머신러닝은 “데이터 + 정답”을 넣어 “규칙(모델)”을 얻어냅니다.' },
          { type: 'code', title: '예제 1-1. 사람이 만든 규칙으로 스팸 판별하기', code: `# 전통적 프로그래밍: 규칙을 사람이 직접 작성
def is_spam(mail):
    for word in ['무료', '당첨', '대출']:
        if word in mail:
            return True
    return False

mails = ['무료 쿠폰 당첨을 축하합니다', '내일 회의는 3시입니다', '무.료 이벤트 참여하세요']
for m in mails:
    print(is_spam(m), '|', m)`,
            expect: 'True | 무료 쿠폰 당첨을 축하합니다\nFalse | 내일 회의는 3시입니다\nFalse | 무.료 이벤트 참여하세요',
            desc: '세 번째 메일은 분명 스팸인데 규칙이 놓쳤습니다. 규칙을 계속 추가해야 하는 것이 전통적 방식의 한계입니다.' },
          { type: 'code', title: '예제 1-2. 데이터와 정답으로 규칙을 “학습”하기', code: `# 머신러닝: 데이터(특성)와 정답(레이블)을 주면 규칙을 스스로 찾는다
from sklearn.tree import DecisionTreeClassifier, export_text

# 특성: [메일 길이(글자 수), 느낌표 개수, 링크 개수]
X = [[20, 3, 2], [15, 2, 1], [120, 0, 0], [80, 0, 1], [25, 4, 3], [200, 1, 0]]
y = [1, 1, 0, 0, 1, 0]          # 정답: 1 = 스팸, 0 = 정상

model = DecisionTreeClassifier(random_state=0)
model.fit(X, y)                 # 학습!
print(export_text(model, feature_names=['length', 'exclaim', 'links']))
print('새 메일 [30자, 느낌표 5개, 링크 2개] →', model.predict([[30, 5, 2]])[0])`,
            desc: '<code>fit()</code> 한 줄로 컴퓨터가 “느낌표가 몇 개 이상이면 스팸” 같은 규칙을 데이터에서 찾아냈습니다. 출력된 트리가 바로 학습된 규칙(모델)입니다.' },
          { type: 'callout', kind: 'tip', title: '한 줄 정의', html: '“명시적으로 프로그래밍하지 않고도 컴퓨터가 학습할 수 있는 능력을 주는 연구 분야” — 아서 사무엘(1959)의 정의로 널리 알려져 있습니다. 핵심은 <b>경험(데이터)이 쌓일수록 성능이 좋아진다</b>는 점입니다.' },
          { type: 'h', text: '머신러닝의 세 가지 종류' },
          { type: 'p', html: '머신러닝은 “정답을 얼마나 알려 주느냐”에 따라 크게 세 가지로 나뉩니다.' },
          { type: 'figure', html: FIG_TYPES, caption: '그림 1-3. 세 가지 학습 방식. 이 강좌는 지도 학습(Part 2, 4, 5)과 비지도 학습(Part 3)을 중심으로 다룹니다.' },
          { type: 'table', head: ['종류', '정답(레이블)', '대표 과제', '예시'], rows: [
            ['🏷️ 지도 학습', '있음', '<b>회귀</b>(숫자 예측) · <b>분류</b>(범주 예측)', '집값 예측, 스팸 분류, 손글씨 인식'],
            ['🧩 비지도 학습', '없음', '<b>군집</b> · <b>차원 축소</b>', '고객 그룹 나누기, 데이터 시각화'],
            ['🎮 강화 학습', '보상', '행동 전략 학습', '게임 AI(알파고), 로봇 제어']
          ] },
          { type: 'callout', kind: 'more', title: '생성형 AI 는 어디에 속할까?', html: '챗봇 · 그림 생성 AI 도 딥러닝 모델입니다. 방대한 텍스트에서 “다음 단어 맞히기”를 반복하는 <b>자기 지도 학습</b>(정답을 데이터 자체에서 만들어 내는 방식)으로 사전학습한 뒤, 사람의 피드백으로 강화 학습을 더해 만듭니다. 이 강좌 12~13차시에서 이런 <b>사전학습 모델</b>을 직접 사용해 봅니다.' }
        ],
        practice: [
          { title: '실습 1-1. 규칙을 고쳐 보기', level: 1,
            desc: '<p>예제 1-1 의 <code>is_spam()</code> 이 세 번째 메일(<code>무.료</code>)도 스팸으로 판별하도록, 검사 전에 메일에서 <code>.</code> 을 없애 보세요. (<code>mail.replace(\'.\', \'\')</code>)</p>',
            hint: '<code>for</code> 문 앞에서 <code>mail = mail.replace(\'.\', \'\')</code>',
            starter: `def is_spam(mail):
    # TODO: 메일에서 '.' 을 지운 뒤 검사하기
    for word in ['무료', '당첨', '대출']:
        if word in mail:
            return True
    return False

mails = ['무료 쿠폰 당첨을 축하합니다', '내일 회의는 3시입니다', '무.료 이벤트 참여하세요']
for m in mails:
    print(is_spam(m), '|', m)
`,
            solution: `def is_spam(mail):
    mail = mail.replace('.', '')
    for word in ['무료', '당첨', '대출']:
        if word in mail:
            return True
    return False

mails = ['무료 쿠폰 당첨을 축하합니다', '내일 회의는 3시입니다', '무.료 이벤트 참여하세요']
for m in mails:
    print(is_spam(m), '|', m)
`,
            expect: 'True | 무료 쿠폰 당첨을 축하합니다\nFalse | 내일 회의는 3시입니다\nTrue | 무.료 이벤트 참여하세요' },
          { title: '실습 1-2. 학습 데이터 추가하기', level: 2,
            desc: '<p>예제 1-2 에 <b>스팸 1개, 정상 1개</b>의 데이터를 직접 만들어 추가하고 다시 학습해 보세요. 출력되는 트리(규칙)가 어떻게 달라지나요?</p>',
            starter: `from sklearn.tree import DecisionTreeClassifier, export_text

X = [[20, 3, 2], [15, 2, 1], [120, 0, 0], [80, 0, 1], [25, 4, 3], [200, 1, 0]]
y = [1, 1, 0, 0, 1, 0]
# TODO: X 와 y 에 데이터를 1개씩 더 추가하기 (append)

model = DecisionTreeClassifier(random_state=0)
model.fit(X, y)
print(export_text(model, feature_names=['length', 'exclaim', 'links']))
`,
            solution: `from sklearn.tree import DecisionTreeClassifier, export_text

X = [[20, 3, 2], [15, 2, 1], [120, 0, 0], [80, 0, 1], [25, 4, 3], [200, 1, 0]]
y = [1, 1, 0, 0, 1, 0]
X.append([40, 0, 3]); y.append(1)     # 느낌표는 없지만 링크가 많은 스팸
X.append([60, 2, 0]); y.append(0)     # 느낌표가 있는 정상 메일

model = DecisionTreeClassifier(random_state=0)
model.fit(X, y)
print(export_text(model, feature_names=['length', 'exclaim', 'links']))
print('데이터 수:', len(X))
` }
        ],
        quiz: QUIZ1,
        slides: [
          { layout: 'title', title: '머신러닝이란 무엇인가?', subtitle: '데이터에서 규칙을 스스로 찾는 프로그램', notes: '<p>첫 시간. 강좌 전체 로드맵(Part 1~5)을 짧게 소개하고, 오늘은 “머신러닝의 큰 그림”을 잡는다고 안내합니다.</p><p>⏱ 도입 8분</p>' },
          { layout: 'bullets', title: '생활 속 머신러닝', lead: '오늘 이미 머신러닝을 몇 번 사용했을까요?', bullets: ['📷 사진 앱의 인물별 앨범 · 얼굴 인식', '🎬 동영상 · 음악 추천', '🌐 번역기 · 음성 비서', '🛡️ 스팸 메일 필터 · 카드 부정 사용 탐지', '🚗 자율주행 · 🏥 의료 영상 판독'],
            notes: '<p><b>발문:</b> “오늘 아침부터 지금까지 AI 가 들어간 서비스를 몇 번 썼나요?” 학생 답을 칠판에 적고, 각각 어떤 데이터로 배웠을지 짧게 묻습니다.</p>' },
          { layout: 'diagram', title: 'AI ⊃ 머신러닝 ⊃ 딥러닝', html: FIG_AIMLDL, caption: 'AI 가 가장 넓고, 딥러닝은 머신러닝의 한 방법',
            notes: '<p>오개념 교정: “AI = 딥러닝 = 챗GPT” 가 아닙니다. 규칙 기반 시스템(예: 초기 체스 프로그램)도 AI 입니다.</p><p>이 강좌 Part 1~3 은 머신러닝, Part 4~5 는 딥러닝.</p>' },
          { layout: 'diagram', title: '전통적 프로그래밍 vs 머신러닝', html: FIG_PROG, caption: '규칙을 넣으면 답이 나온다 ↔ 답을 넣으면 규칙이 나온다',
            notes: '<p>칠판에 두 줄로 대비시켜 적습니다: <b>데이터 + 규칙 → 답</b> / <b>데이터 + 답 → 규칙</b>.</p><p><b>발문:</b> “스팸 필터를 직접 만든다면 어떤 규칙을 쓰겠어요? 그 규칙은 언제 실패할까요?”</p>' },
          { layout: 'code', title: '사람이 만든 규칙의 한계', code: `def is_spam(mail):
    for word in ['무료', '당첨', '대출']:
        if word in mail:
            return True
    return False

for m in ['무료 쿠폰 당첨', '내일 회의 3시', '무.료 이벤트']:
    print(is_spam(m), '|', m)`, points: ['규칙은 사람이 직접 작성', '<code>무.료</code> 처럼 바꾸면 놓친다', '규칙을 끝없이 추가해야 함'],
            notes: '<p>실행 후 세 번째 결과가 False 인 것을 보여 주고, 학생에게 규칙을 고쳐 보라고 합니다(실습 1-1).</p>' },
          { layout: 'code', title: '데이터와 정답으로 규칙 학습하기', code: `from sklearn.tree import DecisionTreeClassifier, export_text

# 특성: [길이, 느낌표 수, 링크 수] / 정답: 1=스팸
X = [[20,3,2], [15,2,1], [120,0,0], [80,0,1], [25,4,3], [200,1,0]]
y = [1, 1, 0, 0, 1, 0]

model = DecisionTreeClassifier(random_state=0)
model.fit(X, y)          # 학습
print(export_text(model, feature_names=['length','exclaim','links']))
print(model.predict([[30, 5, 2]]))`, points: ['<code>fit()</code> = 학습', '출력된 트리 = 컴퓨터가 찾은 규칙', '새 메일은 <code>predict()</code>'],
            notes: '<p>▶ 실행 → 오른쪽 결과 창의 트리를 가리키며 “우리가 규칙을 쓰지 않았는데 컴퓨터가 찾았다”를 강조.</p><p>데이터를 바꾸면 규칙도 바뀐다는 것을 즉석에서 보여 주면 좋습니다.</p>' },
          { layout: 'diagram', title: '머신러닝의 세 가지 종류', html: FIG_TYPES,
            notes: '<p>분류 카드 활동(5분): 사례 8개(스팸 판별, 아파트 가격, 고객 묶기, 바둑 AI, 손글씨 인식, 내일 기온, 수백 특성→2D 시각화, 자율주행 시뮬레이터)를 모둠별로 세 종류로 분류.</p><p>정답: 지도(분류) 2 · 지도(회귀) 2 · 비지도 2 · 강화 2.</p>' },
          { layout: 'table', title: '한눈에 비교', head: ['종류', '정답', '대표 과제', '예시'], rows: [
            ['지도 학습', '있음', '회귀 · 분류', '집값, 스팸, 손글씨'],
            ['비지도 학습', '없음', '군집 · 차원 축소', '고객 그룹, 시각화'],
            ['강화 학습', '보상', '행동 전략', '게임 AI, 로봇']
          ], notes: '<p>회귀 = 숫자, 분류 = 범주. 이 구분은 다음 차시들에서 계속 쓰이므로 확실히 짚습니다.</p>' },
          { layout: 'quiz', title: '확인 문제', q: QUIZ1[1].q, options: QUIZ1[1].options, answer: QUIZ1[1].answer, explain: QUIZ1[1].explain, notes: '<p>손을 들게 해서 답을 확인한 뒤 정답 공개.</p>' },
          { layout: 'practice', title: '실습 1-1. 규칙을 고쳐 보기', desc: '<p><code>무.료</code> 도 스팸으로 잡도록 <code>is_spam()</code> 을 고쳐 보세요.</p>',
            starter: `def is_spam(mail):
    # TODO: '.' 을 지운 뒤 검사
    for word in ['무료', '당첨', '대출']:
        if word in mail:
            return True
    return False

print(is_spam('무.료 이벤트'))`, solution: `def is_spam(mail):
    mail = mail.replace('.', '')
    for word in ['무료', '당첨', '대출']:
        if word in mail:
            return True
    return False

print(is_spam('무.료 이벤트'))`, notes: '<p>그러면 “무1료”는? → 규칙 기반의 한계를 다시 확인하며 마무리.</p>' },
          { layout: 'summary', title: '정리', bullets: ['머신러닝 = 데이터와 정답에서 <b>규칙(모델)</b>을 스스로 찾는 방법', 'AI ⊃ 머신러닝 ⊃ 딥러닝', '지도(회귀 · 분류) · 비지도(군집 · 차원 축소) · 강화(보상)', '다음 교시: 데이터 · 학습 · 테스트와 첫 모델'], notes: '<p>⏱ 정리 6분. 쉬는 시간 뒤 Colab/브라우저 실습으로 이어진다고 예고.</p>' }
        ]
      },
      {
        id: 'ml01-2',
        title: '데이터 · 학습 · 테스트와 첫 모델',
        minutes: 50,
        goals: ['특성(X)과 레이블(y)을 구분한다', '학습용/테스트용 데이터를 나누는 이유를 설명한다', 'k-최근접 이웃으로 붓꽃을 분류하고 테스트 정확도를 확인한다'],
        flow: [['특성과 레이블', 8], ['학습/테스트 흐름', 8], ['KNN 체험', 7], ['첫 모델 코드', 17], ['퀴즈 · 정리', 10]],
        content: [
          { type: 'h', text: '데이터의 언어: 특성과 레이블' },
          { type: 'p', html: '머신러닝에서 데이터는 보통 <b>표</b>로 생각합니다. 한 행은 하나의 <b>샘플</b>(꽃 한 송이), 한 열은 하나의 <b>특성(feature)</b>(꽃잎 길이)입니다. 맞히고 싶은 값은 <b>레이블(label)</b> 또는 타깃이라고 부릅니다.' },
          { type: 'figure', html: FIG_TABLE, caption: '그림 1-4. 붓꽃(iris) 데이터: 150개 샘플 × 4개 특성 + 품종 레이블. 관례적으로 입력은 대문자 X, 정답은 소문자 y 로 씁니다.' },
          { type: 'p', html: '머신러닝 모델은 입력 X 를 받아 예측값 ŷ(와이 햇)을 내놓는 함수 f 입니다: <b>ŷ = f(X)</b>. “학습”이란 예측값 ŷ 가 실제 정답 y 와 최대한 가까워지도록 f 를 조정하는 과정입니다.' },
          { type: 'code', title: '예제 1-3. 허깅페이스 붓꽃 데이터 살펴보기', code: `import mldata                     # 강좌용 데이터 모듈 (허깅페이스 데이터셋 일부)

df = mldata.load('iris')          # 🤗 scikit-learn/iris
df = df.drop(columns=['Id'])
print('크기(행, 열):', df.shape)
display(df.head())                # 표로 보기
print(df['Species'].value_counts())`,
            desc: '<code>display()</code> 는 표(DataFrame)를 오른쪽 결과 창에 보기 좋은 표로 그립니다. Colab 에서는 <code>load_dataset("scikit-learn/iris")</code> 로 같은 데이터를 불러옵니다.' },
          { type: 'code', title: '예제 1-4. 그래프로 품종 구분해 보기', code: `import mldata
import matplotlib.pyplot as plt

df = mldata.load('iris')
fig, axes = plt.subplots(1, 2, figsize=(10, 4))
for name, g in df.groupby('Species'):
    axes[0].scatter(g['SepalLengthCm'], g['SepalWidthCm'], label=name, alpha=.7)
    axes[1].scatter(g['PetalLengthCm'], g['PetalWidthCm'], label=name, alpha=.7)
axes[0].set(title='Sepal', xlabel='length (cm)', ylabel='width (cm)')
axes[1].set(title='Petal', xlabel='length (cm)', ylabel='width (cm)')
axes[1].legend()
plt.show()`,
            desc: '꽃<b>잎</b>(오른쪽) 그래프에서 세 품종이 훨씬 깔끔하게 나뉩니다. 모델도 이런 “구분하기 좋은 특성”을 찾아 활용합니다. (그래프 글자는 한글 글꼴 문제를 피하려고 영어로 씁니다)' },
          { type: 'h', text: '학습과 테스트: 머신러닝의 기본 흐름' },
          { type: 'p', html: '공부한 문제집으로만 시험을 보면 실력을 알 수 없듯이, 모델도 <b>학습에 쓰지 않은 데이터</b>로 평가해야 진짜 실력을 알 수 있습니다. 그래서 데이터를 <b>학습용(train)</b>과 <b>테스트용(test)</b>으로 나눕니다.' },
          { type: 'figure', html: FIG_FLOW, caption: '그림 1-5. 머신러닝 프로젝트의 기본 흐름. 테스트 데이터는 마지막 평가 때까지 “봉인”해 둡니다.' },
          { type: 'demo', title: '가장 가까운 이웃에게 물어보기 (k-최근접 이웃)', desc: '새 데이터와 <b>가장 가까운 k개의 학습 데이터</b>를 찾아 다수결로 정답을 정합니다. 그래프를 클릭해 새 꽃을 놓아 보세요.', html: KNN_HTML, init: knnInit },
          { type: 'code', title: '예제 1-5. 나의 첫 번째 머신러닝 모델', code: `import mldata
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

df = mldata.load('iris')
X = df[['SepalLengthCm', 'SepalWidthCm', 'PetalLengthCm', 'PetalWidthCm']].values
y = df['Species'].values

X_train, X_test, y_train, y_test = train_test_split(      # ② 분할 (80:20)
    X, y, test_size=0.2, random_state=42, stratify=y)
print('학습용:', X_train.shape, ' 테스트용:', X_test.shape)

model = KNeighborsClassifier(n_neighbors=3)              # 모델 선택
model.fit(X_train, y_train)                              # ③ 학습
print('학습 정확도  :', round(model.score(X_train, y_train), 3))
print('테스트 정확도:', round(model.score(X_test, y_test), 3))   # ④ 평가
print('새 꽃 예측  :', model.predict([[5.0, 3.4, 1.5, 0.2]]))   # ⑤ 예측`,
            desc: 'scikit-learn 의 모든 모델은 <code>fit()</code>(학습) → <code>predict()</code>(예측) → <code>score()</code>(평가) 라는 같은 사용법을 공유합니다. <code>stratify=y</code> 는 학습/테스트 양쪽의 품종 비율을 똑같이 맞춰 줍니다.' },
          { type: 'code', title: '예제 1-6. k 값에 따라 정확도는 어떻게 변할까?', code: `import mldata
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

df = mldata.load('iris')
X = df.iloc[:, 1:5].values
y = df['Species'].values
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

ks = range(1, 30, 2)
acc = [KNeighborsClassifier(n_neighbors=k).fit(X_train, y_train).score(X_test, y_test) for k in ks]
plt.plot(list(ks), acc, marker='o')
plt.title('Test accuracy vs k'); plt.xlabel('k (n_neighbors)'); plt.ylabel('accuracy')
plt.ylim(0.8, 1.02); plt.grid(alpha=.3)
plt.show()`,
            desc: '붓꽃은 쉬운 데이터라 대부분의 k 에서 정확도가 높습니다. 정확도가 비슷한 k 가 여럿이라면 무엇을 골라야 할까요? 07차시(검증 데이터 · 교차 검증)에서 답을 찾습니다.' },
          { type: 'table', head: ['도구', '역할', '등장 차시'], rows: [
            ['<b>브라우저 파이썬</b> (이 페이지)', '설치 없이 바로 실행 · 그래프 · 표', '전체'],
            ['<b>Google Colab</b>', '본인 Google 계정 · 무료 GPU · 전체 데이터', '전체 (특히 09~13)'],
            ['<b>NumPy · Pandas · Matplotlib</b>', '배열 계산 · 표 데이터 · 그래프', '02~'],
            ['<b>scikit-learn</b>', '전통적 머신러닝 알고리즘 모음', '01~08'],
            ['<b>PyTorch</b>', '딥러닝 신경망', '09~12 (Colab)'],
            ['<b>🤗 Hugging Face</b>', '공개 데이터셋과 사전학습 모델 저장소', '전체']
          ], caption: '이 강좌에서 사용하는 도구' },
          { type: 'colab', title: 'Colab 실습 01 — 허깅페이스에서 데이터 불러와 첫 모델 만들기', html: '<p>같은 흐름을 Colab 에서 <code>datasets</code> 라이브러리로 해 봅니다. 버튼을 눌러 Colab 을 열고 <b>본인 Google 계정</b>으로 로그인한 뒤 <b>파일 → Drive에 사본 저장</b>을 누르세요. 셀은 위에서부터 <b>Shift + Enter</b> 로 실행합니다. 처음 실행하는 셀에서 “Google 에서 작성하지 않은 노트북” 경고가 나오면 <b>무시하고 계속하기</b>를 누릅니다.</p>' }
        ],
        practice: [
          { title: '실습 1-3. 나만의 꽃 예측하기', level: 1,
            desc: '<p>꽃받침 길이 6.0, 꽃받침 너비 2.9, 꽃잎 길이 4.5, 꽃잎 너비 1.5 인 꽃의 품종을 예측해 보세요.</p>',
            starter: `import mldata
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

df = mldata.load('iris')
X = df.iloc[:, 1:5].values
y = df['Species'].values
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
model = KNeighborsClassifier(n_neighbors=3).fit(X_train, y_train)

my_flower = [[6.0, 2.9, 4.5, 1.5]]
# TODO: my_flower 의 품종을 예측해서 출력하기
`,
            solution: `import mldata
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

df = mldata.load('iris')
X = df.iloc[:, 1:5].values
y = df['Species'].values
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
model = KNeighborsClassifier(n_neighbors=3).fit(X_train, y_train)

my_flower = [[6.0, 2.9, 4.5, 1.5]]
print(model.predict(my_flower))
`,
            expect: "['Iris-versicolor']" },
          { title: '실습 1-4. 다른 모델로 바꿔 보기', level: 2,
            desc: '<p>scikit-learn 의 모델은 모두 사용법이 같습니다. <code>DecisionTreeClassifier</code> 로 바꿔 학습하고 테스트 정확도를 KNN 과 비교해 보세요.</p>',
            hint: '<code>from sklearn.tree import DecisionTreeClassifier</code> → <code>DecisionTreeClassifier(random_state=0).fit(X_train, y_train)</code>',
            starter: `import mldata
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
# TODO: DecisionTreeClassifier 가져오기

df = mldata.load('iris')
X = df.iloc[:, 1:5].values
y = df['Species'].values
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

knn = KNeighborsClassifier(n_neighbors=3).fit(X_train, y_train)
print('KNN  테스트 정확도:', round(knn.score(X_test, y_test), 3))
# TODO: 결정 트리 학습 후 테스트 정확도 출력
`,
            solution: `import mldata
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier

df = mldata.load('iris')
X = df.iloc[:, 1:5].values
y = df['Species'].values
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

knn = KNeighborsClassifier(n_neighbors=3).fit(X_train, y_train)
print('KNN  테스트 정확도:', round(knn.score(X_test, y_test), 3))
tree = DecisionTreeClassifier(random_state=0).fit(X_train, y_train)
print('트리 테스트 정확도:', round(tree.score(X_test, y_test), 3))
` },
          { title: '실습 1-5. (도전) 특성 2개만 사용하기', level: 3,
            desc: '<p>꽃잎 길이와 꽃잎 너비(3, 4번째 특성) <b>두 개만</b> 사용해서 KNN(k=3)을 학습하면 테스트 정확도는 어떻게 될까요? 특성이 많을수록 항상 좋을까요?</p>',
            hint: '<code>X_train[:, 2:]</code>, <code>X_test[:, 2:]</code>',
            starter: `import mldata
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

df = mldata.load('iris')
X = df.iloc[:, 1:5].values
y = df['Species'].values
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
# TODO: 꽃잎 특성 2개만으로 학습하고 테스트 정확도 출력
`,
            solution: `import mldata
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

df = mldata.load('iris')
X = df.iloc[:, 1:5].values
y = df['Species'].values
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
m4 = KNeighborsClassifier(n_neighbors=3).fit(X_train, y_train)
m2 = KNeighborsClassifier(n_neighbors=3).fit(X_train[:, 2:], y_train)
print('특성 4개:', round(m4.score(X_test, y_test), 3))
print('특성 2개:', round(m2.score(X_test[:, 2:], y_test), 3))
` }
        ],
        quiz: QUIZ2,
        slides: [
          { layout: 'title', title: '데이터 · 학습 · 테스트와 첫 모델', subtitle: '붓꽃 품종을 맞히는 k-최근접 이웃', notes: '<p>2교시. 브라우저 실습 위주. 학생들이 코드를 직접 ▶ 실행하도록 안내합니다.</p>' },
          { layout: 'diagram', title: '특성(X)과 레이블(y)', html: FIG_TABLE, caption: '행 = 샘플, 열 = 특성, 맞힐 값 = 레이블',
            notes: '<p><b>발문:</b> “꽃잎 길이는 특성일까 레이블일까?” → 특성. “품종은?” → 레이블.</p>' },
          { layout: 'code', title: '허깅페이스 데이터 불러오기', code: `import mldata

df = mldata.load('iris')      # 🤗 scikit-learn/iris
print(df.shape)
display(df.head())
print(df['Species'].value_counts())`, points: ['<code>mldata</code> = 강좌용 데이터 모듈', '<code>display()</code> → 결과 창에 표', 'Colab: <code>load_dataset()</code>'],
            notes: '<p>처음 실행 시 pandas 를 불러오느라 몇 초 걸립니다.</p>' },
          { layout: 'code', title: '그래프로 살펴보기', code: `import mldata
import matplotlib.pyplot as plt

df = mldata.load('iris')
for name, g in df.groupby('Species'):
    plt.scatter(g['PetalLengthCm'], g['PetalWidthCm'], label=name)
plt.xlabel('petal length'); plt.ylabel('petal width')
plt.legend(); plt.show()`, points: ['꽃잎 특성으로 품종이 잘 나뉨', '사람이라면 어떤 규칙을?', '모델도 이런 특성을 활용'],
            notes: '<p><b>발문:</b> “사람이라면 어떤 규칙을 만들겠어요?” → “꽃잎 길이 &lt; 2.5 이면 setosa”. 모델과 비교하는 것이 이 차시의 핵심.</p>' },
          { layout: 'diagram', title: '학습과 테스트의 흐름', html: FIG_FLOW,
            notes: '<p>비유: 문제집(학습) vs 모의고사(테스트). <b>발문:</b> “학습 정확도 1.0, 테스트 0.9 라면 이 모델의 실력은?” → 0.9</p>' },
          { layout: 'demo', title: 'k-최근접 이웃 체험', html: KNN_HTML, init: knnInit, caption: '클릭한 곳의 품종 = 가까운 이웃 k개의 다수결',
            notes: '<p>k 를 1 과 15 로 바꿔 경계 부근 점의 예측이 어떻게 달라지는지 보여 주세요.</p>' },
          { layout: 'code', title: '첫 번째 머신러닝 모델', code: `import mldata
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

df = mldata.load('iris')
X = df.iloc[:, 1:5].values
y = df['Species'].values
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)

model = KNeighborsClassifier(n_neighbors=3)
model.fit(X_train, y_train)
print('테스트 정확도:', model.score(X_test, y_test))
print(model.predict([[5.0, 3.4, 1.5, 0.2]]))`, points: ['분할 → <code>fit</code> → <code>score</code> → <code>predict</code>', '<code>test_size=0.2</code> → 30개', '<code>random_state</code> = 재현성'],
            notes: '<p>▶ 실행 후 n_neighbors 를 바꿔 다시 실행해 보게 합니다.</p>' },
          { layout: 'quiz', title: '확인 문제', q: QUIZ2[2].q, options: QUIZ2[2].options, answer: QUIZ2[2].answer, explain: QUIZ2[2].explain, notes: '<p>150 × 0.2 = 30.</p>' },
          { layout: 'practice', title: '실습 1-4. 다른 모델로 바꿔 보기', desc: '<p>결정 트리로 바꿔 테스트 정확도를 비교하세요.</p>',
            starter: `import mldata
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

df = mldata.load('iris')
X, y = df.iloc[:, 1:5].values, df['Species'].values
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
knn = KNeighborsClassifier(n_neighbors=3).fit(X_train, y_train)
print('KNN :', knn.score(X_test, y_test))
# TODO: DecisionTreeClassifier`, solution: `import mldata
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier

df = mldata.load('iris')
X, y = df.iloc[:, 1:5].values, df['Species'].values
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
knn = KNeighborsClassifier(n_neighbors=3).fit(X_train, y_train)
print('KNN :', knn.score(X_test, y_test))
tree = DecisionTreeClassifier(random_state=0).fit(X_train, y_train)
print('Tree:', tree.score(X_test, y_test))`, notes: '<p>모델만 바꿔도 사용법이 같다는 점이 scikit-learn 의 장점.</p>' },
          { layout: 'bullets', title: 'Colab 으로 이어서', bullets: ['🟠 차시 개요의 <b>Colab 실습 노트북</b> 버튼', '본인 <b>Google 계정</b>으로 로그인', '<b>파일 → Drive에 사본 저장</b> 후 실행', '<code>load_dataset("scikit-learn/iris")</code> 로 허깅페이스에서 직접'],
            notes: '<p>학교 계정은 Colab 이 막혀 있을 수 있으니 개인 계정을 쓰게 합니다. “Google 에서 작성하지 않음” 경고는 계속하기.</p><p>과제: Colab 실습 노트북의 ✏️ 문제 1~4.</p>' },
          { layout: 'summary', title: '정리', bullets: ['입력 = <b>특성 X</b>, 정답 = <b>레이블 y</b>', '데이터를 <b>학습용 / 테스트용</b>으로 나누고 테스트 정확도로 평가', 'scikit-learn: <code>fit → predict → score</code>', '다음 차시: NumPy · Pandas · Matplotlib'],
            notes: '<p>출구 티켓: “오늘 배운 머신러닝을 친구에게 한 문장으로 설명하기”.</p>' }
        ]
      }
    ]
  });
})();
