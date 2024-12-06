import { Controller, Post, Get, Body, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthDto } from './dto/auth.dto';
import { Roles } from './roles-decorator';
import { Role } from './role-enum';
import { AuthGuard } from './guards/jwt-auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //user
  @Post('sign-in')
  async signin(@Body() signinData: AuthDto, @Res() response: Response) {
    const { accessToken, refreshToken, user } = await this.authService.signin(signinData);
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true, 
      sameSite: 'none',
      maxAge: 60 * 60 * 1000, 
    });

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, 
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return response.status(200).json({ user });
  }

  @Post('sign-up')
  async signup(@Body() signupData: AuthDto, @Res() response: Response) {
    const { accessToken, refreshToken, user } = await this.authService.signup(signupData);
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000, 
    });

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, 
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return response.status(201).json({ user });
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() request: Request, @Res() response: Response) {

    await this.authService.logout(request["user"].user_id);

    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');

    return response.status(200).json({ message: 'Logged out successfully' });
  }
}