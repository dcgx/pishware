import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LandingPageEntity } from "src/landing/entities/landing-page.entity";
import { TemplateEntity } from "src/template/entities/template.entity";

@Entity('campaigns')
export class CampaignEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => TemplateEntity, { nullable: false })
    template: TemplateEntity;

    @ManyToOne(() => LandingPageEntity, { nullable: false })
    landing_page: LandingPageEntity;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    updated_at: Date;
}
