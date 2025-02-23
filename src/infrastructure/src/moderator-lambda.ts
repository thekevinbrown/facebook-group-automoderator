import path from 'node:path';
import { Duration } from 'aws-cdk-lib';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

if (!process.env.GROUP_ID) throw new Error('GROUP_ID is not set in environment variables');

export const attach = ({ construct, bucket }: { construct: Construct; bucket: Bucket }) => {
	// Add the moderator lambda
	const moderator = new NodejsFunction(construct, 'Moderator', {
		functionName: 'facebook-group-moderator',
		handler: 'index.handler',
		runtime: Runtime.NODEJS_22_X,
		timeout: Duration.minutes(15),
		architecture: Architecture.ARM_64,
		memorySize: 1024,
		entry: path.resolve(__dirname, '..', '..', 'lambda.ts'),
		environment: {
			AWS_BUCKET_NAME: bucket.bucketName,
			GROUP_ID: process.env.GROUP_ID ?? '',
		},
		bundling: {
			target: 'node22',
			externalModules: ['@aws-sdk/*', 'fsevents', 'playwright-aws-lambda', 'playwright-core'],
			commandHooks: {
				beforeBundling(inputDir, outputDir) {
					return [];
				},
				beforeInstall(inputDir, outputDir) {
					return [];
				},
				afterBundling(inputDir, outputDir) {
					return [`npm i --prefix "${outputDir}" playwright-aws-lambda playwright-core`];
				},
			},
		},
	});

	// Allow it to access the bucket
	bucket.grantReadWrite(moderator);

	// Trigger it every 10 minutes
	new Rule(construct, 'ModeratorTrigger', {
		schedule: Schedule.rate(Duration.minutes(10)),
		targets: [new LambdaFunction(moderator)],
	});
};
