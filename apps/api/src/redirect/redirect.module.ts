import { Module } from '@nestjs/common';
import { RedirectController } from './redirect.controller';
import { LandingPageModule } from 'src/landing/landing-page.module';

@Module({
    imports: [LandingPageModule],
    controllers: [RedirectController],
    providers: [],
})
export class RedirectModule { }