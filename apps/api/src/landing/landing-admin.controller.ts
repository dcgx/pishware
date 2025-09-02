import { Body, Controller, Get, Post, Param, Put, Delete } from "@nestjs/common";
import { LandingAdminService } from "./landing-admin.service";
import { CreateLandingPageRequestDto } from "./dto/request/create-landing-page-request.dto";
import { ImportUrlDto } from "./dto/import-url.dto";
import { UpdateLandingPageRequestDto } from './dto/request/update-landing-page-request.dto';


@Controller('landing-pages')
export class LandingAdminController {
    constructor(
        private readonly landingAdminService: LandingAdminService
    ) { }

    @Get()
    async findAll() {
        return this.landingAdminService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.landingAdminService.findOne(id);
    }

    @Post()
    async create(
        @Body() dto: CreateLandingPageRequestDto
    ) {
        return this.landingAdminService.create(dto);
    }

    @Post('import')
    async importFromUrl(@Body() dto: ImportUrlDto) {
        const html = await this.landingAdminService.importWithInlineStyles(dto.url)
        return { html }
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateLandingPageRequestDto
    ) {
        return this.landingAdminService.update(id, dto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.landingAdminService.remove(id);
        return { deleted: true };
    }
}