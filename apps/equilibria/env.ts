import { createEnv } from "@t3-oss/env-core";
import * as v from "valibot";

export const env = createEnv({
  server: {
    CONVEX_DEPLOYMENT: v.string(),
  },

  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: "EXPO_PUBLIC_",

  client: {
    EXPO_PUBLIC_CONVEX_URL: v.string(),
  },

  /**
   * Makes sure you explicitly access **all** environment variables
   * from `server` and `client` in your `runtimeEnv`.
   */
  runtimeEnvStrict: {
    CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
    EXPO_PUBLIC_CONVEX_URL: process.env.EXPO_PUBLIC_CONVEX_URL,
  },
});
