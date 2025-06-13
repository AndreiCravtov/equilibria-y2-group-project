import { Result } from "@/util/result";
import { create } from "zustand";

interface Profile {
  name: string;
  age: bigint;
  gender: "male" | "female";
  weight: bigint;
  height: bigint;
  dailyTarget: bigint;
  bottleSize: bigint;
}

interface ProfileStore {
  maybeProfile: Profile | "USER_PROFILE_MISSING";
}

interface ProfileActions {
  setProfile: (profile: Profile) => void;
}

export const useProfileStore = create<ProfileStore & ProfileActions>()(
  (set) => ({
    maybeProfile: "USER_PROFILE_MISSING",
    setProfile: (profile: Profile) => set((_) => ({ maybeProfile: profile })),
  })
);

export default function useProfile() {
  const { maybeProfile } = useProfileStore();
  if (maybeProfile === "USER_PROFILE_MISSING")
    throw Error("Missing user profile");
  return maybeProfile;
}
