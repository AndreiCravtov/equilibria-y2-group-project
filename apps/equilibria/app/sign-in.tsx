import { api } from "@/convex/_generated/api";
import { useConvex, useConvexAuth } from "convex/react";
import {
  Button,
  Form,
  H2,
  H4,
  H5,
  Input,
  Label,
  Paragraph,
  SizableText,
  Spinner,
  Text,
  View,
  YStack,
} from "tamagui";
import { LoadingView } from "@/components/Loading";
import { Link, Redirect } from "expo-router";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Pressable } from "react-native";

const CONTENT = {
  signIn: {
    header: "Sign in to your account",
    button: "Sign In",
    altLinkText: {
      regular: "Don't have an account? ",
      underline: "Sign up",
    },
  },
  signUp: {
    header: "Sign up for an account",
    button: "Sign Up",
    altLinkText: {
      regular: "Already have an account? ",
      underline: "Sign In",
    },
  },
};

export default function SignInScreen() {
  // Configure form state
  const [status, setStatus] = useState<"off" | "submitting" | "submitted">(
    "off"
  );
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"signUp" | "signIn">("signIn");

  // Configure authentication flow
  const { signIn } = useAuthActions();
  async function onSubmit() {
    setStatus("submitting");
    try {
      await signIn("password", { flow: step, email, username, password });
      setStatus("submitted");
    } catch (e) {
      setStatus("off");
      throw e;
    }
  }

  function onChangeStep() {
    setEmail("");
    setUsername("");
    setPassword("");
    setStep((step) => {
      switch (step) {
        case "signIn":
          return "signUp";
        case "signUp":
          return "signIn";
      }
    });
  }

  // Load authentication state
  const authState = useConvexAuth();
  if (authState.isLoading) return <LoadingView />;

  return (
    <YStack
      flex={1}
      items="center"
      justify="center"
      gap="$6"
      px="$9"
      bg="$background"
    >
      <H4 fontWeight="bold">{CONTENT[step].header}</H4>

      <Form onSubmit={onSubmit} asChild>
        <YStack width="100%" gap="$4" mb="$10">
          <View>
            <Label htmlFor="email" lineHeight="$6">
              Email
            </Label>
            <Input
              id="email"
              placeholder="email@example.com"
              inputMode="email"
              autoCapitalize="none"
              onChangeText={setEmail}
              value={email}
            />
          </View>

          {step === "signUp" ? (
            <View>
              <Label htmlFor="username" lineHeight="$6">
                Username
              </Label>
              <Input
                id="username"
                placeholder="Enter username"
                inputMode="text"
                autoCapitalize="none"
                onChangeText={setUsername}
                value={username}
              />
            </View>
          ) : undefined}

          <View>
            <Label htmlFor="password" lineHeight="$6">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Enter password"
              secureTextEntry
              onChangeText={setPassword}
              value={password}
            />
          </View>

          <View height="min-content" items="center" mt="$4" gap="$2">
            <Form.Trigger asChild disabled={status !== "off"}>
              <Button
                width="100%"
                themeInverse
                icon={
                  status === "submitting"
                    ? () => <Spinner color="$color" />
                    : undefined
                }
              >
                {CONTENT[step].button}
              </Button>
            </Form.Trigger>

            <Pressable onPress={onChangeStep} disabled={status !== "off"}>
              <Paragraph textDecorationStyle="unset">
                {CONTENT[step].altLinkText.regular}
                <SizableText textDecorationLine="underline">
                  {CONTENT[step].altLinkText.underline}
                </SizableText>
              </Paragraph>
            </Pressable>
          </View>
        </YStack>
      </Form>
    </YStack>
  );
}
