import 'dotenv/config';
import playwright from 'playwright-core';
import { createBrowserContextWithState, saveBrowserState } from './utils/browser-state';

import { declineNoAnswersAfterDuration } from './decline-no-answers-after-duration';
import { declineWithoutRules } from './decline-without-rules';
import { login } from './log-in';

const go = async () => {
	const browser = process.env.BROWSERLESS_API_TOKEN
		? await playwright.chromium.connect(
				`https://production-sfo.browserless.io/chromium/playwright?token=${process.env.BROWSERLESS_API_TOKEN}`
			)
		: await playwright.chromium.launch({ headless: process.env.HEADED !== 'true' });
	const context = await createBrowserContextWithState(browser);

	try {
		// await login(browser, context);
		await declineNoAnswersAfterDuration(browser, context);
		console.log('No answers done.');

		await declineWithoutRules(browser, context);
		console.log('Without rules done.');
	} finally {
		await saveBrowserState(context);
		await browser.close();
	}
};

go();
