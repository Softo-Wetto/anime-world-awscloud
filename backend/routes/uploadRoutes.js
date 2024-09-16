const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

// Initialize the S3 client (No need to specify access keys, as IAM roles handle it)
const s3 = new AWS.S3({
  region: 'ap-southeast-2',
});

// Get presigned URL for upload
router.get('/presigned-url', async (req, res) => {
  const { fileName, fileType } = req.query; // Get fileName and fileType from the query

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,  // File name being uploaded
    Expires: 60,  // URL expiry time in seconds
    ContentType: fileType,  // Dynamically set the content type based on the file type
  };

  try {
    const presignedUrl = await s3.getSignedUrlPromise('putObject', params);
    const publicUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
    res.json({ presignedUrl, publicUrl });
  } catch (err) {
    console.error('Error generating presigned URL:', err);
    res.status(500).json({ message: 'Server error generating presigned URL' });
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
    res.json({ presignedUrl });
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
          url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${object.Key}`,
        };
      });
      res.json(objects);
    } catch (err) {
      console.error('Error listing S3 objects:', err);
      res.status(500).json({ message: 'Server error fetching S3 objects' });
    }
  });

module.exports = router;