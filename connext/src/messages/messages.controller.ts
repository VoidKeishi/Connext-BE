import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateMessageDto } from './dto/create-message.dto';
import { MESSAGE_EVENT } from 'src/common/constants/event.constant';
import { GetMessageDto } from './dto/get-message.dto';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async getMessages(@Body() getMessageDto: GetMessageDto) {
    const response = await this.messagesService.getMessages(getMessageDto);
    return response;
  }

  @Post('send')
  async createNewMessage(@Body() createMessageDto: CreateMessageDto) {
    const response =
      await this.messagesService.createNewMessage(createMessageDto);
    this.eventEmitter.emit(MESSAGE_EVENT.SEND_MESSAGE, response);
    return;
  }
}
