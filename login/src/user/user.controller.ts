import { Controller, Post, Body, Patch, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(
      @Body('username') userName: string,
      @Body('password') password: string,
      @Body('email') email: string,
      @Body('dateOfBirth') dateOfBirth: string,
      @Body('nickname') nickName: string,
  ) {
    return this.userService.register(
        userName,
        password,
        email,
        dateOfBirth,
        nickName,
    );
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
  async changeInfo(
      @Body()
          body: {
        userName?: string;
        password?: string;
        email?: string;
        nickName?: string;
        avatar_url?: string;
      },
  ): Promise<User> {
    const { userName, password, email, nickName, avatar_url } = body;
    return this.userService.changeInfo(
        userName,
        password,
        email,
        nickName,
        avatar_url,
    );
  }

  @Delete('update-user-info')
  async deleteAccount(
      @Body()
          body: {
        userName?: string;
        password?: string;
      },
  ): Promise<string> {
    const { userName, password } = body;
    await this.userService.deleteAccount(userName, password);
    return 'delete success';
  }
}
