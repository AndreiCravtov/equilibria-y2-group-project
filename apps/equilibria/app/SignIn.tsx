import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, Unauthenticated } from "convex/react";
import { useState } from "react";
import { TextInput, View } from "react-native";
import { Button } from "tamagui";

export function SignIn() {
  const { signIn, signOut } = useAuthActions();
  const [step, setStep] = useState<"signUp" | "signIn">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <>
      <Unauthenticated>
        <View>
          <TextInput
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            inputMode="email"
            autoCapitalize="none"
          />
          <TextInput
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
        </View>
      </Unauthenticated>
      <Authenticated>
        <Button onPress={() => void signOut()}>Sign Out</Button>
      </Authenticated>
    </>
  );
}
