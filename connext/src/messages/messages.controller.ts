import { Controller, Post, Body } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateMessageDto } from './dto/create-message.dto';
import { MESSAGE_EVENT } from 'src/common/constants/event.constant';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('send')
  async createNewMessage(@Body() createMessageDto: CreateMessageDto) {
    const response =
      await this.messagesService.createNewMessage(createMessageDto);
    this.eventEmitter.emit(MESSAGE_EVENT.SEND_MESSAGE, response);
    return;
  }
}
