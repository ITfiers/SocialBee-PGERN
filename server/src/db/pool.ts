import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config()

// export const pool = new Pool({
//   host: "localhost",
//   database: "instagram",
//   user: "postgres",
//   password: "postgres",
//   port: 5432,
// });

export const pool = new Pool({
    connectionString: process.env.DB_CONNECTION_STRING,
})
