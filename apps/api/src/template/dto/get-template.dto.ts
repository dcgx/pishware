import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator'

export class GetTemplateDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  type: string

  @IsNotEmpty()
  @IsString()
  body_content: string

  @IsNotEmpty()
  @IsString()
  subject: string

  @IsOptional()
  @IsArray()
  attachments?: string[]

  @IsOptional()
  @IsString()
  created_by?: string

  @IsOptional()
  @IsString()
  created_at?: string

  @IsOptional()
  @IsString()
  updated_at?: string


}
