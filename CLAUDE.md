# A4 Print-Friendly Educational Worksheet Generator

This project creates A4 print-friendly HTML educational worksheets that convert cleanly to PDF format. Follow these guidelines to ensure consistent, professional output.

## Quick Start

1. Create worksheets using the HTML template structure in `examples/`
2. Validate your design using the PDF preview workflow (see [Validation Workflow](#validation-workflow))
3. Ensure all content fits within page boundaries before finalizing

---

## Design Principles

### Core Philosophy
- **Each section needs its own card frame** - Never continue content from one `.section-card` to another
- **When in doubt, add a page break** - It's better to have extra whitespace than content spilling over
- **Size content appropriately** - Match writing area size to expected response length

---

## Page Break Management

### Key Rules

1. **Split long sections into subsections** (e.g., Section 3 and Section 3A) rather than letting content flow across pages
2. **Use `page-break` class** on subsection titles when content is getting too long for current page
3. **Apply `break-inside: avoid`** to all `.section-card` elements in CSS
4. **Give large writing boxes their own page** - Always add `page-break` class before mega placeholder boxes

### CSS Implementation

```css
@media print {
    @page {
        size: A4;
        margin: 8mm;
    }

    body {
        width: 190mm;
        padding: 0;
    }

    .section-card {
        page-break-inside: avoid;
    }

    .page-break {
        page-break-before: always;
    }

    .prototype-section {
        page-break-before: always;
        page-break-inside: avoid;
    }
}
```

### When to Add Page Breaks

| Scenario | Action |
|----------|--------|
| Large placeholder box (400px+) | Always add `page-break` class |
| New prototype stage | Use `.prototype-section` class |
| Section exceeds ~60% of page | Split into subsections with page break |
| Different activity types | Separate onto distinct pages |

---

## Writing Area Guidelines

### Size Reference Chart

| Size | Height | Use Case |
|------|--------|----------|
| **Small** | `80px` | Brief definitions, single-sentence responses, short lists |
| **Medium** | `125-180px` | Paragraph explanations, problem descriptions, concept development |
| **Large** | `300px` | Extensive brainstorming, detailed explanations |
| **Mega** | `500-750px` | Full-page sketch areas, mood boards, major design work |

### CSS Classes

```css
.placeholder-box {
    border: 2px dashed #ccc;
    border-radius: 0.6em;
    padding: 60px;
    background-color: rgba(0,0,0,0.02);
    text-align: center;
    color: #666;
    font-style: italic;
    margin: 15px 0;
    min-height: 180px;
}

.large-placeholder-box {
    /* Same as above with: */
    min-height: 300px;
    padding: 80px;
}

.mega-placeholder-box {
    /* Same as above with: */
    min-height: 750px;
    padding: 120px;
}
```

---

## Section Numbering Strategy

### Numbering Convention

- **Main sections**: 1, 2, 3, 4...
- **Subsections when splitting**: 1A, 2A, 3A...
- **Multiple subsections**: 9, 9A, 9B for prototype activities

### Example Structure

```
Section 1: Project Overview
Section 2: Research (Page 1)
Section 2A: Research (Page 2)  ← Split due to length
Section 3: Define
Section 4: Ideate (Page 1)
Section 4A: Ideate (Page 2)
...
```

---

## Link Button Styling

Replace plain URL text boxes with styled, clickable buttons:

### Button Types

| Type | Color Scheme | Icon | Use Case |
|------|--------------|------|----------|
| YouTube | Red gradient | `fab fa-youtube` | Video links |
| Google Maps | Blue gradient | `fas fa-map-marker-alt` | Location links |
| Research | Green gradient | `fas fa-external-link-alt` | General research links |

### CSS Implementation

```css
.link-button {
    display: block;
    width: 100%;
    padding: 15px 20px;
    border: none;
    border-radius: 0.6em;
    font-size: 16px;
    font-weight: 600;
    color: white;
    text-decoration: none;
    text-align: center;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 0.15em 0 rgba(0,0,0,0.3);
}

.link-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 0.25em 0 rgba(0,0,0,0.3);
}

.link-button-youtube {
    background: linear-gradient(135deg, #ff0000, #cc0000);
}

.link-button-maps {
    background: linear-gradient(135deg, #4285f4, #34a853);
}

.link-button-research {
    background: linear-gradient(135deg, #10b981, #059669);
}
```

---

## Content Flow Organization

### Activity Separation Rules

Keep these activity types on **separate pages**:
- Watching/video activities
- Note-taking sections
- Sketching/visual work
- Extended writing tasks
- Building/prototype activities

### Visual Continuity Cues

When activities span multiple pages, add info boxes with navigation:

```html
<div class="info-box">
    <i class="fas fa-arrow-right"></i>
    <strong>Continued on next page...</strong>
</div>
```

### Sketch Areas

Use dotted borders with grid backgrounds for visual brainstorming:

```css
.sketch-area {
    border: 2px dashed #ccc;
    border-radius: 0.6em;
    background-image:
        linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
    background-size: 20px 20px;
    min-height: 400px;
}
```

---

## Standard HTML Structure

### Document Setup

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Worksheet Title]</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/inter-ui/3.19.3/inter.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* Include standard CSS here */
    </style>
</head>
<body>
    <!-- Content -->
</body>
</html>
```

### Section Card Template

```html
<div class="section-card">
    <div class="section-title">Section Title <i class="fas fa-icon"></i></div>

    <div class="tip-box">
        <i class="fas fa-info-circle"></i>
        <strong>Instructions:</strong> [Instructions text]
    </div>

    <div class="placeholder-box">
        [Placeholder content or leave empty]
    </div>
</div>
```

### Page Break Section

```html
<div class="section-card page-break">
    <div class="section-title">New Page Section</div>
    <!-- Content -->
</div>
```

---

## Validation Workflow

### MCP-Based PDF Preview and Validation

Use the following workflow to validate your worksheet design before finalizing:

#### Step 1: Convert HTML to PDF

Use Puppeteer or Playwright to render the HTML and generate a PDF:

```javascript
// puppeteer-pdf-converter.js
const puppeteer = require('puppeteer');

async function convertToPDF(htmlPath, outputPath) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

    await page.pdf({
        path: outputPath,
        format: 'A4',
        margin: { top: '8mm', right: '8mm', bottom: '8mm', left: '8mm' },
        printBackground: true
    });

    await browser.close();
    return outputPath;
}
```

#### Step 2: Generate Page Screenshots

Capture individual pages for visual inspection:

```javascript
async function screenshotPages(htmlPath, outputDir) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set viewport to A4 dimensions (96 DPI)
    await page.setViewport({ width: 794, height: 1123 });

    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

    // Emulate print media
    await page.emulateMediaType('print');

    // Get total height and calculate pages
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const pageHeight = 1123; // A4 height at 96 DPI
    const totalPages = Math.ceil(bodyHeight / pageHeight);

    for (let i = 0; i < totalPages; i++) {
        await page.evaluate((scrollY) => window.scrollTo(0, scrollY), i * pageHeight);
        await page.screenshot({
            path: `${outputDir}/page-${i + 1}.png`,
            clip: { x: 0, y: 0, width: 794, height: pageHeight }
        });
    }

    await browser.close();
    return totalPages;
}
```

#### Step 3: Self-Evaluation Checklist

After generating screenshots, verify:

- [ ] **No content spillover** - Text/boxes don't cut off at page boundaries
- [ ] **Consistent margins** - Equal spacing on all sides
- [ ] **Readable text** - Font sizes appropriate for print
- [ ] **Clear section breaks** - Each card starts fresh on its page
- [ ] **Appropriate whitespace** - Not too cramped, not too empty
- [ ] **Placeholder box sizing** - Matches expected content length

### Browser Print Preview Method

For quick validation without MCP tools:

1. Open HTML file in Chrome/Firefox
2. Press `Ctrl+P` (or `Cmd+P` on Mac)
3. Review each page in print preview
4. Check for content spillover at page boundaries
5. Verify section cards don't split across pages

### Automated Validation Script

```bash
#!/bin/bash
# validate-worksheet.sh

