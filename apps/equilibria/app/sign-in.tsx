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
import {EquilibriaInput, EquilibriaH2} from "@/app/custom-components";

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
      <H4 fontWeight="bold" color={"$$indigo12"}>{CONTENT[step].header}</H4>

      <Form onSubmit={onSubmit} asChild>
        <YStack width="100%" gap="$4" mb="$10">   q
          <View>
            <Label htmlFor="email" lineHeight="$6" color={"$indigo12"}>
              Email
            </Label>
            <EquilibriaInput
              id={"email"}
              value={email}
              onChangeText={setEmail}
              placeholder="email@example.com"
              keyboardType="email-address"
              />
          </View>

          {step === "signUp" ? (
            <View>
              <Label htmlFor="username" lineHeight="$6" color={"$indigo12"}>
                Username
              </Label>
              <EquilibriaInput
                id={"username"}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter username"
                keyboardType="default"
              />
            </View>
          ) : undefined}

          <View>
            <Label htmlFor="password" lineHeight="$6" color={"$indigo12"}>
              Password
            </Label>
            <EquilibriaInput
              id={"password"}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry={true}
            />
          </View>

          <View height="min-content" items="center" mt="$4" gap="$2">
            <Form.Trigger asChild disabled={status !== "off"}>
              <Button
                width="100%"
                color="$indigo4"
                bg="$indigo12"
                fontWeight={"bold"}
                fontSize="$6"
                pressStyle={{
                  bg: '$blue10',
                  scale: 0.96,
                }}
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
