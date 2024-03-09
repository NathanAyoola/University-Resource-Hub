  import { userInterface } from '../interfaces/userInterface';
  import nodeMailer from 'nodemailer';
  import SMTPTransport from 'nodemailer/lib/smtp-transport';
  import config from 'config';
  
  const SMTP_SERVER = config.get<string>("SMTP_SERVER");
  const SMTP_PORT = config.get<number>("SMTP_PORT");
  const USERNAME = config.get<string>("USERNAME");
  const PASSWORD = config.get<string>("PASSWORD");
  const DOMAIN_EMAIL = config.get<string>("DOMAIN_EMAIL");

  class Emailing {
    
    private transporter;
  
    constructor() {
      this.transporter = nodeMailer.createTransport({
        host: SMTP_SERVER,
        port: +SMTP_PORT,
        secure: true, // use TLS
        auth: {
          user: USERNAME,
          pass: PASSWORD
        }
      });
    }
        
    
    async verifyEmail(email: string, verificationToken: string):Promise<void> {
      // eslint-disable-next-line no-useless-catch
      try {
        await this.transporter.sendMail({
            from: DOMAIN_EMAIL,
            to: email,
            subject: 'Verify Your Email',
            text: `Please click the following link to verify your email: ${verificationToken}`
        }
        );
      } catch (error) {
        throw error;
      }
    }
  
    async sendResetPassword(email:string, resetToken:string):Promise<void> {
      // eslint-disable-next-line no-useless-catch
      try {
        await this.transporter.sendMail({
            from: DOMAIN_EMAIL,
            to: email,
            subject: 'Reset your password',
            text: `Please click the following link to reset your password: ${resetToken}`
        }
        );
      } catch (error) {
        throw error;
      }
    }
  }
  
  export default new Emailing();
  