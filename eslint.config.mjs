import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored third-party bundles shipped with the Impeccable skill. Linting
    // them produced 94 warnings of noise, which buried real ones.
    ".claude/skills/**",
    // The Shopify concept is a standalone Liquid theme plus a small render
    // harness. It has its own package and is not part of the Next.js app, so
    // the Next/TypeScript rule set does not apply to it.
    "shopify-concept/**",
  ]),
]);

export default eslintConfig;
