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
        "fastify",
        /^@fastify\/.*/,
        "typeorm",
        "pg",
        "reflect-metadata",
      ],
    },
    outDir: "dist",
    ssr: true,
    target: "node24",
  },
  resolve: {
    alias: {
      "@domain": resolve(__dirname, "./src/domain"),
      "@application": resolve(__dirname, "./src/application"),
      "@infrastructure": resolve(__dirname, "./src/infrastructure"),
      "@presentation": resolve(__dirname, "./src/presentation"),
      "@shared": resolve(__dirname, "./src/shared"),
    },
  },
});
