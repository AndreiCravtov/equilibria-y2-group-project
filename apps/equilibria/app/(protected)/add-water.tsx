import {
  Authenticated,
  Unauthenticated,
  useQuery,
  useMutation,
} from "convex/react";
import {
  Text,
  View,
  ScrollView,
  YStack,
  XStack,
  Card,
  Input,
  Button,
  Group,
  H3,
  useTheme,
  Separator,
  H2,
} from "tamagui";
import {
  GlassWater,
  ActivitySquare,
  AirVent,
  Trash,
  Tv,
} from "@tamagui/lucide-icons";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Result } from "@/util/result";
import { useDatePicker } from "@/components/DatePicker";
import { formatDateDay, MS_IN_SEC, timestampToDate } from "@/util/date";
import { Id } from "./_generated/dataModel";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Pressable } from "react-native";
import { AppButton, AppH2 } from "@/components/app-components";

export default function AddWaterScreen() {
  const theme = useTheme();
  const { selectedDayTimestamp } = useDatePicker();
  const selectedDate = timestampToDate(selectedDayTimestamp);

  const waterEntries = useQuery(api.water.getWaterByDate, {
    dateUnixTimestamp: BigInt(selectedDayTimestamp),
  });

  const addWater = useMutation(api.water.addWaterEntry);
  const [newAmount, setNewAmount] = useState("");

  const removeEntry = useMutation(api.water.removeWaterEntry);

  if (!waterEntries) return <Text>Loading water entries...</Text>;

  console.log(`waterEntries: ${waterEntries}`);
  const handleAddEntry = async (amount: number | bigint) => {
    await addWater({
      dateUnixTimestamp: BigInt(selectedDayTimestamp),
      waterIntake: BigInt(amount),
    });
    setNewAmount("");
  };

  const handleRemove = async (id: number | bigint) => {
    await removeEntry({ waterEntryId: id as Id<"water"> });
  };

  function GroupButton({
    icon,
    value,
    bgColor,
  }: {
    icon: any;
    value: number;
    bgColor: string;
  }) {
    return (
      <Group.Item key={value}>
        <Button
          flex={1}
          onPress={() => handleAddEntry(value)}
          icon={icon}
          color="$blue8Dark"
          fontWeight="bold"
          bg={bgColor}
        >
          <Text color="$blue8Dark" fontWeight="bold" fontSize="$5">
            {value}ml
          </Text>
        </Button>
      </Group.Item>
    );
  }

  return (
    <ScrollView padding="$4" bounces={false} bg="#FFFFFF">
      <YStack gap="$4">
        <AppH2 self="center">Add entries</AppH2>
        {/* Input to add water */}
        <Group orientation="horizontal" width="100%">
          <GroupButton
            icon={GlassWater}
            value={200}
            bgColor={"$blue12Dark"}
          ></GroupButton>
          <Separator alignSelf="stretch" vertical borderColor="$indigo10" />
          <GroupButton
            icon={GlassWater}
            value={250}
            bgColor={"$indigo2"}
          ></GroupButton>
          <Separator alignSelf="stretch" vertical borderColor="$indigo10" />
          <GroupButton
            icon={GlassWater}
            value={500}
            bgColor={"$blue12Dark"}
          ></GroupButton>
        </Group>
        <BottleButton onPress={handleAddEntry} />
        <YStack space="$2">
          <Input
            placeholder="Enter water in mL"
            keyboardType="numeric"
            value={newAmount}
            onChangeText={setNewAmount}
            placeholderTextColor="$indigo8Dark"
            color="$indigo8Dark"
            bg="$indigo2"
            borderColor={"$indigo8"}
          />
          <AppButton onPress={() => handleAddEntry(Number(newAmount))}>
            Add Entry
          </AppButton>
        </YStack>

        <Separator my={15} borderColor="$indigo8Dark" />

        <AppH2 self="center">Entries for {formatDateDay(selectedDate)}</AppH2>

        {/* Show entries */}
        {waterEntries.length === 0 ? (
          <Text>No water entries yet.</Text>
        ) : (
          waterEntries.map((item) => (
            <Card key={item._id} p={"$3"} mb={"$3"} bg={"$indigo4"} radiused>
              <XStack justify="space-between" items="center">
                <Text fontWeight="bold" fontSize="$6" color="$indigo11">
                  {item.waterIntake} mL
                </Text>
                <Button
                  size="$3"
                  chromeless
                  onPress={() => handleRemove(item._id)}
                >
                  <Trash size={24} color="$red10" />
                </Button>
              </XStack>
            </Card>
          ))
        )}
      </YStack>
    </ScrollView>
  );
}

function BottleButton(props: { onPress: (amount: bigint) => void }) {
  const profile = useQuery(api.userProfiles.tryGetUserProfile);
  if (!profile || profile === "USER_PROFILE_MISSING") return;
  const bottleSize = profile.bottleSize;
  return (
    <Pressable
      onPress={() => {
        props.onPress(bottleSize);
      }}
      style={{ width: "100%" }}
    >
      <XStack width="100%">
        <View bg="$blue8Dark" style={{ borderRadius: 10, padding: 8, flex: 1 }}>
          <YStack alignItems="center">
            <FontAwesome6 name="bottle-water" size={64} color="white" />
            <Text color="white" fontWeight="bold" fontSize="$5">
              {bottleSize}ml
            </Text>
          </YStack>
        </View>
      </XStack>
    </Pressable>
  );
}
