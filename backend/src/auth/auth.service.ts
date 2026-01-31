import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserRole } from '../users/enums/user-role.enum';

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

    return this.buildAuthResponse(user, false);
  }

  // Login user
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmailWithRelations(
      loginDto.email,
    );

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

    const isOnboardingCompleted =
      (user.role === UserRole.RESTAURANT && !!user.restaurant) ||
      (user.role === UserRole.SUPPLIER && !!user.supplier);

    return this.buildAuthResponse(user, isOnboardingCompleted);
  }

  private buildAuthResponse(
    user: User,
    isOnboardingCompleted: boolean,
  ): AuthResponseDto {
    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        role: user.role,
        isOnboardingCompleted,
      },
    };
  }
}
