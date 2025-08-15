import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { GroupEntity } from "../groups/group.entity";


@Entity('profiles')
export class ProfileEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ type: 'text' })
    email: string;
    
    @Column({ type: 'text' })
    first_name: string;
    
    @Column({ type: 'text' })
    last_name: string;
    
    @Column({ type: 'timestamptz', default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;
    
    @Column({ type: 'varchar' })
    username: string;
    
    @Column({ type: 'timestamptz', nullable: true })
    deleted_at?: Date;

    @ManyToMany(() => GroupEntity, (group) => group.profiles)
    groups: GroupEntity[];
}
