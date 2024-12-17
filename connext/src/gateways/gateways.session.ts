import { Injectable } from '@nestjs/common';
import { AuthenticatedSocket } from './interfaces/AuthenticatedSocket';

@Injectable()
export class GatewaySessions {
  private readonly gatewaySessions: Map<number, AuthenticatedSocket> =
    new Map();

  getAllSockets(): Map<number, AuthenticatedSocket> {
    return this.gatewaySessions;
  }

  getClientSocket(clientId: number): AuthenticatedSocket {
    return this.gatewaySessions.get(clientId);
  }

  setSocket(clientId: number, socket: AuthenticatedSocket) {
    this.gatewaySessions.set(clientId, socket);
  }

  removeSocket(clientId: number) {
    this.gatewaySessions.delete(clientId);
  }
}
