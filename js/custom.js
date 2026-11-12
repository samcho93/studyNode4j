/* 강좌별 추가 기능 — lectureBuilder 가 엔진을 갱신해도 이 파일은 덮어쓰지 않습니다.
 * 쓸 수 있는 전역: PY_COURSE(강좌 데이터) · window.app(현재 역할 · 화면 · 경로)
 * 화면이 바뀔 때마다:
 *   document.addEventListener('lb:render', function (e) {
 *     // e.detail = app.route = { type: 'home' | 'chapter' | 'section', ch, sec }
 *   });
 */
