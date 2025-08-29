import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { LandingPageEntity } from "src/landing/entities/landing-page.entity";
import { TemplateEntity } from "src/template/entities/template.entity";
import { GroupEntity } from "src/iam/groups/group.entity";
import { Profile } from "src/iam/profile/profile.entity";
import { User } from "src/iam/user-management/entities/user.entity";

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
    scheduled_start_at?: Date | null;

    @Column({ type: 'enum', enum: CampaignStatus, default: CampaignStatus.DRAFT })
    status: CampaignStatus;

    @ManyToMany(() => GroupEntity)
    @JoinTable({
        name: 'campaign_groups',
        joinColumn: { name: 'campaign_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'group_id', referencedColumnName: 'id' },
    })
    groups: GroupEntity[];

    @ManyToMany(() => User)
    @JoinTable({
        name: 'campaign_users',
        joinColumn: { name: 'campaign_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
    })
    users: User[];

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    updated_at: Date;
}
