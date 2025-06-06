import type { ConfigOptions, ResourceType, SignApiOptions } from "cloudinary";
import { Readable } from "node:stream";
import { SharpOptions } from "sharp";

export type ModuleOptions = ConfigOptions;

/**
 * Object containing file metadata and access information.
 */
export interface IFile {
	/**
	 * Name of the form field associated with this file.
	 */
	fieldname: string;
	/**
	 * Name of the file on the uploader's computer.
	 */
	originalname: string;
	/**
	 * Value of the `Content-Transfer-Encoding` header for this file.
	 * @deprecated since July 2015
	 * @see RFC 7578, Section 4.7
	 */
	encoding: string;
	/**
	 * Value of the `Content-Type` header for this file.
	 */
	mimetype: string;
	/**
	 * Size of the file in bytes.
	 */
	size: number;
	/**
	 * A readable stream of this file. Only available to the `_handleFile`
	 * callback for custom `StorageEngine`s.
	 */
	stream: Readable;
	/**
	 * `DiskStorage` only: Directory to which this file has been uploaded.
	 */
	destination: string;
	/**
	 * `DiskStorage` only: Name of this file within `destination`.
	 */
	filename: string;
	/**
	 * `DiskStorage` only: Full path to the uploaded file.
	 */
	path: string;
	/**
	 * `MemoryStorage` only: A Buffer containing the entire file.
	 */
	buffer: Buffer;
}

export interface SharpInputOptions {
	width?: number;
	height?: number;
	options?: SharpOptions;
}

export interface SignedUploadUrlOptions extends SignApiOptions {
	public_id: string;
	resource_type: ResourceType;
	folder?: string;
	eager?: string;
}
