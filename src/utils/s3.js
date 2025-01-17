import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.REACT_APP_AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadToS3 = async (file, folder = "inventory") => {
  try {
    const key = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    
    // Convert file to binary data
    const fileData = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });

    const command = new PutObjectCommand({
      Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
      Key: key,
      Body: new Uint8Array(fileData),
      ContentType: file.type,
    });

    await s3Client.send(command);
    return `https://${process.env.REACT_APP_AWS_BUCKET_NAME}.s3.${process.env.REACT_APP_AWS_BUCKET_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
};

export const deleteFromS3 = async (url) => {
  try {
    // Extract key from URL
    const key = url.split('.amazonaws.com/')[1];
    
    const command = new DeleteObjectCommand({
      Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting from S3:", error);
    throw error;
  }
}; 