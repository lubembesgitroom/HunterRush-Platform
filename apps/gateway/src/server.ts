import { buildApp } from "./app.js";

async function start() {
  const app = buildApp();

  try {
    await app.listen({
      host: "0.0.0.0",
      port: 4000,
    });

    console.log("");
    console.log("==================================");
    console.log(" HunterRush Gateway");
    console.log(" Running on http://localhost:4000");
    console.log("==================================");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();