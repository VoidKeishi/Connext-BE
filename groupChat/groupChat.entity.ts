import {User} from "../login/src/user/user.entity";
import {GroupMember} from "../groupMember/groupMember.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';


@Entity('GroupChat')
export class GroupChat {
  @PrimaryGeneratedColumn() _groupId: number;

  @Column({ length: 100, unique: true }) _groupName: string;

  @Column({ type: 'date', nullable: false }) _createdAt?: Date;

  @ManyToOne(() => User, (user) => user.groupChats)
  @JoinColumn({ name: 'createdBy' })
  _createdBy: GroupChat;

  @OneToMany(() => GroupMember, groupMember => groupMember.user)
  groupMembers: GroupMember[];

  get groupId(): number {
    return this._groupId;
  }

  set groupId(value: number) {
    this._groupId = value;
  }

  get groupName(): string {
    return this._groupName;
  }

  set groupName(value: string) {
    this._groupName = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  set createdAt(value: Date) {
    this._createdAt = value;
  }

  get createdBy(): GroupChat {
    return this._createdBy;
  }

  set createdBy(value: GroupChat) {
    this._createdBy = value;
  }
}
