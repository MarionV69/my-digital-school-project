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
import { ProfileWithEstablishmentTypeResponseDto } from './dto/profile-with-establishment-type-response.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { Establishment } from 'src/establishments/entities/establishment.entity';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Establishment)
    private readonly establishmentsRepository: Repository<Establishment>,
    private readonly configService: ConfigService,
  ) {}

  // Hashes the password before saving the user, throws if email already exists
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const { password, acceptTerms: _acceptTerms, ...userData } = createUserDto;
    const saltRounds =
      parseInt(this.configService.get('HASH_SALT', '10'), 10) || 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const newUser = this.usersRepository.create({ ...userData, passwordHash });

    return this.usersRepository.save(newUser);
  }

  async getProfile(
    userId: number,
  ): Promise<ProfileWithEstablishmentTypeResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['establishment'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return {
      ...user,
      establishmentType: user.establishment?.type || null,
    };
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

  // Used during JWT validation to load the user with their establishment
  async findByEmailWithEstablishment(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['establishment'],
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ProfileResponseDto> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);

    if (user.establishmentId && user.role === UserRole.OWNER) {
      await this.establishmentsRepository.delete(user.establishmentId);
    }

    await this.usersRepository.remove(user);
  }

  async updateLastLogin(userId: number): Promise<void> {
    await this.usersRepository.update(userId, {
      lastLoginAt: new Date(),
    });
  }
}
