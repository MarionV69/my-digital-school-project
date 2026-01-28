import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Register a new user
  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    const user = await this.usersService.create(createUserDto);
    await this.usersService.updateLastLogin(user.id);

    return this.generateAccessToken(user);
  }

  // Login user and return JWT token
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.usersService.updateLastLogin(user.id);

    return this.generateAccessToken(user);
  }

  private async generateAccessToken(user: User): Promise<AuthResponseDto> {
    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        role: user.role,
      },
    };
  }
}
