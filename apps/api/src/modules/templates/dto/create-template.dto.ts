import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator'

export class CreateTemplateDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  type: string

  @IsNotEmpty()
  @IsString()
  body_content: string

  @IsOptional()
  @IsArray()
  attachments?: string[]
}
