import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ConfirmUserDto {
  @ApiProperty()
  @IsNotEmpty()
    Id: string
  @ApiProperty()
  @IsString()
    code: string
}
