/**
 * E2E tests for Grid component
 */

import { test, expect } from '@playwright/test';

test.describe('Grid Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  
  test('should display grid with data', async ({ page }) => {
    // Wait for grid to load
    await page.waitForSelector('[data-t-grid-container]');
    
    // Check if grid is visible
    const grid = page.locator('[data-t-grid-container]');
    await expect(grid).toBeVisible();
    
    // Check if header is present
    await expect(page.locator('h1:has-text("Grid Component Demo")')).toBeVisible();
  });
  
  test('should navigate pages', async ({ page }) => {
    await page.waitForSelector('[data-t-grid-container]');
    
    // Check initial page
    await expect(page.locator('text=Page 1 of')).toBeVisible();
    
    // Click next page
    await page.click('button:has-text("Next")');
    
    // Wait for page change
    await page.waitForTimeout(500);
    
    // Check URL changed
    expect(page.url()).toContain('page=2');
    
    // Check page indicator changed
    await expect(page.locator('text=Page 2 of')).toBeVisible();
  });
  
  test('should change page size', async ({ page }) => {
    await page.waitForSelector('[data-t-grid-container]');
    
    // Change page size
    await page.selectOption('select', { label: '50' });
    
    // Wait for data reload
    await page.waitForTimeout(500);
    
    // Check URL
    expect(page.url()).toContain('pageSize=50');
  });
  
  test('should persist state in URL', async ({ page }) => {
    await page.waitForSelector('[data-t-grid-container]');
    
    // Change page and page size
    await page.selectOption('select', { label: '100' });
    await page.waitForTimeout(300);
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(300);
    
    // Get URL
    const url = page.url();
    
    // Reload page
    await page.reload();
    await page.waitForSelector('[data-t-grid-container]');
    
    // Check URL is same
    expect(page.url()).toBe(url);
    
    // Check state is restored
    await expect(page.locator('text=Page 2 of')).toBeVisible();
  });
  
  test('should open column configurator', async ({ page }) => {
    await page.waitForSelector('[data-t-grid-container]');
    
    // Click configure columns
    await page.click('button:has-text("Configure Columns")');
    
    // Check popup is visible
    await expect(page.locator('text=Column Settings')).toBeVisible();
    
    // Check columns are listed
    await expect(page.locator('text=Task Name')).toBeVisible();
    await expect(page.locator('text=Value')).toBeVisible();
  });
  
  test('should toggle column visibility', async ({ page }) => {
    await page.waitForSelector('[data-t-grid-container]');
    
    // Open configurator
    await page.click('button:has-text("Configure Columns")');
    
    // Get initial count
    const initialText = await page.locator('button:has-text("Configure Columns")').textContent();
    const initialCount = initialText?.match(/\d+\/\d+/)?.[0];
    
    // Uncheck first column
    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    await firstCheckbox.click();
    
    // Close configurator
    await page.click('button:has-text("Done")');
    
    // Check count decreased
    const newText = await page.locator('button:has-text("Configure Columns")').textContent();
    expect(newText).not.toBe(initialText);
  });
  
  test('should freeze columns', async ({ page }) => {
    await page.waitForSelector('[data-t-grid-container]');
    
    // Change freeze count
    await page.selectOption('select[value="1"]', { value: '2' });
    
    // Wait for change
    await page.waitForTimeout(300);
    
    // Check status bar
    await expect(page.locator('text=Frozen: 2')).toBeVisible();
  });
  
  test('should add sorting', async ({ page }) => {
    await page.waitForSelector('[data-t-grid-container]');
    
    // Add sort
    await page.selectOption('select:has(option:has-text("Add sort..."))', {
      label: 'Value',
      index: 1,
    });
    
    // Wait for sort
    await page.waitForTimeout(500);
    
    // Check URL contains sort
    expect(page.url()).toContain('sort=');
    
    // Check active sort display
    await expect(page.locator('text=Active Sorts:')).toBeVisible();
  });
  
  test('should clear sorting', async ({ page }) => {
    await page.waitForSelector('[data-t-grid-container]');
    
    // Add sort first
    await page.selectOption('select:has(option:has-text("Add sort..."))', {
      label: 'Value',
      index: 1,
    });
    await page.waitForTimeout(300);
    
    // Clear sort
    await page.click('button:has-text("Clear Sort")');
    
    // Wait for clear
    await page.waitForTimeout(300);
    
    // Check URL doesn't contain sort
    expect(page.url()).not.toContain('sort=');
    
    // Check active sort is hidden
    await expect(page.locator('text=Active Sorts:')).not.toBeVisible();
  });
  
  test('should reset to defaults', async ({ page }) => {
    await page.waitForSelector('[data-t-grid-container]');
    
    // Make some changes
    await page.selectOption('select', { label: '50' });
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(300);
    
    // Reset
    await page.click('button:has-text("Reset All")');
    await page.waitForTimeout(300);
    
    // Check page is 1
    await expect(page.locator('text=Page 1 of')).toBeVisible();
  });
  
  test('should display FPS monitor', async ({ page }) => {
    await page.waitForSelector('[data-t-grid-container]');
    
    // Check FPS monitor is visible
    await expect(page.locator('text=FPS:')).toBeVisible();
    
    // Check FPS value is displayed
    const fpsText = await page.locator('text=FPS:').locator('..').textContent();
    expect(fpsText).toMatch(/FPS:\s*\d+/);
  });
});