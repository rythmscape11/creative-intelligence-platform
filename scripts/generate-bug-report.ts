/**
 * Bug Report Generator Script
 * Parses Playwright test results and generates a detailed bug report
 * 
 * Run: npx ts-node scripts/generate-bug-report.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
    title: string;
    status: 'passed' | 'failed' | 'timedOut' | 'skipped';
    duration: number;
    error?: {
        message: string;
        stack?: string;
    };
    attachments?: Array<{
        name: string;
        path: string;
        contentType: string;
    }>;
}

interface Suite {
    title: string;
    specs: Array<{
        title: string;
        tests: TestResult[];
    }>;
}

interface PlaywrightReport {
    config: {
        projects: Array<{ name: string }>;
    };
    suites: Suite[];
    stats: {
        startTime: string;
        duration: number;
        expected: number;
        unexpected: number;
        flaky: number;
        skipped: number;
    };
}

interface Bug {
    id: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    category: string;
    page: string;
    title: string;
    description: string;
    errorMessage?: string;
    screenshot?: string;
    reproducible: boolean;
}

function parseSeverity(testTitle: string, error?: string): Bug['severity'] {
    if (testTitle.includes('API') || testTitle.includes('Homepage')) return 'critical';
    if (testTitle.includes('Navigation') || testTitle.includes('Authentication')) return 'high';
    if (testTitle.includes('Responsive') || testTitle.includes('Performance')) return 'medium';
    return 'low';
}

function extractPageFromTest(testTitle: string): string {
    const pageMatch = testTitle.match(/\(([^)]+)\)/);
    return pageMatch ? pageMatch[1] : testTitle;
}

function generateBugReport(): void {
    const reportPath = path.join(process.cwd(), 'test-results', 'report.json');

    if (!fs.existsSync(reportPath)) {
        console.log('❌ No test report found. Run tests first: npx playwright test');
        return;
    }

    const reportData: PlaywrightReport = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    const bugs: Bug[] = [];
    let bugId = 1;

    // Parse suites for failures
    for (const suite of reportData.suites || []) {
        for (const spec of suite.specs || []) {
            for (const test of spec.tests || []) {
                if (test.status === 'failed' || test.status === 'timedOut') {
                    const bug: Bug = {
                        id: `BUG-${String(bugId++).padStart(3, '0')}`,
                        severity: parseSeverity(spec.title, test.error?.message),
                        category: suite.title,
                        page: extractPageFromTest(spec.title),
                        title: `${spec.title} - ${test.status}`,
                        description: `Test "${spec.title}" ${test.status} after ${test.duration}ms`,
                        errorMessage: test.error?.message,
                        screenshot: test.attachments?.find(a => a.contentType.includes('image'))?.path,
                        reproducible: true,
                    };
                    bugs.push(bug);
                }
            }
        }
    }

    // Generate markdown report
    const report = generateMarkdownReport(reportData, bugs);

    const outputPath = path.join(process.cwd(), 'BUG_REPORT.md');
    fs.writeFileSync(outputPath, report);
    console.log(`✅ Bug report generated: ${outputPath}`);
    console.log(`📊 Total bugs found: ${bugs.length}`);
}

function generateMarkdownReport(data: PlaywrightReport, bugs: Bug[]): string {
    const stats = data.stats || { expected: 0, unexpected: 0, skipped: 0, duration: 0 };
    const total = stats.expected + stats.unexpected + stats.skipped;
    const passRate = total > 0 ? ((stats.expected / total) * 100).toFixed(1) : '0';

    let report = `# 🐛 Automated Test Bug Report

**Generated:** ${new Date().toISOString()}
**Test Framework:** Playwright

---

## 📊 Summary

| Metric | Value |
|--------|-------|
| Total Tests | ${total} |
| ✅ Passed | ${stats.expected} |
| ❌ Failed | ${stats.unexpected} |
| ⏭️ Skipped | ${stats.skipped} |
| Pass Rate | ${passRate}% |
| Duration | ${(stats.duration / 1000).toFixed(2)}s |

---

`;

    if (bugs.length === 0) {
        report += `## ✅ No Bugs Found

All tests passed successfully! The application is working as expected.
`;
    } else {
        report += `## 🐛 Bugs Found (${bugs.length})

### By Severity

| Severity | Count |
|----------|-------|
| 🔴 Critical | ${bugs.filter(b => b.severity === 'critical').length} |
| 🟠 High | ${bugs.filter(b => b.severity === 'high').length} |
| 🟡 Medium | ${bugs.filter(b => b.severity === 'medium').length} |
| 🟢 Low | ${bugs.filter(b => b.severity === 'low').length} |

---

### Bug Details

`;

        for (const bug of bugs) {
            const severityIcon = {
                critical: '🔴',
                high: '🟠',
                medium: '🟡',
                low: '🟢',
            }[bug.severity];

            report += `#### ${severityIcon} ${bug.id}: ${bug.title}

| Field | Value |
|-------|-------|
| Severity | ${bug.severity.toUpperCase()} |
| Category | ${bug.category} |
| Page | ${bug.page} |
| Reproducible | ${bug.reproducible ? 'Yes' : 'No'} |

**Description:** ${bug.description}

${bug.errorMessage ? `**Error:**\n\`\`\`\n${bug.errorMessage}\n\`\`\`` : ''}

${bug.screenshot ? `**Screenshot:** [View](${bug.screenshot})` : ''}

---

`;
        }
    }

    report += `## 🔧 How to Fix

1. Review each bug in the list above
2. Check the error messages and screenshots
3. Run individual tests: \`npx playwright test --grep "test name"\`
4. View HTML report: \`npx playwright show-report\`
5. Debug with UI: \`npx playwright test --ui\`

## 📁 Test Files

- \`e2e/pages.spec.ts\` - Public page tests
- \`e2e/agency.spec.ts\` - Agency OS tests

---

*Report generated automatically by scripts/generate-bug-report.ts*
`;

    return report;
}

// Run if executed directly
if (require.main === module) {
    generateBugReport();
}

export { generateBugReport };
