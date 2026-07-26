import type { UserWithCandidate } from "@interview.ai/types/db";
import { atom, type PrimitiveAtom } from "jotai";

export const userAtom = atom(null) as PrimitiveAtom<UserWithCandidate | null>;
