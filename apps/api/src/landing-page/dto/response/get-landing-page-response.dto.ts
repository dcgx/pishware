export class GetLandingPageResponseDto {
    id: string;
    name: string;
    html_content: string;
    redirect_url?: string;
    imported_url?: string;
    created_at: Date;
    updated_at: Date;
}