import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { User } from './entities/user.entity';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({
    description: 'Current user profile retrieved',
    type: User,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getProfile(
    @Request() req: ExpressRequest & { user: AuthenticatedUser },
  ): Promise<User> {
    return this.usersService.findOne(req.user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiOkResponse({
    description: 'User profile updated',
    type: User,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async updateProfile(
    @Request() req: ExpressRequest & { user: AuthenticatedUser },
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete current user account' })
  @ApiNoContentResponse({ description: 'User account deleted' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async deleteAccount(
    @Request() req: ExpressRequest & { user: AuthenticatedUser },
  ): Promise<void> {
    return this.usersService.remove(req.user.id);
  }
}
