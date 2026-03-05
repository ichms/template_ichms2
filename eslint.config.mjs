import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{ts,tsx,mts}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "react-hooks/exhaustive-deps": "error",
    },
  },
  {
    files: ["packages/**/*.{ts,tsx,mts}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/**"],
              message:
                "HR-IMP-01: packages 레이어는 features 레이어를 import 할 수 없습니다.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["features/common/**/*.{ts,tsx,mts}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/features/*",
                "@/features/*/**",
                "!@/features/common",
                "!@/features/common/**",
              ],
              message:
                "HR-IMP-02: features/common 레이어는 common 외 다른 features 레이어를 import 할 수 없습니다.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["app/**/*.{ts,tsx,mts}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "ImportDeclaration[source.value=/^@\\/features\\/.*\\/service(\\.ts)?$/] > ImportDefaultSpecifier",
          message:
            "HR-IMP-03: app 라우트에서는 service.ts default import를 금지합니다. get*ForPage named import만 허용됩니다.",
        },
        {
          selector:
            "ImportDeclaration[source.value=/^@\\/features\\/.*\\/service(\\.ts)?$/] > ImportNamespaceSpecifier",
          message:
            "HR-IMP-03: app 라우트에서는 service.ts namespace import를 금지합니다. get*ForPage named import만 허용됩니다.",
        },
        {
          selector:
            "ImportDeclaration[source.value=/^@\\/features\\/.*\\/service(\\.ts)?$/] > ImportSpecifier:not([imported.name=/^get[A-Za-z0-9]*ForPage$/])",
          message:
            "HR-IMP-03: app 라우트에서는 service.ts의 get*ForPage named import만 허용됩니다.",
        },
      ],
    },
  },
  {
    files: ["**/service.{ts,tsx,mts}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@tanstack/react-query",
              message:
                "HR-RQ-02: service.ts는 순수 API 레이어여야 하며 React Query를 import할 수 없습니다.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
