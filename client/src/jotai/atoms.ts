import type { userType } from "@/types";
import { atom, type PrimitiveAtom } from "jotai";

export const userAtom = atom(null) as PrimitiveAtom<userType | null>;
