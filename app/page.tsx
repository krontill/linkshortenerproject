import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Link2,
  BarChart3,
  Share2,
  LayoutDashboard,
  Zap,
  ShieldCheck,
  UserPlus,
  ClipboardPaste,
  MousePointerClick,
} from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "Shorten URLs",
    description:
      "Transform long, unwieldy URLs into clean, compact links in seconds.",
  },
  {
    icon: BarChart3,
    title: "Track Clicks",
    description:
      "See how many times each link has been clicked with real-time analytics.",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description:
      "Copy and share your shortened links instantly across any platform.",
  },
  {
    icon: LayoutDashboard,
    title: "Manage All Links",
    description:
      "View, edit, and delete all your links from a single, organized dashboard.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Redirects are served at the edge for sub-millisecond response times.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    description:
      "Your links are tied to your account — no one else can modify or delete them.",
  },
];

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: "Create a free account",
    description:
      "Sign up in seconds — no credit card required.",
  },
  {
    number: 2,
    icon: ClipboardPaste,
    title: "Paste your long URL",
    description:
      "Drop any URL into the dashboard and we'll generate a short link instantly.",
  },
  {
    number: 3,
    icon: Link2,
    title: "Share your short link",
    description:
      "Copy the compact link and share it anywhere — social media, email, or messages.",
  },
  {
    number: 4,
    icon: MousePointerClick,
    title: "Watch the clicks roll in",
    description:
      "Monitor click counts in real time from your personal dashboard.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 px-4 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          Shorten. Share. Track.
        </h1>
        <p className="text-muted-foreground max-w-xl text-lg">
          Turn long URLs into neat, shareable links and follow every click — all
          from one simple dashboard.
        </p>
        <div className="flex gap-4">
          <SignUpButton mode="modal">
            <Button size="lg">Get started free</Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button variant="outline" size="lg">
              Sign in
            </Button>
          </SignInButton>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full max-w-5xl px-4 pb-24">
        <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight">
          How it works
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ number, icon: Icon, title, description }) => (
            <div key={number} className="flex flex-col items-center gap-3 text-center">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-border bg-muted">
                <Icon className="h-6 w-6" />
                <span className="bg-primary text-primary-foreground absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold">
                  {number}
                </span>
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-muted-foreground text-sm">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="w-full max-w-5xl px-4 pb-24">
        <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight">
          Everything you need
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardHeader>
                <div className="bg-muted mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Icon className="text-foreground h-5 w-5" />
                </div>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
