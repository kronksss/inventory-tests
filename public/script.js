let inventoryItems = [];
let selectedItem = null;

const itemsGrid = document.getElementById('itemsGrid');
const maxWeightInput = document.getElementById('maxWeight');
const freeSlotsInput = document.getElementById('freeSlots');
const currentWeightInput = document.getElementById('currentWeight');
const addButton = document.getElementById('addButton');
const selectedItemName = document.getElementById('selectedItemName');
const resultArea = document.getElementById('resultArea');
const usedSlotsSpan = document.getElementById('usedSlots');
const displayWeightSpan = document.getElementById('displayWeight');
const displayRemainingSpan = document.getElementById('displayRemaining');
const displayFreeSlotsSpan = document.getElementById('displayFreeSlots');
const inventoryItemsDiv = document.getElementById('inventoryItems');

const itemsData = {
    'sword_iron': { name: 'Железный меч', weight: 3.5, icon: '⚔️' },
    'health_potion': { name: 'Зелье здоровья', weight: 0.2, icon: '🧪' },
    'leather_armor': { name: 'Кожаная броня', weight: 5.0, icon: '🛡️' },
    'gold_coin': { name: 'Золотая монета', weight: 0.01, icon: '🪙' },
    'dragon_scale': { name: 'Чешуя дракона', weight: 2.0, icon: '🐉' },
    'magic_staff': { name: 'Магический посох', weight: 1.8, icon: '🔮' },
    'shield': { name: 'Стальной щит', weight: 4.5, icon: '🛡️' },
    'arrow': { name: 'Стрела', weight: 0.05, icon: '🏹' }
};

function updateInventoryDisplay() {
    const usedSlots = inventoryItems.length;
    const totalWeight = inventoryItems.reduce((sum, item) => sum + item.weight, 0);
    const maxWeight = parseFloat(maxWeightInput.value) || 0;
    const freeSlots = (parseInt(freeSlotsInput.value) || 0) - usedSlots;

    usedSlotsSpan.textContent = usedSlots;
    displayWeightSpan.textContent = totalWeight.toFixed(2);
    displayRemainingSpan.textContent = (maxWeight - totalWeight).toFixed(2);
    displayFreeSlotsSpan.textContent = freeSlots >= 0 ? freeSlots : 0;
    currentWeightInput.value = totalWeight.toFixed(2);

    inventoryItemsDiv.innerHTML = inventoryItems.map(item => 
        `<div class="inventory-item">${item.icon} ${item.name} (${item.weight} кг)</div>`
    ).join('');
}

function showResult(message, isSuccess) {
    resultArea.textContent = message;
    resultArea.className = `result-area ${isSuccess ? 'success' : 'error'}`;
    setTimeout(() => {
        resultArea.style.display = 'none';
        resultArea.className = 'result-area';
    }, 3000);
}

async function addToInventory() {
    if (!selectedItem) {
        showResult('❌ Выберите предмет для добавления', false);
        return;
    }

    const currentWeight = parseFloat(currentWeightInput.value) || 0;
    const maxWeight = parseFloat(maxWeightInput.value) || 0;
    const freeSlots = (parseInt(freeSlotsInput.value) || 0) - inventoryItems.length;

    if (freeSlots <= 0) {
        showResult('❌ В рюкзаке нет свободных слотов!', false);
        return;
    }

    if (currentWeight + selectedItem.weight > maxWeight) {
        showResult(`❌ Слишком тяжело! ${selectedItem.name} весит ${selectedItem.weight} кг, осталось только ${(maxWeight - currentWeight).toFixed(2)} кг`, false);
        return;
    }

    try {
        const response = await fetch('/api/inventory/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                item: selectedItem,
                currentWeight: currentWeight,
                maxWeight: maxWeight,
                freeSlots: freeSlots
            })
        });

        const data = await response.json();

        if (response.status === 200) {
            inventoryItems.push(selectedItem);
            updateInventoryDisplay();
            showResult(`✅ ${data.message || 'Предмет добавлен в инвентарь!'}`, true);
            clearSelection();
        } else {
            showResult(`❌ ${data.message || data.error || 'Ошибка при добавлении предмета'}`, false);
        }
    } catch (error) {
        showResult(`❌ Ошибка соединения с сервером`, false);
    }
}

function selectItem(itemId) {
    selectedItem = {
        id: itemId,
        name: itemsData[itemId].name,
        weight: itemsData[itemId].weight,
        icon: itemsData[itemId].icon
    };
    
    selectedItemName.textContent = selectedItem.name;
    addButton.disabled = false;
    
    document.querySelectorAll('.item-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.itemId === itemId) {
            card.classList.add('selected');
        }
    });
}

function clearSelection() {
    selectedItem = null;
    selectedItemName.textContent = 'Не выбран';
    addButton.disabled = true;
    document.querySelectorAll('.item-card').forEach(card => {
        card.classList.remove('selected');
    });
}

function init() {
    document.querySelectorAll('.item-card').forEach(card => {
        card.addEventListener('click', () => selectItem(card.dataset.itemId));
    });
    addButton.addEventListener('click', addToInventory);
    maxWeightInput.addEventListener('input', updateInventoryDisplay);
    freeSlotsInput.addEventListener('input', updateInventoryDisplay);
    updateInventoryDisplay();
}

init();