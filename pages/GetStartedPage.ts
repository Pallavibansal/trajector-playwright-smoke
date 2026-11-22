import { expect, type Locator, type Page } from '@playwright/test';

export const GET_STARTED_URL = 'https://www.trajectormedical.com/lpg/get-started-today/';

/**
 * Page Object Model for https://www.trajectormedical.com/lpg/get-started-today/
 * (Gravity Form #41). Locators are role/label based where the markup allows it,
 * falling back to stable Gravity Forms ids for duplicated labels (Yes/No radios).
 */
export class GetStartedPage {
  readonly page: Page;
  readonly form: Locator;

  // Military questions
  readonly servedMilitaryYes: Locator;
  readonly servedMilitaryNo: Locator;
  readonly vaRating: Locator;
  readonly combatZoneYes: Locator;
  readonly combatZoneNo: Locator;
  readonly retirementPayYes: Locator;
  readonly retirementPayNo: Locator;
  readonly denialLetterYes: Locator;
  readonly denialLetterNo: Locator;

  // Contact details
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly age: Locator;
  readonly email: Locator;
  readonly phone: Locator;
  readonly state: Locator;
  readonly zip: Locator;

  // Consent
  readonly marketingSmsConsent: Locator;
  readonly transactionalSmsConsent: Locator;

  // Submit (intentionally never clicked by this suite)
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.locator('#gform_41');

    this.servedMilitaryYes = this.form.locator('#choice_41_15_0');
    this.servedMilitaryNo = this.form.locator('#choice_41_15_1');
    this.vaRating = this.form.locator('#input_41_40');
    this.combatZoneYes = this.form.locator('#choice_41_18_0');
    this.combatZoneNo = this.form.locator('#choice_41_18_1');
    this.retirementPayYes = this.form.locator('#choice_41_17_0');
    this.retirementPayNo = this.form.locator('#choice_41_17_1');
    this.denialLetterYes = this.form.locator('#choice_41_16_0');
    this.denialLetterNo = this.form.locator('#choice_41_16_1');

    this.firstName = this.form.getByLabel('First Name*', { exact: true });
    this.lastName = this.form.getByLabel('Last Name*', { exact: true });
    this.age = this.form.getByLabel('Age*', { exact: true });
    this.email = this.form.getByLabel('Email*', { exact: true });
    this.phone = this.form.getByLabel('Phone*', { exact: true });
    this.state = this.form.locator('#input_41_26_4');
    this.zip = this.form.getByLabel('ZIP Code', { exact: true });

    this.marketingSmsConsent = this.form.locator('#choice_41_33_1');
    this.transactionalSmsConsent = this.form.locator('#choice_41_34_1');

    this.submitButton = this.form.locator('#gform_submit_button_41');
  }

  async goto() {
    await this.page.goto(GET_STARTED_URL);
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(GET_STARTED_URL);
    await expect(this.form).toBeVisible();
    await expect(this.firstName).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  /** Radio inputs are visually hidden behind styled labels, so check via the label. */
  async chooseRadio(radio: Locator) {
    await radio.check({ force: true });
    await expect(radio).toBeChecked();
  }

  async setCheckbox(checkbox: Locator, checked: boolean) {
    await checkbox.setChecked(checked, { force: true });
  }
}
