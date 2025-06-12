import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { DataModel } from "./_generated/dataModel";
import { v } from "convex/values";
import { internalQuery, query } from "./_generated/server";
import { api } from "./_generated/api";

import * as vb from "valibot";

const PasswordParamsSchema = vb.object({
  email: vb.pipe(vb.string(), vb.email()),
  username: vb.string(),
});

/** Password profile that includes username field */
const PasswordProvider = Password<DataModel>({
  profile: (params, ctx) => {
    // Validate input data
    const { email, username } = vb.parse(PasswordParamsSchema, params);

    return {
      email,
      username,
    };
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [PasswordProvider],
});
