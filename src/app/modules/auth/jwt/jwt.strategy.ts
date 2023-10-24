import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { UserService } from '../../users/user.service'
import { User } from '@root/src/shared/models/user/user.entity'
import { JwtPayload } from './jwt-payload.interface'
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name)
  constructor(private readonly usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret',
    })
    this.logger.warn('JwtStrategy initialized')
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