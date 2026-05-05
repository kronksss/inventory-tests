const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// База данных предметов
const itemsDatabase = {
    'sword_iron': { name: 'Железный меч', weight: 3.5 },
    'health_potion': { name: 'Зелье здоровья', weight: 0.2 },
    'leather_armor': { name: 'Кожаная броня', weight: 5.0 },
    'gold_coin': { name: 'Золотая монета', weight: 0.01 },
    'dragon_scale': { name: 'Чешуя дракона', weight: 2.0 },
    'magic_staff': { name: 'Магический посох', weight: 1.8 },
    'shield': { name: 'Стальной щит', weight: 4.5 },
    'arrow': { name: 'Стрела', weight: 0.05 }
};

// GET: получение веса предмета
app.get('/api/items/:itemId/weight', (req, res) => {
    const item = itemsDatabase[req.params.itemId];
    if (!item) {
        return res.status(404).json({ status: 'error', message: 'Предмет не найден' });
    }
    res.status(200).json({ status: 'success', name: item.name, weight: item.weight });
});

// POST: добавление предмета в инвентарь
app.post('/api/inventory/add', (req, res) => {
    const { item, currentWeight, maxWeight, freeSlots } = req.body;

    if (!item || !item.name) {
        return res.status(400).json({ status: 'error', message: 'Выберите предмет' });
    }
    if (item.weight <= 0) {
        return res.status(400).json({ status: 'error', message: 'Некорректный вес предмета' });
    }
    if (currentWeight < 0) {
        return res.status(400).json({ status: 'error', message: 'Некорректный текущий вес' });
    }
    if (maxWeight <= 0) {
        return res.status(400).json({ status: 'error', message: 'Некорректная грузоподъемность' });
    }
    if (freeSlots <= 0) {
        return res.status(400).json({ status: 'error', message: 'Нет свободных слотов в инвентаре' });
    }

    const newWeight = currentWeight + item.weight;
    if (newWeight > maxWeight) {
        return res.status(400).json({ status: 'error', message: `Превышение максимального веса инвентаря. Текущий: ${currentWeight}, добавляемый: ${item.weight}, максимум: ${maxWeight}` });
    }

    res.status(200).json({ 
        status: 'success', 
        message: `Предмет "${item.name}" добавлен в инвентарь`,
        newTotalWeight: newWeight,
        remainingSlots: freeSlots - 1
    });
});

// GET: проверка статуса
app.get('/api/status', (req, res) => {
    res.status(200).json({ status: 'online', timestamp: new Date() });
});

const PORT = process.env.PORT || 3000;

// Запуск сервера только если файл запущен напрямую (не через require)
if (require.main === module) {
    const server = app.listen(PORT, () => {
        console.log(`Сервер запущен: http://localhost:${PORT}`);
    });
    module.exports = app;
} else {
    // Для тестов - экспортируем app без запуска сервера
    module.exports = app;
}