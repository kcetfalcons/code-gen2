import VisualBuilder from "@/components/app/VisualBuilder";
import RelaxGame from "@/components/app/RelaxGame";
import AIChatBox from "@/components/app/AIChatBox";

export default function Index() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_10%,black,transparent)] bg-[radial-gradient(60%_60%_at_50%_-10%,hsl(var(--primary)/.25),transparent_60%)]" />
        <div className="container py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Build websites without code
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Create pages in HTML, CSS and React—no coding required. Relax with an ad‑free game and get help from our built‑in AI assistant.
              </p>
              <div className="mt-6 flex gap-3">
                <a href="#builder" className="inline-flex"><span className="sr-only">Get started</span></a>
                <a href="#builder" className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground shadow hover:bg-primary/90">Start Building</a>
                <a href="#game" className="inline-flex items-center rounded-md border px-4 py-2">Take a break</a>
              </div>
              <div className="mt-6 text-sm text-muted-foreground">Made for non‑coders. Powered by modern web tech.</div>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl" />
              <div className="relative rounded-2xl border bg-background p-4 shadow-lg">
                <div className="rounded-md border bg-muted p-2 text-xs text-muted-foreground">Live preview</div>
                <div className="mt-3 grid gap-3">
                  <div className="h-4 w-2/3 rounded bg-secondary" />
                  <div className="h-3 w-4/5 rounded bg-secondary" />
                  <div className="h-3 w-3/4 rounded bg-secondary" />
                  <div className="h-8 w-40 rounded-md bg-primary/80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <VisualBuilder />
      <RelaxGame />
      <AIChatBox />
    </div>
  );
}
