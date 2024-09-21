import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {  
  await page.setViewportSize({
    width: 640,
    height: 480,
  });
});

test('has share button', async ({ page }) => {
  await page.goto('/?s=test');
  await expect(page).toHaveScreenshot();
});

test('opens popup on button click', async ({ page }) => {
  await page.goto('/?s=test');

  // Click the get started link.
  await page.locator('css=#mapgl-share-button').click();

  await expect(page).toHaveScreenshot();
});

test('opens preview on preview button click', async ({ page }) => {
  await page.goto('/?s=test');

  // Click the get started link.
  await page.locator('css=#mapgl-share-button').click();
  await page.locator('css=#mapgl-share-preview').click();

  await expect(page).toHaveScreenshot();
});

test('map link copied to clipboard on copy button click', async ({ page }) => {
  await page.goto('/?s=test');
  await page.locator('css=#mapgl-share-button').click();
  await page.locator('css=#mapgl-share-link-copy').click();

  const handle = await page.evaluateHandle(() => navigator.clipboard.readText());
  const clipboardContent = await handle.jsonValue();

  expect(clipboardContent).toEqual('http://localhost:5173/?m=0%2C0%2F2%2Fp%2F0%2Fr%2F0');
});

test('map embed code copied to clipboard on copy button click', async ({ page }) => {
  await page.goto('/?s=test');
  await page.locator('css=#mapgl-share-button').click();
  await page.locator('css=#mapgl-share-embed-copy').click();

  const handle = await page.evaluateHandle(() => navigator.clipboard.readText());
  const clipboardContent = await handle.jsonValue();

  expect(clipboardContent).toEqual(`<div id=\"map-0\" style=\"width:540px;height:340px;\"></div>      <script src=\"https://mapgl.2gis.com/api/js/v1\"></script>      <script>        new mapgl.Map(document.querySelector('#map-0'), {          key: 'cb20c5bf-34d3-4f0e-9b2b-33e9b8edb57f',          center: [0,0],          zoom: 2,           pitch: 0,           rotation: 0,          style: [object Object],          styleState: {            immersiveRoadsOn: true          }        });      </script>`);
});

