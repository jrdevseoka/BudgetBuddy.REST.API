import { UserRepository } from '@root/src/database/repositories/user.repository'
import { CreateUserDto } from '@root/src/shared/models/user/dto/create-user.dto'
import { User } from '@root/src/shared/models/user/user.entity'
import * as bcrypt from 'bcrypt'
import * as uuid from 'uuid'
import * as postmark from 'postmark'
import { EmailService } from '../email/email.service'
import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common'
import { AuthResponse } from '@root/src/shared/models/res/auth.response'
import { ConfirmUserDto } from '@root/src/shared/models/user/dto/confirm-user.dto'
export class UserService {
  private User: User
  private Postmark: postmark.ServerClient
  private TemplateMessage: postmark.Models.TemplatedMessage
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {
    this.User = new User()
    this.Postmark = new postmark.ServerClient('af288866-edec-46d7-843e-479dff8234cc')
  }
  public async create(_user: CreateUserDto, url: string): Promise<AuthResponse<User>> {
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(_user.Password, salt)
    if (passwordHash) {
      this.User = this.mapDtoToUser(_user, passwordHash)
      const user = await this.userRepository.addorUpdate(this.User)
      if (user) {
        const token = await this.confirmationToken()
        if (token) {
          url += `?token=${encodeURIComponent(token)}&code=${encodeURIComponent(user.Link)}`
          const emailResponse = await this.emailService.sendEmailWithTemplate(user, url)
          if (emailResponse.Message === 'OK') {
            user.EmailTokenHash = token
            const _updateUser = await this.userRepository.addorUpdate(user)
            if (_updateUser.EmailTokenHash == token) {
              const response: AuthResponse<User> = {
                Message: 'User account was successfully registered',
                StatusCode: HttpStatus.CREATED,
                Succeeded: true,
              }
              return response
            }
          }
        }
      }
    }
    await this.userRepository.deleteUser(this.User).then(() => {
      throw new HttpException('An error occured while creating a user', HttpStatus.BAD_REQUEST)
    })
  }
  async userConfirmation(_user: ConfirmUserDto) {
    const date = new Date()
    const user = await this.userRepository.findOne({ where: { Link: _user.Id } })
    const hasTokenExpired: boolean = user.TokenExpiry.getHours() - date.getHours() > 8
    if (user) {
      if (hasTokenExpired) {
        const isTokenValid: boolean = user.EmailTokenHash === _user.code
        if (isTokenValid) {
          await this.userRepository.update(user.Link, { EmailConfirmed: 1 })
          const response: AuthResponse<User> = {
            Message: `Account with an email ${user.Email} was successfully confirmed.`,
            StatusCode: HttpStatus.OK,
            Succeeded: true,
            Data: user,
          }
          return response
        }
        throw new UnauthorizedException('Invalid user account confirmation token')
      }
      throw new HttpException(
        'User confirmation token has expired, request a new token to proceed',
        HttpStatus.BAD_REQUEST,
      )
    }
    throw new UnauthorizedException(
      `User with ${user.Email} email address does not exist, proceed to create a new account`,
    )
  }
  private async confirmationToken() {
    return bcrypt.hashSync(uuid.v4(), bcrypt.genSaltSync())
  }
  private mapDtoToUser(_user: CreateUserDto, passwordHash: string): User {
    this.User.Name = _user.Name
    this.User.Email = _user.Email
    this.User.PasswordHash = passwordHash
    this.User.SeqNo = 0
    return this.User
  }
  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { Email: email } })
  }
  async getUserById(id: string) {
    return await this.userRepository.findOne({ where: { Link: id } })
  }
  async getUsers() {
    return await this.userRepository.find({})
  }
  async deleteUser(user: User) {
    return await this.userRepository.remove(user)
  }
  private returnSuccessAuthResponse(): AuthResponse<unknown> {
    const response: AuthResponse<unknown> = {
      Succeeded: true,
      Message: 'User account was created sucessfully.',
      StatusCode: HttpStatus.OK,
    }
    return response
  }
}
