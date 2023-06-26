import { Readable } from 'node:stream';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiOptions, UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

import { ISharpInputOptions, ModuleOptions, SignedUploadUrlOptions, UploadFile } from './cloudinary.interface';
import { MODULE_OPTIONS_TOKEN } from './cloudinary.module-definition';

@Injectable()
export class CloudinaryService {
  public readonly _cloudinary = cloudinary;

  constructor(@Inject(MODULE_OPTIONS_TOKEN) private readonly options: ModuleOptions) {
    this._cloudinary.config(options);
  }

  /**
   * It returns the cloudinary instance.
   * @returns The cloudinary instance.
   */
  get cloudinary() {
    return this._cloudinary;
  }

  ping() {
    cloudinary.api
      .ping()
      .then((res) => {
        Logger.log(`Cloudinary connection ${res.status}`);
      })
      .catch((err) => {
        Logger.warn('Cloudinary connection failed.');
        Logger.error(err.error);
      });
  }

  /**
   * It takes a file, uploads it to cloudinary, and returns a promise
   * @param {UploadFile} file - IFile - This is the file object that is passed to the uploadFile method.
   * @param {UploadApiOptions} [options] - This is the options object that you can pass to the
   * uploader.upload_stream method.
   * @param {ISharpInputOptions} [sharpOptions] - This is an object that contains the options for sharp.
   * @returns UploadApiResponse | UploadApiErrorResponse | PromiseLike<UploadApiResponse | UploadApiErrorResponse>
   */
  async uploadFile(
    file: UploadFile,
    options?: UploadApiOptions,
    sharpOptions?: ISharpInputOptions,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise(async (resolve, reject) => {
      cloudinary.api.ping;
      const upload = cloudinary.uploader.upload_stream(
        options,
        (
          error: any,
          result:
            | UploadApiResponse
            | UploadApiErrorResponse
            | PromiseLike<UploadApiResponse | UploadApiErrorResponse>
            | any,
        ) => {
          if (error) {
            Logger.error(error);
            return reject(error);
          } else {
            resolve(result);
          }
        },
      );

      const stream: Readable = new Readable();

      if (sharpOptions && file.mimetype.match(/^image/)) {
        const options = { width: 800, ...sharpOptions };
        const shrinkedImage = await sharp(file.buffer).resize(options).toBuffer();

        stream.push(shrinkedImage);
      } else {
        stream.push(file.buffer);
      }
      stream.push(null);

      stream.pipe(upload);
    });
  }

  /**
   * It returns a signed upload URL.
   * @see https://cloudinary.com/documentation/signatures#using_cloudinary_backend_sdks_to_generate_sha_authentication_signatures
   * @param {string} publicId - This is the public id of the file.(e.g. 'my_folder/my_file')
   * @param {ResourceType} resourceType - The type of the resource. See ./node_modules/cloudinary/types/index.d.ts
   * @param {SignedUploadUrlOptions} [options] - This is an object that contains the options for signing.
   * @returns string
   */
  async createSignedUploadUrl(options: SignedUploadUrlOptions, secret: string) {
    const url = `https://api.cloudinary.com/v1_1/${options.cloud_name}/${options.resource_type}/upload`;
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const signature = this._cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: options.folder,
        eager: options.eager,
        public_id: options.public_id,
      },
      secret,
    );

    return {
      url,
      timestamp,
      signature,
      ...options,
    };
  }
}
