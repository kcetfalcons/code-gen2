export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Code Generator. Build better without
          code.
        </p>
        <div className="flex items-center gap-4">
          <a href="#builder" className="hover:text-foreground">
            Builder
          </a>
          <a href="#game" className="hover:text-foreground">
            Relax Game
          </a>
          <a href="#chat" className="hover:text-foreground">
            AI Chat
          </a>
        </div>
      </div>
    </footer>
  );
}
