import "ts-node/register"; // Add this to import TypeScript files
import type { ConfigContext, ExpoConfig } from "@expo/config";

// import "./env"; // This will run environment validation on build

module.exports = ({ config }: ConfigContext): ExpoConfig => {
  console.log("Loading `app.config.ts` configurations");
  return {
    ...config,
    name: "equilibria",
    slug: "equilibria",
    version: "1.0.0",
    owner: "equilibria_y2_group_project",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "equilibria",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.y2project.equilibria",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.y2project.equilibria",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      "expo-secure-store",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: "75253099-e75b-4090-a35d-535a8abc0d1b",
      },
    },
  };
};
