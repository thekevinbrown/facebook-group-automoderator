import { declineNoAnswersAfter45Mins } from './decline-no-answers-after-45-mins';

export const handler = async (): Promise<void> => {
	try {
		await declineNoAnswersAfter45Mins();
	} catch (error) {
		console.error('Error in Lambda handler: ', error);
		throw error;
	}
};
