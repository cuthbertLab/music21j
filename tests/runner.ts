import QUnit from 'qunit';
import 'qunit/qunit/qunit.css';

// Import music21j as modules (not the built UMD file)
import * as music21 from '../src/main';

// Import the test registry
import m21_tests from './loadAll';


type QUnit_fail = {
    module: string;
    name: string;
    message: string;
    actual?: unknown;
    expected?: unknown;
    source?: string;
};

const qunit_failures: QUnit_fail[] = [];

QUnit.log(details => {
    // QUnit.log fires for each assertion; we only care about failed ones
    if (!details.result) {
        qunit_failures.push({
            module: details.module ?? '',
            name: details.name ?? '',
            message: details.message ?? '',
            actual: details.actual,
            expected: details.expected,
            source: details.source,
        });
    }
});



// If any tests assume globals, keep them
(globalThis as any).music21 = music21;
(globalThis as any).QUnit = QUnit;

// Keep default existing output plumbing
music21.defaults.appendLocation = '#streamAppend';

QUnit.config.autostart = false;

// Register all suites
const suites: Record<string, unknown> =
    ((m21_tests as any).default ?? (m21_tests as any)) as Record<string, unknown>;

const suite_names = Object.keys(suites);
console.log(`[QUnit] suites found: ${suite_names.length}`);

if (!suite_names.length) {
    throw new Error('No test suites were discovered. loadAll.ts has problems.');
}

// here is where the suites are run!
for (const name of suite_names) {
    const suite = suites[name];
    if (typeof suite === 'function') {
        suite();
    }
}

// Move any music21 output under the test that created it
QUnit.testDone(details => {
    const testId = (details as any).testId; // undocumented but useful
    const stream_append = document.querySelector('#streamAppend');
    if (!stream_append) {
        return;
    }

    const m21_output = Array.from(stream_append.childNodes);
    if (!m21_output.length) {
        return;
    }

    const dom_out = document.getElementById('qunit-test-output-' + testId) as HTMLElement | undefined;
    if (!dom_out) {
        return;
    }

    const source_out = dom_out.querySelector('.qunit-source');
    if (!source_out) {
        return;
    }

    const m21_div = document.createElement('div');
    m21_div.classList.add('m21output');
    m21_div.append(...m21_output); // IMPORTANT: spread + moves nodes out of streamAppend
    source_out.append(m21_div);

    const counts = dom_out.querySelector('.counts');
    if (counts) {
        counts.innerHTML += ` + ${m21_output.length} outputs`;
    }
});

QUnit.start();

QUnit.done(details => {
    (globalThis as any).__qunit_done__ = true;
    (globalThis as any).__qunit_results__ = details;
    (globalThis as any).__qunit_failures__ = qunit_failures;
});
