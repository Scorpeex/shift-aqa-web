import {test, expect} from '@playwright/test';

test('FAQ с развернутым табом', async ({ page }) => {
    await page.goto('/faq');
    await page.getByTestId('faq-question-1').click()
    await expect.soft(page).toHaveScreenshot({            
            timeout: 15000,
            fullPage: true,           
        });
});