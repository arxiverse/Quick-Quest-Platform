import "dotenv/config";
import { defineConfig } from "prisma/config";

function buildMysqlUrl() {
  const username = process.env.DB_USERNAME || "root";
  const password = process.env.DB_PASSWORD || "";
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || "3306";
  const database = process.env.DB_NAME || "quickquest";

  const encodedUsername = encodeURIComponent(username);
  const encodedPassword = password ? `:${encodeURIComponent(password)}` : "";

  return `mysql://${encodedUsername}${encodedPassword}@${host}:${port}/${database}`;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: buildMysqlUrl(),
  },
});
