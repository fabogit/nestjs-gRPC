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

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name, { timestamp: true });
  private usersService: UsersServiceClient;

  constructor(@Inject(AUTH_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.usersService =
      this.client.getService<UsersServiceClient>(USERS_SERVICE_NAME);
  }

  create(createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  findAll() {
    return this.usersService.findAllUsers({});
  }

  findOne(id: string) {
    return this.usersService.findOneUser({ id });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser({ ...updateUserDto, id });
  }

  remove(id: string) {
    return this.usersService.removeUser({ id });
  }

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
