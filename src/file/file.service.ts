import { BadRequestException, Injectable } from '@nestjs/common';
import { FileResponse } from './file.interface';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class FileService {
  constructor(private cloudinary: CloudinaryService) {}
  async uploadImageToCloudinary(file: Express.Multer.File) {
    return await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
  }

  // async saveFiles(
  //   files: Express.Multer.File[],
  //   folder = 'default',
  // ): Promise<FileResponse[]> {
  //   const uploadFolder = `${path}/uploads/${folder}`;
  //   await ensureDir(uploadFolder);
  //
  //   const res: FileResponse[] = await Promise.all(
  //     files.map(async (file) => {
  //       await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
  //       return {
  //         url: `/uploads/${folder}/${file.originalname}`,
  //         name: file.originalname,
  //       };
  //     }),
  //   );
  //
  //   return res;
  // }
}
