import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AUTH } from '@app/common';
import { AuthModule } from './auth.module';

/**
 * Bootstraps the NestJS microservice for the authentication module.
 * Sets up a gRPC transport with specified options for proto definition and package.
 * Starts the microservice and listens for incoming gRPC requests.
 * Catches and logs any errors that occur during the bootstrap process.
 * @async
 * @returnsA Promise that resolves when the microservice has started listening, or rejects if an error occurs.
 * @throws {Error} If any error occurs during microservice creation or startup, it will be caught and logged to the console.
 */
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
