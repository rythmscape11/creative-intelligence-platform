const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    const htmlPath = path.resolve(__dirname, 'docs/BLUEPRINT.html');
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

    await page.pdf({
        path: path.resolve(__dirname, 'docs/BLUEPRINT.pdf'),
        format: 'A4',
        printBackground: true,
        margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' }
    });

    console.log('PDF generated: docs/BLUEPRINT.pdf');
    await browser.close();
})();
