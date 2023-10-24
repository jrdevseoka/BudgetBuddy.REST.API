import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator'

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
    username: string
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minSymbols: 1,
    minLowercase: 1,
    minNumbers: 1,
    minUppercase: 1,
  })
    password: string
}
