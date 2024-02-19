import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.NATS,
    options: {
      servers: [`nats://${process.env.BROKER_HOST}:${process.env.BROKER_PORT}`]
    }
  });
  await app.listen()
  console.log(`[MS-AUTH] with NATS`)
}
bootstrap();
