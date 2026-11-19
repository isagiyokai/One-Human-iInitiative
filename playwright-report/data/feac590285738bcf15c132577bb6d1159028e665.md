# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin Authentication >> displays login form
- Location: e2e\admin.spec.ts:9:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/admin/login
Call log:
  - navigating to "http://localhost:3000/admin/login", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | // Run admin tests serially to avoid rate limiting
  4   | test.describe.serial('Admin Authentication', () => {
  5   |   test.beforeEach(async ({ page }) => {
> 6   |     await page.goto('/admin/login');
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/admin/login
  7   |   });
  8   | 
  9   |   test('displays login form', async ({ page }) => {
  10  |     await expect(page.locator('h1')).toContainText('Admin Sign In');
  11  |     await expect(page.locator('label:has-text("Username")')).toBeVisible();
  12  |     await expect(page.locator('label:has-text("Password")')).toBeVisible();
  13  |     await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
  14  |   });
  15  | 
  16  |   test('rejects invalid credentials', async ({ page }) => {
  17  |     await page.fill('input[type="text"]', 'wronguser');
  18  |     await page.fill('input[type="password"]', 'wrongpass');
  19  |     await page.click('button:has-text("Sign In")');
  20  | 
  21  |     // Wait for error message to appear
  22  |     await expect(page.locator('[role="alert"]').first()).toBeVisible({ timeout: 10000 });
  23  |     await expect(page.locator('[role="alert"]').first()).toContainText('Invalid credentials');
  24  |   });
  25  | 
  26  |   test('logs in with valid credentials', async ({ page }) => {
  27  |     await page.fill('input[type="text"]', 'PunahumanGG');
  28  |     await page.fill('input[type="password"]', 'Punalex10k$');
  29  |     await page.click('button:has-text("Sign In")');
  30  | 
  31  |     // Wait for redirect to dashboard
  32  |     await expect(page).toHaveURL(/.*\/admin$/, { timeout: 15000 });
  33  |     await expect(page.locator('h1')).toContainText('Dashboard');
  34  |   });
  35  | });
  36  | 
  37  | test.describe.serial('Admin Dashboard', () => {
  38  |   test.beforeEach(async ({ page }) => {
  39  |     // Login first
  40  |     await page.goto('/admin/login');
  41  |     await page.fill('input[type="text"]', 'PunahumanGG');
  42  |     await page.fill('input[type="password"]', 'Punalex10k$');
  43  |     await page.click('button:has-text("Sign In")');
  44  | 
  45  |     // Wait for redirect to dashboard - longer timeout for Firefox
  46  |     await expect(page).toHaveURL(/.*\/admin$/, { timeout: 30000 });
  47  |   });
  48  | 
  49  |   test('displays dashboard page', async ({ page }) => {
  50  |     // Dashboard should load - check for the main heading
  51  |     await expect(page.locator('h1')).toContainText('Dashboard');
  52  |     // Wait for the page to settle - Quick Actions heading should be visible in all states (loading, error, data)
  53  |     await expect(page.locator('h3:has-text("Quick Actions")')).toBeVisible({ timeout: 15000 });
  54  |     // Page renders successfully (no crash)
  55  |     await expect(page.locator('body')).toBeVisible();
  56  |   });
  57  | 
  58  |   test('shows quick actions section', async ({ page }) => {
  59  |     // Quick Actions heading should be visible regardless of data state
  60  |     await expect(page.locator('h3:has-text("Quick Actions")')).toBeVisible({ timeout: 10000 });
  61  |     // Page renders without crashing
  62  |     await expect(page.locator('body')).toBeVisible();
  63  |   });
  64  | 
  65  |   test('sidebar navigation links exist', async ({ page }) => {
  66  |     // Verify all sidebar navigation links exist
  67  |     const sections = [
  68  |       'a[href="/admin/campaign"]',
  69  |       'a[href="/admin/payments"]',
  70  |       'a[href="/admin/contributions"]',
  71  |       'a[href="/admin/expenses"]',
  72  |       'a[href="/admin/community"]',
  73  |       'a[href="/admin/updates"]',
  74  |       'a[href="/admin/audit"]',
  75  |     ];
  76  | 
  77  |     for (const link of sections) {
  78  |       await expect(page.locator(link)).toBeVisible({ timeout: 5000 });
  79  |     }
  80  |   });
  81  | 
  82  |   test('can logout', async ({ page }) => {
  83  |     // On mobile, the sign out button is in the collapsed sidebar - open it first
  84  |     const isMobile = await page.evaluate(() => window.innerWidth < 768);
  85  |     if (isMobile) {
  86  |       await page.click('button[aria-label="Open admin menu"]');
  87  |     }
  88  |     await page.click('button:has-text("Sign out")');
  89  |     await expect(page).toHaveURL(/.*\/admin\/login/, { timeout: 10000 });
  90  |   });
  91  | });
  92  | 
  93  | test.describe.serial('Admin Protected Routes', () => {
  94  |   test('redirects to login when not authenticated', async ({ page }) => {
  95  |     await page.goto('/admin');
  96  |     await expect(page).toHaveURL(/.*\/admin\/login/, { timeout: 10000 });
  97  |   });
  98  | 
  99  |   test('redirects to login for all admin sub-routes', async ({ page }) => {
  100 |     const routes = [
  101 |       '/admin/campaign',
  102 |       '/admin/payments',
  103 |       '/admin/contributions',
  104 |       '/admin/expenses',
  105 |       '/admin/community',
  106 |       '/admin/updates',
```