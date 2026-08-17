import "dotenv/config";
import { validateEnv } from "@/config/env";
import { createDb } from "@/shared/database/db";
import { createAuth } from "./auth";

const env = validateEnv(process.env);

const db = createDb(env.DATABASE_URL);

export const auth = createAuth(db, env.BETTER_AUTH_URL, env.BETTER_AUTH_SECRET);
