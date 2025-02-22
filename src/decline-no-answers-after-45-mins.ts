import { Browser, BrowserContext } from '@playwright/test';
import parseDuration from 'parse-duration';

export const declineNoAnswersAfter45Mins = async (browser: Browser, context: BrowserContext) => {
	const page = await context.newPage();
	let tookAction = false;

	do {
		tookAction = false;

		await page.goto(
			`https://www.facebook.com/groups/${process.env.GROUP_ID}/member-requests?joined_fb_recently=false&membership_questions=not_answered_questions&orderby=chronological&previously_removed_members=false&saved_filter=&suggested=false`
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

			const duration = await memberCard
				.locator('span abbr[aria-label$="ago"]')
				.first()
				.textContent();

			if (!duration) {
				console.log('Could not determine duration, skipping.');
				continue;
			}

			console.log('Duration Text: ', duration);
			let minutes = parseDuration(duration, 'm');

			if (minutes === null) {
				// Facebook gets fancy. Here's another one we care about:
				if (duration === 'about an hour ago') {
					minutes = 60;
				}
			}

			console.log('Duration parsed in minutes: ', minutes);

			if (minutes && minutes >= 45) {
				console.log('Duration is greater than 45 minutes, rejecting with text.');
				await memberCard.getByRole('button').last().click();
				await page.getByText('Decline with feedback').click();
				await page.getByRole('radio', { name: 'Issue with answer to questions' }).click();
				await page.getByRole('textbox', { name: 'Write feedback' }).click();
				await page.keyboard.type(
					'Hey there, thanks for your interest in the group. Please answer all questions in the questionnaire and we’ll be happy to review your request to join again.'
				);
				await page.getByRole('button', { name: 'Decline' }).click();
				await page.waitForTimeout(3000);
				tookAction = true;
				break;
			} else {
				console.log('Duration is less than 45 minutes, skipping.');
			}

			console.log();
			console.log('--------------------------------');
		}
	} while (tookAction);

	await page.close();
};
