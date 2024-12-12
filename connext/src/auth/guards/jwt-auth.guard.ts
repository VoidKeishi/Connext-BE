import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyToken } from '../jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  private ACCESS_TOKEN_KEY: string;
  constructor(private readonly configService: ConfigService) {
    this.ACCESS_TOKEN_KEY = this.configService.get<string>('AT_SECRET_KEY');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['accessToken'];
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = verifyToken(token, this.ACCESS_TOKEN_KEY);
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
    return true;
  }
}
