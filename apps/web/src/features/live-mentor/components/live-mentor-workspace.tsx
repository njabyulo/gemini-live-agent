"use client";

import {
  ChevronDown,
  LogOut,
  RefreshCcw,
  UserRound,
} from "lucide-react";
import { useEffect } from "react";
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
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { signOut } from "~/features/auth/services/auth-client";

import { useLiveMentorWorkspace } from "../hooks/use-live-mentor-workspace";
import { useVoiceMentor } from "../hooks/use-voice-mentor";
import { CodeEditorSurface } from "./code-editor-surface";
import { TerminalSurface } from "./terminal-surface";
import { VoiceAgentPanel } from "./voice-agent-panel";

const getInitials = (email: string) =>
  email
    .split("@")[0]
    ?.split(/[._-]/u)
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment.slice(0, 1).toUpperCase())
    .join("") || "JT";

export function LiveMentorWorkspace() {
  const router = useRouter();
  const workspace = useLiveMentorWorkspace();
  const voice = useVoiceMentor();

  useEffect(() => {
    if (!workspace.isSessionPending && !workspace.session?.user) {
      router.replace("/");
    }
  }, [router, workspace.isSessionPending, workspace.session]);

  if (workspace.isSessionPending || workspace.isBootstrapping) {
    return (
      <main className="min-h-screen bg-[#08101a] px-3 py-3 text-[#edf3ff] sm:px-4 sm:py-4">
        <div className="workspace-shell mx-auto min-h-[calc(100vh-1.5rem)] max-w-[1780px] overflow-hidden rounded-[30px] border border-white/10 p-4">
          <div className="rounded-[28px] border border-white/8 bg-[#0c111a] p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-3">
                <Skeleton className="h-3 w-28 bg-white/10" />
                <Skeleton className="h-10 w-80 bg-white/12" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-56 rounded-full bg-white/10" />
                <Skeleton className="h-12 w-44 rounded-full bg-white/10" />
              </div>
            </div>
          </div>

          <div className="mt-4 grid min-h-[calc(100vh-9rem)] grid-cols-1 gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(340px,1fr)]">
            <section className="grid min-h-0 grid-rows-[minmax(0,1fr)_320px] gap-4">
              <div className="panel-surface rounded-[24px] border border-white/8 p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-2xl bg-white/10" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24 bg-white/10" />
                    <Skeleton className="h-4 w-44 bg-white/12" />
                  </div>
                </div>
                <Separator className="my-4 bg-white/8" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-28 rounded-t-2xl bg-white/10" />
                  <Skeleton className="h-9 w-28 rounded-t-2xl bg-white/8" />
                  <Skeleton className="h-9 w-28 rounded-t-2xl bg-white/8" />
                </div>
                <Separator className="my-4 bg-white/8" />
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-3 w-44 bg-white/10" />
                  <Skeleton className="h-7 w-24 rounded-full bg-white/10" />
                </div>
                <Skeleton className="mt-4 h-[calc(100%-9rem)] min-h-[22rem] w-full rounded-[18px] bg-[#0e131d]" />
              </div>

              <div className="panel-surface rounded-[24px] border border-white/8 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-2xl bg-white/10" />
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-20 bg-white/10" />
                      <Skeleton className="h-4 w-56 bg-white/12" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-24 rounded-xl bg-white/10" />
                    <Skeleton className="h-8 w-24 rounded-xl bg-white/10" />
                  </div>
                </div>
                <Separator className="my-4 bg-white/8" />
                <div className="grid gap-3 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_auto]">
                  <Skeleton className="h-20 rounded-[26px] bg-white/10" />
                  <Skeleton className="h-20 rounded-[26px] bg-white/8" />
                  <Skeleton className="h-20 rounded-[26px] bg-white/10" />
                </div>
                <Skeleton className="mt-4 h-36 rounded-[18px] bg-[#0c111b]" />
              </div>
            </section>

            <div className="panel-surface rounded-[24px] border border-white/8 p-5">
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
                    <Skeleton className="h-5 w-20 bg-white/12" />
                  </div>
                  <Skeleton className="h-20 w-4/5 rounded-2xl bg-white/8" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-end gap-3">
                    <Skeleton className="h-5 w-16 bg-white/12" />
                    <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
                  </div>
                  <Skeleton className="ml-auto h-16 w-3/4 rounded-2xl bg-white/8" />
                </div>
              </div>
              <div className="mt-10 flex items-center justify-end gap-3">
                <Skeleton className="h-[4.75rem] flex-1 rounded-[1.55rem] bg-white/8" />
                <Skeleton className="h-[5.1rem] w-[5.1rem] rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08101a] px-3 py-3 text-[#edf3ff] sm:px-4 sm:py-4">
      <div className="workspace-shell mx-auto min-h-[calc(100vh-1.5rem)] max-w-[1780px] overflow-hidden rounded-[30px] border border-white/10">
        <header className="flex items-center justify-between gap-4 border-b border-white/8 bg-[#0c111a] px-5 py-4">
          <div className="min-w-0">
            <p className="workspace-eyebrow">Agent tutor</p>
            <h1 className="workspace-heading truncate text-[2.1rem] text-white">
              Python foundations workspace
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger>
                <Badge className="rounded-full border border-[#ffcb76]/18 bg-[#2c2416] px-3 py-1.5 text-xs font-medium text-[#ffdca6]">
                  Reload resets this lesson workspace
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                This workspace is disposable for the hackathon demo.
              </TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-3 rounded-full border border-white/10 bg-[#141b28] px-3 py-2 text-left text-[#eff5ff] transition hover:bg-[#182130]"
                >
                  <Avatar
                    size="lg"
                    className="border border-[#22424a] bg-[#17323a]"
                  >
                    <AvatarFallback className="bg-[#17323a] text-sm font-semibold text-[#dcfff8]">
                      {getInitials(workspace.userEmail)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm sm:inline">
                    {workspace.userEmail}
                  </span>
                  <ChevronDown className="h-4 w-4 text-[#9bb0ce]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 border-white/10 bg-[#0f1520] text-[#eef4ff]"
              >
                <DropdownMenuLabel className="text-[#9ab1cf]">
                  Judge session
                </DropdownMenuLabel>
                <DropdownMenuItem className="gap-2 text-[#eef4ff] focus:bg-[#162131] focus:text-white">
                  <UserRound className="h-4 w-4" />
                  {workspace.userEmail}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  className="gap-2 text-[#eef4ff] focus:bg-[#162131] focus:text-white"
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

        <div className="grid min-h-[calc(100vh-7rem)] grid-cols-1 gap-4 p-4 xl:grid-cols-[minmax(0,3fr)_minmax(340px,1fr)]">
          <section className="grid min-h-0 grid-rows-[minmax(0,1fr)_320px] gap-4 xl:min-h-[calc(100vh-9rem)]">
            <CodeEditorSurface
              activeFile={workspace.activeFile}
              files={workspace.files}
              onChange={workspace.updateFileContent}
              onSelectFile={workspace.updateActiveFile}
            />

            <TerminalSurface
              isRunningCommand={workspace.isRunningCommand}
              onProgramInputChange={workspace.updateProgramInput}
              onReset={workspace.resetLesson}
              onRunProgram={workspace.runProgram}
              onRunTests={workspace.runTests}
              programInput={workspace.programInput}
              terminalBuffer={workspace.terminalBuffer}
            />
          </section>

          <div className="min-h-0 xl:h-[calc(100vh-9rem)]">
            <VoiceAgentPanel
              inputLevel={voice.inputLevel}
              isCapturingAudio={voice.isCapturingAudio}
              isSessionLive={voice.isSessionLive}
              onConnect={voice.connectSession}
              onDisconnect={voice.disconnectSession}
              transcripts={voice.transcripts}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
