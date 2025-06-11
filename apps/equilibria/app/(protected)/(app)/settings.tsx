import {useState} from "react"
import {View, XStack, Input, Button, Text, YStack} from "tamagui"
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
      const friendId = username as Id<"users">;
      await addFriend({friendId})
      setMessage(`Friend request sent to ${username}`)
      setUsername("")
    } catch (err) {
      console.error(err)
      setMessage("Failed to send friend request")
    }
  }

  return (
    <YStack space="$4" padding="$4">
      <Text fontSize="$6" fontWeight="bold">Add a Friend</Text>

      <XStack space="$2" alignItems="center">
        <Input
          flex={1}
          placeholder="Enter username"
          value={username}
          onChangeText={setUsername}
        />
        <Button onPress={handleAddFriend}>Add</Button>
      </XStack>

      {message !== "" && <Text>{message}</Text>}
    </YStack>
  )
}
