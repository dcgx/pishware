import { LandingPageEntity } from 'src/landing/entities/landing-page.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('tracking_email')
export class TrackingEmail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', nullable: true })
  landing_id: string | null;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'int' })
  profile_id: number;

  @Column()
  email: string;

  @Column({ type: 'text', nullable: true })
  subject: string;

  @Column({ type: 'text', nullable: true })
  message_id: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any> | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;
}
