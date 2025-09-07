import { BadRequestException, Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class FileUploadService {
  private readonly s3 = new S3Client({ region: process.env.AWS_REGION });

  async upload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('no file uploaded');
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('file is too large!');
    }
    return file
  }


  async uploadToS3(
    file: Express.Multer.File,
    opts?: { folder?: string; makePublic?: boolean },
  ) {
    const bucket = process.env.AWS_S3_BUCKET!;
    const folder = (opts?.folder ?? 'templates').replace(/\/+$/, '');
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^\w.-]+/g, '_');
    const key = `${folder}/${timestamp}-${safeName}`;

    const put = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype || 'application/octet-stream',
      // ServerSideEncryption: 'AES256', // opcional
      ACL: opts?.makePublic ? 'public-read' : undefined,
    });

    await this.s3.send(put);

    // URL pública si usas ACL public-read o CDN; si no, genera signed URL on-demand.
    const cdn = process.env.CDN_BASE_URL;
    const url = opts?.makePublic && cdn
      ? `${cdn}/${key}`
      : opts?.makePublic
        ? `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
        : undefined;

    // link temporal (si no es público)
    const signedUrl = url
      ? undefined
      : await getSignedUrl(this.s3, new PutObjectCommand({
        Bucket: bucket, Key: key, Body: undefined,
      }), { expiresIn: 60 }); // cambia por GetObjectCommand si quieres lectura temporal

    return { bucket, key, url, signedUrl, size: file.size, mimetype: file.mimetype, originalname: file.originalname };
  }
}