// Learn more https://docs.expo.io/guides/customizing-metro
/**
 * @type {import('expo/metro-config').MetroConfig}
 */
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const findWorkspaceRoot = require("find-yarn-workspace-root");
const { withTamagui } = require("@tamagui/metro-plugin");

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
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
// 4. Build config with Tamagui
module.exports = withTamagui(config, {
  components: ["tamagui"],
  config: "./tamagui.config.ts",
  outputCSS: "./tamagui-web.css",
});
