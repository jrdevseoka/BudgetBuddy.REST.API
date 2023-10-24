/* eslint-disable indent */
import { Column, Entity, Index } from 'typeorm'
import { BaseEntity } from '@shared/base/models/base.entity'
import * as bcrypt from 'bcrypt'

@Entity({ name: 'USERS' })
@Index('IX_User_Email', ['Email'])
export class User extends BaseEntity {
  @Column({ name: 'FULLNAME', type: 'nvarchar', length: 50, nullable: false })
  Name: string

  @Column({ name: 'EMAIL', type: 'nvarchar', length: 255, unique: true })
  Email: string

  @Column({ name: 'PASSWORD', type: 'nvarchar', length: 255, nullable: false })
  PasswordHash: string
  @Column({ name: 'EMAILCONFIRMED', type: 'bit', default: 0 })
  EmailConfirmed: number
  @Column({ name: 'EMAILTOKENHASH', type: 'nvarchar', length: 255, nullable: true, unique: true })
  EmailTokenHash: string
  @Column({ name: 'TOKENEXPIRY', type: 'datetime', default: new Date() })
  TokenExpiry: Date
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.PasswordHash)
  }

}
