import { test, expect } from '@playwright/test';
import { acceptCookies } from '../helpers/cookies';
import { checkChatAnswer, clickChatOption, closeChat, openChat } from '../helpers/chat';

test('ČSOB pořád nabízí nějaká volná místa', async ({ page }) => {
  // Otevři domovskou stránku ČSOB
  await page.goto('https://www.csob.cz');

  // Potvrď souhlas s použitím cookies tlačítkem "Souhlasím"
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
  
  // Potvrď souhlas s použitím cookies tlačítkem "Přijmout všechny soubory cookie"
  await acceptCookies(page, 'Přijmout všechny soubory cookie');
  
  // Vyfiltruj pozice podle klíčového slova "Test"
  await page.getByTestId('jobCard').first().waitFor();
  await page.getByTestId('searchByKeywords').fill('Test');
  await page.getByRole('button', { name: 'Vyhledat pozice' }).click();

  // Ověř, že výsledky vyhledávání obsahují pozici "IT Test Manažer (m/ž)"
  await page.getByTestId('jobCard').first().waitFor();
  await expect(page.getByText('IT Test Manažer (m/ž)')).toBeVisible();
});

test('Na ČSOB stránce funguje chatovací služba', async ({ page }) => {
  await page.goto('https://www.csob.cz');
  await acceptCookies(page, 'Souhlasím');

  // Zkus otevřít chatovací službu
  await openChat(page);

  // Zavři chatovací okno
  await closeChat(page);
});

test('Chatovací služba ČSOB odpovídá na dotazy', async ({ page }) => {
  await page.goto('https://www.csob.cz');
  await acceptCookies(page, 'Souhlasím');

  // Zkontroluj odpověď chatovací služby na otázku "Kde všude má ČSOB bankomaty?"
  await openChat(page);
  const question = 'Kde všude má ČSOB bankomaty?';
  const expectedAnswerFragment = 'Pobočky, bankomaty i pošty najdete tady.';
  await checkChatAnswer(page, question, expectedAnswerFragment);
});

test('Uživatel se dostane ke kurzovnímu lístku ČSOB', async ({ page }) => {
  await page.goto('https://www.csob.cz');
  await acceptCookies(page, 'Souhlasím');

  await openChat(page);
  const question = 'Jaký je aktuální kurz USD na CZK?';
  const expectedAnswerFragment = 'Na kurzovní lístek se podíváte tady.';
  await checkChatAnswer(page, question, expectedAnswerFragment);
  await clickChatOption(page, 'link', 'Kurzovní lístek');
  const newPage = await page.waitForEvent('popup', { timeout: 5000 }).catch(() => page);
  await newPage.getByRole('textbox', { name: 'Kolik mám' }).fill('100');
  const currencyInput = newPage.locator('#currency-converter-currency-input-select');
  await currencyInput.selectOption('USD');
  await currencyInput.click();
  let value = await newPage.getByRole('textbox', { name: 'Kolik dostanu' }).inputValue();
  value = value.replace(/\s/g, '').replace(',', '.');
  expect(parseFloat(value)).toBeGreaterThan(1985.0);
});