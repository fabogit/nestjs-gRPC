import {
  Injectable,
  OnModuleInit,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserDto,
  User,
  Users,
  PaginationDto,
} from '@app/common';
import { Observable, Subject } from 'rxjs';
import { randomUUID } from 'crypto';
import { faker } from '@faker-js/faker';

/**
 * Injectable service responsible for managing users.
 * Implements `OnModuleInit` lifecycle hook to initialize `Users` on module startup.
 */
@Injectable()
export class UsersService implements OnModuleInit {
  /**
   * Array to store user objects.
   * @private
   * @readonly
   */
  private readonly users: User[] = [];
  /**
   * Logger instance for UsersService.
   * @private
   * @readonly
   */
  private readonly logger = new Logger(UsersService.name, { timestamp: true });

  /**
   * Lifecycle hook, called once the host module has been initialized.
   * Initializes the service by creating a predefined number of users with mock data.
   */
  onModuleInit() {
    const number = 500;
    this.logger.log(`Creating ${number} Users...`);
    for (let i = 0; i < number; i++) {
      this.create({
        username: faker.internet.username(),
        password: faker.internet.password(), //for development it's okay
        age: faker.number.int({ min: 18, max: 99 }),
      });
    }
    this.logger.log('Done');
  }

  /**
   * Creates a new user.
   * @param {CreateUserDto} createUserDto - Data transfer object containing user creation information.
   * @returns {User} The newly created user object.
   */
  create(createUserDto: CreateUserDto): User {
    const user: User = {
      ...createUserDto,
      isSubscribed: false,
      socialMedia: {},
      id: randomUUID(),
    };
    this.users.push(user);
    return user;
  }

  /**
   * Retrieves all users.
   * @returns {Users} An object containing an array of all users.
   */
  findAll(): Users {
    return { users: this.users };
  }

  /**
   * Finds a user by their ID.
   * @param {string} id - The unique identifier of the user to retrieve.
   * @returns {User} The user object corresponding to the provided ID.
   * @throws {NotFoundException} If no user is found with the given ID.
   */
  findOne(id: string): User {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User not found by id: ${id}`);
    }
    return user;
  }

  /**
   * Updates an existing user.
   * @param {string} id - The unique identifier of the user to update.
   * @param {UpdateUserDto} updateUserDto - Data transfer object containing user update information.
   * @returns {User} The updated user object.
   * @throws {NotFoundException} If no user is found with the given ID.
   */
  update(id: string, updateUserDto: UpdateUserDto): User {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex] = {
        ...this.users[userIndex],
        ...updateUserDto,
      };
      return this.users[userIndex];
    }
    throw new NotFoundException(`User not found by id: ${id}`);
  }

  /**
   * Removes a user by their ID.
   * @param {string} id - The unique identifier of the user to remove.
   * @returns {User} The user object that was removed.
   * @throws {NotFoundException} If no user is found with the given ID.
   */
  remove(id: string): User {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      return this.users.splice(userIndex, 1)[0];
    }
    throw new NotFoundException(`User not found by id: ${id}`);
  }

  /**
   * Queries users based on pagination parameters from an Observable stream.
   * @param {Observable<PaginationDto>} paginationDtoStream - Observable stream emitting pagination data.
   * @returns {Observable<Users>} Observable stream emitting paginated user data.
   */
  queryUsers(
    paginationDtoStream: Observable<PaginationDto>,
  ): Observable<Users> {
    const subject = new Subject<Users>();

    const onNext = (paginationDto: PaginationDto) => {
      const start = paginationDto.page * paginationDto.skip;
      subject.next({
        users: this.users.slice(start, start + paginationDto.skip),
      });
    };
    const onComplete = () => subject.complete();
    paginationDtoStream.subscribe({ next: onNext, complete: onComplete });

    return subject.asObservable();
  }
}
