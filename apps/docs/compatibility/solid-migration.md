# Solid 1 → Solid 2 {#solid-1-→-solid-2}

Solid 2는 `2.0.0-rc.19` 런타임, 렌더러, 컴파일러로 고정한 격리된 미리보기입니다. 안정 Solid 1 어댑터의 피어 범위를 넓힌 것이 아닙니다. `@unofficial-krds/solid-next`는 자기 매니페스트 도구 체인과 미리보기 픽스처에서만 씁니다. `solid-js` 세대를 섞지 않습니다. Solid 2 렌더러에 `solid-js/web`을 import하지 않습니다. 모든 런타임을 저장소 루트에서 해석하지 않습니다.

먼저 의미 데이터, 제어(controlled) 값, 콜백 페이로드, CSS 토큰을 옮깁니다. 그다음 선택된 Solid 2 선언과 컴파일러에 맞춰 네이티브 콘텐츠·ref·생명주기 사용을 옮깁니다. Solid 1 JSX 예제가 자동으로 Solid 2 예제가 되지는 않습니다.

미리보기에는 지원되는 upstream siheom이나 안정 네이티브 Storybook 통합이 없습니다. 네이티브 미리보기 빌드, SSR, 브라우저 근거는 따로 기록합니다. [버전과 상태](./) · [네이티브 소스 예제](./examples#solid-next).
