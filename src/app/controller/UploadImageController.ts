import aws from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const region = "sa-east-1";
const bucketName = "topsun-set";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

export async function generateUploadURL() {
  const params = {
    Bucket: bucketName,
    Key: `${uuidv4()}.jpg`,
    Expires: 60,
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);

  return uploadURL;
}
