import "dotenv/config"

import { Pool } from "pg";

export const DB = new Pool ({
    host: "localhost",
    port: 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB
});

