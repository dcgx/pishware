import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tracking_email')
export class TrackingEmail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', nullable: true })
  landing_id: string | null;

  @Column({ type: 'int' })
  user_id: number;

  @Column({ type: 'int' })
  profile_id: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  subject: string | null;

  @Column({ nullable: true })
  message_id: string | null;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any> | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
