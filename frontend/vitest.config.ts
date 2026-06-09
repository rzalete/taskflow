import { defineConfig, mergeConfig } from "vitest/config"

import viteConfig from "./vite.config"

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      // Pin the API base URL so MSW handlers always match, regardless of any
      // local .env value.
      env: {
        VITE_API_BASE_URL: "http://localhost:8000",
      },
      coverage: {
        provider: "v8",
        exclude: ["**/*.config.*", "**/*.d.ts", "src/main.tsx", "src/test/**"],
      },
    },
  }),
)
