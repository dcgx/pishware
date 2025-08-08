import { Body, Controller, Get, Post } from "@nestjs/common";
import { LandingPageService } from "./landing-page.service";
import { CreateLandingPageRequestDto } from "./dto/request/create-landing-page-request.dto";


@Controller('landing-pages')
export class LandingPageController {
    constructor(
        private readonly landingPageService: LandingPageService
    ) { }

    @Get()
    async findAll() {
        return this.landingPageService.findAll();
    }

    @Post()
    async create(
        @Body() dto: CreateLandingPageRequestDto
    ) {
        return this.landingPageService.create(dto);
    }
}