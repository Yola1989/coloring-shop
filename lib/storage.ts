import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// Works with any S3-compatible provider: Cloudflare R2, MinIO, AWS S3, etc.
// Required env vars:
//   S3_ENDPOINT      - e.g. https://<accountid>.r2.cloudflarestorage.com
//   S3_REGION        - "auto" for R2, or an AWS region like "us-east-1"
//   S3_ACCESS_KEY_ID
//   S3_SECRET_ACCESS_KEY
//   S3_BUCKET
//   S3_PUBLIC_URL    - public base URL the uploaded files are served from,
//                      e.g. https://pub-xxxx.r2.dev or your own CDN domain

function getEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} env var is not set`);
  return value;
}

export function getS3Client() {
  return new S3Client({
    region: process.env.S3_REGION || "auto",
    endpoint: getEnv("S3_ENDPOINT"),
    credentials: {
      accessKeyId: getEnv("S3_ACCESS_KEY_ID"),
      secretAccessKey: getEnv("S3_SECRET_ACCESS_KEY"),
    },
  });
}

export async function uploadFile(key: string, file: File): Promise<string> {
  const client = getS3Client();
  const bucket = getEnv("S3_BUCKET");
  const publicUrl = getEnv("S3_PUBLIC_URL").replace(/\/$/, "");

  const buffer = Buffer.from(await file.arrayBuffer());

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
    })
  );

  return `${publicUrl}/${key}`;
}

export async function deleteFile(key: string) {
  const client = getS3Client();
  const bucket = getEnv("S3_BUCKET");

  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
