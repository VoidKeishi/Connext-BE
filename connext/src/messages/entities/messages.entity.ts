import { Conversation } from 'src/conversation/entities/conversation.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Message')
export class Message {
  @PrimaryGeneratedColumn()
  message_id: number;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversation_id' })
  conversation_id: Conversation;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  media_url: string | null;

  @Column()
  media_type: string;

  @CreateDateColumn()
  timestamp: Date;
}
