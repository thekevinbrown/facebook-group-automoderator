import { chromium } from '@playwright/test';
import { createBrowserContextWithState, saveBrowserState } from './utils/browser-state';

import { declineNoAnswersAfter45Mins } from './decline-no-answers-after-45-mins';
import { declineWithoutRules } from './decline-without-rules';

export const handler = async (): Promise<void> => {
	const browser = await chromium.launch({ headless: process.env.HEADED !== 'true' });
	const context = await createBrowserContextWithState(browser);

	try {
		// await login();
		await declineNoAnswersAfter45Mins(browser, context);
		console.log('No answers done.');

		await declineWithoutRules(browser, context);
		console.log('Without rules done.');
	} finally {
		await saveBrowserState(context);
		await browser.close();
	}
};
