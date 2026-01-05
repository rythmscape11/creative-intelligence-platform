import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import fs from 'fs';
import path from 'path';

/**
 * Generate Comprehensive Enterprise PDF Blueprint
 * method: Parses docs/BLUEPRINT.md directly to ensure 100% content match.
 * Run with: npx tsx scripts/generate-blueprint-pdf.ts
 */

const SOURCE_FILE = path.join(process.cwd(), 'docs/BLUEPRINT.md');
const OUT_FILE = path.join(process.cwd(), 'docs/TECHNICAL_BLUEPRINT.pdf');

const doc = new jsPDF();

// Design Tokens
const COLORS = {
    primary: [13, 148, 136], // Teal 600
    secondary: [16, 185, 129], // Emerald 500
    dark: [15, 23, 42], // Slate 900
    text: [51, 65, 85], // Slate 700
    light: [248, 250, 252], // Slate 50
    codeBg: [241, 245, 249] // Slate 100
};

let y = 30; // Start Y (after margin)
const pageWidth = 210;
const pageHeight = 297;
const margin = 20;

// HELPERS ====================================================================

function addHeaderFooter(pageNumber: number, totalPages: number) {
    if (pageNumber === 1) return; // No footer on cover
    const totalPagesStr = totalPages > 0 ? ` of ${totalPages}` : '';
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Aureon One Technical Blueprint | CONFIDENTIAL', margin, 10);
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    doc.text(`Page ${pageNumber}${totalPagesStr}`, pageWidth - margin - 25, pageHeight - 10);
    doc.text('© 2025 MediaPlanPro', margin, pageHeight - 10);
}

function checkPageBreak(needed: number) {
    if (y + needed > pageHeight - 20) {
        doc.addPage();
        y = 30;
    }
}

