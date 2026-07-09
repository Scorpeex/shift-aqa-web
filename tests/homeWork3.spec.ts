import {test, expect} from '@playwright/test'
import { fillAllFields } from '../helpers/fillAllFields'
import {testingNegativeEmails, testingNegativeNames, testingPositiveEmails, testingPositiveNames} from '../helpers/testingData.ts'

test('Тест сортировки по убыванию все страницы по очереди', async ({ page }) => {
    await page.goto('catalog')
    await page.getByTestId('catalog-sort-select').click()
    await page.getByTestId('catalog-sort-option-desc').click()

    let currentPage = 1
    let hasNextPage = true
    // Сперва поставил lastPrice = 99999999, но это выглядело странно, поэтому погуглил и нашел такое решение.
    let lastPrice = Infinity
    
    const priceLocator = page.locator(`[data-testid^="catalog-product-price-prod-"]`)
    await page.waitForSelector(`[data-testid^="catalog-product-price-prod-"]`)

    while (hasNextPage) {
        
        const priceElement = await priceLocator.all()
        const prices: number[] = []

        for (const element of priceElement) {
            const price = Number((await element.textContent())?.replace(/[^0-9]/g, ''))
            prices.push(price)            
        }

        expect.soft(lastPrice).toBeGreaterThanOrEqual(prices[0])

        for (let i=0; i < prices.length-1; i++) {
            // console.log(`${prices[i]}<${prices[i+1]}`)
            expect.soft(prices[i]).toBeGreaterThanOrEqual(prices[i+1])
            lastPrice=prices[i+1]
        }

        const isDisabled = await page.getByTestId('catalog-pagination-next').isDisabled()
        if (isDisabled) {
            hasNextPage = false
        } else {
            await page.getByTestId('catalog-pagination-next').click()
            await page.waitForSelector(`[data-testid^="catalog-product-price-prod-"]`)
        }
        currentPage++
    }
    // console.log(currentPage)
});

testingPositiveNames.forEach((value: { name: string, hint: string }) => {
    test(`Позитивный тест поля ФИО: ${value.hint}. Используется ${value.name || 'пустое значение'}`, async ({ page, request }) => {
        const captchaResponsePromise = page.waitForResponse((response) => 
            response.url().includes('/api/captcha')    
        )
    
        await page.goto('feedback');

        const captchaResponse = await captchaResponsePromise
        const {id} = await captchaResponse.json()
        const {code} = await (await request.get(`api/testing/captcha?id=${id}`)).json()
        const fullNameErrorLocator = await page.getByTestId('feedback-error-fullname')
        const feedbackSubmitButtonLocator = await page.getByTestId('feedback-submit-button')    

        await expect(fullNameErrorLocator).toBeHidden()
        await expect(feedbackSubmitButtonLocator).toBeDisabled()

        await fillAllFields(page, {fullname: value.name, code})

        await expect(fullNameErrorLocator).toBeHidden()
        await expect(feedbackSubmitButtonLocator).toBeEnabled()

        await page.getByTestId('feedback-submit-button').click();
        await expect(page.getByTestId('modal-message')).toBeVisible()
        await expect(page.getByTestId('modal-message'))
        .toContainText('Ваша обратная связь принята. Мы свяжемся с вами в ближайшее время.'); 
        });
});

testingNegativeNames.forEach((value: { name: string, hint: string }) => {
    test(`Негативный тест поля ФИО: ${value.hint}. Используется ${value.name || 'пустое значение'}`, async ({ page, request }) => {
        const captchaResponsePromise = page.waitForResponse((response) => 
            response.url().includes('/api/captcha')    
        )
    
        await page.goto('feedback');

        const captchaResponse = await captchaResponsePromise
        const {id} = await captchaResponse.json()
        const {code} = await (await request.get(`api/testing/captcha?id=${id}`)).json()
        const fullNameErrorLocator = await page.getByTestId('feedback-error-fullname')
        const feedbackSubmitButtonLocator = await page.getByTestId('feedback-submit-button')    

        await expect(fullNameErrorLocator).toBeHidden()
        await expect(feedbackSubmitButtonLocator).toBeDisabled()
        
        //При заполнении пустым значением не активируется проверка поля на фронте
        await page.getByTestId('feedback-input-fullname').fill('a');

        await fillAllFields(page, {fullname: value.name, code})

        await expect(fullNameErrorLocator).toBeVisible()
        await expect(feedbackSubmitButtonLocator).toBeDisabled()
        });
});

testingPositiveEmails.forEach((value: { email: string, hint: string }) => {
    test(`Позитивный тест поля ФИО: ${value.hint}. Используется ${value.email || 'пустое значение'}`, async ({ page, request }) => {
        const captchaResponsePromise = page.waitForResponse((response) => 
            response.url().includes('/api/captcha')    
        )
    
        await page.goto('feedback');

        const captchaResponse = await captchaResponsePromise
        const {id} = await captchaResponse.json()
        const {code} = await (await request.get(`api/testing/captcha?id=${id}`)).json()
        const emailErrorLocator = await page.getByTestId('feedback-error-email')
        const feedbackSubmitButtonLocator = await page.getByTestId('feedback-submit-button')    

        await expect(emailErrorLocator).toBeHidden()
        await expect(feedbackSubmitButtonLocator).toBeDisabled()

        await fillAllFields(page, {email: value.email, code})

        await expect(emailErrorLocator).toBeHidden()
        await expect(feedbackSubmitButtonLocator).toBeEnabled()

        await page.getByTestId('feedback-submit-button').click();
        await expect(page.getByTestId('modal-message')).toBeVisible()
        await expect(page.getByTestId('modal-message'))
        .toContainText('Ваша обратная связь принята. Мы свяжемся с вами в ближайшее время.'); 
        });
});

testingNegativeEmails.forEach((value: { email: string, hint: string }) => {
    test(`Негативный тест поля ФИО: ${value.hint}. Используется ${value.email || 'пустое значение'}`, async ({ page, request }) => {
        const captchaResponsePromise = page.waitForResponse((response) => 
            response.url().includes('/api/captcha')    
        )
    
        await page.goto('feedback');

        const captchaResponse = await captchaResponsePromise
        const {id} = await captchaResponse.json()
        const {code} = await (await request.get(`api/testing/captcha?id=${id}`)).json()
        const emailErrorLocator = await page.getByTestId('feedback-error-email')
        const feedbackSubmitButtonLocator = await page.getByTestId('feedback-submit-button')    

        await expect(emailErrorLocator).toBeHidden()
        await expect(feedbackSubmitButtonLocator).toBeDisabled()
        
        //При заполнении пустым значением не активируется проверка поля на фронте
        await page.getByTestId('feedback-input-email').fill('a');

        await fillAllFields(page, {email: value.email, code})

        await expect(emailErrorLocator).toBeVisible()
        await expect(feedbackSubmitButtonLocator).toBeDisabled()
        });
});