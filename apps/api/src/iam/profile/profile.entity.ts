import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { GroupEntity } from '../groups/group.entity';
import { User } from '../user-management/entities/user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  first_name: string;

  @Column({ type: 'text' })
  last_name: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'timestamptz', nullable: true })
  deleted_at?: Date;

  @ManyToMany(() => GroupEntity, (group) => group.profiles)
  groups: GroupEntity[];

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user?: User;
}
