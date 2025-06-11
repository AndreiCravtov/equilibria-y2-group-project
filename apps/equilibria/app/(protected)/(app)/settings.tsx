import { useState } from "react";
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

export default function SettingsScreen() {
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

  function UserDetails() {
    return (
      <YStack>
        <Text fontSize="$6" fontWeight="bold">
          Name
        </Text>
        <Input value={"John Doe"} />
        <Text fontSize="$6" fontWeight="bold">
          Age
        </Text>
        <Input keyboardType="numeric" value={"20"} />
        <Text fontSize="$6" fontWeight="bold">
          Gender
        </Text>
        <ChooseGender />
        <Text fontSize="$6" fontWeight="bold">
          Weight
        </Text>
        <XStack alignItems="center">
          <Input value={"70"} flex={1} />
          <Text marginLeft="$2">kg</Text>
        </XStack>
        <Button>Update</Button>
      </YStack>
    );
  }

  return (
    <YStack space="$4" padding="$4">
      <Text fontSize="$6" fontWeight="bold">
        Add a Friend
      </Text>

      <XStack space="$2" alignItems="center">
        <Input
          flex={1}
          placeholder="Enter username"
          value={username}
          onChangeText={setUsername}
        />
        <Button onPress={handleAddFriend}>Add</Button>
      </XStack>

      <Separator borderColor={"black"} />

      <UserDetails />

      {message !== "" && <Text color="red">{message}</Text>}
    </YStack>
  );
}

export function ChooseGender(
  props: SelectProps & { trigger?: React.ReactNode },
) {
  const [val, setVal] = useState("male");

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

        <Select.Viewport
          // to do animations:
          // animation="quick"
          // animateOnly={['transform', 'opacity']}
          // enterStyle={{ o: 0, y: -10 }}
          // exitStyle={{ o: 0, y: 10 }}
          minWidth={200}
        >
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
            {/* for longer lists memoizing these is useful */}
            {/* {React.useMemo(
              () =>
                items.map((item, i) => {
                  return (
                    <Select.Item
                      index={i}
                      key={item.name}
                      value={item.name.toLowerCase()}
                    >
                      <Select.ItemText>{item.name}</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  );
                }),
              [items],
            )} */}
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
