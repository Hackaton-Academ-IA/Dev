type Level = "INFO" | "WARN" | "ERROR";

async function writeToFile(line: string): Promise<void> {
  // On vérifie strictement si on est côté serveur (Node.js)
  if (typeof window !== "undefined") return;

  try {
    // Import dynamique pour éviter que le client n'essaie de résoudre 'fs'
    const fs = await import("fs");
    const path = await import("path");
    const AUDIT_PATH = path.join(process.cwd(), "audit.log");

    fs.appendFileSync(AUDIT_PATH, line + "\n", "utf8");
  } catch {
    // La faillite du log ne doit pas bloquer l'application
    // On peut logger l'erreur en console uniquement en dev
  }
}

function log(level: Level, action: string, detail: string, userId?: string): void {
  const ts = new Date().toISOString();
  const ctx = userId ? `${detail} | user:${userId}` : detail;
  const line = `[${ts}] [${level}] ${action} | ${ctx}`;
  
  // Affichage console visible partout
  console.log(line);
  
  // Écriture fichier uniquement sur le serveur
  void writeToFile(line);
}

export const logger = {
  info:  (action: string, detail: string, userId?: string) => log("INFO",  action, detail, userId),
  warn:  (action: string, detail: string, userId?: string) => log("WARN",  action, detail, userId),
  error: (action: string, detail: string, userId?: string) => log("ERROR", action, detail, userId),
};