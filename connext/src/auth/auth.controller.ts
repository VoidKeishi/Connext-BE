import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response, response } from 'express';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('sign-in')
  async signin(@Body() signinData: AuthDto, @Res() response: Response) {
    // TODO: Call signin service
    // TODO: Set cookie for access token and refresh token
    // TODO: Return user data
  }

  @Post('sign-up')
  async signup(@Body() signupData: AuthDto, @Res() response: Response) {
    // TODO: Call signup service
    // TODO: Set cookie for access token and refresh token
    // TODO: Return user data
  }

  @Post('logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    // TODO: Call logout service
    // TODO: Delete cookie key access token and refresh token
    // TODO: Return true
  }
}
