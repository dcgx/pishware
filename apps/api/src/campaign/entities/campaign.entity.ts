import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { LandingPageEntity } from "src/landing/entities/landing-page.entity";
import { TemplateEntity } from "src/template/entities/template.entity";

export enum CampaignStatus {
    DRAFT = 'draft',
    SCHEDULED = 'scheduled',
    SENT = 'sent',
    COMPLETED = 'completed',
}

@Entity('campaigns')
export class CampaignEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @ManyToOne(() => TemplateEntity, { nullable: false })
    @JoinColumn({ name: 'template_id' })
    template: TemplateEntity;

    @ManyToOne(() => LandingPageEntity, { nullable: false })
    @JoinColumn({ name: 'landing_page_id' })
    landing_page: LandingPageEntity;

    @Column({ type: 'timestamp', nullable: true })
    scheduled_start_at: Date | null;

    @Column({ type: 'enum', enum: CampaignStatus, default: CampaignStatus.DRAFT })
    status: CampaignStatus;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    updated_at: Date;
}
