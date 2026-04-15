import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Apply saved theme immediately to prevent flash
const saved = localStorage.getItem('algotrainer-theme') || 'system';
const isDark = saved === 'dark' || (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
document.documentElement.classList.toggle('dark', isDark);

// Apply saved color theme
const savedColor = localStorage.getItem('algotrainer-color-theme') || 'default';
if (savedColor !== 'default') {
  document.documentElement.classList.add(`theme-${savedColor}`);
}

createRoot(document.getElementById("root")!).render(<App />);
