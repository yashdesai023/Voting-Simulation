import { test, expect } from '@playwright/test';

test('Home page loads and has correct title', async ({ page }) => {
    // Go to Home Page (Admin Login by default usually)
    await page.goto('/');

    // Verify Title matches "Digital Ballot Machine"
    await expect(page).toHaveTitle(/Digital Ballot Machine/);

    // Verify basic structure
    // Since "/" redirects to "/admin" if no code, check if we are on login or admin
    // Or if we go to a specific valid ward.
    // For now, let's just check the page loads without 404.
    const title = await page.title();
    console.log('Page Title:', title);

    // Check for some common element like "Login" or header
    await expect(page.locator('body')).toBeVisible();
});
