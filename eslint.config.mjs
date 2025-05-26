// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
// No need to import eslintPluginImport if next/core-web-vitals handles its registration.

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Add this configuration object for import resolver settings
  {
    files: ["**/*.{js,jsx,ts,tsx}"], // Apply to relevant files
    settings: {
      'import/resolver': {
        typescript: {
          // Optional: you can explicitly point to your tsconfig.json
          // project: './tsconfig.json',
          // Defaults to finding tsconfig.json in the current working directory
          // or parent directories, which is usually fine.
          alwaysTryTypes: true, // Good for TypeScript projects
        }
        // The 'node' resolver is usually also configured by 'next/core-web-vitals'
      },
    },
    // You generally don't need to redefine rules like 'import/no-unresolved' here
    // if 'next/core-web-vitals' already sets them appropriately.
  }
];

export default eslintConfig;
