import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/benihseribuan'

// Disable prefetch as it is not supported for "Transaction" mode in connection pooling
// But for local development, it's fine.
const client = postgres(connectionString)

export const db = drizzle(client, { schema })

console.log('🟢 DATABASE: PostgreSQL connection initialized.')
