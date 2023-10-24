import { PostmarkEnvOptions } from './../../../shared/models/postmark.dto'
import { Injectable } from '@nestjs/common'
import { PostmarkConfigureService } from '@root/src/config/postmark/postmark.service'
import { User } from '@root/src/shared/models/user/user.entity'
import * as postmark from 'postmark'
@Injectable()
export class EmailService {
  private PostmarkEnvOptions: PostmarkEnvOptions
  private PostmarkClient: postmark.ServerClient
  /**
   *
   */
  constructor(private readonly postmarkConfig: PostmarkConfigureService) {
    this.PostmarkEnvOptions = {
      companyName: postmarkConfig.getCompanyName(),
      companyUrl: postmarkConfig.getCompanyUrl(),
      senderEmail: postmarkConfig.getSenderEmail(),
      key: postmarkConfig.getAPIKey(),
      senderName: postmarkConfig.getSenderName(),
      template: postmarkConfig.getTemplateAlias(),
      supportEmail: postmarkConfig.getSenderEmail()
    }
    this.PostmarkClient = new postmark.ServerClient(this.PostmarkEnvOptions.key)
  }
  async sendEmailWithTemplate(user: User, url: string) {
    const template = this.getTemplatedMessage(user, url, this.PostmarkEnvOptions)
    return await this.PostmarkClient.sendEmailWithTemplate(template).catch((err) => {
      throw err
    })
  }
  private getTemplatedMessage(recipient: User, url: string, postmarkOptions: PostmarkEnvOptions) {
    return new postmark.Models.TemplatedMessage(postmarkOptions.senderEmail,postmarkOptions.template,
      {
        product_url: postmarkOptions.companyUrl,
        product_name: postmarkOptions.companyName,
        name: recipient.Name,
        action_url: url,
        sender_name: postmarkOptions.senderName,
        support_email: postmarkOptions.senderEmail,
        company_name: postmarkOptions.companyName,
        company_address: 'company_address_Value',
      },recipient.Email)
  }
}
