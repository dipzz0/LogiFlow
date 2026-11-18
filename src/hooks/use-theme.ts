import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "logiflow-theme";

export type Theme = "light" | "dark";

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.style.colorScheme = theme;
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial: Theme = stored ?? "dark";
    setTheme(initial);
    apply(initial);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      window.localStorage.setItem(STORAGE_KEY, next);
      apply(next);
      return next;
    });
  }, []);

  return { theme, toggle };
}
