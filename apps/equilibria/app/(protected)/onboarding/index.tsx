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
  styled,
  Text,
  ToggleGroup,
  View,
  YStack,
} from "tamagui";
import { LoadingView } from "@/components/Loading";
import { Link, Redirect } from "expo-router";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Pressable } from "react-native";
import { AlignLeft } from "@tamagui/lucide-icons";

const Item = styled(ToggleGroup.Item, {
  variants: {
    active: {
      true: {
        backgroundColor: "$backgroundFocus",
      },
    },
  },
});

export default function OnboardingScreen() {
  // Configure form state
  const [status, setStatus] = useState<"off" | "submitting" | "submitted">(
    "off"
  );
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");

  // Configure authentication flow
  const { signIn } = useAuthActions();
  async function onSubmit() {
    setStatus("submitting");
    try {
      // await signIn("password", { email, password });
      setStatus("submitted");
    } catch (e) {
      setStatus("off");
      throw e;
    }
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
      <H4 fontWeight="bold">Please enter details</H4>

      <Form onSubmit={onSubmit} asChild>
        <YStack width="100%" gap="$4" mb="$10">
          {/* Name input */}
          <View>
            <Label htmlFor="name" lineHeight="$6">
              Name
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              inputMode="text"
              onChangeText={setName}
              value={name}
            />
          </View>

          {/* Age input */}
          <View>
            <Label htmlFor="age" lineHeight="$6">
              Age
            </Label>
            <Input
              id="age"
              placeholder="Enter your age"
              inputMode="numeric"
              onChangeText={setAge}
              value={age}
            />
          </View>

          {/* Gender input */}
          <View>
            <Label htmlFor="gender" lineHeight="$6">
              Gender
            </Label>
            <ToggleGroup
              id="gender"
              type="single"
              orientation="horizontal"
              disableDeactivation={true}
            >
              <Item
                value="male"
                active={gender === "male"}
                onPress={() => setGender("male")}
              >
                <Text>Male</Text>
              </Item>
              <Item
                value="female"
                active={gender === "female"}
                onPress={() => setGender("female")}
              >
                <Text>Female</Text>
              </Item>
            </ToggleGroup>
            {/* <Input
              id="gender"
              placeholder="Enter your age"
              inputMode="numeric"
              onChangeText={setAge}
              value={age}
            /> */}
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
                Submit
              </Button>
            </Form.Trigger>
          </View>
        </YStack>
      </Form>
    </YStack>
  );
}
