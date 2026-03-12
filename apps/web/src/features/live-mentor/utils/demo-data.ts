import type { ITestState, TSessionPhase } from "@agent-tutor/shared/types";

import type { ITranscriptMessage } from "../types";

export const TEST_STATES: ITestState[] = [
  {
    id: "state-1",
    label: "Hard fail",
    summary:
      "The button renders the wrong label and does not call the click handler.",
    terminalOutput:
      'FAIL src/components/Button.test.tsx\nExpected text "Continue" but received "Submit".\nExpected handleClick to have been called 1 time, but it was called 0 times.',
    mentorHint:
      "Start by tracing which props the button receives before you change the event logic.",
  },
  {
    id: "state-2",
    label: "Almost there",
    summary: "The label is fixed, but the click handler is still disconnected.",
    terminalOutput:
      "FAIL src/components/Button.test.tsx\nExpected handleClick to have been called 1 time, but it was called 0 times.",
    mentorHint:
      "Now focus on where the click handler is attached to the rendered button.",
  },
  {
    id: "state-3",
    label: "Pass",
    summary: "All checks pass and the learner is ready to submit.",
    terminalOutput:
      "PASS src/components/Button.test.tsx\nTests: 2 passed, 2 total\nStatus: Ready to submit.",
    mentorHint:
      "You are ready to submit. Run the full suite once more and ship it.",
  },
];

export const CODE_BY_STATE: Record<ITestState["id"], string> = {
  "state-1": `type TButtonProps = {\n  label: string;\n  onClick?: () => void;\n};\n\nexport function ContinueButton(props: TButtonProps) {\n  return (\n    <button className="cta">\n      Submit\n    </button>\n  );\n}`,
  "state-2": `type TButtonProps = {\n  label: string;\n  onClick?: () => void;\n};\n\nexport function ContinueButton(props: TButtonProps) {\n  return (\n    <button className="cta">\n      {props.label}\n    </button>\n  );\n}`,
  "state-3": `type TButtonProps = {\n  label: string;\n  onClick?: () => void;\n};\n\nexport function ContinueButton(props: TButtonProps) {\n  return (\n    <button className="cta" onClick={props.onClick}>\n      {props.label}\n    </button>\n  );\n}`,
};

export const INITIAL_MESSAGES: ITranscriptMessage[] = [
  {
    id: "mentor-intro",
    role: "assistant",
    text: "I’m Garrii Live Mentor. Ask for help out loud, share the failure context, and I’ll coach you without giving the full solution.",
  },
];

export const STATUS_LABELS: Record<TSessionPhase | "idle", string> = {
  idle: "Idle",
  connecting: "Connecting",
  ready: "Ready",
  listening: "Listening",
  thinking: "Thinking",
  speaking: "Speaking",
  error: "Error",
};

export function buildScreenshotFromTestState(
  testState: ITestState,
): string | null {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 720;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  ctx.fillStyle = "#f6f0e7";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#102a43";
  ctx.font = "bold 42px sans-serif";
  ctx.fillText("Gemini Live Mentor Screenshot", 64, 88);
  ctx.font = "24px sans-serif";
  ctx.fillText("Lesson: Fix button interaction", 64, 148);
  ctx.fillText(`State: ${testState.label}`, 64, 188);
  ctx.fillText(testState.summary, 64, 232);
  ctx.fillText("Terminal output:", 64, 300);
  ctx.font = "20px monospace";
  testState.terminalOutput.split("\n").forEach((line, index) => {
    ctx.fillText(line, 64, 344 + index * 28);
  });

  return canvas.toDataURL("image/jpeg", 0.85).split(",")[1] ?? null;
}
