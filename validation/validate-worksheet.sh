#!/bin/bash
#
# Worksheet Validation Script
# Generates PDF and page screenshots for visual validation
#
# Usage: ./validate-worksheet.sh <input.html> [output-directory]
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check arguments
if [ -z "$1" ]; then
    echo -e "${RED}Error: No input file specified${NC}"
    echo "Usage: ./validate-worksheet.sh <input.html> [output-directory]"
    exit 1
fi

HTML_FILE="$1"
OUTPUT_DIR="${2:-./validation-output}"

# Check if input file exists
if [ ! -f "$HTML_FILE" ]; then
    echo -e "${RED}Error: File not found: $HTML_FILE${NC}"
    exit 1
fi

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  Worksheet Validation Tool${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""
echo "Input:  $HTML_FILE"
echo "Output: $OUTPUT_DIR"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is required but not installed${NC}"
    echo "Install Node.js from https://nodejs.org/"
    exit 1
fi

# Check for puppeteer
if ! node -e "require('puppeteer')" 2>/dev/null; then
    echo -e "${YELLOW}Installing puppeteer...${NC}"
    npm install puppeteer
fi

# Generate PDF
echo -e "${GREEN}[1/2] Generating PDF...${NC}"
node "$SCRIPT_DIR/puppeteer-pdf-converter.js" "$HTML_FILE" "$OUTPUT_DIR/worksheet.pdf"

# Generate screenshots
echo ""
echo -e "${GREEN}[2/2] Generating page screenshots...${NC}"
node "$SCRIPT_DIR/puppeteer-screenshots.js" "$HTML_FILE" "$OUTPUT_DIR/screenshots"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Validation Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Output files:"
echo "  - PDF:         $OUTPUT_DIR/worksheet.pdf"
echo "  - Screenshots: $OUTPUT_DIR/screenshots/"
echo "  - Report:      $OUTPUT_DIR/screenshots/validation-report.json"
echo ""
echo -e "${YELLOW}Review the screenshots to check for:${NC}"
echo "  - Content spillover at page boundaries"
echo "  - Section cards splitting across pages"
echo "  - Consistent margins and spacing"
echo "  - Appropriate placeholder box sizes"
echo ""
