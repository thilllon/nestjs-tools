import { Module, Scope } from '@nestjs/common';
import { SendgridModule } from 'nestjs-sendgrid';
import { AppController } from './app.controller';
// import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    SendgridModule.forRoot({
      apiKey: process.env.SENDGRID_API_KEY,
      isGlobal: true,
      scope: Scope.DEFAULT,
    }),

    /**
     * or, if you want to use the async version:
     */

    // SendgridModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     return {
    //       apiKey: configService.get('SENDGRID_API_KEY'),
    //       isGlobal: true,
    //       scope: Scope.DEFAULT,
    //     };
    //   },
    // }),
  ],
  controllers: [AppController],
})
export class AppModule {}
