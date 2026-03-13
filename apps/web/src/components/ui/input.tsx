"use client";

import type { ComponentPropsWithoutRef } from "react";

import { cn } from "~/lib/utils";

export function Input({
  className,
  ...props
}: ComponentPropsWithoutRef<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border border-white/10 bg-[#0f1622] px-4 text-sm text-[#edf3ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none placeholder:text-[#7990b2] focus:border-[#52d7c0] focus:ring-3 focus:ring-[#52d7c0]/15",
        className,
      )}
      {...props}
    />
  );
}
