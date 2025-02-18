import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';

/**
 * Module responsible for authentication functionalities.
 * Imports the `UsersModule`.
 * @Module Decorator that defines this class as a NestJS module.
 * @imports {UsersModule} Imports the `UsersModule`, making its exported components available within `AuthModule`.
 * @exports {AuthModule} Exports the `AuthModule` class, allowing other modules to import and utilize its features.
 */
@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [],
})
export class AuthModule {}
