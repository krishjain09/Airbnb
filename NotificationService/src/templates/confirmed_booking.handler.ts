import fs from "fs"
import path from "path"
import Handlebars from "handlebars"
import { InternalServerError } from "../utils/errors/app.error";

export async function renderConfirmedBookingEmail(templateId: string, params: Record<string,any>): Promise<string> {
    const templatePath = path.join(__dirname, "mailer", `${templateId}.hbs`);
    try{
            const source = await fs.promises.readFile(templatePath, 'utf-8');
            const template = Handlebars.compile(source);
            return template(params);
        }catch(e){
            throw new InternalServerError(`Error rendering mail template: ${e}`)
        }
}