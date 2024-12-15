import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SearchUserDto } from './dto/search-user.dto';
import { FindManyUserDto } from './dto/find-many-user.dto';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findManyUsers(@Query() findManyUsersData: FindManyUserDto) {
    return await this.usersService.findManyUsers(
      findManyUsersData.limit,
      findManyUsersData.offset,
    );
  }

  @Get('/search')
  async searchUsers(@Query() searchUserData: SearchUserDto) {
    return await this.usersService.searchUsers(
      searchUserData.query,
      searchUserData.limit,
      searchUserData.offset,
    );
  }

  @Get(':id')
  async findOneUser(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
