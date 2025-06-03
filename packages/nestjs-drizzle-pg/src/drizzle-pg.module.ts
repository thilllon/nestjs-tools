import { Module } from "@nestjs/common";
import { ConfigurableModuleClass } from "./drizzle-pg.module-definition";
import { DrizzlePgService } from "./drizzle-pg.service";

@Module({
	imports: [ConfigurableModuleClass],
	providers: [DrizzlePgService],
	exports: [DrizzlePgService],
})
export class DrizzlePgModule extends ConfigurableModuleClass {}
