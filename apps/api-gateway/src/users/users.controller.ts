import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from '@app/common';

/**
 * Controller for handling user-related requests.
 * Defines REST API to perform CRUD operations on users.
 * Requests are proxyed the to the `auth` microservice via gRPC
 * @Controller Sets the base route for this controller to `/users`.
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Endpoint to create a new user.
   * @Post Defines this method as handling POST requests to `/users`.
   * @Body createUserDto - Data transfer object in the request body containing user creation details.
   * @returns Observable stream emitting the newly created user object.
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Endpoint to retrieve all users.
   * @Get Defines this method as handling GET requests to `/users`.
   * @returns Observable stream emitting an object containing an array of all users.
   */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * Endpoint to retrieve a user by their ID.
   * @Get Defines this method as handling GET requests to `/users/:id`.
   * @Param id - The user ID from the URL path parameter.
   * @returns Observable stream emitting the user object corresponding to the provided ID.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Endpoint to update an existing user by their ID.
   * @Patch Defines this method as handling PATCH requests to `/users/:id`.
   * @Param id - The user ID from the URL path parameter.
   * @Body() updateUserDto - Data transfer object in the request body containing user update details.
   * @returns Observable stream emitting the updated user object.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Endpoint to remove a user by their ID.
   * @Delete Defines this method as handling DELETE requests to `/users/:id`.
   * @Param id - The user ID from the URL path parameter.
   * @returns Observable stream emitting the user object that was removed.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  /**
   * Endpoint to trigger the email sending process to users (implementation detail in `UsersService`).
   * @Post Defines this method as handling POST requests to `/users/email`.
   * @returns This endpoint triggers an email sending process and does not return specific data to the client.
   */
  @Post('email')
  emailUsers() {
    return this.usersService.emailUser();
  }
}
