import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly getStartedButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Several "Get Started" links exist (desktop/mobile nav variants); use the visible one.
    this.getStartedButton = page
      .getByRole('link', { name: 'Get Started', exact: true })
      .filter({ visible: true })
      .first();
  }

  async goto() {
    await this.page.goto('/');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/^https:\/\/(www\.)?trajectormedical\.com\/?$/);
    await expect(this.page).toHaveTitle(/Trajector Medical/i);
    await expect(this.getStartedButton).toBeVisible();
  }

  async clickGetStarted() {
    await this.getStartedButton.click();
  }
}
