import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('auth')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('login-via-username')
    async loginViaUsername(@Body() body: { userName: string; password: string }) {
        const { userName, password } = body;
        return this.userService.authenticateViaUsername(userName, password)
            ? 'Login successful!'
            : 'Invalid username or password!';
    }

    @Post('login-via-email')
    async loginViaEmail(@Body() body: { email: string; password: string }) {
        const { email, password } = body;
        return this.userService.authenticateByEmail(email, password)
            ? 'Login successful!'
            : 'Invalid email or password!';
    }

    @Post('sign-up')
    async signUp(@Body() body: { userName: string; email: string; password: string }) {
        const { userName, email, password } = body;
        return this.userService.signUp(userName, email, password)
            ? 'Sign up successful!'
            : 'Username or email already exists!';
    }
}
