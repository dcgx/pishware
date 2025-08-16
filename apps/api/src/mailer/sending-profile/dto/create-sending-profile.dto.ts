export class CreateSendingProfileDto {
  name: string;
  interfaceType: string;
  smtpFrom: string;
  host: string;
  username: string;
  password: string;
  ignoreCertErrors?: boolean;
  emailHeaders?: Record<string, string>;
}
