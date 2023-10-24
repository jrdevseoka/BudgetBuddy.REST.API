/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, Headers, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@shared/base/controllers/base.controller'
import { CreateUserDto } from '@root/src/shared/models/user/dto/create-user.dto'
import { AuthService } from '../services/auth.service'
import { Response, Request } from 'express'
import { AuthResponse } from '@root/src/shared/models/res/auth.response'

import { ConfirmUserDto } from '@root/src/shared/models/user/dto/confirm-user.dto'
import { LoginDto } from '@root/src/shared/models/user/dto/login-confirm.dto'
import { LocalAuthGuard } from '../guard/local-auth.guard'
import { UserService } from '../../users/user.service'
import { JwtService } from '@nestjs/jwt'
import { JwtRefreshTokenGuard } from '../guard/jwt-refreshtoken.guard'
import { JwtAuthGuard } from '../guard/auth.guard'
import { User } from '@root/src/shared/models/user/user.entity'
@ApiTags('auth')
@Controller()
export class AuthController extends BaseController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    super()
  }

  @Post('sign-up')
  @ApiOperation({ operationId: 'sign-up' })
  async register(@Body() user: CreateUserDto, @Res() res: Response, @Req() request: Request) {
    try {
      const response = await this.userService.create(user, this.getBaseUri(request))
      return response
    } catch (err) {
      const message: string = 'An an error occured while creating user.'
      const code = HttpStatus.BAD_REQUEST
      const error = this.mapErrorToAuthResponse(err, message, code)
      return error
    }
  }

  @Get('confirm')
  @ApiOperation({ operationId: 'confirm' })
  async confirm(@Query() _user: ConfirmUserDto): Promise<AuthResponse<User>> {
    try {
      const response = await this.userService.userConfirmation(_user)
      return response
    } catch (error) {
      const message: string = 'An an error occured while creating user.'
      const code = HttpStatus.BAD_REQUEST
      const err = this.mapErrorToAuthResponse<User>(error, message, code)
      return err
    }
  }
  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ operationId: 'sign-in' })
  async signin(@Body() _user: LoginDto) {
    let response: AuthResponse<User>
    try {
      response = await this.authService.signIn(_user)
      return response
    } catch (error) {
      const message: string = 'An an error occured while creating user.'
      response = this.mapErrorToAuthResponse<User>(error, message, HttpStatus.BAD_REQUEST)
      return response
    }
  }
  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh-token')
  @ApiOperation({ operationId: 'refresh-token' })
  async refreshToken(@Body() token: string) {
    try {
      const accessToken: string = (await this.authService.refreshAccessToken(token)).access_token
      const response: AuthResponse<unknown> = {
        Succeeded: true,
        Message: 'Access token successfully refreshed.',
        AccessToken: accessToken,
        StatusCode: HttpStatus.OK,
      }
      return response
    } catch (err: any) {
      const message = 'An an error occured while refreshing access token'
      const code = HttpStatus.UNAUTHORIZED
      const error = this.mapErrorToAuthResponse(err, message, code)
      return error
    }
  }
  @UseGuards(JwtAuthGuard)
  @Post('invalidate-token')
  async invalidateToken(@Headers('authorization') authorization: string) {
    const token = authorization.split(' ')[1]
    await this.authService.invalidateToken(token)
    return { message: 'Token invalidated successfully' }
  }
  private mapErrorToAuthResponse<T>(error: any, message: string, code: number) {
    error.Error.push(error.message)
    const err: AuthResponse<T> = {
      StatusCode: code,
      Message: message,
      Error: [],
      Succeeded: false,
    }
    return err
  }
  private getBaseUri(request: Request) {
    return `${request.protocol}://${request.get('host')}/confirm`
  }
}
