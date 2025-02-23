import type { Browser, BrowserContext } from 'playwright-core';
import readline from 'readline';

const waitForEnterKey = () =>
	new Promise<void>((resolve) => {
		console.log('\nPlease log in manually in the browser window.');
		console.log('Once you have completed the login, press Enter to save the session and exit...');

		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		rl.question('', () => {
			rl.close();
			resolve();
		});
	});

export const login = async (browser: Browser, context: BrowserContext) => {
	const page = await context.newPage();
	await page.goto(`https://www.facebook.com/groups/${process.env.GROUP_ID}`);

	await waitForEnterKey();

	await page.close();
};
