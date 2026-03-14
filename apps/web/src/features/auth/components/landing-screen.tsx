"use client";

import { ArrowRight, KeyRound, LoaderCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";

import { signIn, useSession } from "../services/auth-client";

export function LandingScreen() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!session?.user) {
      return;
    }

    router.replace("/app");
  }, [router, session]);

  const handleLogin = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      await signIn.email(
        {
          email,
          password,
        },
        {
          onSuccess: () => {
            router.push("/app");
          },
          onError: (context) => {
            setError(context.error.message ?? "Unable to sign in.");
          },
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#eaf3ee] px-6 py-10 text-[#16211b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(132,215,174,0.36),transparent_30%),radial-gradient(circle_at_80%_15%,rgba(212,235,248,0.55),transparent_24%),linear-gradient(180deg,#edf5ef_0%,#e7f0ea_46%,#ecf4ef_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-black/8" />

      <div className="relative w-full max-w-3xl">
        <Card className="mx-auto max-w-xl rounded-[32px] border border-[rgba(20,31,24,0.12)] bg-[linear-gradient(180deg,rgba(248,251,247,0.96),rgba(240,246,242,0.98))] py-0 shadow-[0_30px_120px_rgba(17,28,22,0.12)] backdrop-blur-xl">
          <CardHeader className="items-center px-8 pt-8 text-center">
            <Badge className="border-[#b8d7c4] bg-[#dff1e5] px-3 py-1 text-[11px] leading-none uppercase tracking-[0.26em] text-[#255845]">
              <Sparkles className="h-3.5 w-3.5 text-[#2f735f]" />
              Gemini Live Agent Challenge
            </Badge>
            <CardTitle className="workspace-heading mt-5 text-[clamp(3.5rem,7vw,5rem)] leading-[0.96] text-[#16211b]">
              Agent Tutor
            </CardTitle>
            <CardDescription className="mx-auto mt-5 max-w-[34rem] text-base leading-[1.65] text-[#44554b]">
              A disposable Python practice workspace with a live voice tutor.
              Log in, code, run commands, and ask for help without leaving the
              lesson.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <div className="mt-2 flex justify-center">
              {!isOpen && !session?.user ? (
                <Button
                  type="button"
                  size="lg"
                  onClick={() => setIsOpen(true)}
                  className="h-14 rounded-full border border-[#b8d7c4] bg-[linear-gradient(180deg,#3b7d68,#2f735f)] px-7 text-[15px] leading-none font-semibold text-[#f4fff8] shadow-[0_18px_50px_rgba(47,115,95,0.22)] hover:bg-[linear-gradient(180deg,#44886f,#336f5d)]"
                >
                  <KeyRound className="mr-2 h-4 w-4" />
                  Login
                </Button>
              ) : null}

              {session?.user ? (
                <Button
                  type="button"
                  size="lg"
                  onClick={() => router.push("/app")}
                  className="h-14 rounded-full border border-[#b8d7c4] bg-[linear-gradient(180deg,#3b7d68,#2f735f)] px-7 text-[15px] leading-none font-semibold text-[#f4fff8] shadow-[0_18px_50px_rgba(47,115,95,0.22)] hover:bg-[linear-gradient(180deg,#44886f,#336f5d)]"
                >
                  Open app
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : null}
            </div>

            {isOpen && !session?.user ? (
              <Card className="mx-auto mt-8 max-w-md rounded-[28px] border border-[rgba(20,31,24,0.1)] bg-[#f8fbf7]/95 py-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                <CardContent className="space-y-4 p-5">
                  <div className="space-y-1">
                    <p className="text-[13px] font-semibold tracking-[0.08em] text-[#2f735f] uppercase">
                      Judge access
                    </p>
                    <p className="text-sm leading-6 text-[#55685d]">
                      Use the provided account to enter the workspace.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label
                        htmlFor="judge-email"
                        className="text-[13px] font-semibold leading-5 tracking-normal text-[#33483d]"
                      >
                        Email
                      </Label>
                      <Input
                        id="judge-email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="mt-0 border-[rgba(20,31,24,0.1)] bg-[#fdfefd] text-[#16211b] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] placeholder:text-[#7a8d82] focus:border-[#4ea487] focus:ring-[#4ea487]/15"
                        placeholder="judge@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="judge-password"
                        className="text-[13px] font-semibold leading-5 tracking-normal text-[#33483d]"
                      >
                        Password
                      </Label>
                      <Input
                        id="judge-password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="mt-0 border-[rgba(20,31,24,0.1)] bg-[#fdfefd] text-[#16211b] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] placeholder:text-[#7a8d82] focus:border-[#4ea487] focus:ring-[#4ea487]/15"
                        placeholder="••••••••••"
                      />
                    </div>
                  </div>

                  {error ? (
                    <Alert
                      variant="destructive"
                      className="rounded-2xl border-[#d3aaa3] bg-[#f8e6e2] px-4 py-3"
                    >
                      <AlertTitle className="text-[#8a4338]">
                        Sign-in failed
                      </AlertTitle>
                      <AlertDescription className="text-[#8a4338]/90">
                        {error}
                      </AlertDescription>
                    </Alert>
                  ) : null}

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      size="lg"
                      disabled={isSubmitting}
                      onClick={() => void handleLogin()}
                      className="h-12 flex-1 rounded-full border border-[#b8d7c4] bg-[linear-gradient(180deg,#3b7d68,#2f735f)] text-[#f4fff8] hover:bg-[linear-gradient(180deg,#44886f,#336f5d)]"
                    >
                      {isSubmitting ? (
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Enter workspace
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => setIsOpen(false)}
                      className="h-12 rounded-full border-[rgba(20,31,24,0.1)] bg-transparent px-5 text-[#385043] hover:bg-[#edf4ef]"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {isPending || session?.user ? (
              <>
                <Separator className="mt-8 bg-[rgba(20,31,24,0.1)]" />
                <div className="mt-4 text-center text-[13px] leading-5 text-[#5a6e62]">
                  {isPending ? "Checking session…" : `Signed in as ${session.user.email}`}
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
