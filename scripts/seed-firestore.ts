// One-off seeding script: pushes the bundled seed data (categories, products,
// brand settings) into this project's Firestore via the REST API, using a
// gcloud access token (no service-account key file is written to disk).
// Run with: npx tsx scripts/seed-firestore.ts
import { execSync } from "node:child_process";
import { categories } from "../src/data/categories";
import { products } from "../src/data/products";
import { brand } from "../src/data/brand";

const PROJECT_ID = "bonsai-cafe";
const token = execSync("gcloud auth print-access-token", { encoding: "utf8" }).trim();
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

function toFirestoreValue(v: unknown): Record<string, unknown> {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === "string") return { stringValue: v };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(toFirestoreValue) } };
  if (typeof v === "object") {
    const fields: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) fields[k] = toFirestoreValue(val);
    return { mapValue: { fields } };
  }
  return { stringValue: String(v) };
}

async function setDoc(collection: string, id: string, data: Record<string, unknown>) {
  const fields: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) fields[k] = toFirestoreValue(v);
  const res = await fetch(`${BASE}/${collection}/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) {
    throw new Error(`${collection}/${id} -> ${res.status} ${await res.text()}`);
  }
}

async function main() {
  console.log(`Seeding ${categories.length} categories...`);
  for (const c of categories) await setDoc("categories", c.id, c);

  console.log(`Seeding ${products.length} products...`);
  for (const p of products) await setDoc("products", p.id, p);

  console.log("Seeding brand settings...");
  await setDoc("settings", "brand", brand);

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
