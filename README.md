# Trajector Medical – Playwright Smoke Test

An automated smoke test for [trajectormedical.com](https://www.trajectormedical.com). It runs in a **1920×1080 desktop viewport** and:

1. Opens `https://www.trajectormedical.com/` and checks the URL and page title.
2. Taps **Get Started** and checks that it arrives at `https://www.trajectormedical.com/lpg/get-started-today/`.
3. Fills the form with a **random first and last name** (plus other generated data) on every run.
4. Checks that each field holds the generated value.
5. **Never submits the form.** The submit button is never clicked, and an auto fixture also blocks any `POST` to the form URL as a safety net.

## Requirements → implementation

| Requirement | Where |
|---|---|
| Smoke test for the page | [`tests/get-started.smoke.spec.ts`](tests/get-started.smoke.spec.ts) |
| Navigate to the site and confirm landing | `HomePage.goto()` / `HomePage.expectLoaded()` |
| Click "Get Started" and arrive at `/lpg/get-started-today/` | `HomePage.clickGetStarted()` + URL assertion |
| Page Object Model | [`pages/HomePage.ts`](pages/HomePage.ts), [`pages/GetStartedPage.ts`](pages/GetStartedPage.ts) |
| Helper function that fills the form | [`helpers/formHelper.ts`](helpers/formHelper.ts) → `fillGetStartedForm()` |
| Data fixture for form values | [`fixtures/formData.fixture.ts`](fixtures/formData.fixture.ts) → `formData` fixture / `buildFormData()` |
| Random first and last name each run | `@faker-js/faker` in `buildFormData()` |
| Test log saved to a file | [`reporters/file-logger-reporter.ts`](reporters/file-logger-reporter.ts) → `logs/test-run-<timestamp>.log` |
| Video of the test run | `video: 'on'` in config, plus the `saveVideo` fixture → `videos/*.webm` |
| Desktop viewport | `viewport: { width: 1920, height: 1080 }` in [`playwright.config.ts`](playwright.config.ts) |
| Do **not** submit the form | Submit is never clicked; the `blockFormSubmission` fixture aborts any POST |

## Project structure

```
├── fixtures/formData.fixture.ts      # data fixture + POM, logger, safety & video fixtures
├── helpers/formHelper.ts             # fillGetStartedForm() / expectFormToContain()
├── pages/HomePage.ts                 # POM: home page
├── pages/GetStartedPage.ts           # POM: /lpg/get-started-today/ form
├── reporters/file-logger-reporter.ts # writes the full run log to logs/
├── tests/get-started.smoke.spec.ts   # the smoke test
├── utils/logger.ts                   # timestamped step logger
├── sample-run/                       # log + video from a passing run, for reference
└── playwright.config.ts
```

## Setup and run

You need Node.js 18 or later.

```bash
npm install
npx playwright install chromium
npm test              # headless run
npm run test:headed   # watch it run
npm run report        # open the HTML report
```

## Output

After a run:

- **Log file:** `logs/test-run-<timestamp>.log`. It has the generated data, each step, each Playwright action, the result and the video path.
- **Video:** `videos/<test-name>-<timestamp>.webm`. Playwright's own copy also sits in `test-results/`.
- **HTML report:** `playwright-report/`.

`sample-run/` holds the log and video from a passing run, so you can see the output without running anything.
