# 차시 콘텐츠 작성 가이드 — Node4j

사이트는 **3단 화면** 하나(`index.html`)로 동작합니다.
- 왼쪽: 강의 목차(Part → 차시 → 교시), 학생용/교사용 전환, 검색, 진도
- 가운데: 🎓 학생용 = 문서(개념 · 그림 · 예제 · 실습 · 퀴즈) + 아래 코드 편집기 / 🧑‍🏫 교사용 = **PPT 슬라이드**(16:9, 판서 · 타이머 · 발표자 창) + 교사 노트
- 오른쪽: **실행 결과 창** — 브라우저 파이썬(Pyodide)의 출력, `input()` 입력, **matplotlib 그래프**, **pandas 표(HTML)**

- 작성 형태: 강좌 · 대상: 일반 · 수준: 입문 · 1교시 50분
- 문제 구성: 문제 없음
- 문체: 존댓말, 초보자도 이해할 수 있게 그림·예제 중심

각 차시는 `lessons/<id>.js` 파일 하나이며 `PY_COURSE.addChapter({...})` 를 **한 번** 호출합니다.
평범한 브라우저 스크립트입니다 (import/export 금지, 전역 변수 금지 → `(function(){ ... })();` 안에서 상수 정의).
**형식 예시: `docs/examples/sample-lesson.js`** (다른 강좌의 완성 레슨 — 형식 · 분량 · 그림 스타일만 참고하고, 그 안의 `mldata` · Colab 내용은 이 강좌와 무관합니다).
차시 id · 제목 · 아이콘은 `js/course.js` 의 `order` 에 이미 있습니다 (lectureBuilder 가 관리 — 고치지 마세요).

## 1. 구조

```js
(function () {
  const FIG_X = `<svg ...>...</svg>`;        // 그림은 상수로 만들어 content 와 slides 에서 함께 사용
  function demoInit(root, MLB) { ... }        // 체험 데모 초기화 함수 (선택)
  const QUIZ = [ {q, options, answer, explain}, ... ];

  PY_COURSE.addChapter({
    id: 'ch05', no: '05', title: '...', subtitle: '...',
    summary: '차시 요약 (html)',
    goals: ['차시 학습 목표', ...],
    sections: [ /* 교시 = 50분 1개 */ ]
  });
})();
```

섹션(교시):
```js
{ id: 'ch05-1', title: '교시 제목', minutes: 50,
  goals: ['...'], flow: [['도입', 5], ['개념', 15], ['실습', 20], ['정리', 10]],   // 합계 = minutes
  content: [ /* 본문 블록 */ ], practice: [ /* 실습 */ ], quiz: [ /* 퀴즈 */ ], slides: [ /* 슬라이드 8~14장 */ ] }
```
section id 는 `<차시id>-<번호>` 이며 한 번 정하면 바꾸지 않습니다 (학습 진도가 id 에 저장됨).

## 2. 본문 블록 (`content`)

| type | 필드 | 설명 |
|---|---|---|
| `h` | `text` | 소제목 |
| `p` | `html` | 문단 |
| `list` | `items`, `ordered?` | 목록 |
| `table` | `head`, `rows`, `caption?` | 표 |
| `figure` | `html`(인라인 SVG), `caption` | 그림 |
| `code` | `title`, `code`, `desc?`, `expect?`, `stdin?`, `run?`, `nondeterministic?`, `expectError?` | **브라우저에서 실행되는 파이썬 예제**. 일부러 오류를 보여 주는 예제는 `expectError: true` |
| `callout` | `kind: tip/warn/info/more`, `title?`, `html` | 강조 상자 (`more` = 📘 더 알아보기) |
| `demo` | `title`, `desc?`, `html`, `init(root, MLB)` | 인터랙티브 캔버스 체험 |

어떤 블록이든 `teacher: true` 를 붙이면 **교사용 화면에만** 보입니다 (수업 준비 체크리스트, 오개념 지도 팁, 평가 루브릭, 실습 정답 해설 등 — 보통 마지막 교시 끝에 둡니다).

### 원칙: 이론 → 그림 → 코드
쉬운 비유 → 정확한 정의 → 그림(SVG) → (필요하면) 수식 → 실행 코드 → 결과 해석.
KaTeX 는 없습니다. 수식은 HTML(`<sub>`, `<sup>`, `Σ`, `√`, `ŷ`)로 씁니다.

## 3. 파이썬 코드 (가장 중요)

브라우저 파이썬(Pyodide, Python 3.14)에서 실행됩니다. **사용 가능:** 표준 라이브러리, numpy, pandas, matplotlib, scikit-learn, scipy, Pillow(PIL), `tkinter` · `turtle` · `pygame`(브라우저 호환 모듈). import 하면 자동으로 불러옵니다.
**사용 불가:** torch, tensorflow, 인터넷 URL 직접 읽기(`pd.read_csv(URL)` 등), 멀티프로세싱.
→ 브라우저에서 안 되는 코드는 `run: false` 코드 블록으로 보여 주고 title 에 "(로컬 PC 에서 실행)" 처럼 표기합니다.

