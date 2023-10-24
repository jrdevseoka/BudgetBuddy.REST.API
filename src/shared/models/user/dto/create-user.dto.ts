import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({ description: 'Fullname of the user', })
  @IsString()
  @IsNotEmpty()
    Name: string
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
    Email: string
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({minLength: 1, minLowercase: 1, minNumbers:1, minSymbols: 1, minUppercase: 1})
    Password: string
}
