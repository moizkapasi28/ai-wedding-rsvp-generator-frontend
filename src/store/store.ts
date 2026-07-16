import type { User } from "@/models/user.model";
import { atomWithStorage } from "jotai/utils";

export const userAtom = atomWithStorage<User | null>("user", null);
export const isLoggedInAtom = atomWithStorage<boolean>("isLoggedIn", false);
export const refreshTokenAtom = atomWithStorage<string | null>(
  "refreshToken",
  null,
);
export const activeWeddingIdAtom = atomWithStorage<string | null>(
  "activeWeddingId",
  null,
);
