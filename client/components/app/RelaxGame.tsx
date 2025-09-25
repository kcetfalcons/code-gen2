import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Orb {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  hue: number;
}

export default function RelaxGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(true);
  const orbsRef = useRef<Orb[]>(genOrbs());

  useEffect(() => {
    let raf = 0;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const canvas = ctx.canvas;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const orbs = orbsRef.current;
      for (const o of orbs) {
        if (running) {
          o.x += o.vx;
          o.y += o.vy;
          if (o.x - o.r < 0 || o.x + o.r > canvas.width) o.vx *= -1;
          if (o.y - o.r < 0 || o.y + o.r > canvas.height) o.vy *= -1;
        }
        const grad = ctx.createRadialGradient(
          o.x,
          o.y,
          o.r * 0.2,
          o.x,
          o.y,
          o.r,
        );
        grad.addColorStop(0, `hsla(${o.hue}, 80%, 65%, .9)`);
        grad.addColorStop(1, `hsla(${o.hue}, 80%, 25%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const onClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    orbsRef.current = orbsRef.current.map((o) => ({
      ...o,
      vx: o.vx + (o.x < x ? -0.2 : 0.2),
      vy: o.vy + (o.y < y ? -0.2 : 0.2),
    }));
  };

  const reset = () => {
    orbsRef.current = genOrbs();
  };

  return (
    <section id="game" className="container py-12">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Zen Orbs</CardTitle>
              <CardDescription>
                Calming motion. Click to gently nudge the orbs.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setRunning((r) => !r)}>
                {running ? "Pause" : "Play"}
              </Button>
              <Button variant="secondary" onClick={reset}>
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl overflow-hidden border bg-gradient-to-br from-secondary/40 to-accent/30">
            <canvas
              ref={canvasRef}
              onClick={onClick}
              className="block w-full h-[320px] md:h-[420px]"
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function genOrbs(): Orb[] {
  const out: Orb[] = [];
  for (let i = 0; i < 10; i++) {
    const r = 28 + Math.random() * 32;
    out.push({
      x: 80 + Math.random() * 480,
      y: 80 + Math.random() * 280,
      r,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      hue: 260 + Math.random() * 60,
    });
  }
  return out;
}
