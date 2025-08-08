import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('landing_pages')
export class LandingPageEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text' })
    html_content: string;

    @Column({ type: 'text', nullable: true })
    redirect_url: string;

    @Column({ type: 'text', nullable: true })
    imported_url?: string;

    @Column({ type: 'boolean', default: false })
    capture_submitted_data: boolean;

    @Column({ type: 'boolean', default: false })
    capture_password: boolean;

}
