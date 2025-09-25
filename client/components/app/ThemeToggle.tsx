import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

function applyTheme(next: "light"|"dark"){
  const root = document.documentElement;
  if(next === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  localStorage.setItem("theme", next);
}

function getInitialTheme(): "light"|"dark"{
  const saved = localStorage.getItem("theme");
  if(saved === "light" || saved === "dark") return saved as "light"|"dark";
  return "dark"; // default to dark
}

export default function ThemeToggle(){
  const [theme, setTheme] = useState<"light"|"dark">("dark");

  useEffect(()=>{ const t = getInitialTheme(); setTheme(t); applyTheme(t); }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  return (
    <Button aria-label="Toggle theme" onClick={toggle} variant="ghost" size="icon">
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
