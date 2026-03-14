"use client";

import {
  ChevronDown,
  LogOut,
  RefreshCcw,
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
import { Skeleton } from "~/components/ui/skeleton";
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
  const shouldExpandTerminal =
    workspace.isRunningCommand ||
    workspace.runtime.command.trim().length > 0 ||
    workspace.runtime.command === PYTEST_COMMAND ||
    workspace.runtime.stderr.trim().length > 0;

  useEffect(() => {
    if (!workspace.isSessionPending && !workspace.session?.user) {
      router.replace("/");
    }
  }, [router, workspace.isSessionPending, workspace.session]);

  if (workspace.isSessionPending || workspace.isBootstrapping) {
    return (
      <main className="h-[100dvh] overflow-hidden bg-transparent px-3 py-3 text-[#16211b] sm:px-4 sm:py-4">
        <div className="workspace-shell mx-auto flex h-full max-w-[1780px] flex-col overflow-hidden rounded-[30px] border border-[rgba(20,31,24,0.14)] p-4">
          <div className="rounded-[28px] border border-black/8 bg-[#0b0f0d] px-5 py-4">
            <div className="flex items-center justify-end">
              <Skeleton className="h-14 w-72 rounded-full bg-white/14" />
            </div>
          </div>

          <div className="mt-4 grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
            <section className="min-h-0">
                <div className="codebase-shell h-full rounded-[24px] border border-[rgba(20,31,24,0.1)] overflow-hidden">
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
                  <Skeleton className="min-h-[20rem] flex-1 w-full rounded-none bg-[#0e131d]" />
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
    <main className="h-[100dvh] overflow-hidden bg-transparent px-3 py-3 text-[#16211b] sm:px-4 sm:py-4">
      <div className="workspace-shell mx-auto flex h-full max-w-[1780px] flex-col overflow-hidden rounded-[30px] border border-[rgba(20,31,24,0.14)]">
        <header className="flex items-center justify-end border-b border-black/10 bg-[#0b0f0d] px-5 py-4">
          <div className="flex items-center">
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

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 p-4 xl:grid-cols-[minmax(0,1fr)_420px]">
          <section
            ref={workspaceRegionRef}
            className="min-h-0"
          >
              <div className="codebase-shell flex h-full min-h-0 flex-col overflow-hidden rounded-[26px] border border-[rgba(20,31,24,0.1)]">
                <CodeEditorSurface
                  activeFile={workspace.activeFile}
                  className="min-h-0 flex-[1_1_auto]"
                  embedded
                  files={workspace.files}
                  onChange={workspace.updateFileContent}
                  onSelectFile={workspace.updateActiveFile}
                />

                <TerminalSurface
                  className={shouldExpandTerminal ? "h-[260px] shrink-0" : "h-[190px] shrink-0"}
                  embedded
                  isRunningCommand={workspace.isRunningCommand}
                  onProgramInputChange={workspace.updateProgramInput}
                  onRunProgram={workspace.runProgram}
                  programInput={workspace.programInput}
                  terminalBuffer={workspace.terminalBuffer}
                />
              </div>
          </section>

          <div className="min-h-0">
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
