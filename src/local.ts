import 'dotenv/config';
import { declineNoAnswersAfter45Mins } from './decline-no-answers-after-45-mins';
import { login } from './log-in';

const go = async () => {
	// await login();
	await declineNoAnswersAfter45Mins();
};

go();
