import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomeStringGenerator } from 'src/common/utils/random-string.util';

@Injectable()
export class UploadsService {
  private BUCKET_NAME: string;
  private BUCKET_REGION: string;
  private ACCESS_KEY: string;
  private SECRET_ACCESS_KEY: string;
  private S3: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.BUCKET_NAME = configService.get<string>('BUCKET_NAME');
    this.BUCKET_REGION = configService.get<string>('BUCKET_REGION');
    this.ACCESS_KEY = configService.get<string>('ACCESS_KEY');
    this.SECRET_ACCESS_KEY = configService.get<string>('SECRET_ACCESS_KEY');
    this.S3 = new S3Client({
      credentials: {
        accessKeyId: this.ACCESS_KEY,
        secretAccessKey: this.SECRET_ACCESS_KEY,
      },
      region: this.BUCKET_REGION,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const fileName = randomeStringGenerator();
    const params = {
      Bucket: this.BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    const command = new PutObjectCommand(params);
    await this.S3.send(command);

    const getObjectParams = {
      Bucket: this.BUCKET_NAME,
      Key: fileName,
    };
    const getCommand = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(this.S3, getCommand, { expiresIn: 3600 });
    return {
      fileName: fileName,
      fileUrl: url,
    };
  }

  async deleteFile(filename: string) {
    const params = {
      Bucket: this.BUCKET_NAME,
      Key: filename,
    };
    const command = new DeleteObjectCommand(params);
    const response = await this.S3.send(command);
    return response;
  }
}
