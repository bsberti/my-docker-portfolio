import { test, expect } from '@playwright/test';

test('GET /api/projects deve retornar lista de projetos', async ({ request }) => {
  const response = await request.get('http://127.0.0.1:5000/api/projects'); // Ajuste a porta se for diferente
  expect(response.ok()).toBeTruthy();

  const data = await response.json();
  expect(Array.isArray(data)).toBe(true);
  expect(data.length).toBeGreaterThan(0);
  expect(data[0]).toHaveProperty('name');
  expect(data[0]).toHaveProperty('tech');

});