import { Module } from '@nestjs/common';
import { GatewaysAdapter } from './gateways.adapter';
import { GatewaysGateway } from './gateways.gateway';
import { GatewaySessions } from './gateways.session';

@Module({
  providers: [
    GatewaysGateway,
    GatewaysAdapter,
    GatewaySessions,
  ],
})

export class GatewaysModule { }
