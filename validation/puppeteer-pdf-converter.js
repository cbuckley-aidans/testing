/**
 * Puppeteer PDF Converter
 * Converts HTML worksheets to A4 PDF format for print validation
 *
 * Usage: node puppeteer-pdf-converter.js <input.html> <output.pdf>
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function convertToPDF(htmlPath, outputPath) {
    console.log(`Converting ${htmlPath} to PDF...`);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();

        // Navigate to the HTML file
        const absolutePath = path.resolve(htmlPath);
        await page.goto(`file://${absolutePath}`, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Wait for fonts to load
        await page.evaluateHandle('document.fonts.ready');

        // Generate PDF with A4 settings matching @media print
        await page.pdf({
            path: outputPath,
            format: 'A4',
            margin: {
                top: '8mm',
                right: '8mm',
                bottom: '8mm',
                left: '8mm'
            },
            printBackground: true,
            preferCSSPageSize: true
        });

        console.log(`PDF saved to: ${outputPath}`);
        return outputPath;
    } finally {
        await browser.close();
    }
}

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.log('Usage: node puppeteer-pdf-converter.js <input.html> <output.pdf>');
        process.exit(1);
    }

    const [inputPath, outputPath] = args;

    convertToPDF(inputPath, outputPath)
        .then(() => {
            console.log('Conversion complete!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Error converting to PDF:', error);
            process.exit(1);
        });
}

module.exports = { convertToPDF };
