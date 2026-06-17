import { execSync } from "child_process";
import { existsSync, rmSync } from "fs";
import path from "path";

const ROOT = process.cwd();
const NEXT_DIR = path.join(ROOT, ".next");

export function getDevPort() {
  const raw = process.env.PORT ?? "3000";
  const port = Number(raw);
  return Number.isFinite(port) && port > 0 ? port : 3000;
}

export function getPidsOnPort(port) {
  try {
    const output = execSync(`lsof -ti:${port} -sTCP:LISTEN`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (!output) return [];
    return output
      .split("\n")
      .map((pid) => Number(pid.trim()))
      .filter((pid) => Number.isFinite(pid) && pid > 0);
  } catch {
    return [];
  }
}

export function stopDevServer(port = getDevPort()) {
  const pids = getPidsOnPort(port);
  if (pids.length === 0) return false;

  for (const pid of pids) {
    try {
      process.kill(pid, "SIGTERM");
    } catch {
      // proceso ya terminó
    }
  }

  try {
    execSync("sleep 0.4");
  } catch {
    // ignore
  }

  for (const pid of getPidsOnPort(port)) {
    try {
      process.kill(pid, "SIGKILL");
    } catch {
      // ignore
    }
  }

  return true;
}

export function cleanNextCache() {
  if (!existsSync(NEXT_DIR)) return false;
  rmSync(NEXT_DIR, { recursive: true, force: true });
  return true;
}

/** Producción deja BUILD_ID; mezclarlo con dev corrompe la caché. */
export function hasProductionCache() {
  return existsSync(path.join(NEXT_DIR, "BUILD_ID"));
}

export function log(message) {
  console.log(`[yaavstore] ${message}`);
}
