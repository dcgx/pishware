import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { GroupEntity } from './group.entity';
import { ProfileEntity } from '../profile/profile.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
  ) {}

  async getGroups() {
    return this.groupRepository.find({ relations: ['profiles'] });
  }

  async getGroupByProfileId(id: string) {
    const profile = await this.profileRepository.findOne({
      where: { id },
      relations: ['groups'],
    });
    return profile?.groups ?? [];
  }

  async getGroupsByUserId(userId: string) {
    const profile = await this.profileRepository.findOne({
      where: { id: userId },
      relations: ['groups'],
    });
    return profile?.groups.map((g) => g.id) ?? [];
  }

  async createGroup(body: { name: string; users: any[] }) {
    const userIds = Array.isArray(body.users)
      ? body.users
          .filter(
            (u) =>
              u &&
              typeof u === 'object' &&
              'id' in u &&
              typeof u.id === 'string'
          )
          .map((u) => u.id)
      : [];
    const profiles = userIds.length
      ? await this.profileRepository.findBy({ id: In(userIds) })
      : [];
    const group = this.groupRepository.create({
      name: body.name,
      profiles,
    });
    return this.groupRepository.save(group);
  }
}
