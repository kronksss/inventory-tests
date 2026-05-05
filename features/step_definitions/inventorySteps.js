const { Given, When, Then } = require('@cucumber/cucumber');
const request = require('supertest');
let app;

let payload = {};
let response = null;

// Получаем app без запуска сервера
try {
    app = require('../../server');
} catch (err) {
    console.error('Ошибка загрузки сервера:', err.message);
}

Given('сервис доступен по адресу {string}', async function (path) {
    if (!app) {
        throw new Error('Сервер не загружен');
    }
    const res = await request(app).get(path);
    if (res.status !== 200 || res.body.status !== 'online') {
        throw new Error(`Сервис недоступен: статус ${res.status}`);
    }
});

Given('текущий вес инвентаря равен {float}', function (weight) {
    payload.currentWeight = weight;
});

Given('максимальная грузоподъемность равна {float}', function (maxWeight) {
    payload.maxWeight = maxWeight;
});

Given('количество свободных слотов равно {int}', function (slots) {
    payload.freeSlots = slots;
});

When('я отправляю POST запрос на {string} с предметом {string}', async function (path, itemId) {
    if (!app) {
        throw new Error('Сервер не загружен');
    }
    
    // Получаем вес предмета через GET запрос
    const itemRes = await request(app).get(`/api/items/${itemId}/weight`);
    if (itemRes.status !== 200) {
        throw new Error(`Предмет ${itemId} не найден: ${itemRes.body.message || ''}`);
    }
    
    payload.item = {
        id: itemId,
        name: itemRes.body.name,
        weight: itemRes.body.weight
    };
    
    response = await request(app)
        .post(path)
        .send(payload);
});

Then('API возвращает статус-код {int}', function (expectedCode) {
    if (!response) {
        throw new Error('Нет ответа от сервера');
    }
    if (response.status !== expectedCode) {
        throw new Error(`Ожидался статус ${expectedCode}, получен ${response.status}`);
    }
});

Then('ответ содержит статус {string}', function (expectedStatus) {
    if (!response || !response.body) {
        throw new Error('Нет ответа от сервера');
    }
    if (response.body.status !== expectedStatus) {
        throw new Error(`Ожидался статус "${expectedStatus}", получен "${response.body.status}"`);
    }
});

Then('ответ содержит сообщение об ошибке {string}', function (expectedError) {
    if (!response || !response.body) {
        throw new Error('Нет ответа от сервера');
    }
    if (response.status !== 400) {
        throw new Error(`Ожидалась ошибка 400, получен ${response.status}`);
    }
    const errorMessage = response.body.message || response.body.error || '';
    if (!errorMessage.includes(expectedError)) {
        throw new Error(`Ожидалось сообщение: "${expectedError}", получено: "${errorMessage}"`);
    }
});