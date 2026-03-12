import type { ILessonContext } from "@agent-tutor/shared/types";

export const getLessonContext = ({
  courseId,
  lessonId,
}: {
  courseId: string;
  lessonId: string;
}): ILessonContext => ({
  courseId,
  courseTitle: "React Debugging Sprint",
  lessonId,
  lessonTitle: "Fix button interaction",
  objective: "Repair prop flow and event wiring without leaving the workspace.",
  task: "Make ContinueButton render the learner-facing label and call the provided callback when clicked.",
  expectedOutcome:
    'The button should display "Continue" and call handleClick exactly once.',
  workspaceFiles: [
    "package.json",
    "src/components/ContinueButton.tsx",
    "src/components/ContinueButton.test.tsx",
    "LESSON.md",
  ],
  focusFilePath: "src/components/ContinueButton.tsx",
});
