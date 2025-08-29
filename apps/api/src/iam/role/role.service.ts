import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoleEntity } from "./role.entity";
import { Repository } from "typeorm";

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(RoleEntity) private readonly roleRepository: Repository<RoleEntity>
    ) { }

    async findAll(): Promise<RoleEntity[]> {
        return this.roleRepository.find();
    }

    async findOne(id: number): Promise<RoleEntity | null> {
        return this.roleRepository.findOne({ where: { id } });
    }

    async create(dto: Partial<RoleEntity>): Promise<RoleEntity> {
        const role = this.roleRepository.create(dto);
        return this.roleRepository.save(role);
    }

    async update(id: number, dto: Partial<RoleEntity>): Promise<RoleEntity> {
        await this.roleRepository.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.roleRepository.delete(id);
    }

}