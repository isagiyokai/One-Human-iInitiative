import { test, expect } from '@playwright/test';

// Run admin tests serially to avoid rate limiting
test.describe.serial('Admin Authentication', () => {
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
    await page.fill('input[type="text"]', 'wronguser');
    await page.fill('input[type="password"]', 'wrongpass');
    await page.click('button:has-text("Sign In")');

    // Wait for error message to appear
    await expect(page.locator('[role="alert"]').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[role="alert"]').first()).toContainText('Invalid credentials');
  });

  test('logs in with valid credentials', async ({ page }) => {
    await page.fill('input[type="text"]', 'PunahumanGG');
    await page.fill('input[type="password"]', 'Punalex10k$');
    await page.click('button:has-text("Sign In")');

    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/.*\/admin$/, { timeout: 15000 });
    await expect(page.locator('h1')).toContainText('Dashboard');
  });
});

test.describe.serial('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/admin/login');
    await page.fill('input[type="text"]', 'PunahumanGG');
    await page.fill('input[type="password"]', 'Punalex10k$');
    await page.click('button:has-text("Sign In")');

    // Wait for redirect to dashboard - longer timeout for Firefox
    await expect(page).toHaveURL(/.*\/admin$/, { timeout: 30000 });
  });

  test('displays dashboard page', async ({ page }) => {
    // Dashboard should load - check for the main heading
    await expect(page.locator('h1')).toContainText('Dashboard');
    // Wait for the page to settle - Quick Actions heading should be visible in all states (loading, error, data)
    await expect(page.locator('h3:has-text("Quick Actions")')).toBeVisible({ timeout: 15000 });
    // Page renders successfully (no crash)
    await expect(page.locator('body')).toBeVisible();
  });

  test('shows quick actions section', async ({ page }) => {
    // Quick Actions heading should be visible regardless of data state
    await expect(page.locator('h3:has-text("Quick Actions")')).toBeVisible({ timeout: 10000 });
    // Page renders without crashing
    await expect(page.locator('body')).toBeVisible();
  });

  test('sidebar navigation links exist', async ({ page }) => {
    // Verify all sidebar navigation links exist
    const sections = [
      'a[href="/admin/campaign"]',
      'a[href="/admin/payments"]',
      'a[href="/admin/contributions"]',
      'a[href="/admin/expenses"]',
      'a[href="/admin/community"]',
      'a[href="/admin/updates"]',
      'a[href="/admin/audit"]',
    ];

    for (const link of sections) {
      await expect(page.locator(link)).toBeVisible({ timeout: 5000 });
    }
  });

  test('can logout', async ({ page }) => {
    // On mobile, the sign out button is in the collapsed sidebar - open it first
    const isMobile = await page.evaluate(() => window.innerWidth < 768);
    if (isMobile) {
      await page.click('button[aria-label="Open admin menu"]');
    }
    await page.click('button:has-text("Sign out")');
    await expect(page).toHaveURL(/.*\/admin\/login/, { timeout: 10000 });
  });
});

test.describe.serial('Admin Protected Routes', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*\/admin\/login/, { timeout: 10000 });
  });

  test('redirects to login for all admin sub-routes', async ({ page }) => {
    const routes = [
      '/admin/campaign',
      '/admin/payments',
      '/admin/contributions',
      '/admin/expenses',
      '/admin/community',
      '/admin/updates',
      '/admin/audit',
    ];

    for (const route of routes) {
      await page.goto(route);
      await expect(page).toHaveURL(/.*\/admin\/login/, { timeout: 10000 });
    }
  });
});