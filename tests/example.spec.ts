import { test, expect, Page } from '@playwright/test';
import { acceptCookies } from '../helpers/cookies';

test('ČSOB pořád nabízí nějaká volná místa', async ({ page }) => {
  // Otevři domovskou stránku ČSOB
  await page.goto('https://www.csob.cz');
  // Zavřeme cookie dialog, pokud se objeví (tlačítko na ČSOB: "Souhlasím")
  await acceptCookies(page, 'Souhlasím');

  // Klikni na odkaz "Kariéra v ČSOB a volná místa"
  await page.getByRole('link', { name: 'Kariéra v ČSOB a volná místa' }).click();
  
  // Klikni na tlačítko "Volná místa" a zachyť nově otevřenou záložku nebo navigaci ve stejné stránce.
  await page.getByRole('link', { name: 'Volná místa', exact: true }).click();
  const newPage = await page.waitForEvent('popup', { timeout: 5000 }).catch(() => page);

  // Ověř, že v nové záložce je nadpis s textem "Volná místa"
  await expect(newPage.getByRole('heading', { level: 1 })).toHaveText('Volná místa');

  // Ověř, že stránka zobrazuje alespoň jednu nabídku práce
  const jobCards = newPage.getByTestId('jobCard');
  await jobCards.first().waitFor();
});

test('ČSOB kariérní stránka umožňuje vyhledávání pozic', async ({ page }) => {
  // Otevři kariérní stránku ČSOB
  await page.goto('https://careers.kbc-group.com/CSOB/search?locale=cs_CZ');
  // Accept cookies on the careers site using the localized accept button name.
  await acceptCookies(page, 'Přijmout všechny soubory cookie');
  await page.getByTestId('jobCard').first().waitFor();
  await page.getByTestId('searchByKeywords').fill('Test');
  await page.getByRole('button', { name: 'Vyhledat pozice' }).click();
  await page.getByTestId('jobCard').first().waitFor();
  await expect(page.getByText('IT Test Manažer (m/ž)')).toBeVisible();
});