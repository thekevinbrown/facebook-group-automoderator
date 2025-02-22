import { declineNoAnswersAfterAnHour } from './decline-no-answers-after-an-hour';

export const handler = async (): Promise<void> => {
	try {
		await declineNoAnswersAfterAnHour();
	} catch (error) {
		console.error('Error in Lambda handler: ', error);
		throw error;
	}
};
