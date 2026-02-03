import { Page } from "@playwright/test";

/**
 * Otevře chatovací okno na stránce ČSOB.
 * @param page Stránka Playwright na které se operace provádí
 */
export async function openChat(page: Page): Promise<void> {
  await page.locator('.wrap-div').click();
  await page.locator('iframe[name="onopChatIframe"]').contentFrame().getByRole('button', { name: 'Zahájit chat' }).waitFor();
}

/**
 * Zavře chatovací okno na stránce ČSOB.
 * @param page Stránka Playwright na které se operace provádí
 */
export async function closeChat(page: Page): Promise<void> {
  await page.locator('iframe[name="onopChatIframe"]').contentFrame().locator('#Close path').click();
}

/**
 * Zkontrol odpověď z chatovací služby.
 * @param page Stránka Playwright na které se operace provádí
 * @param questionToAsk Otázka položená chatovací službě
 * @param expectedAnswer Očekávaný text v odpovědi chatovací služby
 */
export async function checkChatAnswer(page: Page, questionToAsk: string, expectedAnswer: string): Promise<void> {
  const chatFrame = page.locator('iframe[name="onopChatIframe"]').contentFrame();
  await chatFrame.getByRole('button', { name: 'Zahájit chat' }).click();
  await chatFrame.getByText('Kate,').waitFor();
  await chatFrame.getByRole('textbox', { name: 'Pište zde...' }).fill(questionToAsk);
  await chatFrame.locator('button').click();
  await chatFrame.getByText(expectedAnswer).last().waitFor();
}

/** Klikne na možnost v chatovacím okně.
 * @param page Stránka Playwright na které se operace provádí
 * @param role Role elementu, na který se má kliknout
 * @param name Název elementu, na který se má kliknout
 */
export async function clickChatOption(page: Page, role: any, name: string): Promise<void> {
    const chatFrame = page.locator('iframe[name="onopChatIframe"]').contentFrame();
    await chatFrame.getByRole(role, { name: name }).click();
}