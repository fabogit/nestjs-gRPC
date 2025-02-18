import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

/**
 * Module for managing user functionalities.
 * Encapsulates the `UsersController` and `UsersService`, providing a modular unit for user-related features.
 * @Module Decorator that defines this class as a NestJS module.
 * @exports {UsersModule} Exports the `UsersModule` class, making it available for import in other modules.
 */
@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
