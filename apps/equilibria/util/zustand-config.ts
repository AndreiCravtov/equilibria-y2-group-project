import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";
import { devtools } from "@csark0812/zustand-expo-devtools";

// type CreateFn<T> = typeof create;

// const useStore = create<State>()(
//   devtools(
//     persist(
//       immer((set) => ({
//         // ... your state and actions
//       })),
//       {
//         name: "app-storage",
//         storage: createJSONStorage(() => AsyncStorage),
//       }
//     ),
//     { name: "app-store" }
//   )
// );
