"use client";

import * as React from "react";

type Mode = "light" | "dark";

interface ThemeContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<Mode>("dark");

  // const updateTheme = (mode: Mode) => {
  //   setMode(mode);
  //   document.documentElement.classList.add(mode);
  // };

  // const handleThemeChange = () => {
  //   updateTheme(mode === "light" ? "dark" : "light");
  // };

  // React.useEffect(() => {
  //   handleThemeChange();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
