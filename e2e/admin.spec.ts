import { test, expect } from '@playwright/test';

const adminUsername = process.env.E2E_ADMIN_USERNAME;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;
const hasE2ECredentials = Boolean(adminUsername && adminPassword);

test.describe('Admin Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
  });

  test('displays login form', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Admin Sign In');
    await expect(page.locator('label:has-text("Username")')).toBeVisible();
    await expect(page.locator('label:has-text("Password")')).toBeVisible();
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
  });

  test('rejects invalid credentials', async ({ page }) => {
    await page.fill('input[type="text"]', 'not-an-admin');
    await page.fill('input[type="password"]', 'not-a-valid-password');
    await page.click('button:has-text("Sign In")');

    await expect(page.locator('[role="alert"]').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[role="alert"]').first()).toContainText('Invalid credentials');
  });

  test('logs in with valid credentials', async ({ page }) => {
    test.skip(!hasE2ECredentials, 'Set E2E_ADMIN_USERNAME and E2E_ADMIN_PASSWORD to run authenticated admin tests.');

    await page.fill('input[type="text"]', adminUsername!);
    await page.fill('input[type="password"]', adminPassword!);
    await page.click('button:has-text("Sign In")');

    await expect(page).toHaveURL(/.*\/admin$/, { timeout: 15000 });
    await expect(page.locator('h1')).toContainText('Dashboard');
  });
});

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasE2ECredentials, 'Set E2E_ADMIN_USERNAME and E2E_ADMIN_PASSWORD to run authenticated admin tests.');

    await page.goto('/admin/login');
    await page.fill('input[type="text"]', adminUsername!);
    await page.fill('input[type="password"]', adminPassword!);
    await page.click('button:has-text("Sign In")');
    await expect(page).toHaveURL(/.*\/admin$/, { timeout: 30000 });
  });

  test('displays dashboard page and quick actions', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Dashboard');
    await expect(page.locator('h3:has-text("Quick Actions")')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('body')).toBeVisible();
  });

  test('sidebar navigation links exist', async ({ page }) => {
    const sections = [
      'a[href="/admin/campaign"]',
      'a[href="/admin/payments"]',
      'a[href="/admin/contributions"]',
      'a[href="/admin/expenses"]',
      'a[href="/admin/community"]',
      'a[href="/admin/updates"]',
      'a[href="/admin/audit"]',
      'a[href="/admin/repayment-contacts"]',
    ];

    for (const link of sections) {
      await expect(page.locator(link)).toBeVisible({ timeout: 5000 });
    }
  });

  test('can log out', async ({ page }) => {
    const isMobile = await page.evaluate(() => window.innerWidth < 768);
    if (isMobile) {
      await page.click('button[aria-label="Open admin menu"]');
    }

    await page.getByRole('button', { name: /sign out/i }).click();
    await expect(page).toHaveURL(/.*\/admin\/login/, { timeout: 10000 });
  });
});

test.describe('Admin Protected Routes', () => {
  test('redirects unauthenticated users from every protected route', async ({ page }) => {
    const routes = [
      '/admin',
      '/admin/campaign',
      '/admin/payments',
      '/admin/contributions',
      '/admin/expenses',
      '/admin/community',
      '/admin/updates',
      '/admin/audit',
      '/admin/repayment-contacts',
    ];

    for (const route of routes) {
      await page.goto(route);
      await expect(page).toHaveURL(/.*\/admin\/login/, { timeout: 10000 });
    }
  });
});
