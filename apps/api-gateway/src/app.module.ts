import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';

/**
 * Root module of the application.
 * Aggregates all feature modules and is the entry point for the NestJS application.
 * In this configuration, it imports the `UsersModule`, incorporating user management functionalities into the application.
 * @Module Decorator that defines this class as a NestJS module.
 * @imports Imports the `UsersModule`, making its exported components available within `AppModule`.
 * @exports Exports the `AppModule` class, making it the main module of the application.
 */
@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
