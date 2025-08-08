import { test, expect } from '@playwright/test';

test('Interface deve listar os projetos na tela inicial', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000');

  const projectItems = page.locator('.project-card');

  // Espera no máximo 10 segundos por itens visíveis
  try {
    await expect(projectItems.first()).toBeVisible({ timeout: 10000 });
  } catch (e) {
    const count = await projectItems.count();
    console.log('[Playwright] Nenhum projeto visível. Total encontrado:', count);
    throw e;
  }

  const count = await projectItems.count();
  console.log('[Playwright] Total de projetos encontrados:', count);
  expect(count).toBeGreaterThan(0);
});