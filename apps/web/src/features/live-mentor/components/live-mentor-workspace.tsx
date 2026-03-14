"use client";

import {
  ChevronDown,
  LogOut,
  RefreshCcw,
  BookOpenCheck,
  UserRound,
} from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
} from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { signOut } from "~/features/auth/services/auth-client";

import { useLiveMentorWorkspace } from "../hooks/use-live-mentor-workspace";
import { useVoiceMentor } from "../hooks/use-voice-mentor";
import { PYTEST_COMMAND } from "../utils/terminal";
import { captureWorkspaceImage } from "../utils/workspace-capture";
import { CodeEditorSurface } from "./code-editor-surface";
import { LearningRail } from "./learning-rail";
import { TerminalSurface } from "./terminal-surface";

const getInitials = (email: string) =>
  email
    .split("@")[0]
    ?.split(/[._-]/u)
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment.slice(0, 1).toUpperCase())
    .join("") || "JT";

const buildTutorNote = (workspace: ReturnType<typeof useLiveMentorWorkspace>) => {
  if (workspace.runtime.command === PYTEST_COMMAND && /passed\b/u.test(workspace.runtime.stdout)) {
    return "Nice. The fix worked. You preserved the original input exactly, so the next move is to submit with confidence.";
  }

  if (workspace.runtime.stderr.trim()) {
    return "The latest command produced an error. Read the output, then ask the tutor what changed between the expected and actual behavior.";
  }

  if (workspace.runtime.command && workspace.loadedLesson?.hints[0]) {
    return workspace.loadedLesson.hints[0];
  }

  return (
    workspace.loadedLesson?.expectedOutcome ||
    "Run the program once, inspect the output, then ask the tutor what to change."
  );
};

const buildSuggestedPrompts = (
  workspace: ReturnType<typeof useLiveMentorWorkspace>,
) => {
  if (workspace.runtime.command === PYTEST_COMMAND && /passed\b/u.test(workspace.runtime.stdout)) {
    return ["Why does this fix work?", "What should I remember from this lesson?"];
  }

  if (workspace.runtime.stderr.trim()) {
    return ["Explain the failure", "What should I change?"];
  }

  if (workspace.runtime.command) {
    return ["What should I change?", "What line should I inspect?"];
  }

  return ["What should I look for first?", "How should I approach this topic?"];
};

const buildAmbientCue = (workspace: ReturnType<typeof useLiveMentorWorkspace>) => {
  if (workspace.runtime.command === PYTEST_COMMAND && /passed\b/u.test(workspace.runtime.stdout)) {
    return "Green result. Ask the tutor for a quick recap if you want the concept behind the fix.";
  }

  if (workspace.runtime.stderr.trim()) {
    return "The tutor noticed a runtime issue. A short hint is ready when you ask.";
  }

  if (workspace.runtime.command) {
    return "The tutor is grounded on your last command and output. Ask for one precise next step.";
  }

  return (
    workspace.loadedLesson?.summary ??
    "Run the program once. The tutor gets sharper after it sees real output."
  );
};

