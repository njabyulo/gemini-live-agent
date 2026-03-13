"use client";

import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import { FlaskConical, RotateCcw, TerminalSquare } from "lucide-react";
import { useEffect, useRef } from "react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import {
  DEFAULT_PROGRAM_INPUT,
  PYTHON_COMMAND_PREFIX,
} from "../utils/terminal";

export function TerminalSurface({
  isRunningCommand,
  onProgramInputChange,
  onReset,
  onRunProgram,
  onRunTests,
  programInput,
  terminalBuffer,
}: {
  isRunningCommand: boolean;
  onProgramInputChange: (value: string) => void;
  onReset: () => void;
  onRunProgram: () => void;
  onRunTests: () => void;
  programInput: string;
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
    <section className="panel-surface flex min-h-0 flex-col overflow-hidden rounded-[24px] border border-white/8">
      <div className="flex items-center justify-between gap-3 border-b border-white/8 bg-[#0d121b] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-[#6fb5ff]/18 bg-[#132134] p-2 text-[#6fb5ff]">
            <TerminalSquare className="h-4 w-4" />
          </div>
          <div>
            <p className="workspace-eyebrow">Terminal</p>
            <p className="text-sm text-[#dbe6f8]">
              Learn how Python runs by changing only the argument input.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Separator
            orientation="vertical"
            className="hidden h-8 bg-white/8 sm:block"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRunTests}
            disabled={isRunningCommand}
            className="border-[#86b8ff]/16 bg-[#101927] text-[#d9e7ff] hover:bg-[#142033]"
          >
            <FlaskConical className="mr-2 h-4 w-4" />
            Run tests
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            className="border-white/10 bg-white/5 text-[#dbe6f8] hover:bg-white/8"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset lesson
          </Button>
        </div>
      </div>

      <div className="border-b border-white/8 bg-[#0f1622] px-4 py-3">
        <form
          className="grid gap-3 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            onRunProgram();
          }}
        >
          <div className="flex min-h-[4.75rem] min-w-0 items-center justify-center rounded-[26px] border border-[#7ce7d3]/12 bg-[#b0e6b6] px-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]">
            <div>
              <Badge className="border-[#24462e]/15 bg-[#d7f4da] text-[#2b4a33] shadow-none">
                Guided command
              </Badge>
              <p className="mt-1 font-mono text-[1.15rem] font-semibold tracking-[-0.04em] text-[#17311d] sm:text-[1.35rem]">
                {PYTHON_COMMAND_PREFIX}
              </p>
            </div>
          </div>

          <div className="flex min-h-[4.75rem] min-w-0 items-center rounded-[26px] border border-[#dbe6f8]/14 bg-[#0b1018] px-5">
            <div className="min-w-0 flex-1">
              <Label
                htmlFor="program-argument"
                className="workspace-eyebrow text-[#8fa5c7]"
              >
                Argument input
              </Label>
              <Input
                id="program-argument"
                value={programInput}
                onChange={(event) => onProgramInputChange(event.target.value)}
                placeholder={DEFAULT_PROGRAM_INPUT}
                className="mt-1 h-auto border-0 bg-transparent px-0 text-[1.05rem] text-[#e7eefb] placeholder:text-[#5d708f] focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="flex items-stretch">
            <Button
              type="submit"
              size="lg"
              disabled={isRunningCommand}
              className="h-full min-h-[4.75rem] w-full rounded-[26px] bg-[#173a39] px-6 text-[#e5fff8] hover:bg-[#1d4846] xl:w-auto"
            >
              {isRunningCommand ? "Running..." : "Run"}
            </Button>
          </div>
        </form>
      </div>

      <div className="terminal-surface min-h-0 flex-1 bg-[#0c111b] p-3">
        <div ref={containerRef} className="h-full w-full" />
      </div>
    </section>
  );
}
