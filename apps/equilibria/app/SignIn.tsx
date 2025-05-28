import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Button, TextInput, View } from "react-native";

export function SignIn() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signUp" | "signIn">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
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
        title={step === "signIn" ? "Sign in" : "Sign up"}
        onPress={() => {
          void signIn("password", { email, password, flow: step });
        }}
      />
      <Button
        title={step === "signIn" ? "Sign up instead" : "Sign in instead"}
        onPress={() => setStep(step === "signIn" ? "signUp" : "signIn")}
      />
    </View>
  );
}
