import { Controller, Get, Post } from "@nestjs/common";

@Controller('templates')
export class TemplateController {
    constructor() { }
    @Get()
    findAll() {
        return []
    }

    @Post('create')
    create() {
        // Logic to create a template
        return { message: 'Template created successfully' };
    }
}