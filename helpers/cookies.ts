import { Page } from '@playwright/test';

/**
 * Pokusí se přijmout cookies kliknutím na tlačítko "Souhlasím", pokud je viditelné.
 * Jedná se o pomocnou funkci na nejlepší možný pokus, která elegantně zvládá případy,
 * kdy dialog není přítomen nebo s ním nelze interagovat.
 * 
 * @param page Stránka Playwright na které se operace provádí
 * @param buttonName Název tlačítka pro přijetí cookies (výchozí je 'Souhlasím')
 */
export async function acceptCookies(page: Page, buttonName: string): Promise<void> {
  try {
    const acceptCookiesButton = page.getByRole('button', { name: buttonName });
    await acceptCookiesButton.waitFor();
    await acceptCookiesButton.click();
  } catch (e) {
    console.warn('Cookie dialog nebyl nalezen nebo s ním nešlo interagovat.');
  }
}