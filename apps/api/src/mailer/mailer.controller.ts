import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { TrackingService } from 'src/tracking/tracking.service';

@Controller('mailer')
export class MailerController {
    constructor(
        private readonly trackingService: TrackingService,
    ) { }

    /**
     * Tracking de apertura de correo (pixel 1x1)
     * Ejemplo: <img src="http://localhost:3000/mailer/open?t=TOKEN" />
     */
    @Get('open')
    async trackOpen(@Query('t') token: string, @Res() res: Response) {
        let decodedtoken = Buffer.from(token || '', 'base64').toString('ascii');
        let timestamp = decodedtoken.split('-').pop();
        let userId = decodedtoken.replace(`-${timestamp}`, '');

        // if (token) {
        //     await this.trackingService.logEvent('email_opened', { token }, {}, userId);
        // }

        const pixel = Buffer.from(
            'R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
            'base64',
        );
        res.setHeader('Content-Type', 'image/gif');
        res.setHeader('Content-Length', pixel.length.toString());
        return res.end(pixel);
    }

    /**
     * Tracking de clic en enlace
     * Ejemplo: <a href="http://localhost:3000/mailer/click?t=TOKEN">Ir al sitio</a>
     */
    @Get('click')
    async trackClick(@Query('t') token: string, @Res() res: Response) {
        let decodedtoken = Buffer.from(token || '', 'base64').toString('ascii');
        let timestamp = decodedtoken.split('-').pop();
        let userId = decodedtoken.replace(`-${timestamp}`, '');

        if (token) {
            await this.trackingService.logEvent('link_clicked', { token }, {}, userId);
        }

        // Redirige al landing real (puedes parametrizarlo)
        return res.redirect('http://localhost:3000/landing');
    }
}
