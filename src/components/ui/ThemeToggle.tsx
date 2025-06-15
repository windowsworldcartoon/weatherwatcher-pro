
import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const getStoredTheme = () => {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem("theme") || "light";
};

const setHtmlThemeClass = (theme: string) => {
  if (typeof window === "undefined") return;
  document.documentElement.classList.remove("dark", "light");
  document.documentElement.classList.add(theme);
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">(getStoredTheme() as "light" | "dark");

  useEffect(() => {
    setHtmlThemeClass(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="absolute top-6 right-6 transition-colors bg-transparent border-none focus:outline-none"
    >
      {theme === "dark" ? (
        <Sun className="w-6 h-6 text-yellow-400" />
      ) : (
        <Moon className="w-6 h-6 text-gray-700" />
      )}
    </button>
  );
};

export default ThemeToggle;
