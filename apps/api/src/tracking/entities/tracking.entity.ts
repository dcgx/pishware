import { User } from "src/iam/user-management/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";

@Entity('tracking')
export class Tracking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  event_type: string;

  @Column()
  payload: string;

  @Column({ type: 'timestamp' })
  submitted_at: Date;

  @Column({ type: 'json' })
  metadata: Record<string, any>;

  @ManyToOne(() => User, (user) => user.trackings, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({ type: 'int', nullable: true })
  tracking_email_id: number | null;
}