function renderCoverPage() {
    doc.setFillColor(COLORS.dark[0], COLORS.dark[1], COLORS.dark[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.circle(pageWidth, 0, 120, 'F');
    doc.circle(0, pageHeight, 90, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(48);
    doc.setFont('helvetica', 'bold');
    doc.text('Aureon One', margin, 100);

    doc.setFontSize(24);
    doc.setFont('helvetica', 'normal');
    doc.text('Technical Blueprint', margin, 120);

    doc.setFontSize(14);
    doc.setTextColor(200, 200, 200);
    doc.text('Comprehensive Documentation', margin, 135);
    doc.text('Version 5.0 | December 23, 2025', margin, 240);
    doc.text('CONFIDENTIAL', margin, 250);

    doc.addPage();
    y = 30;
}

// MARKDOWN PARSER ============================================================

function parseAndRenderMarkdown() {
    const raw = fs.readFileSync(SOURCE_FILE, 'utf-8');
    const lines = raw.split('\n');

    let inTable = false;
    let tableHead: string[] = [];
    let tableBody: string[][] = [];
    let inCodeBlock = false;
    let codeBuffer: string[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trimEnd();
        const trimmed = line.trim();

        // 1. Handle Code Blocks
        if (trimmed.startsWith('```')) {
            if (inCodeBlock) {
                // End block
                renderCodeBlock(codeBuffer);
                codeBuffer = [];
                inCodeBlock = false;
            } else {
                // Start block
                inCodeBlock = true;
            }
            continue;
        }
        if (inCodeBlock) {
            codeBuffer.push(line);
            continue;
        }

        // 2. Handle Tables
        if (trimmed.startsWith('|')) {
            if (!inTable) {
                // Start Table
                // Assumption: First line is Header, Second is Divider (ignore), Rest is Body
                const cols = line.split('|').filter(c => c.trim() !== '').map(c => c.trim());
                if (cols.length > 0) {
                    tableHead = cols;
                    tableBody = [];
                    inTable = true;
                }
            } else {
                // Table Row or Divider
                if (trimmed.includes('---')) continue; // Skip divider row

                const cols = line.split('|').filter((c, idx, arr) => {
                    // Filter out empty start/end if pipe formatting used | A | B |
                    // But split('|') gives ["", "A", "B", ""]
                    // We need a robust split.
                    return true;
                });
                // Robust split: remove first and last if they are empty strings
                let cleanCols = line.split('|').map(c => c.trim());
                if (cleanCols[0] === '') cleanCols.shift();
                if (cleanCols[cleanCols.length - 1] === '') cleanCols.pop();

                if (cleanCols.length > 0) {
                    tableBody.push(cleanCols);
                }
            }
            continue;
        } else if (inTable) {
            // End Table (encountered non-pipe line)
            renderTable(tableHead, tableBody);
            inTable = false;
        }

        // 3. Handle Empty Lines
        if (trimmed === '') {
            y += 2;
            continue;
        }

        // 4. Handle Headers
        if (line.startsWith('# ')) {
            // H1 - New Page usually, or Major Section
            if (y > 50) doc.addPage(); y = 30; // Always new page for H1 unless at top
            renderH1(line.replace('# ', ''));
        } else if (line.startsWith('## ')) {
            renderH2(line.replace('## ', ''));
        } else if (line.startsWith('### ')) {
            renderH3(line.replace('### ', ''));
        }

        // 5. Handle Lists
        else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            renderBullet(trimmed.replace(/^[-*] /, ''));
        } else if (/^\d+\./.test(trimmed)) {
            // 1. List
            const txt = trimmed.replace(/^\d+\.\s*/, '');
            renderNumberedList(trimmed.match(/^\d+/)![0], txt);
        }

        // 6. Handle Blockquotes
        else if (trimmed.startsWith('> ')) {
            renderBlockquote(trimmed.replace('> ', ''));
        }

        // 7. Handle Horizontal Rules
        else if (trimmed === '---') {
            renderDivider();
        }

        // 8. Default Paragraph
        else {
            renderText(trimmed);
        }
    }
    // Flush pending table
    if (inTable) {
        renderTable(tableHead, tableBody);
    }
}

// RENDERERS ==================================================================

function renderH1(text: string) {
    checkPageBreak(25);
    doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.rect(0, y, 8, 14, 'F');
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.dark[0], COLORS.dark[1], COLORS.dark[2]);
    doc.text(text, margin, y + 10);
    y += 25;
}

function renderH2(text: string) {
    checkPageBreak(20);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text(text, margin, y);
    y += 12;
}

function renderH3(text: string) {
    checkPageBreak(15);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.text(text, margin, y);
    y += 10;
}

function renderText(text: string) {
    if (!text) return;
    checkPageBreak(10);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    const lines = doc.splitTextToSize(text, pageWidth - (margin * 2));
    doc.text(lines, margin, y);
    y += lines.length * 5 + 3;
}

function renderBullet(text: string) {
    checkPageBreak(8);
    doc.setFontSize(10);
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.text('•', margin + 2, y);
    const lines = doc.splitTextToSize(text, pageWidth - (margin * 2) - 10);
    doc.text(lines, margin + 7, y);
    y += lines.length * 5 + 2;
}

function renderNumberedList(num: string, text: string) {
    checkPageBreak(8);
    doc.setFontSize(10);
    doc.text(`${num}.`, margin + 2, y);
    const lines = doc.splitTextToSize(text, pageWidth - (margin * 2) - 10);
    doc.text(lines, margin + 10, y);
    y += lines.length * 5 + 2;
}

function renderBlockquote(text: string) {
    checkPageBreak(15);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y - 2, margin, y + 8);
    const lines = doc.splitTextToSize(text, pageWidth - (margin * 2) - 5);
    doc.text(lines, margin + 5, y);
    y += lines.length * 5 + 5;
}

function renderCodeBlock(lines: string[]) {
    if (lines.length === 0) return;
    const height = lines.length * 4 + 10;
    checkPageBreak(height);

    doc.setFillColor(COLORS.codeBg[0], COLORS.codeBg[1], COLORS.codeBg[2]);
    doc.rect(margin, y, pageWidth - (margin * 2), height, 'F');

    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);

    let cy = y + 5;
    lines.forEach(l => {
        doc.text(l.substring(0, 90), margin + 2, cy); // Truncate long lines roughly
        cy += 4;
    });

    y += height + 5;
    // Reset font
    doc.setFont('helvetica', 'normal');
}

function renderTable(head: string[], body: any[]) {
    // Basic check for mermaid diagrams that might get caught as tables? No, mermaid is in code blocks usually.
    if (body.length === 0) return;

    autoTable(doc, {
        startY: y,
        head: [head],
        body: body,
        theme: 'striped',
        styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
        headStyles: { fillColor: COLORS.primary as any, textColor: 255 },
        alternateRowStyles: { fillColor: COLORS.light as any },
        margin: { left: margin, right: margin },
    });
    // @ts-ignore
    y = doc.lastAutoTable.finalY + 10;
}

function renderDivider() {
    y += 5;
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
}

// EXECUTE ====================================================================

console.log('Generating Full-Length Blueprint...');
renderCoverPage();
parseAndRenderMarkdown();

// Page Numbers
const pageCount = doc.getNumberOfPages();
for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addHeaderFooter(i, pageCount);
}

const output = doc.output('arraybuffer');
fs.writeFileSync(OUT_FILE, Buffer.from(output));
console.log(`✅ Generated: ${OUT_FILE} (${pageCount} pages)`);
