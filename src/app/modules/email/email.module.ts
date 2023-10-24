import { Module } from '@nestjs/common'
import { EmailService } from './email.service'
import { PostmarkConfigureService } from '@root/src/config/postmark/postmark.service'

@Module({ providers: [EmailService, PostmarkConfigureService], exports: [EmailService] })
export class EmailModule {}
