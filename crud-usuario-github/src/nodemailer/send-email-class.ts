import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import path from 'path'
import { IUserConfiguration } from '../user/user-config'
import { searchUserUtils } from '../utils/search-user-utils'
import { HostSendEmailTypes, ISendEmailConfig, ITransporterConfig, SendEmailConfig } from './abstract-send-email-config'

export class SendEmail extends SendEmailConfig {
    readonly host: HostSendEmailTypes = HostSendEmailTypes.GMAIL
    readonly transporterConfig: ITransporterConfig
    readonly isEmailForAllAdmins?: boolean

    constructor (sendMailConfig: ISendEmailConfig, isEmailForAllAdmins?: boolean) {
        super(sendMailConfig)
        this.isEmailForAllAdmins = isEmailForAllAdmins
        this.transporterConfig = this.transporter
        this.transporterConfig.host = this.host
    }

    async send(): Promise<void> {
        if (this.isEmailForAllAdmins) {
            return await this.sendEmailForAllAdmins()
        }

        return await this.sendEmailDefault()

    }

    async sendEmailDefault() {
        const transporter = nodemailer.createTransport(this.transporterConfig)

        transporter.use('compile', hbs({
            viewEngine: {
                defaultLayout: undefined,
                partialsDir: path.resolve('src/nodemailer/emails')
            },
            viewPath: path.resolve('src/nodemailer/emails'),
            extName: '.html'
        }))

        await transporter.sendMail(this.sendEmailConfig)
    }

    async sendEmailForAllAdmins() {
        const admins: IUserConfiguration[] = await searchUserUtils.findAllAdminsAndMaster()
        if (admins?.length) {
            for (const adm of admins) {
                const email = adm.email

                this.sendEmailConfig.to = email

                const transporter = nodemailer.createTransport(this.transporterConfig)

                transporter.use('compile', hbs({
                    viewEngine: {
                        defaultLayout: undefined,
                        partialsDir: path.resolve('src/nodemailer/emails')
                    },
                    viewPath: path.resolve('src/nodemailer/emails'),
                    extName: '.html'
                }))

                await transporter.sendMail(this.sendEmailConfig)
            }
        }
    }
}
