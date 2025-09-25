import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary to-accent animate-glow" />
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
            FalconBuilder
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a
            href="#builder"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Builder
          </a>
          <a
            href="#game"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Relax Game
          </a>
          <a
            href="#chat"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            AI Chat
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <a href="#builder">
            <Button size="sm">Get Started</Button>
          </a>
        </div>
      </div>
    </header>
  );
}
