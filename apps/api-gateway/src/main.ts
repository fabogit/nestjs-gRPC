import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Bootstraps the NestJS application.
 * This function initializes the NestJS application using the AppModule and starts the application server.
 * It listens for incoming requests on port 3000.
 * Any errors during the bootstrap process are caught and logged to the console.
 * @async
 * @returns A Promise that resolves when the application has started listening, or rejects if an error occurs.
 * @throws If any error occurs during application creation or startup, it will be caught and logged to the console.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap().catch((err) => console.error(err));
