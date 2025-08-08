import { Controller, Get, Post } from "@nestjs/common";

@Controller('templates')
export class TemplatesController {
    constructor() { }
    @Get()
    getTemplates() {
        return []
    }

    @Post('create')
    createTemplate() {
        // Logic to create a template
        return { message: 'Template created successfully' };
    }
}