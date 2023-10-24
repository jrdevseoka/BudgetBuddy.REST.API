import { Injectable } from '@nestjs/common'
import { User } from '@root/src/shared/models/user/user.entity'
import { DataSource, Repository } from 'typeorm'
@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager())
  }
  async addorUpdate(user: User) {
    return await this.save(user)
  }
  async getUserByEmail(email: string) {
    return await this.findOne({ where: { Email: email } })
  }
  async getUserById(id: string) {
    return await this.findOne({ where: { Link: id } })
  }
  async getUsers() {
    return await this.find({})
  }
  async deleteUser(user: User) {
    return await this.remove(user)
  }
}
