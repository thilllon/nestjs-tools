import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiOptions,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import { Readable } from 'node:stream';
import * as sharp from 'sharp';
import {
  IFile,
  ModuleOptions,
  SharpInputOptions,
  SignedUploadUrlOptions,
} from './cloudinary.interface';
import { MODULE_OPTIONS_TOKEN } from './cloudinary.module-definition';

export const defaultCreateSignedUploadUrlOptions: Partial<SignedUploadUrlOptions> = {
  folder: undefined,
  eager: undefined,
};

@Injectable()
export class CloudinaryService {
  private logger = new Logger(CloudinaryService.name);
  public readonly cloudinary = cloudinary;

  constructor(@Inject(MODULE_OPTIONS_TOKEN) private readonly options: ModuleOptions) {
    this.cloudinary.config(options);
  }

  ping() {
    cloudinary.api
      .ping()
      .then((res) => {
        this.logger.log(`Cloudinary connection ${res.status}`);
      })
      .catch((err) => {
        this.logger.warn('Cloudinary connection failed.');
        this.logger.error(err.error);
      });
  }

  /**
   * It returns a signed upload URL.
   * @see https://cloudinary.com/documentation/signatures#using_cloudinary_backend_sdks_to_generate_sha_authentication_signatures
   * @param {string} publicId - This is the public id of the file.(e.g. 'my_folder/my_file')
   * @param {SignedUploadUrlOptions} [options]
   * @returns string
   */
  async createSignedUploadUrl(options: SignedUploadUrlOptions, apiSecret?: string) {
    options = { ...defaultCreateSignedUploadUrlOptions, ...options };
    const url = `https://api.cloudinary.com/v1_1/${this.options.cloud_name}/${options.resource_type}/upload`;
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = this.cloudinary.utils.api_sign_request(
      {
        public_id: options.public_id,
        timestamp,
        folder: options.folder,
        eager: options.eager,
      },
      apiSecret ?? this.options.api_secret ?? '',
    );

    return {
      url,
      timestamp,
      signature,
      api_key: this.options.api_key,
      ...options,
    };
  }

  /**
   * It takes a file, uploads it to cloudinary, and returns a promise
   * @param {IFile} file - IFile - This is the file object that is passed to the uploadFile method.
   * @param {UploadApiOptions} [options] - This is the options object that you can pass to the
   * uploader.upload_stream method.
   * @param {SharpInputOptions} [sharpOptions] - This is an object that contains the options for sharp.
   */
  async uploadFile(
    file: IFile,
    options?: UploadApiOptions,
    sharpOptions?: SharpInputOptions,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise(async (resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error) {
          this.logger.error(error);
          return reject(error);
        }
        if (result) {
          return resolve(result);
        }
      });
      const readableStream = new Readable();
      if (sharpOptions && file.mimetype.match(/^image/)) {
        const shrinkedImage = await sharp(file.buffer).resize(sharpOptions).toBuffer();
        readableStream.push(shrinkedImage);
      } else {
        readableStream.push(file.buffer);
      }
      readableStream.push(null);
      readableStream.pipe(upload);
    });
  }

  get instance() {
    return this.cloudinary;
  }
}
