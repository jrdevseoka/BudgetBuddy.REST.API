import { ConfigService } from '@nestjs/config'
import { config } from 'dotenv'
import { DataSource } from 'typeorm'

config()

const configService = new ConfigService()

export default new DataSource({
  type: configService.get<'mssql' | 'postgres'>('db.type'),
  host: configService.get<string>('db.host'),
  port: configService.get<number>('db.port'),
  username: configService.get<string>('db.user'),
  password: configService.get<string>('db.password'),
  database: configService.get<string>('db.name'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: configService.get<boolean>('db.synchronize'),
  extra: {
    trustServerCertificate: true,
  },
})