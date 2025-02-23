import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3Bucket from './s3-bucket';
import * as moderatorLambda from './moderator-lambda';

export class FacebookGroupModeratorStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		const { bucket } = s3Bucket.attach({
			construct: this,
		});

		moderatorLambda.attach({
			construct: this,
			bucket,
		});
	}
}
