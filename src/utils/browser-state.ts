import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Browser, BrowserContext } from '@playwright/test';

const { AWS_BUCKET_NAME, AWS_REGION } = process.env;
const STATE_KEY = 'browser-state.json';

if (!AWS_BUCKET_NAME) {
	throw new Error('AWS_BUCKET_NAME environment variable must be set');
}

const s3Client = new S3Client({ region: AWS_REGION });

const loadStateFromS3 = async (): Promise<any | undefined> => {
	try {
		const response = await s3Client.send(
			new GetObjectCommand({
				Bucket: AWS_BUCKET_NAME,
				Key: STATE_KEY,
			})
		);

		const stateData = await response.Body?.transformToString();
		return stateData ? JSON.parse(stateData) : undefined;
	} catch (error: any) {
		if (error.name === 'NoSuchKey') {
			return undefined;
		}
		throw error;
	}
};

const saveStateToS3 = async (state: any): Promise<void> => {
	await s3Client.send(
		new PutObjectCommand({
			Bucket: AWS_BUCKET_NAME,
			Key: STATE_KEY,
			Body: JSON.stringify(state),
			ContentType: 'application/json',
		})
	);
};

export const createBrowserContextWithState = async (browser: Browser): Promise<BrowserContext> => {
	const savedState = await loadStateFromS3();
	return browser.newContext(savedState ? { storageState: savedState } : undefined);
};

export const saveBrowserState = async (context: BrowserContext): Promise<void> =>
	saveStateToS3(await context.storageState());
