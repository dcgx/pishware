import { Test, TestingModule } from '@nestjs/testing';
import { SmtpProfileController } from './smtp-profile.controller';
import { SmtpProfileService } from './smtp-profile.service';

describe('SmtpProfileController', () => {
  let controller: SmtpProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmtpProfileController],
      providers: [SmtpProfileService],
    }).compile();

    controller = module.get<SmtpProfileController>(SmtpProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
