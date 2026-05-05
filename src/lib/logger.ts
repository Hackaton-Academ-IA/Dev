type Level = "INFO" | "WARN" | "ERROR";

function log(level: Level, action: string, detail: string, userId?: string): void {
  const ts = new Date().toISOString();
  const user = userId ? ` [user:${userId}]` : "";
  console.log(`[${ts}] [${level}] [${action}]${user} - ${detail}`);
}

export const logger = {
  info:  (action: string, detail: string, userId?: string) => log("INFO",  action, detail, userId),
  warn:  (action: string, detail: string, userId?: string) => log("WARN",  action, detail, userId),
  error: (action: string, detail: string, userId?: string) => log("ERROR", action, detail, userId),
};
