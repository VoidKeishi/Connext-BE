import { FRIENDSHIP_STATUS } from 'src/common/enum/friendship-status.enum';
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

  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'friend_user_id' })
  friend_user_id: User;

  @Column({ enum: FRIENDSHIP_STATUS })
  status: FRIENDSHIP_STATUS;

  @CreateDateColumn()
  created_at: Date;
}
