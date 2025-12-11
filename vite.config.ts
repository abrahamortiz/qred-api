import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      formats: ["es"],
      fileName: "main",
    },
    rollupOptions: {
      external: [
        // Add external dependencies here (e.g., 'express', 'fastify')
      ],
    },
    outDir: "dist",
    ssr: true,
    target: "node24",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
