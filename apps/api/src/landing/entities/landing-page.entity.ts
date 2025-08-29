import { TrackingEmail } from "src/tracking/entities/tracking-email.entity";
import { BeforeInsert, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('landing_pages')
export class LandingPageEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', unique: true, nullable: true })
    slug?: string;

    @Column({ type: 'text', unique: true, nullable: true })
    public_key?: string;

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

    @BeforeInsert()
    generateSlugAndPublicKey() {
        this.slug = this.slug || this.generateSlug();
        this.public_key = this.public_key || this.generatePublicKey();
    }

    private generateSlug(): string {
        const namePart = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50);
        const randomPart = Math.random().toString(36).substring(2, 8);
        return `${namePart}-${randomPart}`;
    }

    private generatePublicKey(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let key = '';

        for (let i = 0; i < 6; i++) {
            key += Math.floor(Math.random() * 10).toString();
        }

        for (let i = 0; i < 4; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return key.split('').sort(() => Math.random() - 0.5).join('');
    }

}
