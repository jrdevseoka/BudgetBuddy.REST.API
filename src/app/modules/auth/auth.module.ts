import { Module } from '@nestjs/common'
import { AuthController } from './controllers/auth.controller'
import { AuthService } from './services/auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from '@root/src/shared/models/user/user.entity'
import { EmailService } from '@root/src/app/modules/email/email.service'
import { PostmarkConfigureService } from '@root/src/config/postmark/postmark.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt/jwt.strategy'
import { UserService } from '../users/user.service'
import { RefreshTokenIdsStorage } from './jwt/refreshtoken-storage'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: {expiresIn: '1h'}
    }),
  ],
  controllers: [AuthController],
  exports: [AuthService],
  providers: [AuthService, EmailService, PostmarkConfigureService, JwtStrategy, UserService, RefreshTokenIdsStorage],
})
export class AuthModule {}
