import { Controller, Post, Body, Patch, Delete } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './users.entity';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.register(createUserDto);
  }

  @Post('login-via-username')
  async loginViaUsername(@Body() body: { userName: string; password: string }) {
    const { userName, password } = body;
    return (await this.userService.authenticateViaUsername(userName, password))
      ? 'Login successful!'
      : 'Invalid username or password!';
  }

  @Post('login-via-email')
  async loginViaEmail(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return (await this.userService.authenticateViaEmail(email, password))
      ? 'Login successful!'
      : 'Invalid email or password!';
  }

  @Patch('update-user-info')
  async updateUserInfo(@Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.updateUser(updateUserDto);
  }

  @Delete('delete-account')
  async deleteAccount(@Body() body: { userName: string; password: string }): Promise<string> {
    const { userName, password } = body;
    return this.userService.deleteAccount(userName, password);
  }
}
