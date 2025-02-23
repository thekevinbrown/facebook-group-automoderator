import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export const attach = ({ construct }: { construct: Construct }) => {
	const bucket = new Bucket(construct, 'ModeratorStateStorage', {
		bucketName: 'facebook-group-moderator-state-storage',
	});

	return { bucket };
};
