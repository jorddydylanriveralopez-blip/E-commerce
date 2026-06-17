import { execSync } from "child_process";
import { randomBytes } from "crypto";

function run(cmd) {
  execSync(cmd, { stdio: "inherit", encoding: "utf8" });
}

function tryRun(cmd) {
  try {
    execSync(cmd, { stdio: "pipe", encoding: "utf8" });
    return true;
  } catch {
    return false;
  }
}

console.log("[yaavstore] Comprobando sesión de Vercel…");
if (!tryRun("npx vercel whoami")) {
  console.log("\n[yaavstore] Abre el enlace que aparece abajo e inicia sesión en Vercel:\n");
  run("npx vercel login");
}

const secret = randomBytes(32).toString("base64");
console.log("\n[yaavstore] Desplegando a dominio temporal (*.vercel.app)…\n");

run(`npx vercel deploy --prod --yes --env AUTH_SECRET=${secret}`);

console.log("\n[yaavstore] ¡Despliegue listo!");
console.log("[yaavstore] URL arriba ↑  (algo como https://yaavstore.vercel.app)");
console.log("[yaavstore] AUTH_SECRET configurado para este proyecto en Vercel.");
