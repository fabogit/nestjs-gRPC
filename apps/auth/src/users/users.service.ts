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

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly users: User[] = [];
  private readonly logger = new Logger(UsersService.name, { timestamp: true });

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

  findAll(): Users {
    return { users: this.users };
  }

  findOne(id: string): User {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User not found by id: ${id}`);
    }
    return user;
  }

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

  remove(id: string) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      return this.users.splice(userIndex, 1)[0];
    }
    throw new NotFoundException(`User not found by id: ${id}`);
  }

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
