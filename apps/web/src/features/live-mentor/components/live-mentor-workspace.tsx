"use client";

import {
  AlertCircle,
  Bot,
  Mic,
  MicOff,
  Play,
  Send,
  Sparkles,
  Square,
  TestTube2,
  Wand2,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import { useLiveMentorDemo } from "../hooks/use-live-mentor-demo";

export function LiveMentorWorkspace() {
  const {
    code,
    connectSession,
    finishAudioCapture,
    interruptMentor,
    isCapturingAudio,
    isSessionLive,
    messages,
    resetDemo,
    runTests,
    sendTextPrompt,
    sessionPhase,
    setCode,
    setTypedPrompt,
    shareScreenshot,
    startAudioCapture,
    statusLabel,
    stopSession,
    testState,
    typedPrompt,
  } = useLiveMentorDemo();

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1480px] flex-col overflow-hidden rounded-[28px] border border-black/8 panel-surface">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-black/8 px-5 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.32em] text-[color:var(--muted-foreground)]">
              Gemini Live Challenge
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--foreground)]">
              Garrii Live Mentor
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill label={statusLabel} phase={sessionPhase} />
            <div className="rounded-full border border-black/8 bg-white/70 px-3 py-1 text-xs font-medium text-[color:var(--muted-foreground)]">
              Demo URL: gemini-live.njabulomajozi.com
            </div>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 gap-4 p-4 lg:grid-cols-[1.55fr_0.95fr]">
          <section className="grid min-h-0 gap-4">
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <Panel className="gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
                      Lesson
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                      Fix button interaction
                    </h2>
                  </div>
                  <div className="rounded-full bg-[color:var(--accent)] px-3 py-1 text-xs font-semibold text-[color:var(--accent-foreground)]">
                    React Debugging
                  </div>
                </div>
                <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">
                  Understand prop flow and event wiring by fixing a tiny button
                  component without breaking the learner&apos;s momentum.
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <MetricCard
                    label="Objective"
                    value="Correct label + click callback"
                  />
                  <MetricCard label="Current state" value={testState.label} />
                  <MetricCard
                    label="Dopamine hit"
                    value="Red to green in one conversation"
                  />
                </div>
              </Panel>

              <Panel className="gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[color:var(--primary)]" />
                  <p className="text-sm font-semibold">90-second demo beats</p>
                </div>
                <ol className="space-y-2 text-sm leading-6 text-[color:var(--muted-foreground)]">
                  <li>
                    1. Show the failing lesson and click{" "}
                    <span className="font-semibold text-[color:var(--foreground)]">
                      Talk to mentor
                    </span>
                    .
                  </li>
                  <li>
                    2. Say:{" "}
                    <span className="font-semibold text-[color:var(--foreground)]">
                      I ran tests and I&apos;m stuck.
                    </span>
                  </li>
                  <li>
                    3. Share the failure context, rerun tests, and interrupt
                    once.
                  </li>
                  <li>
                    4. Land on{" "}
                    <span className="font-semibold text-[color:var(--foreground)]">
                      Ready to submit
                    </span>
                    .
                  </li>
                </ol>
              </Panel>
            </div>

            <div className="grid min-h-0 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <Panel className="min-h-[420px] gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-[color:var(--primary)]" />
                    <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                      Mock editor
                    </h3>
                  </div>
                  <div className="rounded-full border border-black/8 bg-white/70 px-3 py-1 text-xs font-medium">
                    `apps/web` hosted on Cloudflare
                  </div>
                </div>
                <textarea
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  className="min-h-[320px] flex-1 resize-none rounded-[22px] border border-black/8 bg-[#171819] p-4 font-mono text-sm leading-7 text-[#f6f2eb] shadow-inner outline-none"
                  spellCheck={false}
                />
                <p className="text-xs leading-5 text-[color:var(--muted-foreground)]">
                  The code pane is intentionally deterministic for the
                  hackathon. The live mentor experience is the thing under
                  judgment.
                </p>
              </Panel>

              <Panel className="min-h-[420px] gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <TestTube2 className="h-4 w-4 text-[color:var(--primary)]" />
                    <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                      Test runner
                    </h3>
                  </div>
                  <div className="rounded-full bg-[color:var(--secondary)] px-3 py-1 text-xs font-medium text-[color:var(--secondary-foreground)]">
                    {testState.label}
                  </div>
                </div>
                <div className="rounded-[22px] border border-black/8 bg-[#0e1114] p-4 font-mono text-sm leading-7 text-[#d9f7d6]">
                  <p className="mb-3 text-xs uppercase tracking-[0.22em] text-[#88a59c]">
                    Terminal output
                  </p>
                  <pre className="whitespace-pre-wrap">
                    {testState.terminalOutput}
                  </pre>
                </div>
                <div className="rounded-[22px] bg-[color:var(--secondary)] p-4 text-sm leading-6 text-[color:var(--secondary-foreground)]">
                  <p className="font-semibold">Current mentor angle</p>
                  <p className="mt-1 text-[color:var(--muted-foreground)]">
                    {testState.mentorHint}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    onClick={runTests}
                    disabled={testState.id === "state-3"}
                    className="rounded-full"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Run tests
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void shareScreenshot()}
                    className="rounded-full"
                  >
                    Share screenshot
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetDemo}
                    className="rounded-full"
                  >
                    Reset demo
                  </Button>
                </div>
              </Panel>
            </div>
          </section>

          <Panel className="min-h-0 gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
                  Live mentor
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                  Voice, transcript, interruption
                </h2>
              </div>
              <div className="rounded-2xl border border-black/8 bg-white/70 px-3 py-2 text-right text-xs">
                <p className="font-semibold text-[color:var(--foreground)]">
                  apps/agent-live
                </p>
                <p className="text-[color:var(--muted-foreground)]">
                  Cloud Run runtime
                </p>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <Button
                type="button"
                onClick={connectSession}
                disabled={isSessionLive}
                className="rounded-full"
              >
                <Bot className="mr-2 h-4 w-4" />
                Talk to mentor
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={stopSession}
                disabled={!isSessionLive}
                className="rounded-full"
              >
                <Square className="mr-2 h-4 w-4" />
                Stop session
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => void startAudioCapture()}
                disabled={!isSessionLive || isCapturingAudio}
                className="rounded-full"
              >
                <Mic className="mr-2 h-4 w-4" />
                Start mic
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={finishAudioCapture}
                disabled={!isCapturingAudio}
                className="rounded-full"
              >
                <MicOff className="mr-2 h-4 w-4" />
                Stop mic
              </Button>
            </div>

            <div className="rounded-[24px] border border-black/8 bg-white/75 p-3">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">Transcript</p>
                <div className="text-xs text-[color:var(--muted-foreground)]">
                  State sequence: hard fail {"->"} almost there {"->"} pass
                </div>
              </div>
              <div className="flex max-h-[420px] min-h-[320px] flex-col gap-2 overflow-y-auto pr-1">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "max-w-[92%] rounded-[20px] px-4 py-3 text-sm leading-6 shadow-sm",
                      message.role === "assistant" &&
                        "mr-auto bg-[color:var(--accent)] text-[color:var(--accent-foreground)]",
                      message.role === "user" &&
                        "ml-auto bg-[#17242d] text-white",
                      message.role === "system" &&
                        "mx-auto bg-[color:var(--secondary)] text-[color:var(--secondary-foreground)]",
                    )}
                  >
                    {message.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-black/8 bg-white/75 p-3">
              <label
                htmlFor="typed-prompt"
                className="mb-2 block text-sm font-semibold"
              >
                Typed fallback
              </label>
              <div className="flex gap-2">
                <textarea
                  id="typed-prompt"
                  value={typedPrompt}
                  onChange={(event) => setTypedPrompt(event.target.value)}
                  className="min-h-24 flex-1 resize-none rounded-[18px] border border-black/8 bg-transparent px-4 py-3 text-sm outline-none"
                  placeholder="I reran tests and now the click handler is still failing..."
                />
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    onClick={sendTextPrompt}
                    disabled={!isSessionLive || !typedPrompt.trim()}
                    className="rounded-full"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={interruptMentor}
                    disabled={!isSessionLive}
                    className="rounded-full"
                  >
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Interrupt
                  </Button>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </main>
  );
}

function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "panel-surface flex flex-col rounded-[28px] border border-black/8 p-4",
        className,
      )}
    >
      {children}
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-black/8 bg-white/70 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-3 text-sm font-semibold leading-6">{value}</p>
    </div>
  );
}

function StatusPill({
  label,
  phase,
}: {
  label: string;
  phase: ReturnType<typeof useLiveMentorDemo>["sessionPhase"];
}) {
  return (
    <div
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold",
        phase === "idle" &&
          "bg-[color:var(--secondary)] text-[color:var(--secondary-foreground)]",
        phase === "connecting" && "bg-amber-100 text-amber-900",
        phase === "ready" && "bg-sky-100 text-sky-900",
        phase === "listening" && "bg-emerald-100 text-emerald-900",
        phase === "thinking" && "bg-orange-100 text-orange-900",
        phase === "speaking" && "bg-blue-100 text-blue-900",
        phase === "error" && "bg-red-100 text-red-900",
      )}
    >
      {label}
    </div>
  );
}
