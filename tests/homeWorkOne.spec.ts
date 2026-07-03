import {test, expect} from '@playwright/test'
import config from '../playwright.config'

const baseURL = config.use?.baseURL

if (!baseURL) {
    throw new Error('baseURL не задан в конфиге')
}

test('Проверка ссылки в логотипе (Хедер) переход по ссылке', async ({page})=> {
    await page.goto('catalog')
    await page.getByTestId('header-logo').click()    
    await expect.soft(page).toHaveURL(baseURL)    
})

test('Проверка перехода в корзину из хедера', async ({page})=> {
    await page.goto('')
    await page.getByTestId('header-cart-button').click()
    await expect.soft(page).toHaveURL(`${baseURL}cart`)    
})

test('Проверка перехода в каталог из хедера', async ({page})=> {
    await page.goto('')
    await page.getByTestId('header-nav-link-catalog').click()
    await expect.soft(page).toHaveURL(`${baseURL}catalog`)        
})

test('Проверка перехода в акции из хедера', async ({page})=> {
    await page.goto('')
    await page.getByTestId('header-nav-link-promotions').click()
    await expect.soft(page).toHaveURL(`${baseURL}promotions`)        
})

test('Проверка перехода в доставку из хедера', async ({page})=> {
    await page.goto('')
    await page.getByTestId('header-nav-link-delivery').click()
    await expect.soft(page).toHaveURL(`${baseURL}delivery`)        
})

test('Проверка перехода в раздел О нас из хедера', async ({page})=> {
    await page.goto('')
    await page.getByTestId('header-nav-link-about').click()
    await expect.soft(page).toHaveURL(`${baseURL}about`)        
})

test('Проверка перехода в контакты из хедера', async ({page})=> {
    await page.goto('')
    await page.getByTestId('header-nav-link-contacts').click()
    await expect.soft(page).toHaveURL(`${baseURL}contacts`)        
})

test('Проверка перехода в обратную связь из хедера', async ({page})=> {
    await page.goto('')
    await page.getByTestId('header-nav-link-feedback').click()
    await expect.soft(page).toHaveURL(`${baseURL}feedback`)        
})

test('Проверка перехода в FAQ из хедера', async ({page})=> {
    await page.goto('')
    await page.getByTestId('header-nav-link-faq').click()
    await expect.soft(page).toHaveURL(`${baseURL}faq`)        
})

test('Проверка перехода в Политика конфиденциальности из плашки кук', async ({page})=> {
    await page.goto('')
    // Сомневаюсь, нужно ли проверять видимость плашки перед кликом.
    // Логичнее просто обернуть в трай и выходить из теста,
    // если плашки уже нет (приняли или отклонили ранее)
    await expect.soft(page.getByTestId('cookie-consent-banner')).toBeVisible()
    await page.getByTestId('cookie-consent-privacy-link').click()
    await expect.soft(page).toHaveURL(`${baseURL}privacy`)        
})

test('Проверка закрытия плашки кук при отказе от кук', async ({page})=> {
    await page.goto('')
    await expect.soft(page.getByTestId('cookie-consent-banner')).toBeVisible()
    await page.getByTestId('cookie-decline-button').click()
    await expect.soft(page.getByTestId('cookie-consent-banner')).toBeHidden()    
})

test('Проверка закрытия плашки кук при соглашении с куками', async ({page})=> {
    await page.goto('')
    await expect.soft(page.getByTestId('cookie-consent-banner')).toBeVisible()
    await page.getByTestId('cookie-accept-button').click()
    await expect.soft(page.getByTestId('cookie-consent-banner')).toBeHidden()    
})

//      ОСОБЕННОСТИ СТРАНИЦЫ КАТАЛОГ
//  1. Присутствует пагинация, которая не меняет урл
//  2. Есть фильтры, которые так же не меняют урл
//  3. Цены увеличиваются на 1р раз в несколько секунд.
//  Эти особенности потенциально усложняют процесс написания автотестов