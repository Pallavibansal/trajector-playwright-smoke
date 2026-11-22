import path from 'node:path';
import { test as base } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { createLogger, type Logger } from '../utils/logger';
import { HomePage } from '../pages/HomePage';
import { GetStartedPage } from '../pages/GetStartedPage';

export type YesNo = 'Yes' | 'No';

export type GetStartedFormData = {
  servedMilitary: YesNo;
  vaRating: string;
  combatZone: YesNo;
  retirementPay: YesNo;
  denialLetter: YesNo;
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  phone: string;
  state: string;
  zip: string;
  marketingSmsConsent: boolean;
  transactionalSmsConsent: boolean;
};

const VA_RATINGS = ['Not Rated', '0', '10-40', '50', '60-80', '90'];

/** Builds a fresh data set; first/last name (and derived email) are random every run. */
export function buildFormData(overrides: Partial<GetStartedFormData> = {}): GetStartedFormData {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    servedMilitary: 'Yes',
    vaRating: faker.helpers.arrayElement(VA_RATINGS),
    combatZone: faker.helpers.arrayElement<YesNo>(['Yes', 'No']),
    retirementPay: faker.helpers.arrayElement<YesNo>(['Yes', 'No']),
    denialLetter: faker.helpers.arrayElement<YesNo>(['Yes', 'No']),
    firstName,
    lastName,
    age: String(faker.number.int({ min: 25, max: 65 })),
    // example.com is reserved (RFC 2606) so no real inbox is ever targeted.
    email: faker.internet.email({ firstName, lastName, provider: 'example.com' }).toLowerCase(),
    // 555-01xx numbers are reserved for fictional use.
    phone: `555-555-01${faker.string.numeric(2)}`,
    state: faker.location.state(),
    zip: faker.location.zipCode('#####'),
    marketingSmsConsent: false,
    transactionalSmsConsent: false,
    ...overrides,
  };
}

type Fixtures = {
  formData: GetStartedFormData;
  log: Logger;
  homePage: HomePage;
  getStartedPage: GetStartedPage;
  blockFormSubmission: void;
  saveVideo: void;
};

export const test = base.extend<Fixtures>({
  log: async ({}, use, testInfo) => {
    await use(createLogger(testInfo.title));
  },

  formData: async ({ log }, use) => {
    const data = buildFormData();
    log.info(`Generated form data: ${JSON.stringify(data)}`);
    await use(data);
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  getStartedPage: async ({ page }, use) => {
    await use(new GetStartedPage(page));
  },

  /**
   * Safety net (auto fixture): abort any POST to the get-started page so the
   * real form can never be submitted to Trajector, even by accident.
   */
  blockFormSubmission: [
    async ({ page, log }, use) => {
      await page.route('**/lpg/get-started-today/**', async (route) => {
        if (route.request().method() === 'POST') {
          log.warn(`Blocked form POST to ${route.request().url()}`);
          await route.abort();
        } else {
          await route.continue();
        }
      });
      await use();
    },
    { auto: true },
  ],

  /**
   * Auto fixture: after each test, persist the recorded video to ./videos
   * (Playwright's test-results/ folder is wiped at the start of every run).
   */
  saveVideo: [
    async ({ page, log }, use, testInfo) => {
      await use();
      const video = page.video();
      if (!video) return;
      await page.context().close(); // video is finalised when the context closes
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      const slug = testInfo.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase().slice(0, 60);
      const target = path.resolve('videos', `${slug}-${ts}.webm`);
      await video.saveAs(target);
      log.info(`Video saved to ${target}`);
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
