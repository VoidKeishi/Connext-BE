import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from './guards/jwt-auth.guard';
import { SignUpDto } from './dto/sign-up.dto';
import {
  COOKIE_ACCESS_TOKEN_MAX_AGE,
  COOKIE_REFRESH_TOKEN_MAX_AGE,
  IS_COOKIE_SECURE,
} from 'src/common/constants/jwt.constant';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signin(@Body() signInData: SignInDto, @Res() response: Response) {
    const { accessToken, refreshToken, user } =
      await this.authService.signin(signInData);
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: IS_COOKIE_SECURE,
      maxAge: COOKIE_ACCESS_TOKEN_MAX_AGE,
    });

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: IS_COOKIE_SECURE,
      maxAge: COOKIE_REFRESH_TOKEN_MAX_AGE,
    });

    return response.status(200).json({ user, accessToken });
  }

  @Post('sign-up')
  async signup(@Body() signUpData: SignUpDto, @Res() response: Response) {
    const { accessToken, refreshToken, user } =
      await this.authService.signup(signUpData);
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: IS_COOKIE_SECURE,
      maxAge: COOKIE_ACCESS_TOKEN_MAX_AGE,
    });

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: IS_COOKIE_SECURE,
      maxAge: COOKIE_REFRESH_TOKEN_MAX_AGE,
    });

    return response.status(201).json({ user, accessToken });
  }

  @Post('refresh-token')
  async refreshToken(@Req() request: Request, @Res() response: Response) {
    const refreshToken = request.cookies['refreshToken'];
    if (!refreshToken)
      throw new BadRequestException('Refresh token is required!');

    const accessToken = await this.authService.refreshToken(refreshToken);
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: IS_COOKIE_SECURE,
      maxAge: COOKIE_ACCESS_TOKEN_MAX_AGE,
    });
    return response.status(201).json({ accessToken });
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
