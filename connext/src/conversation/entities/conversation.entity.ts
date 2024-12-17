import { Message } from 'src/messages/entities/messages.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Conversation')
export class Conversation {
  @PrimaryGeneratedColumn()
  conversation_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'first_participant_id' })
  first_participant_id: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'second_participant_id' })
  second_participant_id: User;

  @Column('text', { default: 'Lets say hi to each other!' })
  last_message: string;

  @Column('timestamp', { nullable: true })
  last_message_sent_at: Date;

  @OneToMany(() => Message, (message) => message.conversation_id)
  messages: Message[];
}
