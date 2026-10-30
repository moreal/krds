import type { PatternId, PatternState, PatternStateMap } from './types.js';
export interface PresentationEnvironment { locale: string; direction: 'ltr' | 'rtl'; colorMode: 'light' | 'dark'; nowIso: string; viewport: { width: number; height: number } }
export interface PresentationCase<S = PatternState> { id: string; patternId: PatternId; variant: string; environment: PresentationEnvironment; state: S }
// Pure local snapshots. No requests, timers, driver, DOM or source JavaScript.
const cases: PresentationCase[] = [
  {
    "id": "krds-pattern-form-errors--editing",
    "patternId": "form-errors",
    "variant": "editing",
    "environment": {
      "locale": "ko-KR",
      "direction": "ltr",
      "colorMode": "light",
      "nowIso": "2024-02-29T12:00:00.000Z",
      "viewport": {
        "width": 1280,
        "height": 800
      }
    },
    "state": {
      "patternId": "form-errors",
      "requestId": 0,
      "pendingRequestId": null,
      "pendingPayload": null,
      "failedPayload": null,
      "error": null,
      "phase": "editing",
      "values": {
        "title": "",
        "category": "",
        "detail": ""
      },
      "errors": [],
      "receipt": null
    }
  },
  {
    "id": "krds-pattern-form-errors--invalid",
    "patternId": "form-errors",
    "variant": "invalid",
    "environment": {
      "locale": "ko-KR",
      "direction": "ltr",
      "colorMode": "light",
      "nowIso": "2024-02-29T12:00:00.000Z",
      "viewport": {
        "width": 1280,
        "height": 800
      }
    },
    "state": {
      "patternId": "form-errors",
      "requestId": 0,
      "pendingRequestId": null,
      "pendingPayload": null,
      "failedPayload": null,
      "error": null,
      "phase": "invalid",
      "values": {
        "title": "",
        "category": "",
        "detail": ""
      },
      "errors": [
        {
          "field": "title",
          "targetId": "example-form-title",
          "message": "예제 제목을 4자 이상 60자 이하로 입력하세요.",
          "errorId": "example-form-title-error"
        },
        {
          "field": "category",
          "targetId": "example-form-category",
          "message": "연습 유형을 선택하세요.",
          "errorId": "example-form-category-error"
        }
      ],
      "receipt": null
    }
  },
  {
    "id": "krds-pattern-form-errors--loading",
    "patternId": "form-errors",
    "variant": "loading",
    "environment": {
      "locale": "ko-KR",
      "direction": "ltr",
      "colorMode": "light",
      "nowIso": "2024-02-29T12:00:00.000Z",
      "viewport": {
        "width": 1280,
        "height": 800
      }
    },
    "state": {
      "patternId": "form-errors",
      "requestId": 1,
      "pendingRequestId": 1,
      "pendingPayload": {
        "title": "예제 입력폼 연습",
        "category": "practice",
        "detail": ""
      },
      "failedPayload": null,
      "error": null,
      "phase": "loading",
      "values": {
        "title": "예제 입력폼 연습",
        "category": "practice",
        "detail": ""
      },
      "errors": [],
      "receipt": null
    }
  },
  {
    "id": "krds-pattern-form-errors--error",
    "patternId": "form-errors",
    "variant": "error",
    "environment": {
      "locale": "ko-KR",
      "direction": "ltr",
      "colorMode": "light",
      "nowIso": "2024-02-29T12:00:00.000Z",
      "viewport": {
        "width": 1280,
        "height": 800
      }
    },
    "state": {
      "patternId": "form-errors",
      "requestId": 1,
      "pendingRequestId": null,
      "pendingPayload": null,
      "failedPayload": {
        "title": "예제 입력폼 연습",
        "category": "practice",
        "detail": ""
      },
      "error": "로컬 예제 처리에 실패했습니다. 입력을 유지한 채 다시 시도할 수 있습니다.",
      "phase": "error",
      "values": {
        "title": "예제 입력폼 연습",
        "category": "practice",
        "detail": ""
      },
      "errors": [],
      "receipt": null
    }
  },
  {
    "id": "krds-pattern-form-errors--success",
    "patternId": "form-errors",
    "variant": "success",
    "environment": {
      "locale": "ko-KR",
      "direction": "ltr",
      "colorMode": "light",
      "nowIso": "2024-02-29T12:00:00.000Z",
      "viewport": {
        "width": 1280,
        "height": 800
      }
    },
    "state": {
      "patternId": "form-errors",
      "requestId": 1,
      "pendingRequestId": null,
      "pendingPayload": null,
      "failedPayload": null,
      "error": null,
      "phase": "success",
      "values": {
        "title": "예제 입력폼 연습",
        "category": "practice",
        "detail": ""
      },
      "errors": [],
      "receipt": {
        "id": "DEMO-FORM-001",
        "title": "예제 입력폼 연습",
        "category": "practice",
        "detail": ""
      }
    }
  },
  {
    "id": "krds-pattern-search-results--success",
    "patternId": "search-results",
    "variant": "success",
    "environment": {
      "locale": "ko-KR",
      "direction": "ltr",
      "colorMode": "light",
      "nowIso": "2024-02-29T12:00:00.000Z",
      "viewport": {
        "width": 1280,
        "height": 800
      }
    },
    "state": {
      "patternId": "search-results",
      "requestId": 0,
      "pendingRequestId": null,
      "pendingPayload": null,
      "failedPayload": null,
      "error": null,
      "phase": "success",
      "query": "",
      "appliedQuery": "",
      "category": "all",
      "items": [
        {
          "id": "resource-01",
          "title": "접근성 점검 가이드",
          "category": "guide",
          "summary": "레이블과 키보드 탐색을 연습하는 가상 자료입니다.",
          "date": "2024-02-12"
        },
        {
          "id": "resource-02",
          "title": "접근성 입력폼 예제",
          "category": "example",
          "summary": "오류 안내와 필드 이동을 연습합니다.",
          "date": "2024-02-13"
        },
        {
          "id": "resource-03",
          "title": "접근성 용어 참고",
          "category": "reference",
          "summary": "학습용 용어를 정리한 가상 자료입니다.",
          "date": "2024-02-14"
        }
      ],
      "total": 12,
      "pageCount": 4,
      "page": 1,
      "pageSize": 3
    }
  },
  {
    "id": "krds-pattern-search-results--loading",
    "patternId": "search-results",
    "variant": "loading",
    "environment": {
      "locale": "ko-KR",
      "direction": "ltr",
      "colorMode": "light",
      "nowIso": "2024-02-29T12:00:00.000Z",
      "viewport": {
        "width": 1280,
        "height": 800
      }
    },
    "state": {
      "patternId": "search-results",
      "requestId": 1,
      "pendingRequestId": 1,
      "pendingPayload": {
        "query": "",
        "category": "all",
        "page": 1
      },
      "failedPayload": null,
      "error": null,
      "phase": "loading",
      "query": "",
      "appliedQuery": "",
      "category": "all",
      "items": [
        {
          "id": "resource-01",
          "title": "접근성 점검 가이드",
          "category": "guide",
          "summary": "레이블과 키보드 탐색을 연습하는 가상 자료입니다.",
          "date": "2024-02-12"
        },
        {
          "id": "resource-02",
          "title": "접근성 입력폼 예제",
          "category": "example",
          "summary": "오류 안내와 필드 이동을 연습합니다.",
          "date": "2024-02-13"
        },
        {
          "id": "resource-03",
          "title": "접근성 용어 참고",
          "category": "reference",
          "summary": "학습용 용어를 정리한 가상 자료입니다.",
          "date": "2024-02-14"
        }
      ],
      "total": 12,
      "pageCount": 4,
      "page": 1,
      "pageSize": 3
    }
  },
  {
    "id": "krds-pattern-search-results--error",
    "patternId": "search-results",
    "variant": "error",
    "environment": {
      "locale": "ko-KR",
      "direction": "ltr",
      "colorMode": "light",
      "nowIso": "2024-02-29T12:00:00.000Z",
      "viewport": {
        "width": 1280,
        "height": 800
      }
    },
    "state": {
      "patternId": "search-results",
      "requestId": 1,
      "pendingRequestId": null,
      "pendingPayload": null,
      "failedPayload": {
        "query": "",
        "category": "all",
        "page": 1
      },
      "error": "로컬 예제 처리에 실패했습니다. 입력을 유지한 채 다시 시도할 수 있습니다.",
      "phase": "error",
      "query": "",
      "appliedQuery": "",
      "category": "all",
      "items": [
        {
          "id": "resource-01",
          "title": "접근성 점검 가이드",
          "category": "guide",
          "summary": "레이블과 키보드 탐색을 연습하는 가상 자료입니다.",
          "date": "2024-02-12"
        },
        {
          "id": "resource-02",
          "title": "접근성 입력폼 예제",
          "category": "example",
          "summary": "오류 안내와 필드 이동을 연습합니다.",
          "date": "2024-02-13"
        },
        {
          "id": "resource-03",
          "title": "접근성 용어 참고",
          "category": "reference",
          "summary": "학습용 용어를 정리한 가상 자료입니다.",
          "date": "2024-02-14"
        }
      ],
      "total": 12,
      "pageCount": 4,
      "page": 1,
      "pageSize": 3
    }
  },
  {
    "id": "krds-pattern-search-results--empty",
    "patternId": "search-results",
    "variant": "empty",
    "environment": {
      "locale": "ko-KR",
      "direction": "ltr",
      "colorMode": "light",
      "nowIso": "2024-02-29T12:00:00.000Z",
      "viewport": {
        "width": 1280,
        "height": 800
      }
    },
    "state": {
      "patternId": "search-results",
      "requestId": 1,
      "pendingRequestId": null,
      "pendingPayload": null,
      "failedPayload": null,
      "error": null,
      "phase": "success",
      "query": "존재하지않는예제",
      "appliedQuery": "존재하지않는예제",
      "category": "all",
      "items": [],
      "total": 0,
      "pageCount": 0,
      "page": 1,
      "pageSize": 3
    }
  },
  {
    "id": "krds-pattern-consent-confirmation--editing",
    "patternId": "consent-confirmation",
    "variant": "editing",
    "environment": {
      "locale": "ko-KR",
      "direction": "ltr",
      "colorMode": "light",
      "nowIso": "2024-02-29T12:00:00.000Z",
      "viewport": {
        "width": 1280,
        "height": 800
      }
    },
    "state": {
      "patternId": "consent-confirmation",
      "requestId": 0,
      "pendingRequestId": null,
      "pendingPayload": null,
      "failedPayload": null,
      "error": null,
      "phase": "editing",
      "requiredChoice": null,
      "optionalChoice": false,
      "modalOpen": false,
      "receipt": null
    }
  },
  {
    "id": "krds-pattern-consent-confirmation--invalid",
    "patternId": "consent-confirmation",
    "variant": "invalid",
    "environment": {
      "locale": "ko-KR",
      "direction": "ltr",
      "colorMode": "light",
      "nowIso": "2024-02-29T12:00:00.000Z",
      "viewport": {
        "width": 1280,
        "height": 800
      }
    },
    "state": {
      "patternId": "consent-confirmation",
      "requestId": 0,
      "pendingRequestId": null,
      "pendingPayload": null,
      "failedPayload": null,
      "error": "필수 예제 이용 안내에 동의해야 계속할 수 있습니다.",
      "phase": "invalid",
      "requiredChoice": null,
      "optionalChoice": false,
      "modalOpen": false,
      "receipt": null
    }
  },
  {
    "id": "krds-pattern-consent-confirmation--confirming",
    "patternId": "consent-confirmation",
    "variant": "confirming",
    "environment": {
      "locale": "ko-KR",
      "direction": "ltr",
      "colorMode": "light",
      "nowIso": "2024-02-29T12:00:00.000Z",
      "viewport": {
        "width": 1280,
        "height": 800
      }
    },
    "state": {
      "patternId": "consent-confirmation",
      "requestId": 0,
      "pendingRequestId": null,
      "pendingPayload": null,
      "failedPayload": null,
      "error": null,
      "phase": "confirming",
      "requiredChoice": true,
      "optionalChoice": false,
      "modalOpen": true,
      "receipt": null
    }
  },
  {
    "id": "krds-pattern-consent-confirmation--loading",
    "patternId": "consent-confirmation",
    "variant": "loading",
    "environment": {
      "locale": "ko-KR",
      "direction": "ltr",
      "colorMode": "light",
      "nowIso": "2024-02-29T12:00:00.000Z",
      "viewport": {
        "width": 1280,
        "height": 800
      }
    },
    "state": {
      "patternId": "consent-confirmation",
      "requestId": 1,
      "pendingRequestId": 1,
      "pendingPayload": {
        "requiredChoice": true,
        "optionalChoice": false
      },
      "failedPayload": null,
      "error": null,
      "phase": "loading",
      "requiredChoice": true,
      "optionalChoice": false,
      "modalOpen": true,
      "receipt": null
    }
  },
  {
    "id": "krds-pattern-consent-confirmation--error",
    "patternId": "consent-confirmation",
    "variant": "error",
    "environment": {
      "locale": "ko-KR",
      "direction": "ltr",
      "colorMode": "light",
      "nowIso": "2024-02-29T12:00:00.000Z",
      "viewport": {
        "width": 1280,
        "height": 800
      }
    },
    "state": {
      "patternId": "consent-confirmation",
      "requestId": 1,
      "pendingRequestId": null,
      "pendingPayload": null,
      "failedPayload": {
        "requiredChoice": true,
        "optionalChoice": false
      },
      "error": "로컬 예제 처리에 실패했습니다. 입력을 유지한 채 다시 시도할 수 있습니다.",
      "phase": "error",
      "requiredChoice": true,
      "optionalChoice": false,
      "modalOpen": true,
      "receipt": null
    }
  },
  {
    "id": "krds-pattern-consent-confirmation--success",
    "patternId": "consent-confirmation",
    "variant": "success",
    "environment": {
      "locale": "ko-KR",
      "direction": "ltr",
      "colorMode": "light",
      "nowIso": "2024-02-29T12:00:00.000Z",
      "viewport": {
        "width": 1280,
        "height": 800
      }
    },
    "state": {
      "patternId": "consent-confirmation",
      "requestId": 1,
      "pendingRequestId": null,
      "pendingPayload": null,
      "failedPayload": null,
      "error": null,
      "phase": "success",
      "requiredChoice": true,
      "optionalChoice": false,
      "modalOpen": false,
      "receipt": {
        "id": "DEMO-CONSENT-001",
        "requiredChoice": true,
        "optionalChoice": false
      }
    }
  },
  {
    "id": "krds-pattern-service-layout--default",
    "patternId": "service-layout",
    "variant": "default",
    "environment": {
      "locale": "ko-KR",
      "direction": "ltr",
      "colorMode": "light",
      "nowIso": "2024-02-29T12:00:00.000Z",
      "viewport": {
        "width": 1280,
        "height": 800
      }
    },
    "state": {
      "patternId": "service-layout",
      "requestId": 0,
      "pendingRequestId": null,
      "pendingPayload": null,
      "failedPayload": null,
      "error": null,
      "phase": "success",
      "currentId": "overview",
      "expandedIds": [
        "examples"
      ],
      "mobileOpen": false
    }
  }
];
export const presentationCases = cases;
export function getPresentation<P extends PatternId>(patternId: P, variant: string): PresentationCase<PatternStateMap[P]> {
  const entry = cases.find(item => item.patternId === patternId && item.variant === variant);
  if (!entry) throw new RangeError(`Unknown presentation: ${patternId}/${variant}`);
  return structuredClone(entry) as PresentationCase<PatternStateMap[P]>;
}
