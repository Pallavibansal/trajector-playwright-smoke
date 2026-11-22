/**
 * Minimal step logger. Output goes to stdout, where the custom
 * file-logger reporter captures it into the run's log file.
 */
export type Logger = {
  info: (message: string) => void;
  step: (message: string) => void;
  warn: (message: string) => void;
};

const stamp = () => new Date().toISOString();

export function createLogger(scope: string): Logger {
  const write = (level: string, message: string) =>
    console.log(`[${stamp()}] [${level}] [${scope}] ${message}`);

  return {
    info: (m) => write('INFO', m),
    step: (m) => write('STEP', m),
    warn: (m) => write('WARN', m),
  };
}
