# 버전 적용 후 네이티브 컴파일러 체크포인트 {#native-compiler-checkpoints-after-version-application}

보존된 파일은 Nx가 안정 `0.1.0` 버전을 적용한 뒤 기록한 원본 성공 명령 기록, stdout, stderr, 패키지 출력 인벤토리입니다. 각 프레임워크의 `proof.json`은 공개 예시를 빌드된 패키지 및 컴파일러 명령에 묶습니다. Angular는 소비한 부분 APF 아카이브도 보존합니다. Angular 샌드박스 진단 실패 2건은 세션 아카이브에 남아 있습니다. 성공한 명령은 샌드박스 밖에서 빌드 워커 1개로 실행했습니다.

이 기록은 로컬 컴파일러 체크포인트입니다. 현재 릴리스, 네이티브 동작, SSR, 하이드레이션, Qwik resume, 수동 또는 호스팅 CI 인수를 입증하지 않습니다. proof에 기록된 소스 체크포인트는 메타데이터 커밋보다 앞섭니다.

깨끗한 체크아웃에서 `compatibility/toolchain.json`이 선택한 정확한 Node와 vendored Yarn을 사용합니다. 기존 생산자를 순서대로 실행합니다.

```sh
node tools/yarn.mjs workspace @unofficial-krds/contracts build:local
node tools/yarn.mjs workspace @unofficial-krds/tokens build:local
node tools/yarn.mjs workspace @unofficial-krds/styles build:local
node tools/yarn.mjs workspace @unofficial-krds/assets build:local
node tools/yarn.mjs workspace @unofficial-krds/fonts build:local
```

`react`, `solid`, `svelte`, `vue`, `lit`, `qwik`, `angular` 각각에 대해
`node tools/yarn.mjs workspace @unofficial-krds/<framework> build:local`을 실행합니다.
Angular에는 `NG_BUILD_MAX_WORKERS=1`을 사용합니다. 그다음 컴파일러 명령을 실행합니다.

```sh
node tools/yarn.mjs workspace @unofficial-krds/react exec tsc -p examples/tsconfig.json
node tools/yarn.mjs workspace @unofficial-krds/fixture-solid typecheck
node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck
node tools/yarn.mjs workspace @unofficial-krds/fixture-vue typecheck
node tools/yarn.mjs workspace @unofficial-krds/fixture-lit typecheck
node tools/yarn.mjs workspace @unofficial-krds/fixture-qwik exec tsc -p tsconfig.examples.json --noEmit
NG_BUILD_MAX_WORKERS=1 node tools/yarn.mjs workspace @unofficial-krds/fixture-angular build:local
```

나머지 픽스처 6개에는 `node tools/yarn.mjs workspace @unofficial-krds/fixture-<framework>
build:local`을 실행합니다. 안정 프레임워크 7개 전체에는
`node tools/yarn.mjs workspace @unofficial-krds/storybook-<framework>
build:local`을 실행합니다.
`STORYBOOK_DISABLE_TELEMETRY=1`을 설정하고 Angular의 워커 제한을 유지합니다.

새 근거 디렉터리에 새 argv, 환경 변수 재정의, 종료 상태, stdout, stderr를 보관합니다. 소비한 패키지 출력, 설정, 소스 예시의 SHA-256과 바이트 수를 기록합니다. 기존 proof 바이트는 보존합니다. 타임스탬프와 빌드 시간 로그는 관찰값이므로 바이트 단위로 재현될 필요가 없습니다. 새 체크포인트를 만들려면 `apps/docs/example-evidence.json`의 소스 해시, proof 경로/해시, Angular의 소비 아카이브 바인딩을 명시적으로 갱신해야 합니다. `checkpointOnly: true`와 `currentCandidate: false`를 유지합니다. 기존 생성기가 이 등록을 검증합니다.

생산자 출력을 고정한 상태에서 실제 사이트를 생성하고 검증합니다.

```sh
node tools/yarn.mjs workspace @unofficial-krds/docs build:local
node tools/yarn.mjs workspace @unofficial-krds/docs typecheck
node tools/yarn.mjs workspace @unofficial-krds/docs test
```

문서 스냅샷이 바뀌면 최종 메타데이터 커밋 전에 기존의 명시적 법적/출처 기록 재바인딩이 필요합니다. 나중에 네이티브 입력을 다시 빌드하면 엄격한 문서 최신성 검사가 무효가 될 수 있습니다. 추적되는 과거 아티팩트 체크포인트는 계속 과거 기록이며 변경 가능한 현재 패키지 아티팩트와 독립적입니다.
