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
  Req,
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
  async findManyUsers(
    @Req() request: Request,
    @Query() findManyUsersData: FindManyUserDto,
  ) {
    return await this.usersService.findManyUsers(
      request['user'].userId,
      findManyUsersData.limit,
      findManyUsersData.offset,
    );
  }

  @Get('check-online')
  async checkUserOnlineStatus(@Req() request: Request) {
    return await this.usersService.checkUserOnlineStatus(
      request['user'].userId,
    );
  }

  @Get('/search')
  async searchUsers(
    @Req() request: Request,
    @Query() searchUserData: SearchUserDto,
  ) {
    return await this.usersService.searchUsers(
      request['user'].userId,
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
