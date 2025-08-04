import db from "./db";

async function test() {
  try {
    const result = await db.raw("SELECT NOW()");
    console.log("Conectado ao PostgreSQL em:", result.rows[0].now);
  } catch (error) {
    console.error("Erro ao conectar ao PostgreSQL:", error);
  } finally {
    await db.destroy();
  }
}

test();
