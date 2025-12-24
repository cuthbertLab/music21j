import { chromium } from '@playwright/test';

/**
 * Loads the Vite-served QUnit page in headless Chromium and exits nonzero on failures.
 */
async function main(): Promise<void> {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Assumes vite dev server is running on 5173
    await page.goto('http://localhost:5173/tests/', {waitUntil: 'domcontentloaded'});

    // Wait for QUnit to finish
    await page.waitForFunction(() => (window as any).__qunit_done__ === true, null, {timeout: 120_000});

    const results = await page.evaluate(() => (window as any).__qunit_results__);
    const failures = await page.evaluate(() => (window as any).__qunit_failures__ ?? []);

    await browser.close();

    if (!results) {
        console.error('QUnit did not report results.');
        throw new Error('QUnit did not report results.');
    }

    if (results.failed > 0) {
        console.error(`QUnit failed: ${results.failed} failed / ${results.passed} passed (total ${results.total}).`);
        for (const f of failures) {
            console.error('\n---');
            if (f.module) {
                console.error(`${f.module} :: ${f.name}`);
            } else {
                console.error(f.name);
            }
            if (f.message) {
                console.error(`    ${f.message}`);
            }
            if ('expected' in f || 'actual' in f) {
                console.error('    expected:', f.expected);
                console.error('    actual:  ', f.actual);
            }
            if (f.source) {
                console.error(`    ${f.source.trim()}`);
            }
        }
        process.exitCode = 1;
        await browser.close();
        return;
    }

    console.log(`QUnit OK: ${results.passed} passed (total ${results.total}).`);
}

main().catch(err => {
    console.error(err);
    process.exitCode = 2;
});
