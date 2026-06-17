import {
  cleanNextCache,
  getDevPort,
  log,
  stopDevServer,
} from "./next-guard.mjs";

const port = getDevPort();

if (stopDevServer(port)) {
  log(`Servidor de desarrollo en puerto ${port} detenido antes del build.`);
}

if (cleanNextCache()) {
  log("Caché .next limpiada para un build seguro.");
}

log("Listo para compilar.");
