import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ReplaySubject } from 'rxjs';
import {
  TOTAL_USERS,
  AUTH_SERVICE,
  USERS_SERVICE_NAME,
  CreateUserDto,
  UpdateUserDto,
  UsersServiceClient,
  PaginationDto,
  SKIP,
} from '@app/common';

/**
 * Injectable service responsible for interacting with the gRPC `Users` service.
 * Implements `OnModuleInit` to initialize the gRPC client service on module startup.
 */
@Injectable()
export class UsersService implements OnModuleInit {
  /**
   * Logger instance for `UsersService`, used for logging service activities.
   * @private
   * @readonly
   */
  private readonly logger = new Logger(UsersService.name, { timestamp: true });
  /**
   * gRPC client service for Users, initialized in onModuleInit.
   * @private
   * @type {UsersServiceClient}
   */
  private usersService: UsersServiceClient;

  /**
   * Constructor for `UsersService`.
   * @param {ClientGrpc} client - Injected gRPC client for the `AUTH_SERVICE`.
   * @Inject(AUTH_SERVICE) Injects the gRPC client configured for `AUTH_SERVICE`.
   */
  constructor(@Inject(AUTH_SERVICE) private client: ClientGrpc) {}

  /**
   * Lifecycle hook, called once the host module has been initialized.
   * Initializes the `usersService` property by obtaining the `UsersServiceClient` from the gRPC client.
   */
  onModuleInit() {
    this.usersService =
      this.client.getService<UsersServiceClient>(USERS_SERVICE_NAME);
  }

  /**
   * Calls the gRPC service to create a new user.
   * @param {CreateUserDto} createUserDto - Data transfer object containing user creation information.
   * @returns {Observable<User>} Observable stream emitting the newly created user object from the gRPC service.
   */
  create(createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  /**
   * Calls the gRPC service to retrieve all users.
   * @returns {Observable<Users>} Observable stream emitting an object containing an array of all users from the gRPC service.
   */
  findAll() {
    return this.usersService.findAllUsers({});
  }

  /**
   * Calls the gRPC service to find a user by their ID.
   * @param {string} id - The unique identifier of the user to retrieve.
   * @returns {Observable<User>} Observable stream emitting the user object corresponding to the provided ID from the gRPC service.
   */
  findOne(id: string) {
    return this.usersService.findOneUser({ id });
  }

  /**
   * Calls the gRPC service to update an existing user.
   * @param {string} id - The unique identifier of the user to update.
   * @param {UpdateUserDto} updateUserDto - Data transfer object containing user update information.
   * @returns {Observable<User>} Observable stream emitting the updated user object from the gRPC service.
   */
  update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser({ ...updateUserDto, id });
  }

  /**
   * Calls the gRPC service to remove a user by their ID.
   * @param {string} id - The unique identifier of the user to remove.
   * @returns {Observable<User>} Observable stream emitting the user object that was removed from the gRPC service.
   */
  remove(id: string) {
    return this.usersService.removeUser({ id });
  }

  /**
   * Demonstrates querying users in chunks using pagination and logs the results.
   * Creates an Observable stream of pagination requests and subscribes to the gRPC queryUsers service.
   * Logs debug information about the chunk processing and logs the received user data.
   */
  emailUser() {
    const users$ = new ReplaySubject<PaginationDto>();

    const totalPages = Math.ceil(TOTAL_USERS / SKIP);
    for (let page = 0; page < totalPages; page++) {
      users$.next({ page: page, skip: SKIP });
    }
    users$.complete();

    let chunckNum = 1;
    this.usersService.queryUsers(users$).subscribe((users) => {
      this.logger.debug(
        `Skipping: ${SKIP} on ${TOTAL_USERS} users, chunk number: ${chunckNum}`,
      );
      this.logger.log(users);
      chunckNum += 1;
    });
  }
}
