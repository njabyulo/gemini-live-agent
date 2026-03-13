"use client";

import { ArrowRight, KeyRound, LoaderCircle, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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

  const helperLabel = useMemo(() => {
    if (session?.user) {
      return `Signed in as ${session.user.email}`;
    }

    return "Judges will receive a pre-created account. No sign up flow is needed.";
  }, [session]);

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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08101a] px-6 py-10 text-[#edf3ff]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,143,255,0.18),transparent_30%),radial-gradient(circle_at_80%_15%,rgba(86,219,197,0.18),transparent_24%),linear-gradient(180deg,#08101a_0%,#0d1725_46%,#08101a_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />

      <div className="relative w-full max-w-3xl">
        <Card className="mx-auto max-w-xl rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,37,0.9),rgba(10,16,25,0.96))] py-0 shadow-[0_30px_140px_rgba(3,8,16,0.65)] backdrop-blur-xl">
          <CardHeader className="items-center px-8 pt-8 text-center">
            <Badge className="border-[#7ce7d3]/18 bg-[#112b2a] px-3 py-1 text-[11px] uppercase tracking-[0.26em] text-[#9fe8da]">
              <Sparkles className="h-3.5 w-3.5 text-[#74e3cc]" />
              Gemini Live Agent Challenge
            </Badge>
            <CardTitle className="workspace-heading mt-6 text-[clamp(3rem,8vw,5.75rem)] leading-[0.92] text-white">
              Agent Tutor
            </CardTitle>
            <CardDescription className="mx-auto mt-4 max-w-lg text-[15px] leading-7 text-[#b8c7dc]">
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
                  className="h-14 rounded-full border border-[#4dd7bf]/30 bg-[linear-gradient(180deg,#123c37,#102b31)] px-7 text-[15px] font-semibold text-[#e7fff8] shadow-[0_18px_60px_rgba(8,32,30,0.45)] hover:bg-[linear-gradient(180deg,#184943,#12343b)]"
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
                  className="h-14 rounded-full border border-[#4dd7bf]/30 bg-[linear-gradient(180deg,#123c37,#102b31)] px-7 text-[15px] font-semibold text-[#e7fff8] shadow-[0_18px_60px_rgba(8,32,30,0.45)] hover:bg-[linear-gradient(180deg,#184943,#12343b)]"
                >
                  Open app
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : null}
            </div>

            {isOpen && !session?.user ? (
              <Card className="mx-auto mt-8 max-w-md rounded-[28px] border border-white/10 bg-[#0c1320]/90 py-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <CardContent className="space-y-4 p-5">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label
                        htmlFor="judge-email"
                        className="workspace-eyebrow text-[#8ea7ca]"
                      >
                        Email
                      </Label>
                      <Input
                        id="judge-email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="mt-0"
                        placeholder="judge@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="judge-password"
                        className="workspace-eyebrow text-[#8ea7ca]"
                      >
                        Password
                      </Label>
                      <Input
                        id="judge-password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="mt-0"
                        placeholder="••••••••••"
                      />
                    </div>
                  </div>

                  {error ? (
                    <Alert
                      variant="destructive"
                      className="rounded-2xl border-[#ff997b]/20 bg-[#3b1614] px-4 py-3"
                    >
                      <AlertTitle className="text-[#ffd5ca]">
                        Sign-in failed
                      </AlertTitle>
                      <AlertDescription className="text-[#ffd5ca]/90">
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
                      className="h-12 flex-1 rounded-full border border-[#4dd7bf]/30 bg-[linear-gradient(180deg,#123c37,#102b31)] text-[#e7fff8] hover:bg-[linear-gradient(180deg,#184943,#12343b)]"
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
                      className="h-12 rounded-full border-white/10 bg-transparent px-5 text-[#dbe6f8] hover:bg-white/6"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            <Separator className="mt-8 bg-white/8" />
            <div className="mt-5 text-center text-sm text-[#89a1c1]">
              {isPending ? "Checking session…" : helperLabel}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
