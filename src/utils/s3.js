import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// Validate AWS credentials
const validateAWSCredentials = () => {
  const requiredEnvVars = {
    'REACT_APP_AWS_BUCKET_NAME': process.env.REACT_APP_AWS_BUCKET_NAME,
    'REACT_APP_AWS_BUCKET_REGION': process.env.REACT_APP_AWS_BUCKET_REGION,
    'REACT_APP_AWS_ACCESS_KEY_ID': process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    'REACT_APP_AWS_SECRET_ACCESS_KEY': process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(`Missing required AWS environment variables: ${missingVars.join(', ')}. Please check your .env file.`);
  }
};

// Initialize S3 client with error handling
const createS3Client = () => {
  try {
    validateAWSCredentials();
    
    return new S3Client({
      region: process.env.REACT_APP_AWS_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      },
    });
  } catch (error) {
    console.error('Failed to initialize S3 client:', error);
    throw new Error('Failed to initialize S3 client. Please check your AWS credentials.');
  }
};

const s3Client = createS3Client();

export const uploadToS3 = async (file, folder = "inventory") => {
  try {
    if (!file) {
      throw new Error('No file provided for upload');
    }

    // Validate file size (e.g., 10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds 10MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
    }

    const key = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    
    // Convert file to binary data with error handling
    const fileData = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(new Error(`Failed to read file: ${error.message}`));
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
    // Enhance error messages for specific AWS errors
    if (error.name === 'CredentialsProviderError') {
      throw new Error('Invalid AWS credentials. Please check your AWS access keys.');
    } else if (error.name === 'NoSuchBucket') {
      throw new Error(`S3 bucket '${process.env.REACT_APP_AWS_BUCKET_NAME}' not found. Please check your bucket name.`);
    } else if (error.name === 'NetworkError') {
      throw new Error('Network error occurred. Please check your internet connection.');
    }

    console.error("Error uploading to S3:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

export const deleteFromS3 = async (url) => {
  try {
    if (!url) {
      throw new Error('No URL provided for deletion');
    }

    // Extract key from URL with error handling
    const urlParts = url.split('.amazonaws.com/');
    if (urlParts.length !== 2) {
      throw new Error('Invalid S3 URL format');
    }
    const key = urlParts[1];
    
    const command = new DeleteObjectCommand({
      Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    // Enhance error messages for specific AWS errors
    if (error.name === 'CredentialsProviderError') {
      throw new Error('Invalid AWS credentials. Please check your AWS access keys.');
    } else if (error.name === 'NoSuchBucket') {
      throw new Error(`S3 bucket '${process.env.REACT_APP_AWS_BUCKET_NAME}' not found. Please check your bucket name.`);
    } else if (error.name === 'NoSuchKey') {
      throw new Error('File not found in S3 bucket.');
    }

    console.error("Error deleting from S3:", error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}; 