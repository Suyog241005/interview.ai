import { atom, type PrimitiveAtom } from "jotai";

export const userAtom = atom(null) as PrimitiveAtom<{
  _id: string;
  name: string;
  email: string;
  photoUrl?: string;
  credits: number;
} | null>;
