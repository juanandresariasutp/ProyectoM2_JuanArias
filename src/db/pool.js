import pkg from "pg"

const { Pool } = pkg

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === "true"
        ? { rejectUnauthorized: false }
        : false
    }
  : {
      user: process.env.DB_USER || "postgres",
      host: process.env.DB_HOST || "localhost",
      database: process.env.DB_NAME || "miniblog",
      password: process.env.DB_PASSWORD || "",
      port: Number(process.env.DB_PORT) || 5432
    }

const pool = new Pool(poolConfig)

export default pool