import { Module } from '@nestjs/common';
import { GatewaysAdapter } from './gateways.adapter';
import { GatewaysGateway } from './gateways.gateway';
import { GatewaySessions } from './gateways.session';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [GatewaysGateway, GatewaysAdapter, GatewaySessions],
})
export class GatewaysModule {}
