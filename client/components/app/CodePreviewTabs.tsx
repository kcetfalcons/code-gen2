import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CodePreviewTabs({
  html,
  css,
  react,
}: {
  html: string;
  css: string;
  react: string;
}) {
  const copy = async (text: string) => {
    // Try async Clipboard API first (secure contexts)
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
        return;
      } catch (e) {
        console.warn("Clipboard API blocked, falling back", e);
      }
    }
    // Fallback: execCommand copy via temporary textarea
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (ok) {
        toast.success("Copied to clipboard");
        return;
      }
      throw new Error("execCommand copy returned false");
    } catch (e) {
      console.error("Copy failed", e);
      toast.error("Copy blocked. Select text and press Ctrl/Cmd+C.");
    }
  };
  return (
    <Tabs defaultValue="react" className="w-full">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="react">React</TabsTrigger>
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="css">CSS</TabsTrigger>
        </TabsList>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => copy(react)}>
            Copy React
          </Button>
          <Button variant="outline" size="sm" onClick={() => copy(html)}>
            Copy HTML
          </Button>
          <Button variant="outline" size="sm" onClick={() => copy(css)}>
            Copy CSS
          </Button>
        </div>
      </div>
      <TabsContent value="react">
        <pre className="mt-3 max-h-80 overflow-auto rounded-md bg-muted p-4 text-xs leading-relaxed whitespace-pre-wrap">
          <code>{react}</code>
        </pre>
      </TabsContent>
      <TabsContent value="html">
        <pre className="mt-3 max-h-80 overflow-auto rounded-md bg-muted p-4 text-xs leading-relaxed whitespace-pre-wrap">
          <code>{html}</code>
        </pre>
      </TabsContent>
      <TabsContent value="css">
        <pre className="mt-3 max-h-80 overflow-auto rounded-md bg-muted p-4 text-xs leading-relaxed whitespace-pre-wrap">
          <code>{css}</code>
        </pre>
      </TabsContent>
    </Tabs>
  );
}
