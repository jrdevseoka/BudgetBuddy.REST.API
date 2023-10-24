import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PostmarkConfigureService {
  constructor(private readonly configService: ConfigService) {}
  getAPIKey(): string {
    const key: string = this.configService.get<string>('KEY')
    return key
  }
  getSenderEmail(): string {
    return this.configService.get<string>('SENDER_EMAIL')
  }
  getSenderName(): string {
    return this.configService.get<string>('SENDER_NAME')
  }
  getCompanyName(): string {
    return this.configService.get<string>('PRODUCT_NAME')
  }
  getCompanyUrl(): string {
    return this.configService.get<string>('PRODUCT_URL')
  }
  getTemplateAlias(): string {
    return this.configService.get<string>('TEMPLATE_NAME')
  }
  getEmailTag(): string {
    return this.configService.get<string>('TAG')
  }
}
