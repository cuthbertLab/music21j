import { spawn } from 'node:child_process';

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function wait_for_url(url: string, timeout_ms = 120_000): Promise<void> {
    const start = Date.now();

    while (Date.now() - start < timeout_ms) {
        try {
            // no-await-in-loop is designed to prevent doing sequential things that
            // should be done in parallel (with await Promise.all()...) - it is
            // fine to use in timeout checking situations.

            // eslint-disable-next-line no-await-in-loop
            const res = await fetch(url, { redirect: 'manual' });
            // Any HTTP response means the server is up
            if (res.status >= 200 && res.status < 500) {
                return;
            }
        } catch {
            // server not ready yet
        }
        // eslint-disable-next-line no-await-in-loop
        await sleep(250);
    }

    throw new Error(`Timed out waiting for ${url}`);
}

function run(cmd: string, args: string[]) {
    return spawn(cmd, args, {
        stdio: 'inherit',
        shell: process.platform === 'win32',
    });
}

async function main(): Promise<void> {
    let vite_proc: ReturnType<typeof run> | undefined;

    try {
        // Start Vite dev server
        vite_proc = run('npm', ['run', 'dev']);

        // Wait for test page to be reachable
        await wait_for_url('http://localhost:5173/tests/');

        // Run QUnit + Playwright runner
        const test_proc = run('npm', ['run', 'test:qunit']);

        const exit_code: number = await new Promise(resolve => {
            test_proc.on('close', code => resolve(code ?? 1));
        });

        process.exitCode = exit_code;
    } catch (err) {
        console.error(err);
        process.exitCode = 2;
    } finally {
        if (vite_proc) {
            vite_proc.kill('SIGTERM');
        }
    }
}

main();
