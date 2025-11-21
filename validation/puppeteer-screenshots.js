/**
 * Puppeteer Page Screenshots
 * Generates individual page screenshots for visual validation of A4 worksheets
 *
 * Usage: node puppeteer-screenshots.js <input.html> <output-directory>
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// A4 dimensions at 96 DPI
const A4_WIDTH = 794;  // 210mm at 96 DPI
const A4_HEIGHT = 1123; // 297mm at 96 DPI

async function screenshotPages(htmlPath, outputDir) {
    console.log(`Generating page screenshots for ${htmlPath}...`);

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();

        // Set viewport to A4 dimensions
        await page.setViewport({
            width: A4_WIDTH,
            height: A4_HEIGHT,
            deviceScaleFactor: 2 // Higher resolution screenshots
        });

        // Navigate to HTML file
        const absolutePath = path.resolve(htmlPath);
        await page.goto(`file://${absolutePath}`, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Wait for fonts to load
        await page.evaluateHandle('document.fonts.ready');

        // Emulate print media for accurate representation
        await page.emulateMediaType('print');

        // Get total document height
        const bodyHeight = await page.evaluate(() => {
            return Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight
            );
        });

        // Calculate number of pages
        const totalPages = Math.ceil(bodyHeight / A4_HEIGHT);
        console.log(`Document spans approximately ${totalPages} pages`);

        const screenshots = [];

        // Generate screenshot for each page
        for (let i = 0; i < totalPages; i++) {
            const scrollY = i * A4_HEIGHT;

            // Scroll to page position
            await page.evaluate((y) => window.scrollTo(0, y), scrollY);

            // Small delay to ensure rendering
            await new Promise(resolve => setTimeout(resolve, 100));

            const filename = `page-${String(i + 1).padStart(2, '0')}.png`;
            const filepath = path.join(outputDir, filename);

            await page.screenshot({
                path: filepath,
                clip: {
                    x: 0,
                    y: 0,
                    width: A4_WIDTH,
                    height: A4_HEIGHT
                }
            });

            console.log(`  Generated: ${filename}`);
            screenshots.push(filepath);
        }

        // Generate summary report
        const reportPath = path.join(outputDir, 'validation-report.json');
        const report = {
            source: htmlPath,
            generatedAt: new Date().toISOString(),
            totalPages: totalPages,
            dimensions: {
                width: A4_WIDTH,
                height: A4_HEIGHT,
                unit: 'pixels',
                dpi: 96
            },
            screenshots: screenshots.map((p, i) => ({
                page: i + 1,
                path: path.basename(p)
            }))
        };

        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\nValidation report saved to: ${reportPath}`);

        return {
            totalPages,
            screenshots,
            reportPath
        };
    } finally {
        await browser.close();
    }
}

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.log('Usage: node puppeteer-screenshots.js <input.html> <output-directory>');
        process.exit(1);
    }

    const [inputPath, outputDir] = args;

    screenshotPages(inputPath, outputDir)
        .then((result) => {
            console.log(`\nScreenshot generation complete!`);
            console.log(`Total pages: ${result.totalPages}`);
            console.log(`\nReview screenshots in: ${outputDir}`);
            process.exit(0);
        })
        .catch((error) => {
            console.error('Error generating screenshots:', error);
            process.exit(1);
        });
}

module.exports = { screenshotPages, A4_WIDTH, A4_HEIGHT };
