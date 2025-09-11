import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();
// loads variables from .env into process.env
const config = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // needed on Render
  },
};

const pool = new Pool(config);

export default pool;
