import { PartialType } from '@nestjs/mapped-types';
import { CreateSendingProfileDto } from './create-sending-profile.dto';

export class UpdateSendingProfileDto extends PartialType(CreateSendingProfileDto) {}
