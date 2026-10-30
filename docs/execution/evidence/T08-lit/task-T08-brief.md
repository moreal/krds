### T08. Lit 네이티브 파일럿과 폼 연결

**Files**

- Create: `packages/lit/src/controllers/zag-controller.ts`
- Create: `packages/lit/src/controllers/form-control-controller.ts`
- Create: `packages/lit/src/directives/machine-props.ts`
- Create: `packages/lit/src/components/<pilot>/`, `src/register.ts`, `src/index.ts`
- Modify: `apps/fixture-lit/src/`
- Create: `apps/storybook-lit/src/stories/`

**Interfaces**

- Consumes: `MachineBridge<P, A>`, Zag model, 공통 계약·스타일.
- Produces: LitElement 컴포넌트, 명시적 registration entry, DOM event 계약.

**Steps**

- [ ] prop 갱신, listener 교체·제거, disconnect/reconnect, 타이머 정리의 실패 테스트를 작성한다.
- [ ] 공식 Vanilla 어댑터를 활용해 service와 Lit 업데이트를 연결한다.
- [ ] parts·attrs·property·style·event를 전달하는 directive를 구현하고 이전 값 제거를 검증한다.
- [ ] form-associated 연결을 구현한다. name/value 전송, reset, disabled fieldset, required validity, restore의 결과를 테스트한다.
- [ ] 파일럿을 구현하고 Shadow DOM 안의 이름 연결·초점·Zag 조회·테마를 검증한다.
- [ ] 기본·focus-visible·disabled·오류·작은 viewport를 실제 Lit 렌더링으로 검토한다. Shadow DOM 안팎 및 Portal의 토큰 전달을 포함한다.
- [ ] NativeSelect의 시각적 컨트롤이 실제 native select인지 확인한다.
- [ ] native Web Components Storybook에 같은 상태 fixture를 구현하고 `yarn test:stories --framework lit`을 실행한다. siheom의 공식 Lit adapter가 없는 현재 상태를 기록하고 Playwright/native 검증을 생략하지 않는다.
- [ ] `yarn test:contract --framework lit`과 Lit build/typecheck를 실행한다.
- [ ] source import의 전역 부작용과 등록 충돌, 독립적인 원본 고지 보존을 리뷰한 뒤 커밋한다.

**Done when:** Lit 자체로 파일럿을 렌더링하며, 외부 폼과의 의미까지 네이티브 경로와 일치한다.

