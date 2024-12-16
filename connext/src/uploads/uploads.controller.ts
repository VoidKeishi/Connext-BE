import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('uploads')
@UseGuards(AuthGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const uploadResponse = await this.uploadsService.uploadFile(file);
    return uploadResponse;
  }

  @Post('delete')
  async deleteFile(@Body('fileName') fileName: string) {
    const deleteResponse = await this.uploadsService.deleteFile(fileName);
    return deleteResponse;
  }
}
