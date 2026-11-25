// Trusted Super Admin bootstrap script.
// Looks up the designated owner email in Firebase Authentication, verifies
// that the account exists and has a verified email, and writes a server-
// validated role record to Firestore `admins/{uid}` plus custom claims.
// Refuses to create accounts or grant privileges to absent/unverified users.
//
// Usage: npx tsx scripts/bootstrap-super-admin.ts

import { execSync } from "node:child_process";

const PROJECT_ID = "bonsai-cafe";
const SUPER_ADMIN_EMAIL = "mohameadalhaear100@gmail.com";

async function main() {
  const token = execSync("gcloud auth print-access-token", { encoding: "utf8" }).trim();
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "x-goog-user-project": PROJECT_ID,
  };

  // 1. Look up existing Firebase Auth user by email
  const lookupRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/accounts:lookup`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ email: [SUPER_ADMIN_EMAIL] }),
    }
  );

  if (!lookupRes.ok) {
    throw new Error(
      `Firebase Auth lookup failed (${lookupRes.status}). Make sure Firebase Authentication is enabled for project "${PROJECT_ID}".`
    );
  }

  const lookupJson = (await lookupRes.json()) as {
    users?: Array<{ localId: string; email?: string; emailVerified?: boolean; displayName?: string }>;
  };

  const user = lookupJson.users?.find(
    (u) => u.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()
  );

  if (!user) {
    console.error(
      `Bootstrap stopped: Account "${SUPER_ADMIN_EMAIL}" does not exist in Firebase Auth yet.\n` +
        `Please enable Google Sign-In in Firebase Console and sign in once with this account first.`
    );
    process.exit(1);
  }

  if (!user.emailVerified) {
    console.error(
      `Bootstrap stopped: Account "${SUPER_ADMIN_EMAIL}" (UID: ${user.localId}) does not have a verified email.`
    );
    process.exit(1);
  }

  // 2. Set custom claim role=SUPER_ADMIN on the verified UID
  const claimRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/accounts:update`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        localId: user.localId,
        customAttributes: JSON.stringify({ role: "SUPER_ADMIN", superAdmin: true }),
      }),
    }
  );

  if (!claimRes.ok) {
    throw new Error(`Failed to set custom claims (${claimRes.status}): ${await claimRes.text()}`);
  }

  // 3. Write admins/{uid} record in Firestore
  const docUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/admins/${encodeURIComponent(
    user.localId
  )}`;
  const docRes = await fetch(docUrl, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        uid: { stringValue: user.localId },
        email: { stringValue: SUPER_ADMIN_EMAIL },
        role: { stringValue: "SUPER_ADMIN" },
        verified: { booleanValue: true },
        updatedAt: { timestampValue: new Date().toISOString() },
      },
    }),
  });

  if (!docRes.ok) {
    throw new Error(`Failed to write admins/${user.localId} (${docRes.status}): ${await docRes.text()}`);
  }

  console.log(`Granted SUPER_ADMIN to verified UID ${user.localId} (${SUPER_ADMIN_EMAIL}).`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
