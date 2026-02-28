import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { FindOneOptions } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const { password, ...userData } = createUserDto;
    const saltRounds =
      parseInt(this.configService.get('HASH_SALT', '10'), 10) || 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const newUser = this.usersRepository.create({ ...userData, passwordHash });

    return this.usersRepository.save(newUser);
  }

  async findOne(id: number, options?: FindOneOptions<User>): Promise<User> {
    const user = await this.usersRepository.findOne({
      ...(options || {}),
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByEmailWithEstablishment(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['establishment'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async updateLastLogin(userId: number): Promise<void> {
    await this.usersRepository.update(userId, {
      lastLoginAt: new Date(),
    });
  }
}
