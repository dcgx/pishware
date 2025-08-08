import { Body, Controller, Get, Post } from "@nestjs/common";
import { TemplateService } from "./template.service";
import { CreateTemplateDto } from "./dto/create-template.dto";

@Controller('templates')
export class TemplateController {
    constructor(
        private readonly templateService: TemplateService
    ) { }

    @Get()
    findAll() {
        return this.templateService.findAll();
    }

    @Post('create')
    create(
        @Body() dto: CreateTemplateDto
    ) {
        console.log('Creating template with data:', dto);
        return this.templateService.create(dto);
    }
}