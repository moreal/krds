# FileUpload

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `file-upload`; Korean name 파일 업로드; export `FileUpload`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_09_04](https://www.krds.go.kr/html/site/component/component_09_04.html); preserved [HTML](../../upstream/krds/raw/components/component_09_04.html). Retrieved `2026-10-29T23:28:05.532Z`; `88760` bytes; SHA-256 `c498892258d66f642e54152aa6518c4520d58df848739038014bda505e180cb3`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `integration`. Recommend integration: L1005–1006 forbids automatic server upload/storage before form submission; L1012–1018 includes server-only failure states, while L1188–1189 mandates native file input.

Supported native cases (variant and state axes): `single`, `multiple`, `button`, `dropzone`, `pending`, `success`, `error`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Section label/title, optional description, explicit type/size/count constraints, real file-picker control, optional dropzone, count and file records (name/extension/size/status/remove). Single file uses p grouping; multiple ul/li. Remove button described by corresponding file text. Long filename one visual line with full accessible name.

## Plain semantic API

Choose a **controlled-only committed file set**: required `files: readonly FileRecord[]`, initially supplied explicitly as `[]`; there is no defaultFiles or uncontrolled nonempty/empty baseline. `FileRecord={id:string,file:File,status:staged|uploading|success|error,progress?:number,error?:string}` has a unique stable ID and the actual immutable File handle, not a pathname or renderer/machine object. Other props: multiple=false, accept?, maxFiles?, maxBytes?, disabled=false, name. A retained browser File is intentionally supported native file data; callbacks never carry a native Event object. Changing/removing files happens only when the host supplies the new files prop. Mount/hydration/prop/reset/reconciliation emits no user-change callback.

One accepted candidate selection/removal request calls only `onFilesChange({value:FileRecord[],reason:picker|drop|remove,addedIds:string[],removedIds:string[]})` once, carrying the **complete requested final set**. Remove uses this same event; there is no second onRemove request. Rejected validation candidates report once through separate `onFilesRejected({rejected:{file,code,message}[]})` and visible associated errors; this is validation feedback, not a changed-value notification. If no valid candidate changes the requested set, emit no onFilesChange. A controlled host may decline a valid request; display, count, actual submitted set and retained previews remain based on committed files, with no optimistic removal/addition leaking into FormData.

For multiple=true, picker selections and drops append valid candidates in supplied order after the current committed set; retain all existing files. Validate type/extension/size, then available count slots in order and report rejected excess without removing existing records. Distinct newly chosen File objects get new IDs, even when filenames/metadata coincide; no content-deduplication claim is made. The exact same already-committed File object is a no-op duplicate. For multiple=false, one valid candidate replaces the current set; a multi-file drop is rejected as a whole with count guidance rather than silently choosing one. Invalid or canceled selection never clears the prior set. accept remains a picker hint; no fabricated password/virus checking or transfer on selection.

## Keyboard, focus and state transitions

Native picker owns OS keyboard navigation and opens only from a real user action. Dropzone includes the click/keyboard picker equivalent. Snapshot chosen File objects, then clear only the ephemeral native chooser value so the same file can be chosen again; that chooser is not the committed file store. Cancel emits neither files-change nor rejection and preserves committed records. Remove requests the final set once; **after actual accepted removal**, restore focus to prior remaining removal control, else next, else picker. Rejected removal keeps its record/control/focus. Keep the input and picker stable during native list updates. Addition does not start host transfer; pending/success/error records come from explicit Submit-driven host state.

## Responsive/mobile requirements

No multi-file modal layout; narrow list remains readable, count visible, drag hint does not exclude touch users. Pending/success/error icons plus text; selection control remains available after successful addition unless host disables input.

## Forms, reset and composition

The real native file input remains required as the user picker, but its ephemeral FileList does not represent an accumulated picker+drop store. Never set a nonempty input.value or claim that native FormData automatically contains the committed array. The host submission driver must remove this field's ephemeral chooser entries and append exactly the **current committed enabled** records as `FormData.append(name,record.file,record.file.name)` on explicit Submit (disabled uploader contributes none). Host required/count validation likewise reads committed records rather than an empty chooser. A picker A → drop B → accepted remove A → Submit must send only B; rejected additions/removals must not change that result.

Canceled native reset is a no-op for chooser, committed records, errors and previews. Noncanceled reset clears the chooser and transient drag/validation state but, as this API is controlled-only, retains the current files prop and the same submitted set, with zero files-change/removal notifications. A host that wants a form reset to clear committed files explicitly sets files=[] from its own noncanceled reset policy; that prop update emits no component callback. Do not imply an uncontrolled reset baseline. Revoke component-owned object URLs only when their committed records are actually removed/replaced or on unmount; a native reset must not revoke a preview still needed by retained controlled files. No server transfer/storage before explicit Submit.

## Asset, integration and composition completion

Accepted project component→integration completion: mandatory native picker/staging UI connects to an explicit host FormData/transfer driver. The official continued-addition/native-input/no-transfer-before-Submit guidance ([L989–1006](../../upstream/krds/raw/components/component_09_04.html:989), [L1188–1189](../../upstream/krds/raw/components/component_09_04.html:1188)) remains binding; drop wording “start upload” is interpreted as staging against the explicit Submit boundary, not silently executed as a network transfer. Completion requires a controlled local store that actually accepts/declines final-set requests, picker+drop accumulation/replacement, submitted-file inspection, reset policy, deterministic Submit-triggered mock progress/failure/removal and preview cleanup. Merely emitting logs or wrapping input type=file is insufficient.

## Stable parts and states

root, label, description, help, picker, file-input, dropzone, count, list, item, filename, size, status, progress, remove, error; staged,drag-over,uploading,success,error,disabled.

All rendered owned parts use `data-krds-component="file-upload"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Cancel keeps prior files without callback.
2. Same file can be selected after removal.
3. Drop has keyboard picker equivalent.
4. Constraints produce file-specific errors.
5. No network/transfer before explicit Submit.
6. Rendered and submitted files always reflect the committed set after accepted or rejected removal and the declared controlled reset policy.
7. Pending/success/error mock shows correct labels and cleans object URLs.
8. Controlled multiple picker A then drop B appends both, accepted remove A then Submit sends only committed B as an actual File.
9. Controlled rejected addition or removal leaves rendered count, focus and exact submitted File set unchanged.
10. Single-file replacement, invalid candidate and multi-file-drop rejection preserve the specified final-set policy.
11. Canceled reset is entirely inert; ordinary controlled reset retains records unless the host explicitly changes files, with zero files-change callbacks.
12. Each changed final-set request emits one onFilesChange and no duplicate onRemove, while validation feedback is separate.
13. Chooser clearing allows same-file reselection without clearing the committed store or revoking retained preview URLs.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`file-upload--single`, `file-upload--multiple`, `file-upload--button`, `file-upload--dropzone`, `file-upload--cancel-reselect`, `file-upload--constraints-error`, `file-upload--submit-mock-progress`, `file-upload--failure-retry`, `file-upload--form-reset`, `file-upload--picker-drop-remove-submit`, `file-upload--controlled-add-rejected`, `file-upload--controlled-remove-rejected`, `file-upload--single-replacement`, `file-upload--controlled-reset-retained`, `file-upload--host-reset-clear`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_09_04.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_09_04.html:889): 1. 레이블/제목 파일 업로드 섹션을 설명하는 텍스트로 파일 용도 등 업로드 맥락을 제공함
- L[890–890](../../upstream/krds/raw/components/component_09_04.html:890): 2. 설명(선택) 헤딩의 정보를 보완하는 텍스트 설명
- L[891–891](../../upstream/krds/raw/components/component_09_04.html:891): 3. 도움말 텍스트 업로드 프로세스 또는 요구 사항을 설명하고 파일 형식 및 크기에 대한 가이드라인을 제공
- L[892–892](../../upstream/krds/raw/components/component_09_04.html:892): 4. 파일 선택 버튼 업로드할 파일을 선택하는 파일 선택기를 실행하는 버튼
- L[893–893](../../upstream/krds/raw/components/component_09_04.html:893): 5. 드롭 영역 업로드할 파일을 끌어다 놓는 영역
- L[894–894](../../upstream/krds/raw/components/component_09_04.html:894): 6. 카운터 업로드 가능한 전체 파일 수와 업로드된 파일 수를 보여줌
- L[895–895](../../upstream/krds/raw/components/component_09_04.html:895): 7. 파일 항목 업로드가 진행 중이거나 완료된 파일의 이름, 확장자, 크기를 보여줌
- L[896–896](../../upstream/krds/raw/components/component_09_04.html:896): 8. 삭제 버튼 업로드된 파일을 제거하는 아이콘 버튼
- L[900–900](../../upstream/krds/raw/components/component_09_04.html:900): a. 업로드 중 파일이 업로드 중일 때 스피너 아이콘을 표시함
- L[901–901](../../upstream/krds/raw/components/component_09_04.html:901): b. 성공 문제없이 파일이 업로드되었음을 안내하는 아이콘. 성공 상태인 경우에 표시되었다 삭제 버튼으로 전환됨
- L[897–903](../../upstream/krds/raw/components/component_09_04.html:897): 9. 업로드 상태 아이콘 a. 업로드 중 파일이 업로드 중일 때 스피너 아이콘을 표시함 b. 성공 문제없이 파일이 업로드되었음을 안내하는 아이콘. 성공 상태인 경우에 표시되었다 삭제 버튼으로 전환됨

### 유형

- L[911–911](../../upstream/krds/raw/components/component_09_04.html:911): 유형
- L[913–913](../../upstream/krds/raw/components/component_09_04.html:913): 업로드 가능 파일 수
- L[916–916](../../upstream/krds/raw/components/component_09_04.html:916): 1개 파일의 업로드만 필요하거나 서로 관련이 없는 여러 개의 파일을 업로드해야 할 경우에 사용한다. 서로 관련 없는 파일은 섹션을 명확하게 구분하고 각 파일에 대해 개별적인 파일 업로드 컴포넌트를 제공하는 것이 적절하다.
- L[920–920](../../upstream/krds/raw/components/component_09_04.html:920): 한 번에 업로드할 파일을 여러 개 선택할 수 있도록 허용하는 경우에 사용한다. 모든 파일이 서로 관련되어 있는 경우(예- 사진첩에서 여러 개의 사진을 선택하여 업로드)에 사용하기 적합하다.
- L[924–924](../../upstream/krds/raw/components/component_09_04.html:924): 업로드 수단
- L[927–927](../../upstream/krds/raw/components/component_09_04.html:927): 파일 선택 대화 상자를 표시하는 작업 버튼을 클릭하여 하나 이상의 파일을 업로드할 수 있다.
- L[931–931](../../upstream/krds/raw/components/component_09_04.html:931): 선택한 파일을 드롭 영역에 직접 끌어다 놓거나 드롭 영역 내부의 텍스트 링크를 클릭하여 파일 선택 대화 상자를 통해 파일을 업로드할 수 있다.

### 용례

- L[939–939](../../upstream/krds/raw/components/component_09_04.html:939): 용례
- L[941–941](../../upstream/krds/raw/components/component_09_04.html:941): 사용하기 적합하지 않은 경우
- L[946–946](../../upstream/krds/raw/components/component_09_04.html:946): 업로드된 파일 목록이 수직으로 쌓이기 때문에 여러 파일을 업로드할 때는 모달 레이아웃을 사용하지 않는다.
- L[943–948](../../upstream/krds/raw/components/component_09_04.html:943): 모달 레이아웃에서의 다중 파일 업로드 업로드된 파일 목록이 수직으로 쌓이기 때문에 여러 파일을 업로드할 때는 모달 레이아웃을 사용하지 않는다.

### 사용성 가이드라인

- L[956–956](../../upstream/krds/raw/components/component_09_04.html:956): 사용성 가이드라인
- L[959–959](../../upstream/krds/raw/components/component_09_04.html:959): 파일 업로드는 필요한 경우에만 사용한다.
- L[960–960](../../upstream/krds/raw/components/component_09_04.html:960): 파일 업로드는 파일의 탐색과 선택이라는 복잡한 과업을 사용자에게 요구한다. 파일 업로드 컴포넌트를 사용하기 전에 파일의 첨부가 꼭 필요한지 확인하여 사용자에게 불필요한 입력을 요청하지 않아야 한다.
- L[963–963](../../upstream/krds/raw/components/component_09_04.html:963): 레이블을 제공한다.
- L[964–964](../../upstream/krds/raw/components/component_09_04.html:964): 파일 업로더에 명확한 레이블을 제공하여 사용자가 파일의 제출 용도와 정확히 어떤 파일을 업로드해야 하는지 명확하게 알 수 있도록 한다.
- L[967–967](../../upstream/krds/raw/components/component_09_04.html:967): 파일 유형, 파일 크기, 파일 개수 제한에 대해 안내한다.
- L[968–968](../../upstream/krds/raw/components/component_09_04.html:968): 업로드 가능한 문서 유형, 파일 크기, 파일 개수에 제한이 있는 경우 도움말 텍스트를 사용하여 제약 사항에 대한 정보를 강조하여 표시한다. 이를 통해 사용자가 잘못된 형식의 파일을 업로드하거나 너무 큰 파일을 업로드하여 오류가 발생하는 것을 방지할 수 있다.
- L[975–975](../../upstream/krds/raw/components/component_09_04.html:975): 가능한 한 파일 형식을 제한하지 않는다.
- L[976–977](../../upstream/krds/raw/components/component_09_04.html:976): 제출을 요구하는 파일의 일반적인 형식을 확인하여 사용자가 다양한 파일 형식을 업로드할 수 있도록 한다. 모든 사람이 동일한 소프트웨어에 접근할 수 있는 것이 아니므로 불필요한 소프트웨어 설치 요구 등을 피하기 위해 업로드 파일 형식을 유연하게 구성해야 한다. 이때, 파일의 확장자에도 부적절한 제한이 발생하지 않도록 한다(예 - JPEG 형식의 파일에 대해 .jpg, .jpeg, .jpe 등의 확장자를 허용함).
- L[980–980](../../upstream/krds/raw/components/component_09_04.html:980): 가능한 한 파일 크기를 제한하지 않는다.
- L[981–982](../../upstream/krds/raw/components/component_09_04.html:981): 만약 업로드 가능한 파일 크기를 제한해야 한다면 제출을 요구하는 파일의 일반적인 크기를 확인하여 사용자가 원활하게 파일을 업로드할 수 있도록 해야 한다. 어떤 사용자는 파일의 크기를 줄이는 방법을 알지 못할 수 있으며, 파일 크기를 원하는 수준으로 줄이기 위해서는 다른 도구를 사용해야 한다.
- L[985–985](../../upstream/krds/raw/components/component_09_04.html:985): 이미지 유형의 파일에 대해 파일 크기 자동 압축 기능을 제공한다.
- L[986–986](../../upstream/krds/raw/components/component_09_04.html:986): 이미지를 원하는 크기와 품질로 줄이는 과정에는 여러 번의 테스트가 필요하다. 만약 사용자의 이미지 파일 제출이 필요하고 용량을 제한해야 한다면 파일 크기를 필요한 수준으로 압축하는 기능을 제공하는 방안을 고려한다.
- L[989–989](../../upstream/krds/raw/components/component_09_04.html:989): 파일이 업로드된 후에도 파일 선택 버튼을 기본 상태로 유지한다.
- L[990–990](../../upstream/krds/raw/components/component_09_04.html:990): 사용자가 파일을 선택한 후에도 새 파일을 추가하거나 변경할 수 있도록 파일 선택 버튼 또는 드롭 영역을 사용 가능한 기본 상태로 유지한다. 파일 업로드의 사용 불가 상태는 사용자의 입력 행위 자체를 제한할 때에 사용한다.
- L[993–993](../../upstream/krds/raw/components/component_09_04.html:993): 파일 선택 버튼을 적절한 강조 수준으로 표현한다.
- L[994–994](../../upstream/krds/raw/components/component_09_04.html:994): 페이지에 입력폼 제출 버튼과 같은 최상위 수준의 버튼이 존재하는 경우에는 하위 위계 수준의 버튼 강조 표현을 사용하여 핵심 작업과 파일 업로드 작업이 충돌하지 않도록 한다.
- L[1005–1005](../../upstream/krds/raw/components/component_09_04.html:1005): 파일을 자동으로 제출하지 않는다.
- L[1006–1006](../../upstream/krds/raw/components/component_09_04.html:1006): 사용자가 입력폼을 제출할 때까지 파일을 서버에 업로드하거나 저장해서는 안 된다.
- L[1009–1009](../../upstream/krds/raw/components/component_09_04.html:1009): 오류 상태에 대한 구체적인 오류 메시지를 제공한다.
- L[1010–1010](../../upstream/krds/raw/components/component_09_04.html:1010): 사용자가 어떤 종류의 오류가 발생했는지 명확히 이해할 수 있도록 구체적인 오류 메시지를 제공한다. 파일 업로드에 제공할 수 있는 오류 메시지는 다음과 같다. 기타 항목은 파일 업로더의 능력에 따라 선택적으로 제공할 수 있는 오류 상태이다.
- L[1012–1012](../../upstream/krds/raw/components/component_09_04.html:1012): 선택한 파일이 없는 경우
- L[1013–1013](../../upstream/krds/raw/components/component_09_04.html:1013): 잘못된 파일 형식인 경우
- L[1014–1014](../../upstream/krds/raw/components/component_09_04.html:1014): 파일이 너무 큰 경우
- L[1015–1015](../../upstream/krds/raw/components/component_09_04.html:1015): 파일이 비어있는 경우
- L[1016–1016](../../upstream/krds/raw/components/component_09_04.html:1016): 문제가 발생하여 파일이 업로드되지 않은 경우
- L[1017–1017](../../upstream/krds/raw/components/component_09_04.html:1017): 사용자가 선택할 수 있는 파일 수에 제한이 있는 경우
- L[1018–1018](../../upstream/krds/raw/components/component_09_04.html:1018): 기타: 파일이 비밀번호로 보호되어 있는 경우, 파일에 바이러스가 포함된 경우 등
- L[1022–1022](../../upstream/krds/raw/components/component_09_04.html:1022): 업로드된 파일 이름 텍스트를 두 줄로 제공하지 않는다.
- L[1023–1023](../../upstream/krds/raw/components/component_09_04.html:1023): 파일 이름이 길어 텍스트가 파일 항목 컨테이너를 벗어나는 경우 말줄임표를 사용한다.

### 접근성 가이드라인

- L[1138–1138](../../upstream/krds/raw/components/component_09_04.html:1138): 접근성 가이드라인
- L[1141–1141](../../upstream/krds/raw/components/component_09_04.html:1141): 파일 업로드에 적절한 레이블을 제공한다.
- L[1142–1142](../../upstream/krds/raw/components/component_09_04.html:1142): 업로드가 필요한 파일의 용도를 이해할 수 있는 적절한 설명을 제공해야 한다.
- L[1149–1149](../../upstream/krds/raw/components/component_09_04.html:1149): 파일 항목과 항목 삭제 버튼을 하나의 그룹으로 제공한다.
- L[1150–1151](../../upstream/krds/raw/components/component_09_04.html:1150): 사용자가 여러 개의 파일을 업로드하는 경우, 스크린 리더 사용자는 연속된 파일명과 파일 삭제 버튼 요소 간 관계를 인지하기 어려워진다. 단일 파일 업로드 형식에서는 항목을 &lt;p&gt;로, 다중 파일 업로드 형식에서는 &lt;ul&gt;, &lt;li&gt; 구조로 파일 항목과 삭제 버튼을 그룹화한다. 그런 다음 파일 항목 텍스트와 항목 삭제 버튼을 aria-describedby 속성으로 연결하여 두 요소 간 컨트롤 관계가 보다 명확하게 스크린 리더로 전달될 수 있도록 한다.
- L[1158–1158](../../upstream/krds/raw/components/component_09_04.html:1158): 키보드 초점을 명확하게 표시한다.
- L[1159–1159](../../upstream/krds/raw/components/component_09_04.html:1159): 파일 선택 버튼이 초점을 가진 상태에서 포커스링이 시각적으로 명확하게 표시되어야 한다.
- L[1167–1167](../../upstream/krds/raw/components/component_09_04.html:1167): 드래그 앤 드롭 유형은 반드시 파일 업로더와 함께 사용한다.
- L[1168–1168](../../upstream/krds/raw/components/component_09_04.html:1168): 경로 기반 동작을 수행할 수 없는 사용자 입력 인터페이스를 이용하는 사용자, 정교한 마우스 컨트롤이 어려운 사용자를 고려하여 단순 마우스 Click과 키보드 Enter 동작만으로도 파일을 업로드할 수 있게 해야 한다.
- L[1188–1188](../../upstream/krds/raw/components/component_09_04.html:1188): 스크린 리더로 접근할 수 있도록 한다.
- L[1189–1189](../../upstream/krds/raw/components/component_09_04.html:1189): 파일 업로드 컴포넌트의 역할이 스크린 리더로 전달될 수 있도록 시각적으로 숨겨진 &lt;input type="file"&gt;에 적절한 숨김 스타일을 사용해야 한다.

### 상호작용 가이드라인

- L[1200–1200](../../upstream/krds/raw/components/component_09_04.html:1200): 상호작용 가이드라인
- L[1202–1202](../../upstream/krds/raw/components/component_09_04.html:1202): 탐색
- L[1220–1223](../../upstream/krds/raw/components/component_09_04.html:1220): Tab 파일 선택 버튼/드롭 영역, 파일 삭제 버튼에 접근할 수 있다.
- L[1224–1227](../../upstream/krds/raw/components/component_09_04.html:1224): 방향키 ↑, ↓ 파일 선택기가 활성화되었을 때 키보드의 방향키 ↑, ↓을 눌러 파일을 탐색할 수 있다.
- L[1235–1235](../../upstream/krds/raw/components/component_09_04.html:1235): 파일 업로드
- L[1253–1256](../../upstream/krds/raw/components/component_09_04.html:1253): Click 파일 선택기가 활성화된 상태에서 파일을 선택하고 '열기' 버튼을 Click 하면 파일 선택을 완료할 수 있다.
- L[1257–1260](../../upstream/krds/raw/components/component_09_04.html:1257): Space, Enter 파일 선택기가 활성화되었을 때 업로드할 파일 및 '열기' 버튼에 초점을 가진 상태에서 Space 또는 Enter 키를 눌러 파일 선택을 완료할 수 있다.
- L[1261–1264](../../upstream/krds/raw/components/component_09_04.html:1261): Drag & Drop 파일이 첨부된 드롭 영역의 범위 내에서 마우스를 아무 곳으로나 Drag 하면 해당 영역 안에 파일을 Drop 하고 업로드를 시작할 수 있다.
- L[1271–1271](../../upstream/krds/raw/components/component_09_04.html:1271): 파일 삭제
- L[1289–1292](../../upstream/krds/raw/components/component_09_04.html:1289): Click 삭제 버튼을 Click 하면 파일이 삭제된다.
- L[1293–1296](../../upstream/krds/raw/components/component_09_04.html:1293): Space, Enter 삭제 버튼이 초점을 가진 상태에서 Space 또는 Enter 키를 누르면 파일이 삭제된다.

### 예시

- L[1315–1315](../../upstream/krds/raw/components/component_09_04.html:1315): 예시
- L[1319–1319](../../upstream/krds/raw/components/component_09_04.html:1319): 기본
- L[1330–1330](../../upstream/krds/raw/components/component_09_04.html:1330): 타이틀영역
- L[1417–1417](../../upstream/krds/raw/components/component_09_04.html:1417): 기본 코드 확인하기

### 마크업 가이드

- L[1437–1437](../../upstream/krds/raw/components/component_09_04.html:1437): 마크업 가이드
- L[1440–1440](../../upstream/krds/raw/components/component_09_04.html:1440): CSS 선택자
- L[1457–1460](../../upstream/krds/raw/components/component_09_04.html:1457): 전체영역 .krds-file-upload
- L[1461–1464](../../upstream/krds/raw/components/component_09_04.html:1461): 파일 업로드 영역 .file-upload
- L[1465–1468](../../upstream/krds/raw/components/component_09_04.html:1465): 업로드 된 파일 리스트 영역 .file-list

Inline preserved example markup (reference, not the public native API): L[1324–1411](../../upstream/krds/raw/components/component_09_04.html:1324)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Concrete controlled-only final-set, accumulation, reset and host FormData policies are independent project choices. Official drop-immediate wording still conflicts with explicit no-transfer-before-Submit; this draft preserves the latter and retains exact evidence. No native FileList synchronization is assumed.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1422 `../../code/file_upload.html`, L1483 `./variable/file_upload.html`. Do not infer unseen contents.
- 8 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `FileUploadContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