export function LiveMentorWorkspace() {
  const router = useRouter();
  const workspace = useLiveMentorWorkspace();
  const workspaceRegionRef = useRef<HTMLElement | null>(null);
  const handleCaptureWorkspaceImage = useCallback(async () => {
    try {
      return await captureWorkspaceImage(workspaceRegionRef.current);
    } catch {
      return null;
    }
  }, []);
  const voice = useVoiceMentor({
    captureWorkspaceImage: handleCaptureWorkspaceImage,
  });
  const tutorNote = buildTutorNote(workspace);
  const suggestedPrompts = buildSuggestedPrompts(workspace);
  const ambientCue = buildAmbientCue(workspace);
  const shouldExpandTerminal =
    workspace.isRunningCommand ||
    workspace.runtime.command === PYTEST_COMMAND ||
    workspace.runtime.stderr.trim().length > 0;

  useEffect(() => {
    if (!workspace.isSessionPending && !workspace.session?.user) {
      router.replace("/");
    }
  }, [router, workspace.isSessionPending, workspace.session]);

  if (workspace.isSessionPending || workspace.isBootstrapping) {
    return (
      <main className="min-h-screen bg-transparent px-3 py-3 text-[#16211b] sm:px-4 sm:py-4">
        <div className="workspace-shell mx-auto min-h-[calc(100vh-1.5rem)] max-w-[1780px] overflow-hidden rounded-[30px] border border-[rgba(20,31,24,0.14)] p-4">
          <div className="rounded-[28px] border border-black/8 bg-[#0b0f0d] p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-3">
                <Skeleton className="h-3 w-28 bg-white/14" />
                <Skeleton className="h-22 w-[25rem] max-w-full bg-white/18" />
                <Skeleton className="h-5 w-[29rem] max-w-full bg-white/12" />
              </div>
              <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                <Skeleton className="h-14 w-64 rounded-full bg-white/12" />
                <Skeleton className="h-9 w-32 rounded-full bg-white/12" />
                <Skeleton className="h-8 w-64 rounded-full bg-white/12" />
                <Skeleton className="h-14 w-72 rounded-full bg-white/14" />
              </div>
            </div>
          </div>

          <div className="mt-4 grid min-h-[calc(100vh-9rem)] grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
            <section className="grid min-h-0 gap-4 grid-rows-[minmax(0,1fr)_160px]">
                <div className="panel-surface rounded-[24px] border border-[rgba(20,31,24,0.1)] overflow-hidden">
                  <div className="flex items-center gap-3 border-b border-[rgba(20,31,24,0.1)] px-4 py-3">
                    <Skeleton className="h-10 w-10 rounded-2xl bg-[#dfe9e1]" />
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-24 bg-[#dfe9e1]" />
                      <Skeleton className="h-4 w-56 bg-[#d4e0d7]" />
                    </div>
                  </div>
                  <div className="flex gap-2 border-b border-[rgba(20,31,24,0.1)] px-3 py-2">
                    <Skeleton className="h-10 w-28 rounded-xl bg-[#e6eee8]" />
                    <Skeleton className="h-10 w-32 rounded-xl bg-[#eef4ef]" />
                    <Skeleton className="h-10 w-32 rounded-xl bg-[#eef4ef]" />
                  </div>
                  <div className="flex items-center justify-between gap-3 border-b border-[rgba(20,31,24,0.1)] px-4 py-2.5">
                    <Skeleton className="h-3 w-44 bg-[#dfe9e1]" />
                    <Skeleton className="h-7 w-20 rounded-full bg-[#dfe9e1]" />
                  </div>
                  <Skeleton className="h-[calc(100%-8.9rem)] min-h-[24rem] w-full rounded-none bg-[#0e131d]" />
                </div>

                <div className="panel-surface rounded-[24px] border border-[rgba(20,31,24,0.1)] overflow-hidden">
                  <div className="flex items-center justify-between gap-3 border-b border-[rgba(20,31,24,0.1)] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-2xl bg-[#dfe9e1]" />
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-20 bg-[#dfe9e1]" />
                        <Skeleton className="h-4 w-56 bg-[#d4e0d7]" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-10 w-28 rounded-full bg-[#dfe9e1]" />
                      <Skeleton className="h-10 w-32 rounded-full bg-[#dfe9e1]" />
                    </div>
                  </div>
                  <div className="space-y-3 px-4 py-3">
                    <div className="grid gap-3 lg:grid-cols-[max-content_minmax(0,1fr)_auto]">
                      <Skeleton className="h-11 rounded-full bg-[#eef4ef]" />
                      <Skeleton className="h-11 rounded-full bg-[#f5f8f2]" />
                      <Skeleton className="h-11 w-24 rounded-full bg-[#dfe9e1]" />
                    </div>
                    <Skeleton className="h-4 w-[36rem] max-w-full bg-[#dfe9e1]" />
                  </div>
                  <Skeleton className="mx-3 mb-3 h-[4.75rem] rounded-[18px] bg-[#0c111b]" />
                </div>
            </section>

            <div className="panel-surface rounded-[24px] border border-[rgba(20,31,24,0.1)] p-5">
              <div className="space-y-6">
                <div className="space-y-4 border-b border-[rgba(20,31,24,0.08)] pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-28 bg-[#dfe9e1]" />
                      <Skeleton className="h-10 w-52 bg-[#d4e0d7]" />
                    </div>
                    <Skeleton className="h-8 w-28 rounded-full bg-[#dfe9e1]" />
                  </div>
                  <Skeleton className="h-12 rounded-full bg-[#edf3ee]" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-32 rounded-[22px] bg-[#eef4ef]" />
                  <Skeleton className="h-20 rounded-[22px] bg-[#f3f7f4]" />
                  <Skeleton className="h-48 rounded-[22px] bg-[#eef4ef]" />
                </div>
              </div>
              <div className="mt-10 flex items-center justify-end gap-3">
                <Skeleton className="h-[4.75rem] flex-1 rounded-[1.55rem] bg-[#0f1619]" />
                <Skeleton className="h-[5.1rem] w-[5.1rem] rounded-full bg-[#0f1619]" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent px-3 py-3 text-[#16211b] sm:px-4 sm:py-4">
      <div className="workspace-shell mx-auto min-h-[calc(100vh-1.5rem)] max-w-[1780px] overflow-hidden rounded-[30px] border border-[rgba(20,31,24,0.14)]">
        <header className="flex flex-col gap-4 border-b border-black/10 bg-[#0b0f0d] px-5 py-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <p className="workspace-eyebrow">Agent tutor</p>
            <h1 className="workspace-heading max-w-[13ch] text-[clamp(2rem,2.8vw,3rem)] leading-[0.98] text-white">
              Python foundations workspace
            </h1>
            <p className="mt-2 max-w-2xl text-[0.95rem] leading-6 text-[#b2c3b7]">
              {ambientCue}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 xl:max-w-[54rem] xl:justify-end">
            {workspace.loadedLesson ? (
              <Badge className="hidden rounded-full border border-[#84d7ae]/18 bg-[#14221d] px-3.5 py-2 text-[0.78rem] font-medium text-[#d5fff0] shadow-none lg:inline-flex">
                <BookOpenCheck className="mr-2 h-3.5 w-3.5" />
                {workspace.loadedLesson.lessonTitle}
              </Badge>
            ) : null}
            <Badge className="hidden rounded-full border border-[#84d7ae]/18 bg-[#14221d] px-3.5 py-2 text-[0.78rem] font-medium text-[#d5fff0] shadow-none lg:inline-flex">
              {voice.isSessionLive ? `Tutor ${voice.sessionPhase}` : "Tutor ready"}
            </Badge>
            <Tooltip>
              <TooltipTrigger>
                <span className="inline-flex">
                  <Badge className="rounded-full border border-[#d5a443]/22 bg-[#f7ecd1] px-3 py-1.5 text-[0.73rem] font-medium text-[#78541d]">
                    Reload resets this lesson workspace
                  </Badge>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                This workspace is disposable for the hackathon demo.
              </TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-14 items-center gap-3 rounded-full border border-black/8 bg-[#f8fbf7] px-3.5 py-2 text-left text-[#16211b] transition hover:bg-[#edf4ef]"
                >
                  <Avatar
                    size="lg"
                    className="border border-[#b8d7c4] bg-[#d9efe1]"
                  >
                    <AvatarFallback className="bg-[#d9efe1] text-sm font-semibold text-[#1f4d3e]">
                      {getInitials(workspace.userEmail)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm sm:inline">
                    {workspace.userEmail}
                  </span>
                  <ChevronDown className="h-4 w-4 text-[#64776c]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 border-black/8 bg-[#f8fbf7] text-[#16211b]"
              >
                <DropdownMenuLabel className="text-[#5a6e62]">
                  Judge session
                </DropdownMenuLabel>
                <DropdownMenuItem className="gap-2 text-[#16211b] focus:bg-[#edf4ef] focus:text-[#16211b]">
                  <UserRound className="h-4 w-4" />
                  {workspace.userEmail}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-black/8" />
                <DropdownMenuItem
                  className="gap-2 text-[#16211b] focus:bg-[#edf4ef] focus:text-[#16211b]"
                  onClick={() => workspace.resetLesson()}
                >
                  <RefreshCcw className="h-4 w-4" />
                  Reset lesson
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2 text-[#ffd5cd] focus:bg-[#361917] focus:text-[#ffd5cd]"
                  onClick={() => {
                    void signOut({
                      fetchOptions: {
                        onSuccess: () => router.replace("/"),
                      },
                    });
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="grid min-h-[calc(100vh-7rem)] grid-cols-1 gap-4 p-4 xl:grid-cols-[minmax(0,1fr)_420px]">
          <section
            ref={workspaceRegionRef}
            className="grid min-h-0 gap-4 lg:min-h-[calc(100vh-9rem)]"
          >
            <ScrollArea className="min-h-0 h-full">
              <div
                className={`grid min-h-full gap-4 pr-3 ${
                  shouldExpandTerminal
                    ? "grid-rows-[minmax(0,1fr)_220px]"
                    : "grid-rows-[minmax(0,1fr)_160px]"
                }`}
              >
                <CodeEditorSurface
                  activeFile={workspace.activeFile}
                  files={workspace.files}
                  lessonTitle={
                    workspace.loadedLesson?.lessonTitle ??
                    "Python Foundations"
                  }
                  onChange={workspace.updateFileContent}
                  onSelectFile={workspace.updateActiveFile}
                  taskSummary={workspace.activeTaskSummary}
                />

                <TerminalSurface
                  ambientCue={ambientCue}
                  isRunningCommand={workspace.isRunningCommand}
                  onProgramInputChange={workspace.updateProgramInput}
                  onReset={workspace.resetLesson}
                  onRunProgram={workspace.runProgram}
                  onRunTests={workspace.runTests}
                  programInput={workspace.programInput}
                  runtime={workspace.runtime}
                  terminalBuffer={workspace.terminalBuffer}
                />
              </div>
            </ScrollArea>
          </section>

          <div className="min-h-0 lg:h-[calc(100vh-9rem)]">
            <LearningRail
              activeLesson={workspace.loadedLesson}
              activeRailTab={workspace.activeRailTab}
              course={workspace.course}
              inputLevel={voice.inputLevel}
              isCapturingAudio={voice.isCapturingAudio}
              isLoadingLesson={workspace.isLoadingLesson}
              isSessionLive={voice.isSessionLive}
              lessonView={workspace.lessonView}
              loadedTopicId={workspace.loadedTopicId}
              onBackToOutline={() => workspace.updateLessonView("outline")}
              onConnect={voice.connectVoiceSession}
              onDisconnect={voice.disconnectSession}
              onPreviewTopic={(topicId) =>
                workspace.updateLessonSelection(topicId, "detail")
              }
              onRailTabChange={workspace.updateActiveRailTab}
              onStartLesson={(topicId) => {
                voice.disconnectSession();
                workspace.loadLesson(topicId);
              }}
              onSuggestedPrompt={voice.sendSuggestedPrompt}
              selectedLesson={workspace.selectedLesson}
              selectedTopicId={workspace.selectedTopicId}
              sessionPhase={voice.sessionPhase}
              suggestedPrompts={suggestedPrompts}
              topicStatusById={workspace.topicStatusById}
              transcripts={voice.transcripts}
              tutorNote={tutorNote}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
