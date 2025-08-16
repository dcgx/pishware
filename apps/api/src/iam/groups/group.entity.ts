import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Profile } from '../profile/profile.entity';

@Entity('groups')
export class GroupEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', default: 'Unnamed Group' })
  name: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ManyToMany(() => Profile, (profile) => profile.groups)
  @JoinTable({
    name: 'group_profile',
    joinColumn: { name: 'group_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'profile_id', referencedColumnName: 'id' },
  })
  profiles: Profile[];
}
