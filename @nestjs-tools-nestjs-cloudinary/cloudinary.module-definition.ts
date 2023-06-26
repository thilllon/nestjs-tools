import { ConfigurableModuleBuilder } from '@nestjs/common';

import { ModuleOptions } from './cloudinary.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = new ConfigurableModuleBuilder<ModuleOptions>()
  .setExtras(
    {
      isGlobal: true,
    },
    (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }),
  )
  .setClassMethodName('forRoot')
  .build();
