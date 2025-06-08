import { useAuthActions } from "@convex-dev/auth/react";
import {
  Authenticated,
  Unauthenticated,
  useQuery,
  useConvexAuth,
} from "convex/react";
import { useState } from "react";
import { Button, Input, YStack, Text } from "tamagui";
import { api } from "@/convex/_generated/api";

export function SignIn() {
  const foo = useQuery(api.users.getCurrentUser);

  const { signIn, signOut } = useAuthActions();
  const [step, setStep] = useState<"signUp" | "signIn">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <>
      <Unauthenticated>
        <YStack>
          <Input
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            inputMode="email"
            autoCapitalize="none"
          />
          <Input
            placeholder="Password"
            onChangeText={setPassword}
            value={password}
            secureTextEntry
          />
          <Button
            onPress={() => {
              void signIn("password", { email, password, flow: step });
            }}
          >
            {step === "signIn" ? "Sign in" : "Sign up"}
          </Button>
          <Button
            onPress={() => setStep(step === "signIn" ? "signUp" : "signIn")}
          >
            {step === "signIn" ? "Sign up instead" : "Sign in instead"}
          </Button>
        </YStack>
      </Unauthenticated>
      <Authenticated>
        <Text>Current user: {foo?.email ?? "Missing User Email!!"}</Text>
        <Button onPress={() => void signOut()}>Sign Out</Button>
      </Authenticated>
    </>
  );
}
