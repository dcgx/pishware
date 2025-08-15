import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('tracking')
export class Tracking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    event_type: string; // e.g., 'click', 'view', 'submit'

    @Column()
    payload: string;

    @Column({ type: 'timestamp' })
    submitted_at: Date;

    @Column({ type: 'json' })
    metadata: Record<string, any>;

    @Column({ type: 'int' })
    user_id: number; // Assuming tracking is associated with a user
}
