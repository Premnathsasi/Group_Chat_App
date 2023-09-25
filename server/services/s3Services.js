const AWS = require("aws-sdk");

exports.uploadToS3 = async (buffer, fileName, mimetype) => {
  const bucketName = process.env.BUCKET_NAME;
  const userKey = process.env.IAM_USER_ACCESS_KEY;
  const secretKey = process.env.IAM_USER_SECRET_KEY;

  let s3 = new AWS.S3({
    accessKeyId: userKey,
    secretAccessKey: secretKey,
  });

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: buffer,
    ContentType: mimetype,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result.Location);
      }
    });
  });
};
