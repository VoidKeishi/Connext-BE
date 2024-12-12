import { Controller, Post, Body, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from './guards/jwt-auth.guard';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signin(@Body() signInData: SignInDto, @Res() response: Response) {
    const { accessToken, refreshToken, user } =
      await this.authService.signin(signInData);
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 1000,
    });

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return response.status(200).json({ user });
  }

  @Post('sign-up')
  async signup(@Body() signUpData: SignUpDto, @Res() response: Response) {
    const { accessToken, refreshToken, user } =
      await this.authService.signup(signUpData);
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 15 * 60 * 1000,
    });

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return response.status(201).json({ user });
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    await this.authService.logout(request['user'].userId);

    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');

    return response.status(200).json({ message: 'Logged out successfully' });
  }
}
