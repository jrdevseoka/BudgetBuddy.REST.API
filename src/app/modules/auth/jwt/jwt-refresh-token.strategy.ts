import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Logger } from '@nestjs/common'
import { UserService } from '../../users/user.service'
import { JwtPayload } from './jwt-payload.interface'
import { User } from '@root/src/shared/models/user/user.entity'

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  private readonly logger = new Logger(JwtRefreshTokenStrategy.name)

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret',
    })
    this.logger.warn('JwtRefreshTokenStrategy initialized')
  }

  async validate(payload: JwtPayload): Promise<User> {
    this.logger.warn(`Payload: ${JSON.stringify(payload)}`)
    const user = await this.usersService.getUserById(payload.sub)
    if (!user) {
      this.logger.error('User not found')
      throw new UnauthorizedException()
    }
    return user
  }
}