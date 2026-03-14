import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
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
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { type AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ProfileWithEstablishmentTypeResponseDto } from './dto/profile-with-establishment-type-response.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({
    description: 'Current user profile retrieved',
    type: ProfileWithEstablishmentTypeResponseDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  getProfile(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ProfileWithEstablishmentTypeResponseDto> {
    return this.usersService.getProfile(user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiOkResponse({
    description: 'User profile updated',
    type: ProfileResponseDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ProfileResponseDto> {
    return this.usersService.update(user.id, updateUserDto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete current user account' })
  @ApiNoContentResponse({ description: 'User account deleted' })
  @ApiNotFoundResponse({ description: 'User not found' })
  deleteAccount(@CurrentUser() user: AuthenticatedUser): Promise<void> {
    return this.usersService.remove(user.id);
  }
}
