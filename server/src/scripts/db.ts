import knex from "knex";

const db = knex({
  client: "pg",
  connection: {
    host: process.env.PG_HOST || "postgres",
    port: Number(process.env.PG_PORT) || 5432,
    user: process.env.PG_USER || "devuser",
    password: process.env.PG_PASSWORD || "devpass",
    database: process.env.PG_DATABASE || "devdb",
  },
});

export default db;
