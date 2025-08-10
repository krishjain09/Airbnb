import { serverConfig } from "../config";
import transporter from "../config/mailer.config";

export async function sendEmail(to: string,subject: string, html: string){
    try{
    await transporter.sendMail({
            from: serverConfig.MAIL_USER,
            to,
            subject,
            html
        });
    }catch(err){
        return 
    }
}