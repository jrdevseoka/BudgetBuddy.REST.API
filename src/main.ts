import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe, VersioningType } from '@nestjs/common'

async function boostrap() {
  try
  {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        whitelist: true,
      }),
    )
    app.setGlobalPrefix('api')
    app.enableCors()
    app.enableVersioning({ type: VersioningType.URI })
    const config = new DocumentBuilder()
      .setTitle('Budget Buddy API')
      .setDescription(
        'BudgetBuddyAPI is a robust and flexible back-end API for a personal financial tracking application built using NestJS, JEST, TypeORM, MSSQL, Docker Containerization. The application empowers users to efficiently manage their financial data, including multiple accounts, transactions, reports, balances, and notifications',
      )
      .setVersion('1.0')
      .addTag('budgetbuddy')
      .build()
  
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)
  
    await app.listen(3000)
  }
  catch(error)
  {
    // eslint-disable-next-line no-console
    console.log(error)
  }
}
boostrap()
