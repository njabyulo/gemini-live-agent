"use client";

import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { ICourseDefinition, ILessonContext } from "@agent-tutor/shared/types";

import type { ITranscriptMessage, TCourseTopicStatus } from "../types";
import { LessonPanel } from "./lesson-panel";
import { VoiceAgentPanel } from "./voice-agent-panel";

export function LearningRail({
  activeLesson,
  activeRailTab,
  course,
  inputLevel,
  isCapturingAudio,
  isLoadingLesson,
  isSessionLive,
  lessonView,
  loadedTopicId,
  onBackToOutline,
  onConnect,
  onDisconnect,
  onPreviewTopic,
  onRailTabChange,
  onStartLesson,
  onSuggestedPrompt,
  selectedLesson,
  selectedTopicId,
  sessionPhase,
  suggestedPrompts,
  topicStatusById,
  transcripts,
  tutorNote,
}: {
  activeLesson: ILessonContext | null;
  activeRailTab: "lesson" | "tutor";
  course: ICourseDefinition;
  inputLevel: number;
  isCapturingAudio: boolean;
  isLoadingLesson: boolean;
  isSessionLive: boolean;
  lessonView: "outline" | "detail";
  loadedTopicId: string | null;
  onBackToOutline: () => void;
  onConnect: () => void;
  onDisconnect: () => void;
  onPreviewTopic: (topicId: string) => void;
  onRailTabChange: (tab: "lesson" | "tutor") => void;
  onStartLesson: (topicId: string) => void;
  onSuggestedPrompt: (prompt: string) => void;
  selectedLesson: ILessonContext | null;
  selectedTopicId: string | null;
  sessionPhase: string;
  suggestedPrompts: string[];
  topicStatusById: Record<string, TCourseTopicStatus>;
  transcripts: ITranscriptMessage[];
  tutorNote: string;
}) {
  return (
    <aside className="panel-surface flex h-full min-h-0 flex-col overflow-hidden rounded-[24px] border border-[rgba(20,31,24,0.1)]">
      <div className="border-b border-[rgba(20,31,24,0.08)] p-4">
        <Tabs
          value={activeRailTab}
          onValueChange={(value) => onRailTabChange(value as "lesson" | "tutor")}
          className="gap-0"
        >
          <TabsList className="grid h-12 w-full grid-cols-2 rounded-full border border-[rgba(20,31,24,0.08)] bg-[#edf3ee] p-1">
            <TabsTrigger
              value="lesson"
              className="rounded-full text-[0.92rem] font-medium data-[state=active]:bg-[#162028] data-[state=active]:text-[#edf4ff]"
            >
              Lesson
            </TabsTrigger>
            <TabsTrigger
              value="tutor"
              className="rounded-full text-[0.92rem] font-medium data-[state=active]:bg-[#162028] data-[state=active]:text-[#edf4ff]"
            >
              Tutor
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="min-h-0 flex-1">
        {activeRailTab === "lesson" ? (
          <LessonPanel
            course={course}
            isLoadingLesson={isLoadingLesson}
            lessonView={lessonView}
            loadedTopicId={loadedTopicId}
            onBackToOutline={onBackToOutline}
            onPreviewTopic={onPreviewTopic}
            onStartLesson={onStartLesson}
            selectedLesson={selectedLesson}
            selectedTopicId={selectedTopicId}
            topicStatusById={topicStatusById}
          />
        ) : (
          <VoiceAgentPanel
            activeLesson={activeLesson}
            inputLevel={inputLevel}
            isCapturingAudio={isCapturingAudio}
            isSessionLive={isSessionLive}
            onConnect={onConnect}
            onDisconnect={onDisconnect}
            onSuggestedPrompt={onSuggestedPrompt}
            sessionPhase={sessionPhase}
            suggestedPrompts={suggestedPrompts}
            transcripts={transcripts}
            tutorNote={tutorNote}
          />
        )}
      </div>
    </aside>
  );
}
