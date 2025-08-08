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

    async create(dto: Partial<RoleEntity>): Promise<RoleEntity> {
        const role = this.roleRepository.create(dto);
        return this.roleRepository.save(role);
    }

}