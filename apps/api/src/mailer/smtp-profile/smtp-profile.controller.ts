import { Controller } from '@nestjs/common';
import { SmtpProfileService } from './smtp-profile.service';

@Controller('smtp-profile')
export class SmtpProfileController {
  constructor(private readonly smtpProfileService: SmtpProfileService) {}
}
