import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '@root/src/shared/models/user/user.entity'
import { AuthResponse } from '@root/src/shared/models/res/auth.response'
import { EmailService } from '../../email/email.service'
import { LoginDto } from '@root/src/shared/models/user/dto/login-confirm.dto'
import { UserService } from '../../users/user.service'
import { JwtService } from '@nestjs/jwt'
import { RefreshTokenIdsStorage } from '../jwt/refreshtoken-storage'
import { JwtPayload } from '../jwt/jwt-payload.interface'
import { Profile } from '@root/src/shared/models/user/dto/profile.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenStorage: RefreshTokenIdsStorage,
  ) {
    
  }

  async signIn(user: LoginDto): Promise<AuthResponse<User>> {
    const results = await this.validateUser(user)
    if (results.Succeeded) {
      const credentials: JwtPayload = { sub: results.Data.Id, username: results.Data.Email }
      const accessToken = await this.jwtService.signAsync(credentials)
      const refreshToken = await this.jwtService.signAsync(credentials, {
        expiresIn: '1d',
      })
      await this.refreshTokenStorage.insert(results.Data.Id, refreshToken)
      const response: AuthResponse<User> = {
        Message: `${credentials.username} account has successfully login.`,
        Succeeded: true,
        AccessToken: accessToken,
        RefreshToken: refreshToken,
        StatusCode: HttpStatus.OK
      }
      return response
    }
    throw new UnauthorizedException('Invalid user credentials')
  }
  async invalidateToken(accessToken: string): Promise<void> {
    try {
      const decoded = await this.jwtService.verifyAsync(accessToken)
      await this.refreshTokenStorage.invalidate(decoded.sub)
    } catch (error) {
      throw new UnauthorizedException('Invalid token access')
    }
  }
  async validateUser(_user: LoginDto): Promise<AuthResponse<Profile>> {
    const user = await this.userRepository.getUserByEmail(_user.username)
    const isPasswordValidated: boolean = await user.validatePassword(_user.password)
    if (user && isPasswordValidated) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { PasswordHash, EmailTokenHash, ...result } = user
      const profile: Profile = { Id: result.Link, Email: result.Email }
      const response: AuthResponse<Profile> = {
        Succeeded: true,
        StatusCode: HttpStatus.OK,
        Message: `User's password with an id ${result.Link} was validated`,
        Data: profile,
      }
      return response
    }
  }
  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ access_token: string }> {
    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken)
      await this.refreshTokenStorage.validate(decoded.sub, refreshToken)
      const payload = { sub: decoded.sub, username: decoded.username }
      const accessToken = await this.jwtService.signAsync(payload)
      return { access_token: accessToken }
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }

 
}
