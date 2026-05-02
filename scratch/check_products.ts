import { db } from "./src/lib/db/index";
import { products } from "./src/lib/db/schema";
import { inArray } from "drizzle-orm";

async function check() {
  const ids = [1, 13, 9, 4];
  const list = await db.select().from(products).where(inArray(products.id, ids));
  console.log(JSON.stringify(list, null, 2));
  process.exit(0);
}

check();
