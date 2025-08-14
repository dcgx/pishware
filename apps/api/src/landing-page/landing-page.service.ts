import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LandingPageEntity } from "./landing-page.entity";

import axios from 'axios'
import * as cheerio from 'cheerio'

@Injectable()
export class LandingPageService {
    constructor(
        @InjectRepository(LandingPageEntity) private readonly landingPageRepository: Repository<LandingPageEntity>
    ) { }

    async findAll(): Promise<LandingPageEntity[]> {
        return this.landingPageRepository.find();
    }

    async create(dto: Partial<LandingPageEntity>): Promise<LandingPageEntity> {
        const landingPage = this.landingPageRepository.create(dto);
        return this.landingPageRepository.save(landingPage);
    }

    async importHtmlFromUrl(rawUrl: string): Promise<string> {
        let origin: string
        try {
            const u = new URL(rawUrl)
            origin = u.origin
        } catch {
            throw new BadRequestException('URL inválida')
        }

        const { data, headers, status } = await axios.get<string>(rawUrl, {
            responseType: 'text',
            headers: { 'User-Agent': 'Mozilla/5.0 (Pishware Importer)' },
            timeout: 15000,
            validateStatus: s => s >= 200 && s < 400,
        })

        if (status >= 300) throw new BadRequestException('No se pudo descargar la página')

        const $ = cheerio.load(data)

        // 1) Elimina scripts por seguridad (puedes permitir algunos si lo necesitas)
        $('script').remove()

        // 2) Asegura <head> y agrega <base>
        if ($('head').length === 0) {
            $('html').prepend('<head></head>')
        }
        const hasBase = $('head base').length > 0
        if (!hasBase) {
            $('head').prepend(`<base href="${origin}/">`)
        }

        // 3) Reescribe atributos relativos a absolutos
        const attrs = ['href', 'src', 'action']
        const tags = ['a', 'link', 'img', 'script', 'form', 'source', 'video', 'audio']
        tags.forEach(tag => {
            $(tag).each((_, el) => {
                attrs.forEach(attr => {
                    const val = $(el).attr(attr)
                    if (!val) return
                    // ignora anchors/mailto/tel/data
                    if (val.startsWith('#') || val.startsWith('mailto:') || val.startsWith('tel:') || val.startsWith('data:')) return
                    try {
                        const abs = new URL(val, rawUrl).href
                        $(el).attr(attr, abs)
                    } catch { /* noop */ }
                })
            })
        })

        // 4) (Opcional) Redirige formularios a tu colector
        // $('form').each((_, el) => {
        //   $(el).attr('action', `${process.env.APP_URL}/collect`)
        //   $(el).attr('method', 'POST')
        // })

        // 5) Devuelve HTML "limpio"
        return $.html()
    }
}

