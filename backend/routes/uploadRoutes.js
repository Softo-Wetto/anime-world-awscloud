const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

// Initialize the S3 and SQS clients (No need to specify access keys, as IAM roles handle it)
const s3 = new AWS.S3({ region: 'ap-southeast-2' });
const sqs = new AWS.SQS({ region: 'ap-southeast-2' });

// Get presigned URL for upload
router.get('/presigned-url', async (req, res) => {
  const { fileName, fileType } = req.query;

  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
  };

  try {
    // Generate a presigned URL for uploading to S3
    const presignedUrl = await s3.getSignedUrlPromise('putObject', s3Params);
    const publicUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

    // Send a message to SQS for further processing
    const sqsMessageParams = {
      QueueUrl: process.env.SQS_QUEUE_URL,
      MessageBody: JSON.stringify({
        bucket: process.env.S3_BUCKET_NAME,
        key: fileName,
        fileType: fileType,
        publicUrl: publicUrl,
      }),
    };

    await sqs.sendMessage(sqsMessageParams).promise();
    console.log(`Message sent to SQS for file: ${fileName}`);

    res.json({ presignedUrl, publicUrl });
  } catch (err) {
    console.error('Error generating presigned URL or sending message to SQS:', err);
    res.status(500).json({ message: 'Server error generating presigned URL or sending message to SQS' });
  }
});

// Get presigned URL for download
router.get('/download-url/:fileName', async (req, res) => {
  const { fileName } = req.params;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,  // File name to download
    Expires: 60,  // URL expiry time in seconds
  };

  try {
    const presignedUrl = await s3.getSignedUrlPromise('getObject', params);
    // Use CloudFront distribution URL instead of S3 bucket URL
    const cloudFrontUrl = `https://${process.env.CLOUDFRONT_DOMAIN_NAME}/${fileName}`;
    res.json({ presignedUrl, cloudFrontUrl });
  } catch (err) {
    console.error('Error generating download URL:', err);
    res.status(500).json({ message: 'Server error generating download URL' });
  }
});

// List all objects in the S3 bucket
router.get('/list-objects', async (req, res) => {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
    };
  
    try {
      const data = await s3.listObjectsV2(params).promise();
      const objects = data.Contents.map((object) => {
        return {
          key: object.Key,
          // Use CloudFront distribution URL for all listed files
          url: `https://${process.env.CLOUDFRONT_DOMAIN_NAME}/${object.Key}`,
        };
      });
      res.json(objects);
    } catch (err) {
      console.error('Error listing S3 objects:', err);
      res.status(500).json({ message: 'Server error fetching S3 objects' });
    }
  });

module.exports = router;