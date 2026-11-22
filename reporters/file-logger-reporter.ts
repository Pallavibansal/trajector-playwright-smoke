import fs from 'node:fs';
import path from 'node:path';
import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
  TestStep,
} from '@playwright/test/reporter';

const stripAnsi = (text: string) => text.replace(/\u001b\[[0-9;]*m/g, '');

/**
 * Writes a complete, timestamped log of each test run to
 * logs/test-run-<timestamp>.log, including test stdout/stderr,
 * Playwright steps, results, errors, and attachment paths (videos).
 */
export default class FileLoggerReporter implements Reporter {
  private stream!: fs.WriteStream;
  private filePath!: string;
  private readonly logDir: string;

  constructor(options: { logDir?: string } = {}) {
    this.logDir = options.logDir ?? 'logs';
  }

  private write(line: string) {
    this.stream.write(`[${new Date().toISOString()}] ${stripAnsi(line)}\n`);
  }

  onBegin(config: FullConfig, suite: Suite) {
    fs.mkdirSync(this.logDir, { recursive: true });
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    this.filePath = path.resolve(this.logDir, `test-run-${ts}.log`);
    this.stream = fs.createWriteStream(this.filePath, { flags: 'a' });
    this.write(`=== Test run started: ${suite.allTests().length} test(s), ${config.workers} worker(s) ===`);
  }

  onTestBegin(test: TestCase) {
    this.write(`--- TEST START: ${test.titlePath().filter(Boolean).join(' > ')}`);
  }

  onStepEnd(_test: TestCase, _result: TestResult, step: TestStep) {
    if (step.category === 'test.step' || step.category === 'pw:api') {
      this.write(`  step: ${step.title} (${step.duration}ms)${step.error ? ' FAILED' : ''}`);
    }
  }

  onStdOut(chunk: string | Buffer) {
    this.stream.write(stripAnsi(chunk.toString()));
  }

  onStdErr(chunk: string | Buffer) {
    this.stream.write(`[stderr] ${stripAnsi(chunk.toString())}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    this.write(`--- TEST END: ${test.title} -> ${result.status.toUpperCase()} in ${result.duration}ms`);
    for (const error of result.errors) {
      this.write(`  error: ${error.message ?? error.value}`);
      if (error.stack) this.stream.write(`${stripAnsi(error.stack)}\n`);
    }
    for (const a of result.attachments) {
      if (a.path) this.write(`  attachment [${a.name}]: ${a.path}`);
    }
  }

  async onEnd(result: FullResult) {
    this.write(`=== Test run finished: ${result.status.toUpperCase()} ===`);
    await new Promise<void>((resolve) => this.stream.end(resolve));
    console.log(`\nTest log written to: ${this.filePath}`);
  }

  printsToStdio() {
    return false;
  }
}
