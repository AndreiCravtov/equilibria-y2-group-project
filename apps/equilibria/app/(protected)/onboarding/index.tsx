import { api } from "@/convex/_generated/api";
import { useConvex, useConvexAuth, useMutation } from "convex/react";
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
import { AppButton, AppH4, AppInput } from "@/components/app-components";

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
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const submitProfile = useMutation(api.userProfiles.createUserProfile);

  // Submitting logic
  async function onSubmit() {
    setStatus("submitting");
    try {
      await submitProfile({
        name,
        age: BigInt(age),
        gender,
        weight: BigInt(weight),
        height: BigInt(height),
      });
      setStatus("submitted");
    } catch (e) {
      setStatus("off");
      throw e;
    }
  }

  return (
    <YStack
      flex={1}
      items="center"
      justify="center"
      gap="$6"
      px="$9"
      bg="$background"
    >
      <AppH4>Please enter details</AppH4>

      <Form onSubmit={onSubmit} asChild>
        <YStack width="100%" gap="$4" mb="$10">
          {/* Name input */}
          <View>
            <Label htmlFor="name" lineHeight="$6" color={"$indigo12"}>
              Name
            </Label>
            <AppInput
              id="name"
              value={name}
              onChangeText={setName}
              placeholder="John Doe"
            />
          </View>

          {/* Age input */}
          <View>
            <Label htmlFor="age" lineHeight="$6" color={"$indigo12"}>
              Age
            </Label>
            <AppInput
              id="age"
              value={age}
              onChangeText={setAge}
              placeholder="Enter your age"
              keyboardType="numeric"
            />
          </View>

          {/* Gender input */}
          <View>
            <Label htmlFor="gender" lineHeight="$6" color={"$indigo12"}>
              Gender
            </Label>
            <ToggleGroup
              id="gender"
              type="single"
              orientation="horizontal"
              disableDeactivation={true}
              borderColor={"$indigo4"}
            >
              <Item
                value="male"
                active={gender === "male"}
                onPress={() => setGender("male")}
                bg={gender === "male" ? "$blue4" : "transparent"}
                pressStyle={{ bg: "$blue4" }}
              >
                <Text>Male</Text>
              </Item>
              <Item
                value="female"
                active={gender === "female"}
                onPress={() => setGender("female")}
                bg={gender === "female" ? "$blue4" : "transparent"}
                pressStyle={{ bg: "$blue4" }}
              >
                <Text>Female</Text>
              </Item>
            </ToggleGroup>
          </View>

          {/* Weight input */}
          <View>
            <Label htmlFor="weight" lineHeight="$6" color={"$indigo12"}>
              Weight (kg)
            </Label>
            <AppInput
              id="weight"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholder="Enter your weight in kg"
            />
          </View>

          {/* Height input */}
          <View>
            <Label htmlFor="height" lineHeight="$6" color={"$indigo12"}>
              Height (cm)
            </Label>
            <AppInput
              id="height"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
              placeholder="Enter your height in cm"
            />
          </View>

          {/* Submit form */}
          <View height="min-content" items="center" mt="$4" gap="$2">
            <Form.Trigger asChild disabled={status !== "off"}>
              <AppButton
                width="100%"
                icon={
                  status === "submitting"
                    ? () => <Spinner color="$color1" />
                    : undefined
                }
              >
                Submit
              </AppButton>
            </Form.Trigger>
          </View>
        </YStack>
      </Form>
    </YStack>
  );
}
