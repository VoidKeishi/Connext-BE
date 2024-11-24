import { Injectable } from '@nestjs/common';
import { CreateCallDto } from './dto/initiate-call.dto';
import { UpdateCallDto } from './dto/end-call.dto';

@Injectable()
export class CallsService {
  create(createCallDto: CreateCallDto) {
    return 'This action adds a new call';
  }

  findAll() {
    return `This action returns all calls`;
  }

  findOne(id: number) {
    return `This action returns a #${id} call`;
  }

  update(id: number, updateCallDto: UpdateCallDto) {
    return `This action updates a #${id} call`;
  }

  remove(id: number) {
    return `This action removes a #${id} call`;
  }
}
