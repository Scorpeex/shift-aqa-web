import {test, expect} from '@playwright/test';

test('Корзина с товаром', async ({ page }) => {
    await page.goto('/catalog');
    await page.getByTestId('catalog-add-to-cart-button-prod-001').click();       
    await page.getByTestId('catalog-add-to-cart-button-prod-001').click();
    await page.getByTestId('header-cart-button').click();
    await expect.soft(page).toHaveScreenshot({
            // Без таймаута тест на десктопном разрешении падал с ошибкой
            // "Failed to take two consecutive stable screenshots." Возможно
            //  мой нетбук просто слишком слаб, скриншот тесты его дейтсвительно сильно грузят.
            timeout: 15000,
            fullPage: true,
            mask: [                
                page.getByTestId('cart-captcha-image'),
                page.getByTestId('cart-total-price'),
                // Я решил повесить маску на весь блок не потому что у него есть тестИД, а потому
                // что первый товар в каталоге может отличаться не только ценой, но и катринкой,
                // и это уронит тест.
                page.getByTestId('cart-item-prod-001'),
            ]
        });
});