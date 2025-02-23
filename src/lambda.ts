import playwright from 'playwright-core';
import { createBrowserContextWithState, saveBrowserState } from './utils/browser-state';

import { declineNoAnswersAfterDuration } from './decline-no-answers-after-duration';
import { declineWithoutRules } from './decline-without-rules';

export const handler = async (): Promise<void> => {
	const browser = process.env.BROWSERLESS_API_TOKEN
		? await playwright.chromium.connect(
				`wss://production-sfo.browserless.io/chromium/playwright?token=${process.env.BROWSERLESS_API_TOKEN}`
			)
		: await playwright.chromium.launch({ headless: process.env.HEADED !== 'true' });
	const context = await createBrowserContextWithState(browser);

	try {
		await declineNoAnswersAfterDuration(browser, context);
		console.log('No answers done.');

		await declineWithoutRules(browser, context);
		console.log('Without rules done.');
	} finally {
		await saveBrowserState(context);
		await browser.close();
	}
};
