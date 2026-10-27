import mysql from "mysql2/promise";

export const db = {
  async query<T extends mysql.RowDataPacket[]>(sql: string, values?: unknown[]) {
    const connection = await mysql.createConnection({
      uri: process.env.DATABASE_URL,
      disableEval: true,
    });
    try {
      return await connection.query<T>(sql, values);
    } finally {
      await connection.end();
    }
  },
};