import { PartialType } from '@nestjs/mapped-types';
import { CreateLandingPageRequestDto } from './create-landing-page-request.dto';

export class UpdateLandingPageRequestDto extends PartialType(CreateLandingPageRequestDto) {}
