export class CreateLandingPageRequestDto {
    name: string;
    html_content: string;
    redirect_url?: string;
    imported_url?: string;
}