import { IsUrl } from 'class-validator'

export class ImportUrlDto {
    @IsUrl({ require_tld: true, protocols: ['http', 'https'] })
    url: string
}