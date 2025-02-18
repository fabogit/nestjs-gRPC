import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AUTH } from '@app/common';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.GRPC,
      options: {
        // path to proto when compiled
        protoPath: join(__dirname, '../auth.proto'),
        package: AUTH,
      },
    },
  );
  await app.listen();
}

bootstrap().catch((err) => console.error(err));
