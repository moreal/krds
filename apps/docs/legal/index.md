# 출처와 권리 {#sources-rights-and-redistribution}

Unofficial KRDS는 독립 구현입니다. 공식 KRDS도 정부 서비스도 아니며, 정부와 관계가 있다고 주장하지 않습니다. 패키지는 아직 npm에 게시하지 않았습니다.

이 프로젝트에는 세 가지 조건이 함께 있습니다. 직접 작성한 코드는 MIT 라이선스, KRDS에서 온 자료는 KRDS의 원래 조건, 글꼴은 SIL Open Font License 1.1을 따릅니다.

## 코드 {#independent-code}

이 저장소에서 직접 작성한 코드는 [MIT 라이선스](/sources/LICENSES/MIT.txt.txt)입니다.

**Copyright (c) 2026 Lee Dogeon &lt;dev.moreal@gmail.com&gt;**

MIT 라이선스는 직접 작성한 코드에만 적용됩니다. KRDS 원본과 그 파생 가이드, 글꼴, 로고, 미디어, 의존성 코드의 권리를 바꾸거나 대신하지 않습니다. 정부가 이 코드를 공동 소유한다고 주장하지 않습니다.

## KRDS 자료 {#official-krds-material}

KRDS의 텍스트, 아이콘, 디자인 토큰은 **행정안전부 / Ministry of the Interior and Safety**의 자료이고 원래 조건을 따릅니다. 조건은 [KRDS 저작권 정책](https://www.krds.go.kr/html/eng/utility/utility_05.html)과 [KOGL 이용허락 정책](https://www.kogl.or.kr/info/license.do)(공공누리 제1유형)에 있습니다. 원본은 [KRDS 저장소](https://github.com/KRDS-uiux/krds-uiux)에 있습니다.

이 사이트의 컴포넌트 안내 중 KRDS에서 인용하거나 옮긴 내용도 KRDS의 원래 조건을 따릅니다.

이 프로젝트가 쓰는 `LicenseRef-KRDS-KOGL-Type-1`은 로컬 식별자이고 공식 SPDX 식별자가 아닙니다. KRDS 원본 패키지 메타데이터의 ISC 표기와 함께 고를 수 있는 이중 라이선스라는 뜻도 아닙니다.

기관 로고, 서비스 이름, 공식 정부 배너, 다른 회사의 상표는 패키지에 들어 있지 않습니다. 앱에서 이런 자료를 쓰려면 권리를 직접 확인합니다.

KRDS 원본 JavaScript를 이 컴포넌트와 같은 DOM에서 함께 실행하지 않습니다.

## 글꼴, 아이콘, 미디어 {#fonts-dependencies-and-local-media}

Pretendard GOV 글꼴은 [SIL Open Font License 1.1](/sources/LICENSES/Pretendard-GOV-OFL-1.1.txt.txt)을 따릅니다. `@unofficial-krds/fonts`에는 수정하지 않은 Regular, Medium, Bold 파일이 들어 있습니다. 이 사이트도 같은 파일을 씁니다.

사이트의 워드마크와 K 아이콘은 이 프로젝트가 Pretendard GOV 윤곽선으로 만든 그림입니다. 글꼴의 라이선스를 바꾸지 않고, 정부의 보증을 뜻하지도 않습니다.

미리보기의 프레임워크 탭 로고는 Simple Icons(CC0-1.0)의 아이콘 데이터입니다. 각 이름과 로고의 상표권은 해당 프로젝트에 있습니다. 어떤 프레임워크인지 알리는 데만 쓰며 제휴나 보증을 뜻하지 않습니다.

미디어 예시에는 사용 허락을 확인한 로컬 합성음, 기하 도형 영상, VTT 자막만 씁니다. 의존성은 각자의 라이선스와 고지를 따릅니다.

## 재배포할 때 {#redistribute-from-the-actual-artifact}

패키지를 재배포할 때는 패키지에 들어 있는 다음 파일을 함께 둡니다.

- `LICENSE.md`
- `LICENSES/`
- `ATTRIBUTION.md`
- `THIRD-PARTY-NOTICES.md`
- `provenance.json`

글꼴 파일을 재배포할 때는 OFL 전문과 저작권 고지도 함께 둡니다.

원본 URL, 받은 시각, SHA-256은 다음 기록에 있습니다.

- <a href="../_legal/index.html" target="_self">사이트 배포 파일 목록</a>
- [프로젝트 신원 기록](/sources/compliance/project-identity.json.txt)
- [이용 조건 원문과 해시](/sources/compliance/license-policy.json.txt)
- [KRDS 저작권 정책 원문](/sources/LICENSES/KRDS-copyright-en.html.txt)
- [KOGL 정책 원문](/sources/LICENSES/KOGL-license-policy.html.txt)
- [출처 기록](/sources/compliance/provenance.json.txt)
- [자산 출처](/sources/compliance/provenance-asset-sources.json.txt)
- [글꼴 패키지 출처](/sources/compliance/provenance-font-package.json.txt)
- [의존성 출처](/sources/compliance/provenance-dependencies.json.txt)
