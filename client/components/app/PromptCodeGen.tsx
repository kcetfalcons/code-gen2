import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import CodePreviewTabs from "./CodePreviewTabs";

export default function PromptCodeGen({
  baseHtml,
  baseCss,
  baseReact,
}: {
  baseHtml: string;
  baseCss: string;
  baseReact: string;
}) {
  const [prompt, setPrompt] = useState("");
  const [out, setOut] = useState<{
    html: string;
    css: string;
    react: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const g = heuristicGenerate(prompt, {
        html: baseHtml,
        css: baseCss,
        react: baseReact,
      });
      setOut(g);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container py-12">
      <Card>
        <CardHeader>
          <CardTitle>Prompt to Code</CardTitle>
          <CardDescription>
            Describe what you want. We’ll generate React, HTML, and CSS,
            learning from your current export.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A hero with title 'Welcome', subtitle, and a primary CTA button"
          />
          <div className="flex gap-2">
            <Button onClick={generate} disabled={!prompt.trim() || loading}>
              {loading ? "Generating..." : "Generate Code"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setPrompt("");
                setOut(null);
              }}
            >
              Clear
            </Button>
          </div>
          {out && (
            <div className="mt-4">
              <CodePreviewTabs
                html={out.html}
                css={out.css}
                react={out.react}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function heuristicGenerate(
  prompt: string,
  base: { html: string; css: string; react: string },
) {
  const p = prompt.toLowerCase();
  const title =
    matchText(prompt, /title '([^']+)'|title "([^"]+)"/i) || "Welcome";
  const btn = matchText(prompt, /button '?"?([^'"\n]+)'?"?/i) || "Get Started";

  let html = `<!-- Prompt: ${escapeHtml(prompt)} -->\n<main>\n  <section class="hero">\n    <h1>${escapeHtml(title)}</h1>\n    <p>Create websites without code.</p>\n    <a href="#" class="btn-primary">${escapeHtml(btn)}</a>\n  </section>\n</main>`;

  let css = `/* Based on current export */\n${base.css}\n\n/* Prompt styles */\n.hero{ max-width: 960px; margin: 0 auto; padding: 3rem 1rem; }\n.hero h1{ font-size: clamp(2rem, 5vw, 3rem); line-height:1.1 }\n.hero p{ color:#6b7280; margin: .75rem 0 1rem }\n.btn-primary{ display:inline-block; background:#7c3aed; color:white; padding:.6rem 1rem; border-radius:.6rem }`;

  let react = `// Prompt: ${prompt}\nexport default function Section(){\n  return (\n    <main className="max-w-4xl mx-auto p-6">\n      <section className="text-center">\n        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">${title}</h1>\n        <p className="text-muted-foreground mt-3">Create websites without code.</p>\n        <a href="#" className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground mt-4">${btn}</a>\n      </section>\n    </main>\n  )\n}`;

  if (p.includes("grid")) {
    html = html.replace(
      "</main>",
      `  <section class=\"grid\">\n    <div class=\"card\">Card 1</div>\n    <div class=\"card\">Card 2</div>\n    <div class=\"card\">Card 3</div>\n  </section>\n</main>`,
    );
    css += `\n.grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap: 1rem; margin-top: 2rem }\n.card{ background:#111827; color:#e5e7eb; padding:1rem; border-radius:.75rem }`;
    react = react.replace(
      "</section>",
      `  <div className=\"mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4\">\n          <div className=\"rounded-lg border p-4\">Card 1</div>\n          <div className=\"rounded-lg border p-4\">Card 2</div>\n          <div className=\"rounded-lg border p-4\">Card 3</div>\n        </div>\n      </section>`,
    );
  }

  return { html, css, react };
}

function matchText(s: string, re: RegExp) {
  const m = s.match(re);
  if (!m) return null;
  return m[1] || m[2] || null;
}
function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ] as string,
  );
}
