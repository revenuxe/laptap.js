import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig({
  vite: {
    server: { host: "::", port: 8080 },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  },
  plugins: [process.env.NODE_ENV === "development" && componentTagger()].filter(Boolean),
  tanstackStart: {
    server: { entry: "server" },
  },
  ssrErrorLogger: true,
  serverFnErrorLogger: true,
});
