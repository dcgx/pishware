import { Test, TestingModule } from '@nestjs/testing';
import { SmtpProfileService } from './smtp-profile.service';

describe('SmtpProfileService', () => {
  let service: SmtpProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmtpProfileService],
    }).compile();

    service = module.get<SmtpProfileService>(SmtpProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
