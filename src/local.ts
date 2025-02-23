import 'dotenv/config';
import * as playwright from 'playwright-aws-lambda';
import { createBrowserContextWithState, saveBrowserState } from './utils/browser-state';

import { declineNoAnswersAfter45Mins } from './decline-no-answers-after-45-mins';
import { declineWithoutRules } from './decline-without-rules';
import { login } from './log-in';

const go = async () => {
	const browser = await playwright.launchChromium({ headless: process.env.HEADED !== 'true' });
	const context = await createBrowserContextWithState(browser);

	try {
		// await login(browser, context);
		await declineNoAnswersAfter45Mins(browser, context);
		console.log('No answers done.');

		await declineWithoutRules(browser, context);
		console.log('Without rules done.');
	} finally {
		await saveBrowserState(context);
		await browser.close();
	}
};

go();
