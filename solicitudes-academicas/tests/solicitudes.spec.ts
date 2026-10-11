import { test, expect, Page } from '@playwright/test';

async function completarFormulario(page: Page, tipo = 'Constancia de estudios') {
  await page.getByLabel('Nombre completo').fill('Estudiante de prueba');
  await page.getByLabel('Código de estudiante').fill('20260001');
  await page.getByLabel('Correo electrónico').fill('estudiante@example.com');
  await page.getByLabel('Tipo de solicitud').selectOption(tipo);
  await page.getByLabel('Motivo', { exact: true }).fill('Solicito una constancia de estudios para un trámite de prácticas.');
}

test('bloquea entradas inválidas, registra y conserva al navegar sin duplicar', async ({ page }) => {
  const errores: string[] = [];
  page.on('pageerror', error => errores.push(error.message));
  await page.goto('/');
  await expect(page).toHaveURL(/\/solicitudes$/);
  await expect(page.getByText('Aún no tienes solicitudes')).toBeVisible();
  await page.screenshot({ path: '../evidencias/01-listado-vacio.png', fullPage: true });
  await page.getByRole('link', { name: '+ Nueva solicitud', exact: true }).click();
  await page.getByRole('button', { name: 'Registrar solicitud', exact: true }).click();
  await expect(page.locator('input[aria-invalid="true"]')).toHaveCount(3);
  await expect(page.getByRole('alert')).toContainText('Revisa los campos');
  await page.screenshot({ path: '../evidencias/02-formulario-invalido.png', fullPage: true });
  await completarFormulario(page);
  await page.getByLabel('Nombre completo').fill('    ');
  await page.getByLabel('Código de estudiante').fill('abcdefgh');
  await page.getByLabel('Correo electrónico').fill('correo-invalido');
  await page.getByLabel('Motivo', { exact: true }).fill('                         ');
  await page.getByRole('button', { name: 'Registrar solicitud', exact: true }).click();
  await expect(page.getByRole('status')).toHaveCount(0);
  await expect(page.getByText('El código debe contener exactamente 8 números.')).toBeVisible();
  await expect(page.getByText('Ingresa un correo válido de hasta 120 caracteres.')).toBeVisible();
  await page.getByRole('link', { name: 'Volver al listado' }).click();
  await expect(page.getByText('Aún no tienes solicitudes')).toBeVisible();
  await page.getByRole('link', { name: '+ Nueva solicitud', exact: true }).click();
  await completarFormulario(page);
  await page.screenshot({ path: '../evidencias/03-formulario-valido.png', fullPage: true });
  await page.getByRole('button', { name: 'Registrar solicitud', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('SOL-001 registrada correctamente');
  await expect(page.getByRole('button', { name: 'Registrar solicitud', exact: true })).toBeDisabled();
  await page.screenshot({ path: '../evidencias/04-registro-confirmado.png', fullPage: true });
  await page.getByRole('button', { name: 'Ver mis solicitudes' }).click();
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await expect(page.locator('tbody')).toContainText('SOL-001');
  await expect(page.locator('tbody')).toContainText('Pendiente');
  await page.screenshot({ path: '../evidencias/05-listado-con-registro.png', fullPage: true });
  await page.getByRole('link', { name: '+ Nueva solicitud', exact: true }).click();
  await completarFormulario(page, 'Revisión de nota');
  await page.getByRole('button', { name: 'Registrar solicitud', exact: true }).click();
  await page.getByRole('button', { name: 'Ver mis solicitudes' }).click();
  await expect(page.locator('tbody tr')).toHaveCount(2);
  await expect(page.locator('tbody')).toContainText('SOL-002');
  await page.reload();
  await expect(page.getByText('Aún no tienes solicitudes')).toBeVisible();
  expect(errores).toEqual([]);
});

test('API simulada: carga, respuesta vacía, error y reintento', async ({ page }) => {
  let modo: 'vacio' | 'error' | 'datos' = 'vacio';
  let liberar: () => void = () => {};
  const espera = new Promise<void>(resolve => { liberar = resolve; });
  await page.route('https://jsonplaceholder.typicode.com/users', async route => {
    await espera;
    if (modo === 'error') await route.fulfill({ status: 503, body: 'Servicio no disponible' });
    else await route.fulfill({ json: modo === 'vacio' ? [] : [{ id: 1, name: 'Usuario de prueba', username: 'prueba', email: 'prueba@example.com' }] });
  });
  await page.goto('/usuarios');
  await expect(page.getByRole('status')).toContainText('Consultando usuarios');
  await expect(page.getByRole('button', { name: 'Consultando…', exact: true })).toBeDisabled();
  liberar();
  await expect(page.getByText('La API respondió con una lista vacía.')).toBeVisible();
  modo = 'error';
  await page.getByRole('button', { name: 'Volver a consultar' }).click();
  await expect(page.getByRole('alert')).toContainText('No se pudo consultar la API');
  await page.screenshot({ path: '../evidencias/06-api-error-simulado.png', fullPage: true });
  modo = 'datos';
  await page.getByRole('button', { name: 'Reintentar' }).click();
  await expect(page.locator('tbody')).toContainText('Usuario de prueba');
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('rutas desconocidas y formulario en pantalla móvil', async ({ page }) => {
  await page.goto('/ruta-inexistente');
  await expect(page).toHaveURL(/\/solicitudes$/);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('link', { name: '+ Nueva solicitud', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Nueva solicitud', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: '../evidencias/07-formulario-movil.png', fullPage: true });
});

test('API real: GET remoto y usuarios visibles sin interceptar', async ({ page }) => {
  test.skip(process.env['RUN_LIVE_API'] !== '1', 'Activar RUN_LIVE_API=1 para comprobar la API real.');
  const respuesta = page.waitForResponse(response => response.url() === 'https://jsonplaceholder.typicode.com/users');
  await page.goto('/usuarios');
  const response = await respuesta;
  expect(response.status()).toBe(200);
  const usuarios = await response.json();
  expect(usuarios.length).toBeGreaterThan(0);
  await expect(page.locator('tbody tr')).toHaveCount(usuarios.length);
  await expect(page.locator('tbody')).toContainText(usuarios[0].name);
  await page.screenshot({ path: '../evidencias/08-api-real.png', fullPage: true });
  const fs = await import('node:fs');
  fs.writeFileSync('../evidencias/api-real.json', JSON.stringify({ fecha: new Date().toISOString(), url: response.url(), metodo: response.request().method(), status: response.status(), cantidad: usuarios.length, respuesta: usuarios }, null, 2));
});
