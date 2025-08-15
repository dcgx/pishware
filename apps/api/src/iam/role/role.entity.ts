import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('roles')
export class RoleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'text' })
    description: string;

}   
