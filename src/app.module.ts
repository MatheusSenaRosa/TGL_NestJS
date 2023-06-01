import { Module } from "@nestjs/common";
import {
  GamesModule,
  AuthModule,
  BetsModule,
  PrismaModule,
  UsersModule,
  MeModule,
  RolesModule,
} from "./modules";
import { APP_GUARD } from "@nestjs/core";
import { AccessTokenGuard } from "./guards";
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
  imports: [
    GamesModule,
    PrismaModule,
    UsersModule,
    BetsModule,
    AuthModule,
    MeModule,
    RolesModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.MAILER_HOST,
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASSWORD,
        },
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
