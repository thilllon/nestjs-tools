import {
	Controller,
	HttpStatus,
	INestApplication,
	Injectable,
	Module,
	OnModuleDestroy,
	Post,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as dotenv from "dotenv";
import * as path from "path";
import * as request from "supertest";
import { PubNubModule } from "./pubnub.module";
import { PubNubService } from "./pubnub.service";

dotenv.config({ path: path.join(__dirname, "../../.env.test") });

@Injectable()
class FooService {
	channel = "chats_inbox.user_12341234";

	constructor(private readonly pubnubService: PubNubService) {
		pubnubService.subscribe({
			channels: [this.channel],
		});

		pubnubService.addListener({
			message: (message) => {
				console.log("Received message:", message);
			},
		});
	}

	async greet() {
		return this.pubnubService.publish({
			channel: this.channel,
			message: {
				title: "greeting",
				description: "This is my first message!",
			},
		});
	}
}

@Controller("/foo")
class FooController {
	constructor(private readonly fooService: FooService) {}

	@Post("/greet")
	greet() {
		return this.fooService.greet();
	}
}

@Module({
	imports: [
		PubNubModule.registerAsync({
			inject: [],
			useFactory: () => {
				return {
					userId: "test_nestjs_app",
					publishKey: process.env.PUBNUB_PUBLISH_KEY ?? "",
					subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY ?? "",
					secretKey: process.env.PUBNUB_SECRET_KEY ?? "",
				};
			},
		}),
	],
	providers: [FooService],
	controllers: [FooController],
})
class FooModule implements OnModuleDestroy {
	constructor(private readonly pubnubService: PubNubService) {}

	onModuleDestroy() {
		this.pubnubService.unsubscribeAll();
	}
}

jest.setTimeout(30000);

describe("PubnubService", () => {
	let app: INestApplication;
	let pubnubService: PubNubService;
	let fooService: FooService;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [FooModule],
		}).compile();
		app = await module.createNestApplication();
		await app.init();
		pubnubService = module.get(PubNubService);
		fooService = module.get(FooService);
	});

	afterAll(async () => {
		await app.close();
	});

	it("subscribe and publish", async () => {
		const result = await fooService.greet();
		setTimeout(() => {
			expect(result).toStrictEqual(
				expect.objectContaining({
					timetoken: expect.any(String),
				}),
			);
		}, 5000);
	});

	it("greet", async () => {
		await request(app.getHttpServer())
			.post("/foo/greet")
			.expect(HttpStatus.CREATED)
			.expect((res) =>
				expect(res.body).toStrictEqual(
					expect.objectContaining({
						timetoken: expect.any(String),
					}),
				),
			);
	});
});
