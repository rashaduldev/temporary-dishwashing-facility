import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { getAppCheck } from "firebase-admin/app-check";
export function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing server setting: ${name}`);
  return v;
}
export function requiredSecret(name: string) {
  const value = required(name);
  if (Buffer.byteLength(value) < 32)
    throw new Error(`Server setting ${name} must contain at least 32 bytes`);
  return value;
}
export function firebase() {
  if (
    process.env.FIREBASE_DATABASE_EMULATOR_HOST ||
    process.env.FIRESTORE_EMULATOR_HOST ||
    process.env.FIREBASE_AUTH_EMULATOR_HOST
  )
    throw new Error("Deployed backend refuses emulator configuration.");
  const app =
    getApps().find((app) => app.name === "temporary123-server") ||
    initializeApp(
      {
        databaseURL: required("FIREBASE_DATABASE_URL"),
        credential: cert({
          projectId: required("FIREBASE_PROJECT_ID"),
          clientEmail: required("FIREBASE_CLIENT_EMAIL"),
          privateKey: required("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
        }),
      },
      "temporary123-server",
    );
  return { db: getDatabase(app), appCheck: getAppCheck(app) };
}
