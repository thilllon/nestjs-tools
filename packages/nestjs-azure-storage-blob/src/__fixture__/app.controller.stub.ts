import { Controller, Get, NotFoundException, Query } from "@nestjs/common";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import { AzureStorageBlobService } from "..";

@Controller()
export class AppController {
	constructor(private readonly storageBlobService: AzureStorageBlobService) {}

	@Get("/")
	async getSas(
		@Query("containerName") containerName = process.env
			.NESTJS_STORAGE_BLOB_CONTAINER,
		@Query("fileName") fileName = "image.jpg",
	) {
		const expiresOn = new Date(Date.now() + 3600 * 1000);
		const accountSas = await this.storageBlobService.getAccountSasUrl();
		const containerSas = await this.storageBlobService.getContainerSasUrl(
			containerName,
			{ add: true, read: true },
			{ expiresOn },
		);
		const blobSas = await this.storageBlobService.getBlockBlobSasUrl(
			containerName,
			fileName,
			{ add: true, create: true, read: true, delete: true, write: true },
			{ expiresOn },
		);
		return { accountSas, containerSas, blobSas };
	}

	@Get("/upload")
	async upload(
		@Query("containerName") containerName = process.env
			.NESTJS_STORAGE_BLOB_CONTAINER,
		@Query("fileName") fileName = "image.jpg",
	) {
		const expiresOn = new Date(Date.now() + 3600 * 1000);
		const blobSas = await this.storageBlobService.getBlockBlobSasUrl(
			containerName,
			fileName,
			{ add: true, create: true, read: true, delete: true, write: true },
			{ expiresOn },
		);
		const buffer = fs.readFileSync(
			path.join(process.cwd(), "assets", fileName),
		);
		if (buffer) {
			throw new NotFoundException("file not found");
		}
		const response = await axios.put(blobSas.sasUrl, buffer, {
			headers: { ...blobSas.headers },
		});
		return { blobSas, status: response.status };
	}
}
