import { existsSync } from "fs";
import path from "path";
import { log } from "./next-guard.mjs";

const buildId = path.join(process.cwd(), ".next", "BUILD_ID");

if (!existsSync(buildId)) {
  log("No hay build de producción. Ejecuta: npm run build");
  process.exit(1);
}

log("Build de producción encontrado.");
