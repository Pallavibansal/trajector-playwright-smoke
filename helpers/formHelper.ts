import { expect } from '@playwright/test';
import type { GetStartedPage } from '../pages/GetStartedPage';
import type { GetStartedFormData } from '../fixtures/formData.fixture';
import type { Logger } from '../utils/logger';

/**
 * Populates every field of the Get Started form from a data fixture.
 * Does NOT submit the form.
 */
export async function fillGetStartedForm(
  form: GetStartedPage,
  data: GetStartedFormData,
  log?: Logger,
): Promise<void> {
  log?.step(`Served in military: ${data.servedMilitary}`);
  await form.chooseRadio(data.servedMilitary === 'Yes' ? form.servedMilitaryYes : form.servedMilitaryNo);

  if (data.servedMilitary === 'Yes') {
    // Conditional fields are revealed by Gravity Forms logic after answering "Yes".
    await expect(form.vaRating).toBeVisible();

    log?.step(`VA disability rating: ${data.vaRating}`);
    await form.vaRating.selectOption(data.vaRating);

    log?.step(`Combat zone: ${data.combatZone}`);
    await form.chooseRadio(data.combatZone === 'Yes' ? form.combatZoneYes : form.combatZoneNo);

    log?.step(`Military retirement pay: ${data.retirementPay}`);
    await form.chooseRadio(data.retirementPay === 'Yes' ? form.retirementPayYes : form.retirementPayNo);

    log?.step(`VA denial letter: ${data.denialLetter}`);
    await form.chooseRadio(data.denialLetter === 'Yes' ? form.denialLetterYes : form.denialLetterNo);
  }

  log?.step(`Name: ${data.firstName} ${data.lastName}`);
  await form.firstName.fill(data.firstName);
  await form.lastName.fill(data.lastName);

  log?.step(`Age: ${data.age}`);
  await form.age.selectOption(data.age);

  log?.step(`Email: ${data.email}`);
  await form.email.fill(data.email);

  // The phone input is masked; type it key-by-key so the mask formats it.
  log?.step(`Phone: ${data.phone}`);
  await form.phone.click();
  await form.phone.pressSequentially(data.phone.replace(/\D/g, ''));

  log?.step(`Location: ${data.state} ${data.zip}`);
  await form.state.selectOption(data.state);
  await form.zip.fill(data.zip);

  log?.step(`SMS consent: marketing=${data.marketingSmsConsent}, transactional=${data.transactionalSmsConsent}`);
  await form.setCheckbox(form.marketingSmsConsent, data.marketingSmsConsent);
  await form.setCheckbox(form.transactionalSmsConsent, data.transactionalSmsConsent);
}

/** Asserts that the form currently holds the values from the data fixture. */
export async function expectFormToContain(form: GetStartedPage, data: GetStartedFormData): Promise<void> {
  await expect(form.firstName).toHaveValue(data.firstName);
  await expect(form.lastName).toHaveValue(data.lastName);
  await expect(form.age).toHaveValue(data.age);
  await expect(form.email).toHaveValue(data.email);
  // The input mask controls punctuation (e.g. "(555) 555-0133"), so compare digits only.
  const digits = data.phone.replace(/\D/g, '').split('');
  await expect(form.phone).toHaveValue(new RegExp(`^\\D*${digits.join('\\D*')}\\D*$`));
  await expect(form.state).toHaveValue(data.state);
  await expect(form.zip).toHaveValue(data.zip);
  if (data.servedMilitary === 'Yes') {
    await expect(form.vaRating).toHaveValue(data.vaRating);
  }
}
