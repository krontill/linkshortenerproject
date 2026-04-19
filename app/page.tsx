import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <main className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Link Shortener</h1>
        <p className="text-muted-foreground text-lg">
          Shorten, share, and track your links.
        </p>
        <div className="flex gap-4">
          <SignInButton mode="modal">
            <Button variant="outline">Sign in</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button>Get started</Button>
          </SignUpButton>
        </div>
      </main>
    </div>
  );
}
