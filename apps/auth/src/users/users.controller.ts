import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  UsersServiceControllerMethods,
  UsersServiceController,
  CreateUserDto,
  FindOneUserDto,
  UpdateUserDto,
  PaginationDto,
} from '@app/common';
import { Observable } from 'rxjs';

/**
 * Controller for managing user resources.
 * Implements the `UsersServiceController` interface and utilizes `UsersService` for data manipulation.
 * @Controller Decorator that marks this class as a NestJS controller.
 * @UsersServiceControllerMethods Decorator for grpc method configured in `common/types/auth.ts`.
 * @implements {UsersServiceController} Interface defining the contract for user-related controller methods.
 */
@Controller()
@UsersServiceControllerMethods()
export class UsersController implements UsersServiceController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Endpoint to create a new user.
   * Proxies the request to the `UsersService.create` method.
   * @param {CreateUserDto} createUserDto - Data transfer object containing the data for the new user.
   * @returns The newly created user object.
   */
  createUser(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Endpoint to retrieve all users.
   * Proxies the request to the `UsersService.findAll` method.
   * @returns An object containing an array of all users.
   */
  findAllUsers() {
    return this.usersService.findAll();
  }

  /**
   * Endpoint to retrieve a user by their ID.
   * Proxies the request to the `UsersService.findOne` method.
   * @param {FindOneUserDto} findOneUserDto - Data transfer object containing the ID of the user to retrieve.
   * @returns The user object corresponding to the provided ID.
   * @throws {NotFoundException} If no user is found with the given ID, as thrown by `UsersService.findOne`.
   */
  findOneUser(findOneUserDto: FindOneUserDto) {
    return this.usersService.findOne(findOneUserDto.id);
  }

  /**
   * Endpoint to update an existing user.
   * Proxies the request to the `UsersService.update` method.
   * @param {UpdateUserDto} updateUserDto - Data transfer object containing the ID and update data for the user.
   * @returns The updated user object.
   * @throws {NotFoundException} If no user is found with the given ID, as thrown by `UsersService.update`.
   */
  updateUser(updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  /**
   * Endpoint to remove a user by their ID.
   * Proxies the request to the `UsersService.remove` method.
   * @param {FindOneUserDto} findOneUserDto - Data transfer object containing the ID of the user to remove.
   * @returns The user object that was removed.
   * @throws {NotFoundException} If no user is found with the given ID, as thrown by `UsersService.remove`.
   */
  removeUser(findOneUserDto: FindOneUserDto) {
    return this.usersService.remove(findOneUserDto.id);
  }

  /**
   * Endpoint to query users based on pagination parameters via a stream.
   * Proxies the request to the `UsersService.queryUsers` method.
   * @param {Observable<PaginationDto>} paginationDtoStream - Observable stream emitting pagination data.
   * @returns Observable stream emitting paginated user data, as returned by `UsersService.queryUsers`.
   */
  queryUsers(paginationDtoStream: Observable<PaginationDto>) {
    return this.usersService.queryUsers(paginationDtoStream);
  }
}
