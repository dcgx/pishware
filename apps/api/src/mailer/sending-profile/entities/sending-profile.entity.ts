import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sending_profiles')
export class SendingProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'interface_type' })
  interfaceType: string;

  @Column({ name: 'smtp_from' })
  smtpFrom: string;

  @Column()
  host: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: false, name: 'ignore_cert_errors' })
  ignoreCertErrors: boolean;

  @Column('json', { nullable: true, name: 'email_headers' })
  emailHeaders?: Record<string, string>;
}
