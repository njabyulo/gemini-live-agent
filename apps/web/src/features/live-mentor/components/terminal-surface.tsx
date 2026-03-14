"use client";

import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import { FlaskConical, RotateCcw, TerminalSquare } from "lucide-react";
import { useEffect, useRef } from "react";

import type {
  IRuntimeSnapshot,
} from "@agent-tutor/shared/types";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import {
  DEFAULT_PROGRAM_INPUT,
  PYTHON_COMMAND_PREFIX,
} from "../utils/terminal";

export function TerminalSurface({
  ambientCue,
  isRunningCommand,
  onProgramInputChange,
  onReset,
  onRunProgram,
  onRunTests,
  programInput,
  runtime,
  terminalBuffer,
}: {
  ambientCue: string;
  isRunningCommand: boolean;
  onProgramInputChange: (value: string) => void;
  onReset: () => void;
  onRunProgram: () => void;
  onRunTests: () => void;
  programInput: string;
  runtime: IRuntimeSnapshot;
  terminalBuffer: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!containerRef.current || terminalRef.current) {
      return;
    }

    const terminal = new Terminal({
      allowTransparency: true,
      convertEol: true,
      cursorBlink: false,
      cursorStyle: "bar",
      disableStdin: true,
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      lineHeight: 1.35,
      theme: {
        background: "#0c111b",
        brightBlue: "#6fb5ff",
        brightCyan: "#7ce7d3",
        brightGreen: "#a7f3a0",
        brightRed: "#ff8f7b",
        foreground: "#dbe6f8",
        red: "#ff7d6a",
      },
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(containerRef.current);
    fitAddon.fit();

    terminalRef.current = terminal;
    fitAddonRef.current = fitAddon;

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      fitAddon.dispose();
      terminal.dispose();
      terminalRef.current = null;
      fitAddonRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!terminalRef.current) {
      return;
    }

    terminalRef.current.reset();
    terminalRef.current.write(terminalBuffer);
    fitAddonRef.current?.fit();
  }, [terminalBuffer]);

  return (
    <section className="panel-surface flex min-h-0 flex-col overflow-hidden rounded-[24px] border border-[rgba(20,31,24,0.1)]">
      <div className="flex flex-col gap-3 border-b border-[rgba(20,31,24,0.1)] bg-[#f7fbf7] px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-[#c4d8cd] bg-[#e5edf0] p-2 text-[#466b7a]">
            <TerminalSquare className="h-4 w-4" />
          </div>
          <div>
            <p className="workspace-eyebrow">Terminal</p>
            <p className="text-[0.96rem] leading-6 text-[#233328]">
              Run the program, inspect the output, then tighten the fix.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Separator
            orientation="vertical"
            className="hidden h-8 bg-[rgba(20,31,24,0.1)] sm:block"
          />
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onRunTests}
            disabled={isRunningCommand}
            className="h-10 rounded-full border-[#c6d9ce] bg-[#edf4ef] px-4 text-[0.92rem] text-[#27463a] hover:bg-[#e3efe7]"
          >
            <FlaskConical className="mr-2 h-4 w-4" />
            Run tests
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onReset}
            className="h-10 rounded-full border-[rgba(20,31,24,0.1)] bg-[#f8fbf7] px-4 text-[0.92rem] text-[#385043] hover:bg-[#eef4ef]"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset lesson
          </Button>
        </div>
      </div>

      <div className="border-b border-[rgba(20,31,24,0.1)] bg-[#edf4ef] px-4 py-3">
        <form
          className="grid gap-3 lg:grid-cols-[max-content_minmax(0,1fr)_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            onRunProgram();
          }}
        >
          <div className="flex min-h-11 items-center rounded-full border border-[rgba(20,31,24,0.1)] bg-[#f8fbf7] px-4 font-mono text-[0.94rem] text-[#1d2a21] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
            <span className="mr-3 text-[#5f7468]">$</span>
            <span>{PYTHON_COMMAND_PREFIX}</span>
          </div>

          <div className="flex min-h-11 min-w-0 items-center rounded-full border border-[rgba(20,31,24,0.1)] bg-[#f8fbf7] px-4">
            <Input
              id="program-argument"
              value={programInput}
              onChange={(event) => onProgramInputChange(event.target.value)}
              placeholder={DEFAULT_PROGRAM_INPUT}
              className="h-10 border-0 bg-transparent px-0 font-mono text-[0.95rem] leading-6 text-[#1d2a21] placeholder:text-[#748679] focus-visible:ring-0"
            />
          </div>

          <div className="flex items-stretch justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={isRunningCommand}
              className="h-11 rounded-full bg-[#2f735f] px-6 text-sm font-semibold text-[#f5fff8] hover:bg-[#336f5d]"
            >
              {isRunningCommand ? "Running..." : "Run"}
            </Button>
          </div>
        </form>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.79rem] leading-5 text-[#52685b]">
          <p className="max-w-[52rem]">
            {ambientCue}
          </p>
          {runtime.command ? (
            <Badge className="rounded-full border border-[#c6d9ce] bg-[#edf4ef] px-3 py-1 text-[11px] text-[#45636e] shadow-none">
              Last command: {runtime.command}
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="terminal-surface min-h-0 flex-1 bg-[#0c111b] p-3">
        <div ref={containerRef} className="h-full w-full" />
      </div>
    </section>
  );
}
