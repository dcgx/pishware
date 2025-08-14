import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { Response } from 'express';

import { LandingPageService } from "./landing-page.service";
import { CreateLandingPageRequestDto } from "./dto/request/create-landing-page-request.dto";
import { ImportUrlDto } from "./dto/import-url.dto";


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

    @Post('import')
    async importFromUrl(@Body() dto: ImportUrlDto) {
        const html = await this.landingPageService.importHtmlFromUrl(dto.url)
        return { html }
    }
}