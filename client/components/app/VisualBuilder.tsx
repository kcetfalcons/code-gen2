import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CodePreviewTabs from "./CodePreviewTabs";

type Block =
  | { id: string; type: "heading"; text: string; level: 1 | 2 | 3 }
  | { id: string; type: "text"; text: string }
  | { id: string; type: "image"; src: string; alt: string }
  | { id: string; type: "button"; label: string; href: string };

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function VisualBuilder() {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: uid(), type: "heading", text: "Welcome to my site", level: 1 },
    { id: uid(), type: "text", text: "Click blocks to edit content." },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = blocks.find((b) => b.id === selectedId) || null;

  const add = (block: Block) => setBlocks((b) => [...b, block]);
  const remove = (id: string) => setBlocks((b) => b.filter((x) => x.id !== id));
  const move = (id: string, dir: -1 | 1) =>
    setBlocks((b) => {
      const i = b.findIndex((x) => x.id === id);
      if (i < 0) return b;
      const j = Math.min(b.length - 1, Math.max(0, i + dir));
      const copy = [...b];
      const [x] = copy.splice(i, 1);
      copy.splice(j, 0, x);
      return copy;
    });

  const html = useMemo(() => {
    const body = blocks
      .map((b) => {
        if (b.type === "heading")
          return `<h${b.level}>${escapeHtml(b.text)}</h${b.level}>`;
        if (b.type === "text") return `<p>${escapeHtml(b.text)}</p>`;
        if (b.type === "image")
          return `<img src="${escapeAttr(b.src)}" alt="${escapeAttr(b.alt)}" />`;
        if (b.type === "button")
          return `<a href="${escapeAttr(b.href)}" class="btn">${escapeHtml(b.label)}</a>`;
        return "";
      })
      .join("\n");
    return `<!doctype html>\n<html>\n  <head>\n    <meta charset=\"utf-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n    <title>My Site</title>\n    <link rel=\"stylesheet\" href=\"styles.css\" />\n  </head>\n  <body>\n    <main>\n${indent(body, 6)}\n    </main>\n  </body>\n</html>`;
  }, [blocks]);

  const css = `:root { --brand: #6d28d9; }\nbody { font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin: 0; padding: 2rem; color: #111827;}\nmain{ max-width: 900px; margin: 0 auto;}\nh1,h2,h3{ line-height: 1.1; }\np{ color:#374151 }\nimg{ max-width:100%; border-radius: 12px }\n.btn{ display:inline-block; background: var(--brand); color:white; padding:.6rem 1rem; border-radius:.6rem; text-decoration:none }`;

  const reactCode = useMemo(() => {
    const jsx = blocks
      .map((b) => {
        if (b.type === "heading")
          return `<h${b.level} className=\"mb-3\">${escapeHtml(b.text)}</h${b.level}>`;
        if (b.type === "text")
          return `<p className=\"text-muted-foreground mb-4\">${escapeHtml(b.text)}</p>`;
        if (b.type === "image")
          return `<img src=\"${escapeAttr(b.src)}\" alt=\"${escapeAttr(b.alt)}\" className=\"rounded-xl mb-4\" />`;
        if (b.type === "button")
          return `<a href=\"${escapeAttr(b.href)}\" className=\"inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white\">${escapeHtml(b.label)}</a>`;
        return "";
      })
      .join("\n");
    return `export default function MySection(){\n  return (\n    <main className=\"max-w-3xl mx-auto p-6\">\n${indent(jsx, 6)}\n    </main>\n  )\n}`;
  }, [blocks]);

  return (
    <section id="builder" className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Block Library</CardTitle>
            <CardDescription>Add elements to your page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full"
              variant="secondary"
              onClick={() =>
                add({
                  id: uid(),
                  type: "heading",
                  text: "A beautiful heading",
                  level: 2,
                })
              }
            >
              Add Heading
            </Button>
            <Button
              className="w-full"
              variant="secondary"
              onClick={() =>
                add({
                  id: uid(),
                  type: "text",
                  text: "This is a paragraph. Edit it to make it yours.",
                })
              }
            >
              Add Paragraph
            </Button>
            <Button
              className="w-full"
              variant="secondary"
              onClick={() =>
                add({
                  id: uid(),
                  type: "image",
                  src: "https://images.unsplash.com/photo-1528795259021-d8c86e14354c?q=80&w=1200&auto=format&fit=crop",
                  alt: "Unsplash",
                })
              }
            >
              Add Image
            </Button>
            <Button
              className="w-full"
              variant="secondary"
              onClick={() =>
                add({
                  id: uid(),
                  type: "button",
                  label: "Call to Action",
                  href: "#",
                })
              }
            >
              Add Button
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle>Canvas</CardTitle>
            <CardDescription>
              Click blocks to edit. Drag order using Move buttons.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border p-4 bg-background">
              {blocks.map((b) => (
                <div
                  key={b.id}
                  className={`group relative rounded-md p-2 hover:bg-accent/40 ${selectedId === b.id ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setSelectedId(b.id)}
                >
                  <div className="absolute -left-2 top-2 hidden gap-1 group-hover:flex">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        move(b.id, -1);
                      }}
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        move(b.id, 1);
                      }}
                    >
                      ↓
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(b.id);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                  {b.type === "heading" && (
                    <div className="py-1">
                      <Heading level={b.level}>{b.text}</Heading>
                    </div>
                  )}
                  {b.type === "text" && (
                    <p className="text-muted-foreground py-1">{b.text}</p>
                  )}
                  {b.type === "image" && (
                    <img src={b.src} alt={b.alt} className="rounded-xl my-2" />
                  )}
                  {b.type === "button" && (
                    <a
                      href={b.href}
                      className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground"
                    >
                      {b.label}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Inspector</CardTitle>
            <CardDescription>Edit the selected block</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selected && (
              <p className="text-sm text-muted-foreground">
                Select a block on the canvas to edit.
              </p>
            )}
            {selected?.type === "heading" && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Text</label>
                <Input
                  value={selected.text}
                  onChange={(e) =>
                    update(selected.id, { text: e.target.value })
                  }
                />
                <label className="text-sm font-medium">Level</label>
                <div className="flex gap-2">
                  {[1, 2, 3].map((lvl) => (
                    <Button
                      key={lvl}
                      variant={lvl === selected.level ? "default" : "outline"}
                      onClick={() =>
                        update(selected.id, { level: lvl as 1 | 2 | 3 })
                      }
                    >
                      H{lvl}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {selected?.type === "text" && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Text</label>
                <Textarea
                  value={selected.text}
                  onChange={(e) =>
                    update(selected.id, { text: e.target.value })
                  }
                />
              </div>
            )}
            {selected?.type === "image" && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Image URL</label>
                <Input
                  value={selected.src}
                  onChange={(e) => update(selected.id, { src: e.target.value })}
                />
                <label className="text-sm font-medium">Alt text</label>
                <Input
                  value={selected.alt}
                  onChange={(e) => update(selected.id, { alt: e.target.value })}
                />
              </div>
            )}
            {selected?.type === "button" && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Label</label>
                <Input
                  value={selected.label}
                  onChange={(e) =>
                    update(selected.id, { label: e.target.value })
                  }
                />
                <label className="text-sm font-medium">Link</label>
                <Input
                  value={selected.href}
                  onChange={(e) =>
                    update(selected.id, { href: e.target.value })
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Export Code</CardTitle>
          <CardDescription>Copy HTML/CSS or a React component</CardDescription>
        </CardHeader>
        <CardContent>
          <CodePreviewTabs html={html} css={css} react={reactCode} />
        </CardContent>
      </Card>
    </section>
  );

  function update<T extends Block["id"]>(
    id: T,
    patch: Partial<Extract<Block, { id: T }>>,
  ) {
    setBlocks((b) =>
      b.map((x) => (x.id === id ? ({ ...x, ...patch } as Block) : x)),
    );
  }
}

function Heading({ level, children }: { level: 1 | 2 | 3; children: string }) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const cls =
    level === 1
      ? "text-3xl md:text-4xl font-bold tracking-tight"
      : level === 2
        ? "text-2xl md:text-3xl font-semibold"
        : "text-xl md:text-2xl font-semibold";
  return <Tag className={cls}>{children}</Tag>;
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
function escapeAttr(s: string) {
  return s.replace(
    /["']/g,
    (c) => ({ '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}
function indent(s: string, n = 2) {
  return s
    .split("\n")
    .map((l) => " ".repeat(n) + l)
    .join("\n");
}
