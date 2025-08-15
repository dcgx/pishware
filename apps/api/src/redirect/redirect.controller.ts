import { Controller, Get, Query, Res, HttpStatus, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { LandingPageService } from 'src/landing/landing-page.service';

@Controller('r')
export class RedirectController {
    constructor(private readonly landingPageService: LandingPageService) { }

    @Get()
    async showRedirect(
        @Query('k') key: string,
        @Res() res: Response,
    ) {
        console.log(`Event received key=${key} event=openLanding`);
        if (!key) {
            return res.status(HttpStatus.BAD_REQUEST).send('Missing key');
        }

        const landingPage = await this.landingPageService.findByPublicKey(key);
        if (!landingPage) {
            return res.status(HttpStatus.NOT_FOUND).send('Landing page not found');
        }

        const withAction = (landingPage.html_content || '')
            .replace(/<form[^>]*action="[^"]*"([^>]*)>/i, `<form action="http://localhost:3000/r/submit?k=${key}"$1>`)
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
        @Body() body: any,
        @Res() res: Response,
    ) {
        if (!key) {
            return res.status(HttpStatus.BAD_REQUEST).send('Missing key');
        }

        const redirectUrl = `https://google.com/`
        console.log(`Event received key=${key} event=submitLanding`, body, res);
        return res.status(HttpStatus.FOUND).redirect(redirectUrl);
    }
}
