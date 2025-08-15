import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('smtp_profiles')
export class SmtpProfileEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    host: string;

    @Column()
    port: number;

    @Column({ default: false })
    secure: boolean;

    @Column()
    user: string;

    @Column()
    password: string;

    @Column()
    from_email: string;

    @Column({ nullable: true })
    from_name: string;
}
