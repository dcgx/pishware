import { Profile } from 'src/iam/profile/profile.entity';
import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate, ManyToOne } from 'typeorm';

@Entity('templates')
export class TemplateEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    type: string;

    @Column()
    body_content: string;

    @Column()
    subject: string;

    @Column('simple-array', { nullable: true })
    attachments?: string[];

    @ManyToOne(() => Profile, { nullable: true })
    created_by?: Profile;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    created_at?: Date;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    updated_at?: Date;

    @BeforeUpdate()
    updateTimestamp() {
        this.updated_at = new Date;
    }
}

