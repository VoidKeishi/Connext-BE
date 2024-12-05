import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Friendship')
export class Friendship {
  @PrimaryGeneratedColumn()
  friendship_id: number;

  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'user_id' })
  user_id: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'friend_user_id' })
  friend_user_id: User;

  @Column()
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
