import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      stream: "stream-browserify",
      path: "path-browserify",
      buffer: "buffer/",
    },
  },
  define: {
    global: "globalThis",
    "process.env": {}, 
  },
  optimizeDeps: {
    include: ["buffer", "process"],
  },
});