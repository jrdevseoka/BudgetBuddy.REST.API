import { Module } from '@nestjs/common'
import { CoreModule } from '../core/core..module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module'
import { AppConfigModule } from '../config/app.config.module'
import { EmailModule } from '@root/src/app/modules/email/email.module'
import { PostmarkModule } from '../config/postmark/postmark.module'
import { UserModule } from './modules/users/user.module'

@Module({
  imports: [
    AppConfigModule,
    CoreModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'mssql' | 'postgres'>('db.type'),
        host: configService.get<string>('db.host'),
        port: configService.get<number>('db.port'),
        username: configService.get<string>('db.user'),
        password: configService.get<string>('db.password'),
        database: configService.get<string>('db.name'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('db.synchronize'),
        extra: {
          trustServerCertificate: true,
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    EmailModule,
    PostmarkModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
