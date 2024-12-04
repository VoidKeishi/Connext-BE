import { IoAdapter } from '@nestjs/platform-socket.io';
import { AuthenticatedSocket } from './interfaces/AuthenticatedSocket';
import { User } from '../users/entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { plainToInstance } from 'class-transformer';

export class GatewaysAdapter extends IoAdapter {
  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, options);
    server.use(async (socket: AuthenticatedSocket, next) => {
      console.log('Inside Websocket Adapter');
      const token = socket.handshake.headers['authorization'];
      if (!token) {
        console.log('No token provided');
        return next(new Error('Not Authenticated. No token provided'));
      }

      const jwtToken = token.substring("Bearer ".length)

      try {
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
        const userDB = plainToInstance(User, decoded);
        socket.user = userDB;
        next();
      } catch (err) {
        console.log('Token verification failed', err);
        return next(new Error('Not Authenticated. Token verification failed'));
      }
    });
    return server;
  }
}
