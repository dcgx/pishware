import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LandingPageEntity } from "./landing-page.entity";
import axios from "axios";
// import juice from "juice";
import * as cheerio from 'cheerio'

const juice = require('juice') as typeof import('juice');


const UA = 'Mozilla/5.0 (Pishware Importer)';

@Injectable()
export class LandingPageService {
    constructor(
        @InjectRepository(LandingPageEntity) private readonly landingPageRepository: Repository<LandingPageEntity>
    ) { }

    async findAll(): Promise<LandingPageEntity[]> {
        return this.landingPageRepository.find();
    }

    async findByPublicKey(key: string): Promise<LandingPageEntity | null> {
        console.log('Finding landing page by public key:', key);
        return this.landingPageRepository.findOne({ where: { public_key: key } });
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


    async importWithInlineStyles(rawUrl: string): Promise<string> {
        let origin: string;
        try {
            const u = new URL(rawUrl);
            origin = u.origin;
        } catch {
            throw new BadRequestException('URL inválida');
        }

        const { data, headers, status } = await axios.get<string>(rawUrl, {
            responseType: 'text',
            headers: { 'User-Agent': UA },
            timeout: 15000,
            validateStatus: s => s >= 200 && s < 400,
        });
        if (status >= 300) throw new BadRequestException('No se pudo descargar la página');

        const $ = cheerio.load(data);

        // 1) Seguridad mínima
        $('script').remove();

        // 2) Asegura <head> y <base>
        if ($('head').length === 0) $('html').prepend('<head></head>');
        if ($('head base').length === 0) $('head').prepend(`<base href="${origin}/">`);

        // 3) Reescribe atributos relativos -> absolutos
        const attrs = ['href', 'src', 'action'];
        const tags = ['a', 'link', 'img', 'script', 'form', 'source', 'video', 'audio'];
        tags.forEach(tag => {
            $(tag).each((_, el) => {
                attrs.forEach(attr => {
                    const val = $(el).attr(attr);
                    if (!val) return;
                    if (val.startsWith('#') || val.startsWith('mailto:') || val.startsWith('tel:') || val.startsWith('data:')) return;
                    try {
                        const abs = new URL(val, rawUrl).href;
                        $(el).attr(attr, abs);
                    } catch { /* noop */ }
                });
            });
        });

        // 4) Descarga todas las hojas de estilo <link rel="stylesheet"> y embebe como <style>
        const linkEls = $('link[rel="stylesheet"]').toArray();
        for (const el of linkEls) {
            const href = $(el).attr('href');
            if (!href) { $(el).remove(); continue; }
            try {
                const css = await this.loadCssWithImports(href);
                // Opcional: pequeña sanitización de @font-face si no te interesa
                $('head').append(`<style data-inlined-href="${href}">${css}</style>`);
                $(el).remove();
            } catch {
                // si una hoja falla, al menos la quitamos para no romper el inlining
                $(el).remove();
            }
        }

        // 5) (Opcional) Redirige formularios a tu colector
        // $('form').attr('action', `${process.env.APP_URL}/r/submit?k={{PUBLIC_KEY}}`).attr('method','POST');

        // 6) Incrusta estilos como inline con juice
        const htmlBeforeJuice = $.html();
        console.log('HTML before inlining:', htmlBeforeJuice);
        const inlined = juice(htmlBeforeJuice, {
            preserveMediaQueries: true,
            applyWidthAttributes: true,
            applyHeightAttributes: true,
            inlinePseudoElements: true,
            removeStyleTags: true, // elimina los <style> tras inlining
        });

        // 7) (Opcional) Limpiezas finales
        // - elimina comentarios HTML si quieres
        // - añade no-cache headers cuando lo sirvas
        console.log('HTML inlined successfully', inlined);
        return inlined;
    }


    async loadCssWithImports(href: string, depth = 0): Promise<string> {
        const { data: css } = await axios.get<string>(href, {
            responseType: 'text',
            headers: { 'User-Agent': UA },
            timeout: 12000,
            validateStatus: s => s >= 200 && s < 400,
        });

        let processed = this.absolutizeCssUrls(css, href);

        if (depth < 2) {
            const importRe = /@import\s+url\(['"]?([^'")]+)['"]?\)[^;]*;/g;
            const imports = Array.from(processed.matchAll(importRe));
            for (const m of imports) {
                try {
                    const childHref = new URL(m[1], href).href;
                    const childCss = await this.loadCssWithImports(childHref, depth + 1);
                    processed = processed.replace(m[0], childCss);
                } catch {
                    // si falla algún import, lo dejamos tal cual
                }
            }
        }

        return processed;
    }


    absolutizeCssUrls(css: string, baseHref: string): string {
        // url(...)
        css = css.replace(
            /url\(\s*(['"]?)(?!data:|https?:|mailto:|tel:|#)([^'")]+)\1\s*\)/g,
            (_m, q, rel) => {
                try {
                    const abs = new URL(rel, baseHref).href;
                    return `url(${q || ''}${abs}${q || ''})`;
                } catch {
                    return _m;
                }
            },
        );
        // @import
        css = css.replace(
            /@import\s+(?:url\()?['"]?(?!data:|https?:|\/)([^'")]+)['"]?\)?([^;]*);/g,
            (_m, rel, rest) => {
                try {
                    const abs = new URL(rel, baseHref).href;
                    return `@import url('${abs}')${rest};`;
                } catch {
                    return _m;
                }
            },
        );
        return css;
    }

}


