async function addToInventory(item, currentWeight, maxWeight, freeSlots, services = {}) {
    if (!item || typeof item !== 'object') {
        throw new Error('Предмет не указан');
    }
    if (item.weight === undefined || item.weight <= 0) {
        throw new Error('Некорректный вес предмета');
    }
    if (typeof currentWeight !== 'number' || currentWeight < 0) {
        throw new Error('Некорректный текущий вес инвентаря');
    }
    if (typeof maxWeight !== 'number' || maxWeight <= 0) {
        throw new Error('Некорректная максимальная грузоподъемность');
    }
    if (typeof freeSlots !== 'number' || freeSlots < 0) {
        throw new Error('Некорректное количество слотов');
    }
    if (freeSlots <= 0) {
        throw new Error('Нет свободных слотов в инвентаре');
    }
    
    const newWeight = currentWeight + item.weight;
    if (newWeight > maxWeight) {
        throw new Error(`Превышение максимального веса инвентаря. Текущий: ${currentWeight}, добавляемый: ${item.weight}, максимум: ${maxWeight}`);
    }
    
    if (services.loggerService) {
        services.loggerService.log({
            action: 'add_to_inventory',
            item: item.name,
            weight: item.weight,
            newTotalWeight: newWeight,
            remainingSlots: freeSlots - 1
        });
    }
    
    return {
        status: 'success',
        message: `Предмет "${item.name}" добавлен в инвентарь`,
        addedItem: item,
        newTotalWeight: newWeight,
        remainingSlots: freeSlots - 1,
        remainingCapacity: maxWeight - newWeight
    };
}

module.exports = addToInventory;