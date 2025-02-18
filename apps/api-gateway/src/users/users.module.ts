import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME, AUTH_SERVICE } from '@app/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { join } from 'path';

/**
 * Module for managing user related functionalities within the application.
 * Configures a gRPC client to communicate with the `AUTH_SERVICE` and sets up the `UsersController` and `UsersService`.
 * @Module Decorator that defines this class as a NestJS module.
 * @imports Imports the `ClientsModule` to register gRPC clients.
 * @controllers Declares the `UsersController` to handle user-related API requests.
 * @providers Declares the `UsersService` to provide user-related business logic and gRPC communication.
 * @exports Exports the `UsersModule` class, making it available for import in other modules.
 */
@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: AUTH_PACKAGE_NAME,
          // path to proto file compiled in /dist
          protoPath: join(__dirname, '../auth.proto'),
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
