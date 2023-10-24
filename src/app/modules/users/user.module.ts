import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserRepository } from '@root/src/database/repositories/user.repository'

@Module({providers: [UserService], exports: [UserService], imports: [TypeOrmModule.forFeature([UserRepository])]})
export class UserModule {}
