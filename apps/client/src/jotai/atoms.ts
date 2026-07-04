import type { User } from "@interview.ai/types/db/types";
import { atom, type PrimitiveAtom } from "jotai";

export const userAtom = atom(null) as PrimitiveAtom<User | null>;
