import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import pluginVue from "eslint-plugin-vue";

const isProd = process.env.NODE_ENV === "production";

export default defineConfigWithVueTs(
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "coverage/**",
      "ios/**",
      "android/**",
    ],
  },
  pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,
  {
    rules: {
      "no-console": isProd ? "warn" : "off",
      "no-debugger": isProd ? "warn" : "off",
      "vue/no-deprecated-slot-attribute": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  }
);
