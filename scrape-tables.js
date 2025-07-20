const { chromium } = require('playwright');

const seeds = Array.from({ length: 10 }, (_, i) => 26 + i);
const baseUrl = 'https://example.com/report?seed=';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    let grandTotal = 0;

    for (const seed of seeds) {
        const url = `${baseUrl}${seed}`;
        await page.goto(url);

        const numbers = await page.$$eval('table td', cells =>
            cells
                .map(cell => parseFloat(cell.textContent.replace(/[^0-9.-]+/g, '')))
                .filter(num => !isNaN(num))
        );

        const pageTotal = numbers.reduce((acc, val) => acc + val, 0);
        console.log(`Seed ${seed}:`, pageTotal);
        grandTotal += pageTotal;
    }

    console.log('Final Total:', grandTotal);
    await browser.close();
})();
