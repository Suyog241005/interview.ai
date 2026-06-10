import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants";

export const genToken = (userId: string) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });

  return token;
};

export const verifyToken = (token: string) => {
  const { userId } = jwt.verify(token, JWT_SECRET) as { userId: string };
  if (!userId) {
    throw new Error("Invalid token");
  }

  return userId;
};
