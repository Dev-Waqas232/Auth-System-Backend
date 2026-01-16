import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOneBy({ email });
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) throw new NotFoundException("User doesn't exist");

    return user;
  }

  async createUser(data: RegisterDto) {
    const user = this.userRepo.create(data);

    return await this.userRepo.save(user);
  }
}
