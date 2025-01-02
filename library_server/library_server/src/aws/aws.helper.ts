import multer, { FileFilterCallback } from "multer";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import path from "path";
import { Request } from "express";

dotenv.config();

// Cấu hình AWS
process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = "1";

AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});
const s3 = new AWS.S3();

const bucketName = process.env.S3_BUCKET_NAME as string;

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    checkFileType(file, cb);
  },
});

// Hàm kiểm tra loại file
function checkFileType(
  file: Express.Multer.File,
  cb: FileFilterCallback
): void {
  const fileTypes = /pdf|jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);
  console.log(file.originalname);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type!"));
  }
}

// Hàm lưu file lên S3
export const saveFile = async (file: Express.Multer.File): Promise<string> => {
  try {
    const filePath = `${Date.now().toString()}_${file.originalname}`;

    const paramsS3: AWS.S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: filePath,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const data = await s3.upload(paramsS3).promise();

    return data.Location;
  } catch (err) {
    throw new Error("Upload file to AWS S3 failed");
  }
};

// Hàm lưu file lên S3 với key
export const saveFileWithKey = async (
  file: Express.Multer.File,
  key: string
): Promise<string> => {
  try {
    const paramsS3: AWS.S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const data = await s3.upload(paramsS3).promise();

    return data.Location;
  } catch (err) {
    throw new Error("Upload file to AWS S3 failed");
  }
};

// Hàm đọc file PDF từ S3
export const readPdfFromS3 = async (
  keyName: string
): Promise<Buffer | undefined> => {
  try {
    const params: AWS.S3.GetObjectRequest = {
      Bucket: bucketName,
      Key: keyName,
    };
    const file = await s3.getObject(params).promise();
    return file.Body as Buffer;
  } catch (error) {
    console.error("Error reading PDF from S3:", error);
  }
};

// Hàm xóa file từ S3
export const deleteFileFromS3 = async (keyName: string): Promise<void> => {
  try {
    const params: AWS.S3.DeleteObjectRequest = {
      Bucket: bucketName,
      Key: keyName,
    };

    await s3.deleteObject(params).promise();
    console.log("File deleted successfully");
  } catch (error) {
    console.error("Error deleting file from S3:", error);
  }
};
