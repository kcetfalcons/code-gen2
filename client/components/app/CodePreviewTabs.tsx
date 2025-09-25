import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function CodePreviewTabs({ html, css, react }: { html: string; css: string; react: string; }) {
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      console.error("Copy failed", e);
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
          <Button variant="outline" size="sm" onClick={() => copy(react)}>Copy React</Button>
          <Button variant="outline" size="sm" onClick={() => copy(html)}>Copy HTML</Button>
          <Button variant="outline" size="sm" onClick={() => copy(css)}>Copy CSS</Button>
        </div>
      </div>
      <TabsContent value="react">
        <pre className="mt-3 max-h-80 overflow-auto rounded-md bg-muted p-4 text-xs leading-relaxed whitespace-pre-wrap"><code>{react}</code></pre>
      </TabsContent>
      <TabsContent value="html">
        <pre className="mt-3 max-h-80 overflow-auto rounded-md bg-muted p-4 text-xs leading-relaxed whitespace-pre-wrap"><code>{html}</code></pre>
      </TabsContent>
      <TabsContent value="css">
        <pre className="mt-3 max-h-80 overflow-auto rounded-md bg-muted p-4 text-xs leading-relaxed whitespace-pre-wrap"><code>{css}</code></pre>
      </TabsContent>
    </Tabs>
  );
}
