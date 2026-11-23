import { test, expect } from '../fixtures/formData.fixture';
import { GET_STARTED_URL } from '../pages/GetStartedPage';
import { fillGetStartedForm, expectFormToContain } from '../helpers/formHelper';

test.describe('Trajector Medical smoke test (desktop)', () => {
  test('home page -> Get Started -> fill form (no submit)', async ({
    page,
    homePage,
    getStartedPage,
    formData,
    log,
  }) => {
    const viewport = page.viewportSize();
    log.info(`Viewport: ${viewport?.width}x${viewport?.height}`);
    expect(viewport).toEqual({ width: 1920, height: 1080 });

    await test.step('Navigate to trajectormedical.com', async () => {
      log.step('Opening https://www.trajectormedical.com/');
      await homePage.goto();
    });

    await test.step('Confirm we landed on trajectormedical.com', async () => {
      await homePage.expectLoaded();
      log.info(`Landed on ${page.url()} — title "${await page.title()}"`);
    });

    await test.step('Click "Get Started" and arrive at the form page', async () => {
      log.step('Clicking "Get Started"');
      await homePage.clickGetStarted();
      await expect(page).toHaveURL(GET_STARTED_URL);
      await getStartedPage.expectLoaded();
      log.info(`Arrived at ${page.url()}`);
    });

    await test.step('Fill the form with randomly generated data', async () => {
      log.step(`Filling form for ${formData.firstName} ${formData.lastName}`);
      await fillGetStartedForm(getStartedPage, formData, log);
    });

    await test.step('Verify the form holds the generated values (NOT submitted)', async () => {
      await expectFormToContain(getStartedPage, formData);
      await expect(page).toHaveURL(GET_STARTED_URL);
      log.info('Form populated and verified. Submit intentionally NOT clicked.');
    });
  });
});
