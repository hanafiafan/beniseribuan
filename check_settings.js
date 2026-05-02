import { db } from "./src/lib/db/index.js";
import { settings } from "./src/lib/db/schema.js";

async function check() {
  const all = await db.select().from(settings);
  console.log(JSON.stringify(all, null, 2));
  process.exit(0);
}
check();
