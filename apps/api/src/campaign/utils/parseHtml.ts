import { User } from "src/iam/user-management/entities/user.entity";
import { LandingPageEntity } from "src/landing/entities/landing-page.entity";

export const parseHtmlCampaign = (bodyContent: string | undefined, landingPage: LandingPageEntity, template: any, user: User): string => {
    if (!bodyContent) return '<p>No content</p>';

    let parsedHtml = bodyContent;

    let publicKey = landingPage.public_key

    const trackingToken = `${user.id}-${Date.now()}`;
    const encodedToken = Buffer.from(trackingToken).toString('base64');

    parsedHtml = parsedHtml.replace(/{{FirstName}}/g, user.first_name || 'Valued');
    parsedHtml = parsedHtml.replace(/{{LastName}}/g, user.last_name || '');
    parsedHtml = parsedHtml.replace(/{{Email}}/g, user.email || '');
    parsedHtml = parsedHtml.replace(/{{URL}}/g, `http://localhost:3000/r?k=${publicKey}&t=${encodedToken}`);
    parsedHtml += `<img src="http://localhost:3000/mailer/open?t=${encodedToken}" width="1" height="1" style="display:none;" />`;
    console.log({ parsedHtml });
    return parsedHtml;
}