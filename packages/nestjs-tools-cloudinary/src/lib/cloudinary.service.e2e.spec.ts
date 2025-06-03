import {
	Controller,
	HttpStatus,
	INestApplication,
	Injectable,
	Module,
	Post,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Test } from "@nestjs/testing";
import * as dotenv from "dotenv";
import * as path from "path";
import * as request from "supertest";
import { IFile } from "./cloudinary.interface";
import { CloudinaryModule } from "./cloudinary.module";
import { CloudinaryService } from "./cloudinary.service";

dotenv.config({ path: path.join(__dirname, "../../.env.test") });

jest.setTimeout(30000);

@Injectable()
class FooService {
	constructor(private readonly cloudinaryService: CloudinaryService) {}

	async upload(file: IFile) {
		return this.cloudinaryService.uploadFile(file);
	}
}

@Controller("/foo")
class FooController {
	constructor(private readonly fooService: FooService) {}

	@Post("/upload")
	@UseInterceptors(FileInterceptor("file"))
	async upload(@UploadedFile() file: IFile) {
		return this.fooService.upload(file);
	}
}

@Module({
	imports: [
		CloudinaryModule.register({
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET,
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		}),
	],
	providers: [FooService],
	controllers: [FooController],
})
class FooModule {}

describe("CloudinaryService (E2E)", () => {
	let app: INestApplication;
	let service: CloudinaryService;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [FooModule],
		}).compile();

		app = module.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	it("upload", async () => {
		await request(app.getHttpServer())
			.post("/foo/upload")
			.attach("file", path.join(__dirname, "../__fixtures__/image.jpg"))
			.then((res) => {
				expect(res.status).toBe(HttpStatus.CREATED);
				expect(res.body).toEqual({
					api_key: process.env.CLOUDINARY_API_KEY,
					asset_id: expect.any(String),
					bytes: 210286,
					created_at: expect.any(String),
					etag: expect.any(String),
					folder: "",
					format: "jpg",
					width: 794,
					height: 1000,
					original_filename: "file",
					placeholder: false,
					public_id: expect.any(String),
					resource_type: "image",
					secure_url: expect.any(String),
					signature: expect.any(String),
					tags: [],
					type: "upload",
					url: expect.any(String),
					version: expect.any(Number),
					version_id: expect.any(String),
				});
			});
	});
});
