import type { Browser, BrowserContext } from 'playwright-core';

const REJECT_TEXT = `Hey there, thanks for your interest in the group. Please accept the group rules and we'll be happy to review your request to join again.`;

export const declineWithoutRules = async (browser: Browser, context: BrowserContext) => {
	const page = await context.newPage();
	let tookAction = false;

	do {
		tookAction = false;
		await page.goto(
			`https://www.facebook.com/groups/${process.env.GROUP_ID}/member-requests?joined_fb_recently=false&membership_questions=answered_questions&orderby=chronological&previously_removed_members=false&rules_agreement=no_response_to_rules_agreement&saved_filter=&suggested=false`
		);

		// Check if there are any member requests
		if ((await page.getByText(`We couldn't find any people for this search`).count()) > 0) {
			console.log('No requests found');
			return;
		}

		if ((await page.getByText('No pending members').count()) > 0) {
			console.log('No pending members');
			return;
		}

		const lists = await page.getByRole('list');
		const listsCount = await lists.count();
		console.log('Lists Count: ', listsCount);

		for (let i = 0; i < listsCount; i++) {
			const list = lists.nth(i);

			// Look for a home link. If it exists, skip this list.
			const homeLink = list.locator('a[href="/"]');
			console.log('Home Links: ', await homeLink.count());
			if ((await homeLink.count()) > 0) {
				console.log('Home link found, skipping...');
				continue;
			}

			const memberCard = list.locator('xpath=ancestor::div[1]');

			console.log('--------------------------------');
			// Find the closest parent article element and then look for the name link within it
			const name = await memberCard.locator('svg').getAttribute('aria-label');
			console.log('Name: ', name);

			await memberCard.getByRole('button').last().click();
			await page.getByText('Decline with feedback').click();
			await page.getByRole('radio', { name: 'Did not agree to group rules' }).click();
			await page.getByRole('textbox', { name: 'Write feedback' }).click();
			await page.keyboard.type(REJECT_TEXT);
			await page.getByRole('button', { name: 'Decline' }).click();
			await page.waitForTimeout(3000);
			tookAction = true;
			break;
		}
	} while (tookAction);

	await page.close();
};
