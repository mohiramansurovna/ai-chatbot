import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

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



  await app.listen(process.env.PORT ?? 3000, ()=>{
    console.log("Server started runnnig at http://localhost:",process.env.PORT)
  });
}
bootstrap();
