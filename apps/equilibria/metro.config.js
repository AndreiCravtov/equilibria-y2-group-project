// Learn more https://docs.expo.io/guides/customizing-metro
/**
 * @type {import('expo/metro-config').MetroConfig}
 */
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const findWorkspaceRoot = require("find-yarn-workspace-root");

// Find the project and workspace directories
const projectRoot = __dirname;
const monorepoRoot = findWorkspaceRoot(projectRoot);

const config = getDefaultConfig(projectRoot, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// 1. Watch all files within the monorepo
config.watchFolders = [monorepoRoot];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];
// 3. Make `.mjs` sources work as well
config.resolver.sourceExts.push("mjs");

// Tamagui support
const { withTamagui } = require("@tamagui/metro-plugin");
module.exports = withTamagui(config, {
  components: ["tamagui"],
  config: "./tamagui.config.ts",
  outputCSS: "./tamagui-web.css",
});
