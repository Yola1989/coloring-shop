import crypto from "crypto";

// Order numbers look like: LB-20260731-7F3A
// "LB" = LawenBook (was "CS", left over from the old coloring-shop name).
const PREFIX = "LB";

function randomPart(): string {
  // crypto.randomBytes instead of Math.random(): far fewer collisions and
  // order numbers stop being guessable from one another.
  return crypto.randomBytes(3).toString("hex").toUpperCase();
}

export function generateOrderNumber(): string {
  const date = new Date();
  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");

  return `${PREFIX}-${datePart}-${randomPart()}`;
}
