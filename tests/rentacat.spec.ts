import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:8080';

test.beforeEach(async ({ page, context }) => {
  await context.addCookies([
    { name: '1', value: 'false', url: BASE },
    { name: '2', value: 'false', url: BASE },
    { name: '3', value: 'false', url: BASE },
  ]);

  await page.goto(BASE);
});

test('TEST-1-RESET', async ({ page, context }) => {
  await context.addCookies([
    { name: '1', value: 'true', url: BASE },
    { name: '2', value: 'true', url: BASE },
    { name: '3', value: 'true', url: BASE },
  ]);

  await page.goto(BASE);
  await page.getByText('Reset').click();

  const items = page.locator('text=Cats available for rent:')
    .locator('xpath=..')
    .locator('li');

  await expect(items.nth(0)).toHaveText('ID 1. Jennyanydots');
  await expect(items.nth(1)).toHaveText('ID 2. Old Deuteronomy');
  await expect(items.nth(2)).toHaveText('ID 3. Mistoffelees');
});

test('TEST-2-CATALOG', async ({ page }) => {
  await page.getByText('Catalog').click();

  const images = page.locator('ol img');
  await expect(images.nth(1)).toHaveAttribute('src', '/images/cat2.jpg');
});

test('TEST-3-LISTING', async ({ page }) => {
  const section = page.locator('main > div');
  const items = section.locator('ul').first().locator('li');

  await expect(items).toHaveCount(3);
  await expect(items.nth(2)).toHaveText('ID 3. Mistoffelees');
});

test('TEST-4-RENT-A-CAT', async ({ page }) => {
  await page.getByText('Rent-A-Cat').click();

  await expect(page.getByRole('button', { name: 'Rent' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Return' })).toBeVisible();
});

test('TEST-5-RENT', async ({ page }) => {
  await page.getByText('Rent-A-Cat').click();

  await page.getByRole('textbox').first().fill('1');
  await page.getByRole('button', { name: 'Rent' }).click();

  const items = page.locator('text=Cats available for rent:')
    .locator('xpath=..')
    .locator('li');

  await expect(items.nth(0)).toHaveText('Rented out');
  await expect(page.locator('#rentResult')).toHaveText('Success!');
});

test('TEST-6-RETURN', async ({ page, context }) => {
  await context.addCookies([
    { name: '2', value: 'true', url: BASE },
    { name: '3', value: 'true', url: BASE },
  ]);

  await page.goto(BASE);
  await page.getByText('Rent-A-Cat').click();

  await page.getByRole('textbox').nth(1).fill('2');
  await page.getByRole('button', { name: 'Return' }).click();

  const items = page.locator('text=Cats available for rent:')
    .locator('xpath=..')
    .locator('li');

  await expect(items.nth(1)).toHaveText('ID 2. Old Deuteronomy');
  await expect(page.locator('#returnResult')).toHaveText('Success!');
});

test('TEST-7-FEED-A-CAT', async ({ page }) => {
  await page.getByText('Feed-A-Cat').click();

  await expect(page.getByRole('button', { name: 'Feed' })).toBeVisible();
});

test('TEST-8-FEED', async ({ page }) => {
  await page.getByText('Feed-A-Cat').click();

  await page.getByRole('textbox').fill('6');
  await page.getByRole('button', { name: 'Feed' }).click();

  await expect(page.locator('#feedResult')).toHaveText('Nom, nom, nom.');
});

test('TEST-9-GREET-A-CAT', async ({ page }) => {
  await page.getByText('Greet-A-Cat').click();

  await expect(page.locator('body')).toContainText('Meow!Meow!Meow!');
});

test('TEST-10-GREET-A-CAT-WITH-NAME', async ({ page }) => {
  await page.goto(`${BASE}/greet-a-cat/Jennyanydots`);

  await expect(page.locator('body')).toContainText('Meow!');
});

test('TEST-12-FEED-A-CAT-NEGATIVE-INTEGER', async ({ page }) => {
  await page.goto(BASE);

  await page.getByText('Feed-A-Cat').click();

  await page.getByRole('textbox').fill('-3');
  await page.getByRole('button', { name: 'Feed' }).click();

  await expect(page.locator('#feedResult')).not.toHaveText('Nom, nom, nom.');
});

test('TEST-13-RENT-A-CAT-DECIMAL-ID', async ({ page }) => {
  await page.goto(BASE);

  await page.getByText('Rent-A-Cat').click();

  await page.getByRole('textbox').first().fill('1.0');
  await page.getByRole('button', { name: 'Rent' }).click();

  await expect(page.locator('#rentResult')).toHaveText('Success!');
});

test('TEST-14-GREET-A-CAT', async ({ page }) => {
  await page.goto(BASE);

  await page.getByText('Rent-A-Cat').click();

  await page.getByRole('textbox').first().fill('1');
  await page.getByRole('button', { name: 'Rent' }).click();

  await expect(page.locator('#rentResult')).toHaveText('Success!');

  await page.getByText('Greet-A-Cat').click();

  await expect(page.locator('body')).toContainText('Meow!Meow!Meow!');
});