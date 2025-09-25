import { useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChatBox() {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("fb_chat") || "[]");
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem("fb_chat", JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const user: Message = { role: "user", content: input.trim() };
    setMessages((m) => [...m, user]);
    setInput("");

    const reply = generateReply([...messages, user]);
    setTimeout(
      () => setMessages((m) => [...m, { role: "assistant", content: reply }]),
      300,
    );
  };

  return (
    <section id="chat" className="container py-12">
      <Card>
        <CardHeader>
          <CardTitle>AI Site Assistant</CardTitle>
          <CardDescription>
            Ask for code, content, or help with the builder. No keys required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80 rounded-md border p-4 bg-background">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  Try: “Create a hero section with a headline, subtext and a
                  button.”
                </div>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] ${m.role === "user" ? "ml-auto text-right" : ""}`}
                >
                  <div
                    className={`inline-block rounded-2xl px-3 py-2 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                send();
              }
            }}
          />
          <Button onClick={send}>Send</Button>
        </CardFooter>
      </Card>
    </section>
  );
}

function generateReply(history: Message[]): string {
  const last = history[history.length - 1]?.content.toLowerCase();
  if (!last) return "How can I help you build today?";
  if (last.includes("hero")) {
    return "Add a Heading and a Paragraph, then a Button. Set heading level to H1 and label the button 'Get Started'. Use a calming gradient background for the section.";
  }
  if (last.includes("html")) {
    return "You can export clean HTML/CSS from the Export Code panel. For responsive layouts, wrap blocks in a <main> with max-width and use CSS for spacing.";
  }
  if (last.includes("react")) {
    return "Use the React tab in Export Code to copy a ready component. You can paste it into any React app and customize className props.";
  }
  if (last.includes("color") || last.includes("theme")) {
    return "Update theme from Settings > Tailwind tokens. Primary hue is adjustable via CSS vars in global.css for instant brand updates.";
  }
  return "Got it. Try adding blocks with the library on the left, edit in Inspector, then copy your code from Export. Ask for specifics and I’ll guide you.";
}
