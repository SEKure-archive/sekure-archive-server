import * as aws from 'aws-sdk';

/** Validates the supplied AWS credentials. */
export function validate(
    region: string, accessKeyID: string, secretAccessKey: string
): Promise<boolean> {
    if (process.env.SKIP_AWS_VALIDATE) {
        return Promise.resolve(true);
    } else {
        let s3 = new aws.S3({ region: region, accessKeyId: accessKeyID, secretAccessKey });
        return s3.listBuckets().promise().then(_ => true, _ => false)
    }
}
