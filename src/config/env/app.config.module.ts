import { Module } from '@nestjs/common'
import { configuration } from '../configuration'
import { ConfigModule } from '@nestjs/config'
import { validationSchema } from '@config/validation'
const environment = process.env.NODE_ENV || 'development' // Default to 'development'
const sanitizedEnvironment = environment.replace(/\s+/g, '') // Remove spaces
const envFilePath = `src/config/env/${sanitizedEnvironment}.env`
const configModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: envFilePath,
  load: [configuration],
  validationSchema,
})
@Module({
  imports: [configModule],
  exports: [configModule],
})
export class AppConfigModule {}
