# Solid 1 → Solid 2 {#solid-1-→-solid-2}

Solid 2 지원은 미리보기 단계입니다. `@unofficial-krds/solid-next`는 Solid `2.0.0-rc.19`에 맞춘 별도 패키지이고, 아직 일부 컴포넌트만 제공합니다. Solid 1용 `@unofficial-krds/solid`와 한 앱에서 섞어 쓸 수 없습니다.

옮길 때는 이 순서를 권합니다.

1. 의존성을 Solid 2의 `solid-js`와 `@solidjs/web`으로 바꾸고, 컴포넌트 패키지를 `@unofficial-krds/solid-next`로 교체합니다.
2. `solid-js/web`을 import하던 코드는 `@solidjs/web`으로 바꿉니다.
3. 속성 이름, 제어 값, 콜백이 받는 값, CSS 토큰은 그대로 씁니다.
4. 콘텐츠 전달, ref, 생명주기 코드는 Solid 2 문법에 맞게 고칩니다. Solid 1용 JSX 예제가 그대로 동작하지는 않습니다.

Solid 2용 Storybook 통합은 아직 없습니다.

[프레임워크 호환성](./)
