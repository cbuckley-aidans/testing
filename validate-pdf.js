const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

async function validateWorksheet(htmlPath, outputDir) {
    console.log(`Validating: ${htmlPath}`);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.setViewportSize({ width: A4_WIDTH, height: A4_HEIGHT });

    const absolutePath = path.resolve(htmlPath);
    await page.goto(`file://${absolutePath}`, { waitUntil: 'networkidle' });

    // Emulate print media
    await page.emulateMedia({ media: 'print' });

    // Generate PDF
    await page.pdf({
        path: path.join(outputDir, 'worksheet.pdf'),
        format: 'A4',
        margin: { top: '8mm', right: '8mm', bottom: '8mm', left: '8mm' },
        printBackground: true
    });
    console.log('PDF generated');

    // Get page count by measuring document height
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const totalPages = Math.ceil(bodyHeight / 1123);
    console.log(`Estimated pages: ${totalPages}`);

    // Generate screenshots for each page
    for (let i = 0; i < totalPages; i++) {
        await page.evaluate((scrollY) => window.scrollTo(0, scrollY), i * A4_HEIGHT);
        await page.waitForTimeout(100);

        await page.screenshot({
            path: path.join(outputDir, `page-${String(i + 1).padStart(2, '0')}.png`),
            clip: { x: 0, y: 0, width: A4_WIDTH, height: A4_HEIGHT }
        });
        console.log(`Screenshot: page-${String(i + 1).padStart(2, '0')}.png`);
    }

    await browser.close();
    console.log(`\nValidation complete. Check ${outputDir} for output files.`);
}

const htmlFile = process.argv[2] || 'fast-fashion-test.html';
const outputDir = process.argv[3] || './validation-output';

validateWorksheet(htmlFile, outputDir).catch(console.error);
