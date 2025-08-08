import { test, expect } from '@playwright/test';

test('Interface deve listar os projetos na tela inicial', async ({ page }) => {
  await page.route('**/projects', route => route.continue());
  await page.goto('http://127.0.0.1:3000');

  await page.waitForResponse(resp =>
    resp.url().includes('/projects') && resp.status() === 200
  );

  const projectItems = page.locator('[data-testid="project-item"]');
  await expect(projectItems.first()).toBeVisible();

  const count = await projectItems.count();
  console.log('Total de projetos encontrados:', count);
});
