const addToInventory = require('../src/inventoryProcessor');

describe('inventoryProcessor - Unit Tests', () => {
    test('должен успешно добавить предмет при наличии места', async () => {
        const item = { name: 'Тестовый предмет', weight: 1.0 };
        const result = await addToInventory(item, 5.0, 20.0, 3);
        
        expect(result.status).toBe('success');
        expect(result.newTotalWeight).toBe(6.0);
        expect(result.remainingSlots).toBe(2);
    });

    test('должен выбросить ошибку при отсутствии слотов', async () => {
        const item = { name: 'Тестовый предмет', weight: 1.0 };
        
        await expect(addToInventory(item, 5.0, 20.0, 0))
            .rejects.toThrow('Нет свободных слотов');
    });

    test('должен выбросить ошибку при превышении веса', async () => {
        const item = { name: 'Тяжелый предмет', weight: 10.0 };
        
        await expect(addToInventory(item, 15.0, 20.0, 2))
            .rejects.toThrow('Превышение максимального веса');
    });

    test('должен выбросить ошибку при некорректном весе предмета', async () => {
        const item = { name: 'Неверный предмет', weight: -5.0 };
        
        await expect(addToInventory(item, 5.0, 20.0, 3))
            .rejects.toThrow('Некорректный вес предмета');
    });

    test('должен выбросить ошибку при отсутствии предмета', async () => {
        await expect(addToInventory(null, 5.0, 20.0, 3))
            .rejects.toThrow('Предмет не указан');
    });
});