import * as aws from 'aws-sdk';

/** Posts the supplied file to the download queue. */
export function post(directory: string, file: string, s3: string): Promise<string> {
    if (process.env.SKIP_AWS) {
        return Promise.resolve('message_identifier');
    } else {
        return new Promise((resolve, reject) => {
            let sqs = new aws.SQS({ region: 'us-east-1' });
            let params = {
                QueueUrl: 'https://sqs.us-east-1.amazonaws.com/373886653085/download',
                MessageBody: 'Download',
                MessageAttributes: {
                    directory: { DataType: 'string', Value: directory },
                    filename: { DataType: 'string', Value: file },
                    s3path: { DataType: 'string', Value: s3 },
                },
            };
            sqs.sendMessage(params, (error, data) => {
                error ? reject(error) : resolve(data.MessageId);
            });
        });
    }
}

/** Validates the supplied AWS credentials. */
export function validate(
    region: string, accessKeyID: string, secretAccessKey: string
): Promise<boolean> {
    if (process.env.SKIP_AWS) {
        return Promise.resolve(true);
    } else {
        let s3 = new aws.S3({ region: region, accessKeyId: accessKeyID, secretAccessKey });
        return s3.listBuckets().promise().then(_ => true, _ => false)
    }
}
