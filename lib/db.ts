import mysql from "mysql2/promise";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const db = {
  async query<T extends mysql.RowDataPacket[]>(sql: string, values?: unknown[]) {
    let connectionConfig: mysql.ConnectionOptions = {
      uri: process.env.DATABASE_URL,
      disableEval: true,
    };

    try {
      const { env } = await getCloudflareContext({ async: true });
      const hd = (env as Record<string, any>)?.HYPERDRIVE;
      if (hd) {
        connectionConfig = {
          host: hd.host,
          user: hd.user,
          password: hd.password,
          database: hd.database,
          port: hd.port,
          disableEval: true,
        };
      }
    } catch {
      // Rodando localmente com next dev, usa o process.env.DATABASE_URL
    }

    const connection = await mysql.createConnection(connectionConfig);
    try {
      return await connection.query<T>(sql, values);
    } finally {
      await connection.end();
    }
  },
};