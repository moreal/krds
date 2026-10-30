/** Required semantic observations. Native renderer behavior belongs to app implementations. */
export interface PilotScenario { componentId: string; caseId: string; description: string; }
export const pilotScenarios: readonly PilotScenario[] = [
  {
    "componentId": "button",
    "caseId": "disabled",
    "description": "disabled click emits no event"
  },
  {
    "componentId": "native-select",
    "caseId": "controlled",
    "description": "external value updates native select"
  },
  {
    "componentId": "native-select",
    "caseId": "form-reset",
    "description": "form reset restores initial value"
  },
  {
    "componentId": "modal",
    "caseId": "focus-return",
    "description": "closing dialog returns focus to trigger"
  },
  {
    "componentId": "modal",
    "caseId": "trigger-removed",
    "description": "closing after trigger removal focuses the alternate button 다음 작업"
  },
  {
    "componentId": "tabs",
    "caseId": "manual-activation",
    "description": "arrow changes focus without activation until Enter"
  },
  {
    "componentId": "date-input",
    "caseId": "leap-year",
    "description": "2023-02-29 invalid; 2024-02-29 valid"
  },
  {
    "componentId": "date-input",
    "caseId": "ime",
    "description": "composition preserves local Korean input"
  },
  {
    "componentId": "date-input",
    "caseId": "timezone-invariance",
    "description": "semantic date remains unchanged in Pacific/Kiritimati and America/Los_Angeles without unsolicited events"
  }
];
