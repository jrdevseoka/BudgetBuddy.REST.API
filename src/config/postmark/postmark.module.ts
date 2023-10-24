import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { join } from 'path'
import { PostmarkConfigureService } from './postmark.service'
const currentDir = __dirname
const envFilePath = join(currentDir, 'postmark.env')
@Module({
  imports: [ConfigModule.forRoot({ envFilePath: envFilePath })],
  exports: [PostmarkConfigureService],
  providers: [PostmarkConfigureService],
})
export class PostmarkModule {}
