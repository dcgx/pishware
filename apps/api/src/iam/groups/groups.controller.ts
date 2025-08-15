import { Body, Controller, Get, Post } from "@nestjs/common";
import { GroupsService } from "./groups.service";

@Controller('groups')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) {}
    
    @Get()
    async getAll() {
        return this.groupsService.getGroups();
    }
    
    @Post()
    async create(@Body() body: any) {
        return this.groupsService.createGroup(body);
    }
}