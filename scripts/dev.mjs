import { spawn } from "child_process";
import {
  cleanNextCache,
  getDevPort,
  hasProductionCache,
  log,
  stopDevServer,
} from "./next-guard.mjs";

const fresh = process.argv.includes("--fresh");
const useWebpack = process.argv.includes("--webpack");
const port = getDevPort();

if (fresh) {
  log("Iniciando dev con caché limpia…");
  stopDevServer(port);
  cleanNextCache();
} else if (hasProductionCache()) {
  log("Detectada caché de producción. Limpiando antes de dev…");
  stopDevServer(port);
  cleanNextCache();
} else {
  const pids = stopDevServer(port);
  if (pids) {
    log(`Servidor anterior en puerto ${port} detenido.`);
  }
}

const nextArgs = useWebpack
  ? ["next", "dev", "-p", String(port)]
  : ["next", "dev", "--turbopack", "-p", String(port)];

const child = spawn("npx", nextArgs, {
  cwd: process.cwd(),
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32",
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 0);
});

process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
