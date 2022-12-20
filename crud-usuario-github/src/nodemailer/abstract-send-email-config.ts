export interface ISendEmailConfig {
    from?: string
    to: string
    subject: string
    template: any
    context: any
}

export interface ITransporterConfig {
    host: string
    port: number
    secure: boolean
    auth: {
        user: string,
        pass: string
    }
}

export enum HostSendEmailTypes {
    GMAIL = 'smtp.gmail.com'
}

export abstract class SendEmailConfig {
    readonly port: number = 465
    readonly transporter: ITransporterConfig
    protected user: string = process.env.EMAIL
    protected pass: string = process.env.PASSWORD
    sendEmailConfig: ISendEmailConfig
    secure: boolean = true

    constructor (sendMailConfig: ISendEmailConfig) {
        this.sendEmailConfig = sendMailConfig

        this.transporter.port = this.port
        this.transporter.secure = this.secure
        this.transporter.auth.user = this.user
        this.transporter.auth.pass = this.pass
    }

    async send(): Promise<void> {
    }

}