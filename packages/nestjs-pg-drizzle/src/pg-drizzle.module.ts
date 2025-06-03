import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './pg-drizzle.module-definition';
import { DrizzleService } from './pg-drizzle.service';

@Module({
  imports: [ConfigurableModuleClass],
  providers: [DrizzleService],
  exports: [DrizzleService],
})
export class DrizzleModule extends ConfigurableModuleClass {}
