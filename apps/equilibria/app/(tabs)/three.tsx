import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button, Input, Text, View, YStack } from "tamagui";

export default function AddProductScreen() {
  const addProduct = useMutation(api.products.add);

  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [status, setStatus] = useState<null | string>(null);

  const handleAdd = async () => {

    if (!name || !calories) {
      setStatus("Please fill out all fields.");
      return;
    }

    const parsedCalories = BigInt(calories);

    try {
      await addProduct({
        name,
        calories: parsedCalories,
      });
      setName("");
      setCalories("");
      setStatus("Product added successfully!");
    } catch (err) {
      console.error(err);
      setStatus("Error adding product.");
    }
  };

  return (
    <View flex={1} justifyContent="center" alignItems="center" padding="$4">
      <YStack space="$3" width="100%" maxWidth={400}>
        <Text fontSize="$6" fontWeight="bold">
          Add New Product
        </Text>

        <Input
          placeholder="Product Name"
          value={name}
          onChangeText={setName}
        />
        <Input
          placeholder="Calories"
          value={calories}
          onChangeText={setCalories}
          keyboardType="numeric"
        />

        <Button onPress={handleAdd}>Add Product</Button>

        {status && <Text>{status}</Text>}
      </YStack>
    </View>
  );
}
