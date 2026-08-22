import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DomainExceptionFilter } from './interface/shared/filters/domain-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser());
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173' // Local development fallback
    ],
    credentials: true,
  });
  app.useGlobalFilters(new DomainExceptionFilter())



  await app.listen(process.env.PORT ?? 3000, ()=>{
    console.log("Server started runnnig at http://localhost:",process.env.PORT)
  });
}
bootstrap();
