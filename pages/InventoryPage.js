class InventoryPage {
    constructor(page) {
        this.page = page;
        this.maxWeightInput = '#maxWeight';
        this.freeSlotsInput = '#freeSlots';
        this.currentWeightInput = '#currentWeight';
        this.addButton = '#addButton';
        this.resultArea = '#resultArea';
        this.itemCard = (itemId) => `[data-item-id="${itemId}"]`;
    }

    async navigate() {
        await this.page.goto('http://localhost:3000');
    }

    async selectItem(itemId) {
        await this.page.click(this.itemCard(itemId));
    }

    async setMaxWeight(weight) {
        await this.page.fill(this.maxWeightInput, String(weight));
    }

    async setFreeSlots(slots) {
        await this.page.fill(this.freeSlotsInput, String(slots));
    }

    async setCurrentWeight(weight) {
        await this.page.fill(this.currentWeightInput, String(weight));
    }

    async clickAddButton() {
        await this.page.click(this.addButton);
    }

    async getSuccessMessage() {
        const el = this.page.locator('.success');
        await el.waitFor({ state: 'visible', timeout: 5000 });
        return el.textContent();
    }

    async getErrorMessage() {
        const el = this.page.locator('.error');
        await el.waitFor({ state: 'visible', timeout: 5000 });
        return el.textContent();
    }

    async addItem(itemId, maxWeight, freeSlots, currentWeight) {
        if (maxWeight !== undefined) await this.setMaxWeight(maxWeight);
        if (freeSlots !== undefined) await this.setFreeSlots(freeSlots);
        if (currentWeight !== undefined) await this.setCurrentWeight(currentWeight);
        await this.selectItem(itemId);
        await this.clickAddButton();
    }
}

module.exports = InventoryPage;