const { test, expect } = require('@playwright/test');

test.describe('Инвентарь игрока - UI тесты', () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000');
        await page.waitForTimeout(1000);
    });

    test('Проверка заголовка страницы', async ({ page }) => {
        const title = await page.textContent('h1');
        expect(title).toContain('Инвентарь игрока');
        console.log('✅ Заголовок страницы верный');
    });

    test('Проверка наличия предметов на странице', async ({ page }) => {
        const items = await page.locator('.item-card').count();
        expect(items).toBe(8);
        console.log(`✅ Найдено ${items} предметов`);
    });

    test('Выбор предмета активирует кнопку добавления', async ({ page }) => {
        const addButton = page.locator('#addButton');
        expect(await addButton.isEnabled()).toBe(false);
        
        await page.click('[data-item-id="gold_coin"]');
        await page.waitForTimeout(500);
        
        expect(await addButton.isEnabled()).toBe(true);
        console.log('✅ Кнопка активирована после выбора предмета');
    });

    test('Добавление предмета через интерфейс', async ({ page }) => {
        await page.fill('#maxWeight', '20');
        await page.fill('#freeSlots', '5');
        await page.fill('#currentWeight', '0');
        
        await page.click('[data-item-id="gold_coin"]');
        await page.waitForTimeout(500);
        
        await page.click('#addButton');
        await page.waitForTimeout(2000);
        
        const result = page.locator('#resultArea');
        const resultText = await result.textContent();
        expect(resultText).toContain('добавлен');
        console.log('✅ Предмет добавлен успешно');
    });

    test('Кнопка добавления не активна без выбора предмета', async ({ page }) => {
        await page.fill('#maxWeight', '20');
        await page.fill('#freeSlots', '5');
        await page.fill('#currentWeight', '0');
        
        const addButton = page.locator('#addButton');
        const isEnabled = await addButton.isEnabled();
        
        expect(isEnabled).toBe(false);
        
        const selectedItemName = await page.textContent('#selectedItemName');
        expect(selectedItemName).toContain('Не выбран');
        
        console.log('✅ Кнопка не активна, так как предмет не выбран');
    });
});