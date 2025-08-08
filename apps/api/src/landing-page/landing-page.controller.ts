import { Body, Controller } from "@nestjs/common";
import { LandingPageService } from "./landing-page.service";
import { CreateLandingPageRequestDto } from "./dto/request/create-landing-page-request.dto";


@Controller('landing-pages')

export class LandingPageController {
    constructor(
        private readonly landingPageService: LandingPageService
    ) { }

    async findAll() {
        return this.landingPageService.findAll();
    }

    async create(
        @Body() dto: CreateLandingPageRequestDto
    ) {
        return this.landingPageService.create(dto);
    }
}