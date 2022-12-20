import { Request, Response } from "express";
import { generateJWT } from "../json-web-token/generate-jwt";
import { ISendEmailConfig } from "../nodemailer/abstract-send-email-config";
import { SendEmail } from "../nodemailer/send-email-class";
import { userSessionService } from "../services/user-session-service";
import { IUserConfiguration, UserCollection } from "../user/user-config";
import { userControl } from "../user/user-control-class";
import { UserControlManager } from "../user/user-control-manager-class";

export class UserSessionController {

    constructor() {
    }

    async registerUser(req: Request, res: Response) {
        try {
            const userConfiguration: IUserConfiguration = await userSessionService.registerUser(req)

            await userControl.createCollection(userConfiguration)

            return res.status(201).json({
                message: 'User created successfully!',
                token: generateJWT.generateUserToken(((await UserCollection.findOne({ email: userConfiguration.email })).userUuid))
            })
            
        } catch (e) {

            return res.status(400).json({ error: e.message })
        }
    }

    async loginUser(req: Request, res: Response) {
        try {
            const userUuid: string = await userSessionService.loginUser(req)

            return res.status(201).json({
                message: 'User found successfully',
                token: generateJWT.generateUserToken(userUuid)
            })

        } catch (e) {

            return res.status(400).json({ error: e.message })
        }
    }

    async sendMailToRedefinePassword(req: Request, res: Response) {
        try {
            const sendMailConfig: ISendEmailConfig = await userSessionService.sendMailToRedefinePassword(req)
            await new SendEmail(sendMailConfig).send()

            return res.status(201).json({ message: 'Email sent successfully!' })

        } catch (e) {

            return res.status(400).json({ error: e.message })
        }
    }

    async redefinePassword(req: Request, res: Response) {
        try {
            const { newPassword } = req.body
            const user: UserControlManager = await userSessionService.redefinePassword(req)

            await user.updatePassword(newPassword)

            return res.status(201).json({ message: 'Password redefine successfully!' })
        } catch (e) {

            return res.status(400).json({ error: e.message })
        }
    }

    async verifyEmail(req: Request, res: Response) {
        try {
            const userConfiguration: IUserConfiguration = await userSessionService.verifyEmail(req)
            await new UserControlManager(userConfiguration).validateEmail()

            return res.status(201).json({ message: 'Email verified successfully!' })

        } catch (e) {

            return res.status(400).json({ error: e.message })
        }
    }
}

export const userSessionController = new UserSessionController()