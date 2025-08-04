import { test, expect } from '@playwright/test';

test('Interface deve listar os projetos na tela inicial', async ({ page }) => {
  await page.goto('http://localhost:3000'); // ajuste se a porta for diferente

  const projectItems = page.locator('li'); // ou outro seletor do ProjectList
  await expect(projectItems.first()).toBeVisible();
});