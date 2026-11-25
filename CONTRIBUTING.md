# 기여하기

이 문서는 저장소에서 패키지, 문서 사이트, 테스트를 다루는 방법입니다. 패키지를 앱에서 쓰는 방법은 [설치하기](https://moreal.github.io/krds/getting-started/installation.html)에 있습니다.

## 도구

Node 24.18.0과 Yarn 4.14.1을 씁니다. Yarn은 저장소에 들어 있으므로 따로 설치하지 않습니다. 정확한 버전은 `compatibility/toolchain.json`에 있습니다.

```sh
node tools/yarn.mjs --version
node tools/yarn.mjs install --immutable
```

`node tools/yarn.mjs`는 지정된 Node로 저장소의 Yarn을 실행하고 전역 도구는 바꾸지 않습니다. 설치는 Yarn으로만 합니다. lockfile은 `yarn.lock` 하나입니다. `.yarnrc.yml`의 `nodeLinker: pnpm`은 Yarn이 패키지를 연결하는 방식일 뿐이므로 `pnpm install`은 쓰지 않습니다.

## 패키지 빌드

```sh
node tools/yarn.mjs nx run krds-react:build
node tools/yarn.mjs build
```

첫 줄은 패키지 하나를, 둘째 줄은 모든 워크스페이스를 빌드합니다. Nx가 공유 패키지 `contracts`, `tokens`, `styles`를 먼저 빌드합니다. 결과물은 각 워크스페이스의 `dist/`에 생깁니다.

## 문서 사이트

```sh
node tools/yarn.mjs nx run krds-docs:build
node tools/yarn.mjs workspace @unofficial-krds/docs typecheck
node tools/yarn.mjs workspace @unofficial-krds/docs test
node tools/yarn.mjs exec node apps/docs/scripts/serve.mjs
```

서버가 뜨면 `http://127.0.0.1:49100/krds/`를 엽니다. 하위 페이지는 `.html` 주소를 쓰므로 주소로 바로 들어가거나 새로고침해도 됩니다.

문서 원본은 `docs/getting-started/`, `docs/legal/`, `docs/patterns/`와 `catalog/component-guides/`에 있습니다. `apps/docs/scripts/generate.mjs`가 이 원본으로 사이트 페이지와 `docs/components/`, `docs/compatibility/README.md`를 만듭니다. 만들어진 파일은 직접 고치지 않습니다.

예제 앱과 Storybook은 공개 사이트에 올리지 않습니다. 각각 빌드한 뒤 로컬 서버의 `/krds/native/fixture-vue/`, `/krds/native/storybook-vue/` 같은 경로에서 봅니다. 빌드하지 않은 경로는 404로 표시됩니다.

`main`에 push하거나 수동으로 실행하면 [Docs Pages workflow](.github/workflows/docs-pages.yml)가 문서를 빌드하고 검사한 뒤 GitHub Pages에 배포합니다. 이 workflow는 npm 패키지를 게시하거나 태그를 만들지 않습니다.

## 테스트

테스트는 세 가지이고 각각 확인하는 것이 다릅니다. 소스 파일도 따로 둡니다.

| 테스트 | 목적 | 소스와 명령 |
| --- | --- | --- |
| 네이티브 Storybook | 컴포넌트의 상태, args, 입력, 콘텐츠를 눈으로 보고 시각·접근성 결과 확인 | `apps/storybook-<framework>/`, `node tools/yarn.mjs test:stories --framework react` |
| 네이티브 siheom | 사용자가 관찰할 수 있는 컴포넌트 동작 확인 | 예제 앱의 `tests/siheom/`, `node tools/yarn.mjs test:siheom --framework react` |
| Playwright 프로덕션 앱 | 빌드한 앱에서 초점, 폼 제출, 네트워크 요청, 프레임워크별 경계 확인 | 예제 앱과 `tools/run-contract-tests.mjs`, `node tools/yarn.mjs test:contract --framework react` |

명령의 `react` 자리에 다른 프레임워크 이름을 넣습니다. 해당 프레임워크가 그 테스트를 지원할 때만 실행됩니다. Lit과 Solid 2에는 지원되는 upstream siheom 어댑터가 없으므로 두 프레임워크는 Playwright 브라우저 테스트를 씁니다.

### 스토리는 결정적으로

스토리는 언제 실행해도 같은 화면이 나와야 합니다.

- 상태는 로컬 args, inputs, slots, snippets와 고정 데이터로 만듭니다.
- API, 인증, CDN, 외부 글꼴, 외부 이미지를 쓰지 않습니다.
- 공유 데이터는 상태와 기대값만 담습니다. 다른 프레임워크의 컴포넌트로 렌더링하지 않습니다.
- 여러 단계에 걸친 동작 테스트는 Storybook `play`에 넣지 않고 별도 파일에 씁니다.

테스트가 하나도 없는 동작 스위트는 실패로 처리합니다.

### 결과 읽기

러너의 종료 코드만 보지 않습니다. 실제 assertion 수, axe 위반 목록, 브라우저 오류, 네트워크 요청 결과를 확인합니다. 러너가 0으로 끝나도 axe 위반이 남아 있을 수 있습니다.

컴파일이 된다고 키보드 동작, 스크린 리더 출력, 터치 동작, 강제 색상 모드와 확대, 언마운트 뒤 정리가 확인되지는 않습니다. 따로 테스트합니다.

Storybook만으로 확인할 수 없는 것도 있습니다.

- **Qwik**: Storybook은 클라이언트에서 렌더링합니다. 프로덕션 SSR, resume, 첫 이벤트는 빌드한 서버 앱에서 확인합니다.
- **Angular**: APF 패키지 사용과 `ControlValueAccessor` 폼, 리셋은 실제 Angular 앱에서 확인합니다.
- **Lit**: light DOM에서 보이는 모습과 Shadow DOM의 접근 가능한 이름, 폼 연관은 별개입니다.

로컬에서 브라우저 테스트를 실행하려면 `PLAYWRIGHT_BROWSERS_PATH`를 Playwright 1.64.1 브라우저가 설치된 경로로 지정하거나, 먼저 기본 위치에 설치합니다.

### 병렬 네이티브 CI

CI는 프레임워크별로 나누어 병렬로 실행합니다.

1. `select-and-check`가 변경의 영향 범위를 한 번 정합니다.
2. 프레임워크 워커 7개, 공유 검사, 문서, Solid 2 미리보기가 각자 새 체크아웃에서 실행됩니다.
3. `native-ci-result`가 결과를 모읍니다. 선택된 대상이 모두 통과해야 성공입니다.

영향이 없어 실행하지 않은 레인은 `not-selected`로 기록됩니다. 결과가 빠졌거나, 건너뛰었거나, 취소된 레인이 있으면 전체가 실패합니다.

실패 원인은 워커 아티팩트에서 찾습니다. 각 워커는 `native-worker-<worker>-<run>-<attempt>` 아티팩트를 올리고 14일 동안 보관합니다. 안에는 로그, 캐시 보고서, 동작 테스트 결과가 있습니다. Lit 테스트는 10분 제한이 있고, 시간을 넘기면 진단 정보를 남기고 실패합니다.
