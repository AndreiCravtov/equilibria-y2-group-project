import { useEffect, useState } from "react";
import { View, XStack, Input, Button, Text, YStack, Separator } from "tamagui";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Select } from "tamagui";
import type { SelectProps } from "tamagui";
import { ChevronUp, ChevronDown, Check } from "@tamagui/lucide-icons";
import { Sheet, Adapt } from "tamagui";
import React from "react";
import { LinearGradient } from "react-native-svg";
import { tryGetUserProfile } from "@/convex/userProfiles";
import { useQuery } from "convex/react";
import { ScrollView } from "tamagui";

function isNumber(v: string) {
  return /^\d*$/.test(v);
}

type SetMessage = (msg: string) => void;

function UserDetails({ setMessage }: { setMessage: SetMessage }) {
  let profile = useQuery(api.userProfiles.tryGetUserProfile);
  const profile_err = profile === "USER_PROFILE_MISSING" || !profile;
  const [updated, setUpdated] = useState(false);
  const [name, setName] = useState(profile_err ? "" : profile.name);
  const [age, setAge] = useState(profile_err ? "" : profile.age.toString());
  const [weight, setWeight] = useState(
    profile_err ? "" : profile.weight.toString(),
  );
  const [gender, setGender] = useState(profile_err ? "" : profile.gender);
  const [height, setHeight] = useState(
    profile_err ? "" : profile.height.toString(),
  );
  const updateProfile = useMutation(api.userProfiles.updateUserProfile);
  if (profile_err) {
    setMessage("Could not find user profile");
    return;
  }

  function update() {
    setMessage("");
    if (!updated) return;
    if (!name) {
      setMessage("Please enter your name");
      return;
    }
    if (!age) {
      setMessage("Please enter your age");
      return;
    }
    if (!weight) {
      setMessage("Please enter your weight");
      return;
    }
    if (!height) {
      setMessage("Please enter your height");
      return;
    }
    // do the update
    setUpdated(false);
    updateProfile({
      name,
      age: BigInt(age),
      gender: gender as "male" | "female",
      weight: BigInt(weight),
      height: BigInt(10),
    });
  }
  return (
    <YStack space="$4">
      {/* User's name: */}
      <Text fontSize="$8" fontWeight="bold" pb="$1" color="$indigo4Dark">
        Name
      </Text>
      <Input
        value={name}
        onChangeText={(newName) => {
          setName(newName);
          setUpdated(true);
        }}
        color="$indigo8Dark"
        bg="$indigo2"
      />

      {/* User's age */}
      <Text fontSize="$8" fontWeight="bold" pb="$1" color="$indigo4Dark">
        Age
      </Text>
      <Input
        keyboardType="numeric"
        value={age}
        onChangeText={(newAge) => {
          if (isNumber(newAge)) {
            setAge(newAge);
            setUpdated(true);
          }
        }}
        color="$indigo8Dark"
        bg="$indigo2"
      />

      {/* User's gender */}
      <Text fontSize="$8" fontWeight="bold" pb="$1" color="$indigo4Dark">
        Gender
      </Text>
      <ChooseGender
        value={gender}
        onValueChange={(newGender) => {
          setGender(newGender);
          setUpdated(true);
        }}
      />

      {/* User's weight */}
      <Text fontSize="$8" fontWeight="bold" pb="$1" color="$indigo4Dark">
        Weight
      </Text>
      <XStack alignItems="center">
        <Input
          value={weight}
          flex={1}
          keyboardType="numeric"
          onChangeText={(newWeight) => {
            if (isNumber(newWeight)) {
              setWeight(newWeight);
              setUpdated(true);
            }
          }}
          color="$indigo8Dark"
          bg="$indigo2"
        />
        <Text ml="$2" alignSelf="center">
          kg
        </Text>
      </XStack>

      {/* User's height */}
      <Text fontSize="$8" fontWeight="bold" pb="$1" color="$indigo4Dark">
        Height
      </Text>
      <XStack alignItems="center">
        <Input
          value={height}
          flex={1}
          keyboardType="numeric"
          onChangeText={(newHeight) => {
            if (isNumber(newHeight)) {
              setHeight(newHeight);
              setUpdated(true);
            }
          }}
          color="$indigo8Dark"
          bg="$indigo2"
        />
        <Text ml="$2" alignSelf="center">
          cm
        </Text>
      </XStack>
      <Button
        disabled={!updated}
        {...(updated ? { color: "red", backgroundColor: "lightgrey" } : {})}
        onPress={update}
      >
        Update
      </Button>
    </YStack>
  );
}

export default function SettingsScreen({ set }) {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const addFriend = useMutation(api.friends.addFriend);

  const handleAddFriend = async () => {
    console.log("adding Friend");

    if (!username.trim()) {
      setMessage("Please enter a username");
      return;
    }
    try {
      const friendId = username as Id<"users">;
      await addFriend({ friendId });
      setMessage(`Friend request sent to ${username}`);
      setUsername("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to send friend request");
    }
  };

  return (
    <ScrollView>
      <YStack space="$4" padding="$4">
        <Text fontSize="$8" fontWeight="bold" color="$indigo4Dark">
          Add a Friend
        </Text>

        <XStack space="$2" alignItems="center">
          <Input
            flex={1}
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
            color="$indigo8Dark"
            bg="$indigo2"
          />
          <Button onPress={handleAddFriend}>Add</Button>
        </XStack>

        <Separator borderColor={"black"} />

        <UserDetails setMessage={setMessage} />

        {message !== "" && <Text color="red">{message}</Text>}
      </YStack>
    </ScrollView>
  );
}

export function ChooseGender(
  props: SelectProps & { trigger?: React.ReactNode },
) {
  const [val, setVal] = useState("something");

  return (
    <Select
      value={val}
      onValueChange={setVal}
      disablePreventBodyScroll
      {...props}
    >
      {props?.trigger || (
        <Select.Trigger maxWidth={220} iconAfter={ChevronDown}>
          <Select.Value placeholder="Something" />
        </Select.Trigger>
      )}

      <Adapt when="maxMd" platform="touch">
        <Sheet
          native={!!props.native}
          modal
          dismissOnSnapToBottom
          animation="medium"
        >
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            backgroundColor="$shadowColor"
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.ScrollUpButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronUp size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={["$background", "transparent"]}
            borderRadius="$4"
          />
        </Select.ScrollUpButton>

        <Select.Viewport minWidth={200}>
          <Select.Group>
            <Select.Label>Gender</Select.Label>
            <Select.Item index={0} key="Male" value="male">
              <Select.ItemText>Male</Select.ItemText>
              <Select.ItemIndicator marginLeft="auto">
                <Check size={16} />
              </Select.ItemIndicator>
            </Select.Item>
            <Select.Item index={1} key="Female" value="female">
              <Select.ItemText>Female</Select.ItemText>
              <Select.ItemIndicator marginLeft="auto">
                <Check size={16} />
              </Select.ItemIndicator>
            </Select.Item>
          </Select.Group>
        </Select.Viewport>

        <Select.ScrollDownButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronDown size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={["transparent", "$background"]}
            borderRadius="$4"
          />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  );
}