- 각 코드는 **그대로 실행되는 완전한 프로그램** (앞 예제의 변수에 기대지 말 것 — 매번 데이터 만들기부터).
- 데이터는 코드 안에서 직접 만들거나(리스트 · `np.random.default_rng(42)` · 작은 DataFrame), 파일이 필요하면 `assets/` 에 넣고 `assets/manifest.json` 목록에 이름을 추가합니다 (실행 시 작업 폴더에 복사됨).
- `input()` 을 쓰는 예제는 `stdin` 에 입력값을 넣습니다 (예: `stdin: '홍길동\n17\n'`).
- **실행 시간:** 브라우저는 일반 파이썬보다 2~5배 느립니다. 예제 하나가 **5초 이내**가 되도록 데이터 크기 · 반복 수를 줄이세요.
- **그래프:** `plt.show()` 를 호출하면 오른쪽 결과 창에 그려집니다 (잊어도 끝에서 자동 표시). 한 예제에 그림 1~2개, `figsize` 는 (6,4) ~ (10,4).
  **한글 제목 · 축 이름을 써도 됩니다** — 브라우저에서 NanumGothic 이 자동 적용되고, `plt.rcParams['font.family'] = 'Malgun Gothic'` 같은 코드도 그대로 동작합니다. 음수 부호(−)도 정상 표시됩니다.
- **표:** `display(df.head())` 는 결과 창에 HTML 표로 그립니다. `print()` 도 됩니다.
- `random_state=42` / 고정 시드로 재현성. 결과가 고정되면 `expect` 에 실제 출력을 넣습니다 (그래프는 출력 텍스트에 영향 없음). 출력이 길면 생략 가능, 실행마다 달라지면 `nondeterministic: true`.
- JS 템플릿 문자열 안의 파이썬 코드: `${` 금지(파이썬 f-string 의 `{}` 는 괜찮음), 백틱 금지, **`\n` 은 `\\n` 으로** (print() 를 여러 번 쓰는 것이 안전).
- **실습(practice)** `{ title, level(1~3), desc, hint?, starter, solution, stdin? }` — `starter` 는 문법 오류 없이 실행되는 뼈대(# TODO 주석), `solution` 은 완전한 정답 (교사용에서만 보임). 섹션마다 1~3개.

## 4. 그림 (SVG)

- 인라인 SVG 는 다음 CSS 클래스를 사용합니다 (라이트/다크 자동 대응):
  `.p1~.p5`(채움) `.p1s~.p5s`(연한 채움) `.s1~.s5`(선) `.ln` `.ax` `.tx` `.tx-m` `.tx-b` `.tx-w` `.card-bg` `.fill-arrow`
- `<marker id>` 등 SVG 안의 id 는 **차시 접두어로 고유하게** (예: `c05a1`). 하나의 교시 문서 안에 같은 id 가 두 번 나오면 안 됩니다.
- 하드코딩 색 금지 (CSS 클래스 / `var(--f-p1)` 등 사용).

## 5. 체험 데모 (`demo`, 선택)

```js
const DEMO_HTML = `<canvas></canvas><div class="controls"><label>k <input type="range" min="1" max="9" value="3" data-k></label><span class="readout" data-out></span></div>`;
function demoInit(root, MLB) {
  const cv = root.querySelector('canvas');
  const { ctx, w, h } = MLB.setupCanvas(cv, 640, 340);   // 논리 크기 (가로:세로 ≈ 16:8.5)
  const P = () => MLB.palette();                          // 테마 색 {bg,line,text,muted,p1..p5,p1s..p5s}
  MLB.onTheme(draw, cv);                                  // 테마 전환 시 다시 그리기
  // 애니메이션: MLB.loop(cv, () => { ...; return 계속할지 })
}
```
- **`document.getElementById` · id 속성 금지** → `root.querySelector('[data-…]')` 만 사용. 전역 변수 · 외부 라이브러리 금지.
- 같은 데모를 content(`type:'demo'`)와 slides(`layout:'demo'`) 양쪽에 넣을 수 있습니다.

## 6. 퀴즈

`{ q: 'html', options: ['..','..','..','..'], answer: 0부터, explain: 'html' }` — 객관식만 지원합니다. q 안 코드는 `<pre><code>…</code></pre>` (`<` → `&lt;`).

## 7. 교사용 슬라이드 (`slides`) — PPT 화면

한 장 = 객체 하나, **모든 슬라이드에 `notes`**(교사 노트: 말할 내용, 💬 발문과 예상 답, 주의점, 시간). 섹션당 8~14장.
첫 장 뒤에 “학습 목표 + 수업 흐름” 슬라이드가 자동으로 들어갑니다.

| layout | 필드 |
|---|---|
| `title` | `title`, `subtitle?` — 섹션 첫 장 |
| `bullets` | `title`, `bullets: [html \| [html, [하위…]]]`, `lead?` — 불릿 3~6개 |
| `code` | `title`, `code`(18줄 이내, 실행 가능), `points?: [html 2~4개]` — 슬라이드에서 수정 · ▶ 실행 → 오른쪽 결과 창 |
| `two` | `title`, `left: {title, bullets?/html?/code?}`, `right: {...}` |
| `table` | `title`, `head`, `rows`, `lead?` |
| `diagram` | `title`, `html`(SVG), `caption?` |
| `demo` | `title`, `html`, `init`, `caption?` |
| `quiz` | `title`, `q`, `options`, `answer`, `explain` |
| `practice` | `title`, `desc`, `starter`, `solution` |
| `summary` | `title`, `bullets` — 섹션 마지막 장 |

권장 흐름: `title` → 개념(bullets/diagram) → 예제(code) → … → quiz → practice → summary.
교사용 화면이 없는 강좌라면 `slides` · `flow` · `notes` 는 생략합니다.

## 8. 검증 (필수)

```bash
node tools/validate.js ch05 --jobs 4        # 구조 + 모든 코드 실행(로컬 파이썬) + expect 비교
node tools/validate.js ch05 --print         # 실제 출력 보기 (expect 작성용)
node tools/validate.js ch05 --no-run        # 로컬 파이썬이 없으면 구조만 검사
```
오류 0 이 될 때까지 고치세요 (경고 “expect 없음”은 괜찮음). scikit-learn import 는 처음에 느릴 수 있습니다.
