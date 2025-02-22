import 'dotenv/config';
import { declineNoAnswersAfterAnHour } from './decline-no-answers-after-an-hour';
import { login } from './log-in';

const go = async () => {
	// await login();
	await declineNoAnswersAfterAnHour();
};

go();
