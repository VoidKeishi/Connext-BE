import { PartialType } from '@nestjs/mapped-types';
import { CreateCallDto } from './initiate-call.dto';

export class UpdateCallDto extends PartialType(CreateCallDto) { }