HTML_FILE=$1
OUTPUT_DIR="./validation-output"

mkdir -p $OUTPUT_DIR

# Generate PDF
node puppeteer-pdf-converter.js "$HTML_FILE" "$OUTPUT_DIR/worksheet.pdf"

# Generate page screenshots
node puppeteer-screenshots.js "$HTML_FILE" "$OUTPUT_DIR"

echo "Validation files generated in $OUTPUT_DIR"
echo "Review screenshots for any layout issues"
```

---

## Common Issues & Solutions

### Content Spilling Over Pages

**Problem**: Section card content continues onto next page
**Solution**:
1. Add `page-break` class to the section
2. Split into subsections (e.g., 3A, 3B)
3. Reduce placeholder box size

### Section Cards Breaking Mid-Content

**Problem**: Cards split at page boundary
**Solution**: Ensure CSS includes:
```css
.section-card {
    page-break-inside: avoid;
}
```

### Inconsistent Spacing

**Problem**: Varying margins between sections
**Solution**: Use consistent `margin-bottom: 18px` on all `.section-card` elements

### Print Background Not Showing

**Problem**: Background colors don't appear in PDF
**Solution**: Enable "Print backgrounds" in print settings or PDF generation:
```javascript
await page.pdf({ printBackground: true });
```

---

## File Organization

```
project/
├── CLAUDE.md                    # This file
├── examples/
│   └── yr-6-house-design-worksheet.html
├── worksheets/
│   └── [generated-worksheets].html
├── validation/
│   ├── puppeteer-pdf-converter.js
│   └── puppeteer-screenshots.js
└── output/
    ├── pdfs/
    └── screenshots/
```

---

## Design Process Cards Reference

Use these colored cards for design process overviews:

| Stage | Color | Icon |
|-------|-------|------|
| Project Planning | Purple `#8b5cf6` | `fa-calendar-days` |
| Empathy | Rose `#f43f5e` | `fa-heart` |
| Define | Green `#10b981` | `fa-bullseye` |
| Ideate | Amber `#f59e0b` | `fa-lightbulb` |
| Prototype | Sky `#0ea5e9` | `fa-hammer` |
| Evaluate | Indigo `#6366f1` | `fa-clipboard-check` |

---

## Six Thinking Hats Reference

For evaluation sections using Six Thinking Hats:

| Hat | Color | Focus |
|-----|-------|-------|
| White | White `#ffffff` | Facts and data |
| Red | Red `#dc2626` | Emotions and feelings |
| Black | Black `#000000` | Critical analysis |
| Yellow | Yellow `#facc15` | Positive aspects |
| Green | Green `#16a34a` | Creative ideas |
| Blue | Blue `#2563eb` | Process reflection |

---

## Quick Reference: Box Sizes

```
Small:   min-height: 80px    → Brief responses
Medium:  min-height: 125px   → Paragraphs
Large:   min-height: 300px   → Extended writing
Mega:    min-height: 750px   → Full-page work (ALWAYS add page-break)
```

---

## Version History

- **v1.0** - Initial guidelines based on Fashion Design HTV Assessment template
