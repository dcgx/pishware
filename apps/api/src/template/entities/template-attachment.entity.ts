import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

import { Profile } from 'src/iam/profile/profile.entity';
import { TemplateEntity } from './template.entity';

@Entity('template_attachments')
export class TemplateAttachmentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TemplateEntity, template => template.attachments, { onDelete: 'CASCADE' })
    template: TemplateEntity;

    @Column()
    file_name: string;

    @Column()
    file_path: string;

    @Column()
    mime_type: string;

    @Column('bigint')
    size: number;

    @CreateDateColumn()
    uploaded_at: Date;

    @ManyToOne(() => Profile, { nullable: true })
    created_by?: Profile;
}
