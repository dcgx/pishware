import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LandingPageEntity } from "./landing-page.entity";


@Injectable()
export class LandingPageService {
    constructor(
        @InjectRepository(LandingPageEntity) private readonly landingPageRepository: Repository<LandingPageEntity>
    ) { }

    async findAll(): Promise<LandingPageEntity[]> {
        return this.landingPageRepository.find();
    }

    async create(dto: Partial<LandingPageEntity>): Promise<LandingPageEntity> {
        const landingPage = this.landingPageRepository.create(dto);
        return this.landingPageRepository.save(landingPage);
    }
}

