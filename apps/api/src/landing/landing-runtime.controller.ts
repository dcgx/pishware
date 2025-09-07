import { Controller, Get, Query, Res, HttpStatus, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from 'src/iam/user-management/user-management.service';
import { LandingAdminService } from 'src/landing/landing-admin.service';
import { TrackingService } from 'src/tracking/tracking.service';

@Controller('r')
export class LandingRuntimeController {
    constructor(
        private readonly landingAdminService: LandingAdminService,
        private readonly trackingService: TrackingService,
        private readonly userService: UsersService,
    ) { }

    @Get()
    async showRedirect(
        @Query('k') key: string,
        @Query('t') token: string,
        @Res() res: Response,
    ) {
        console.log(`Event received key=${key} event=openLanding`);
        let decodedtoken = Buffer.from(token || '', 'base64').toString('ascii');
        let timestamp = decodedtoken.split('-').pop();
        let userId = decodedtoken.replace(`-${timestamp}`, '');
        let user = await this.userService.findOne(userId);

        if (!key) {
            return res.status(HttpStatus.BAD_REQUEST).send('Missing key');
        }

        const landingPage = await this.landingAdminService.findByPublicKey(key);
        if (!landingPage) {
            return res.status(HttpStatus.NOT_FOUND).send('Landing page not found');
        }

        try {
            await this.trackingService.logEvent('email_opened', { token }, {}, userId);

            await setTimeout(async () => {
                await this.trackingService.logEvent('landing_viewed', null, { key, landingId: landingPage.id }, user?.id.toString());
            }, 500)

        } catch (error) {
            console.error('Error logging landing_viewed event:', error);
        }

        const withAction = (landingPage.html_content || '')
            .replace(/<form[^>]*action="[^"]*"([^>]*)>/i, `<form action="http://localhost:3000/r/submit?k=${key}&t=${token}"$1>`)
            .replace(/<form([^>]*)method="get"/i, `<form$1 method="post"`) // si venía GET, lo cambiamos a POST
            .replace(/<form(?![^>]*method=)/i, `<form method="post"`); // si no tenía method, agregamos POST

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');

        return res.status(HttpStatus.OK).send(withAction);
    }

    @Post('submit')
    async handleSubmit(
        @Query('k') key: string,
        @Query('t') token: string,
        @Body() body: any,
        @Res() res: Response,
    ) {
        if (!key) {
            return res.status(HttpStatus.BAD_REQUEST).send('Missing key');
        }

        let decodedtoken = Buffer.from(token || '', 'base64').toString('ascii');
        let timestamp = decodedtoken.split('-').pop();
        let userId = decodedtoken.replace(`-${timestamp}`, '');
        let user = await this.userService.findOne(userId);

        const landingPage = await this.landingAdminService.findByPublicKey(key);
        await this.trackingService.logEvent('landing_submitted', body, { key, landingId: landingPage?.id }, user?.id.toString());
        const redirectUrl = landingPage?.redirect_url || `https://google.com/`;
        return res.status(HttpStatus.FOUND).redirect(redirectUrl);
    }
}
