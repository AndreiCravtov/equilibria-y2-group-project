import {useState} from "react"
import {View, XStack, Input, Button, Text, YStack, H2, ScrollView} from "tamagui"
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

export default function SettingsScreen() {
  const [username, setUsername] = useState("")
  const [message, setMessage] = useState("")

  const addFriend = useMutation(api.friends.addFriend)

  const handleAddFriend = async () => {

    console.log("adding Friend")

    if (!username.trim()) {
      setMessage("Please enter a username")
      return
    }
    try {
      await addFriend({username})
      setMessage(`Friend request sent to ${username}`)
      setUsername("")
    } catch (err) {
      console.error(err)
      setMessage("Failed to send friend request")
    }
  }

  return (
    <ScrollView p="$4" bounces={false} bg="#FFFFFF">
      <YStack space="$4" padding="$4" alignItems="center">
        <H2 fontWeight="bold" color="$indigo8Dark" bg="#FFFFFF" fontSize={32}>Add a friend</H2>

        <XStack space="$2" alignItems="center">
          <Input
            placeholder="Enter friend's username"
            flex={1}
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="$indigo8Dark"
            color="$indigo8Dark"
            bg="$indigo2"
          />
          <Button onPress={handleAddFriend}
                  color="$blue8Dark"
                  bg="$indigo2">
            Add
          </Button>
        </XStack>

        {message !== "" && <Text>{message}</Text>}
      </YStack>
    </ScrollView>
  )
}
