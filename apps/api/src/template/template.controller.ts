import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { TemplateService } from "./template.service";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('templates')
export class TemplateController {
    constructor(
        private readonly templateService: TemplateService
    ) { }

    @Get()
    findAll() {
        return this.templateService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.templateService.findOne(Number(id));
    }

    @Post('create')
    create(
        @Body() dto: CreateTemplateDto
    ) {
        console.log('Creating template with data:', dto);
        return this.templateService.create(dto);
    }

    @Post(':templateId/attachment/upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadAttachment(
        @Param('templateId') templateId: number,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.templateService.uploadAttachment(templateId, file);
    }
}