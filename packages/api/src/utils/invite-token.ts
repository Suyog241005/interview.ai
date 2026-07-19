import { getRandomValues } from "crypto";

export function generateInviteCode(length = 6): string {
  const chars = "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ";
  const byteArray = new Uint8Array(length);
  getRandomValues(byteArray);

  let result = "";
  for (let i = 0; i < length; i++) {
    const currentByte = byteArray[i];
    if (currentByte !== undefined) {
      result += chars[currentByte % chars.length] || "";
    }
  }
  return result;
}
