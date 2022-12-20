import { verify } from "jsonwebtoken"
import { ISendEmailConfig } from "../nodemailer/abstract-send-email-config"
import { SendEmail } from "../nodemailer/send-email-class"
import { IUserConfiguration } from "../user/user-config"
import { UserControlManager } from "../user/user-control-manager-class"
import { searchUserUtils } from "../utils/search-user-utils"
import { generateJWT } from "./generate-jwt"

export class CheckJWT {
    async check(token: string, notSendEmailAlert: boolean = false): Promise<string> {
        const decodedToken: unknown = verify(token, process.env.SECRET, (e, decoded) => {
            if (e) {
                throw new Error(e.message)
            }

            return JSON.parse(JSON.stringify(decoded)).params || decoded
        })

        if (!notSendEmailAlert) {
            const userConfiguration: IUserConfiguration = await searchUserUtils.findUserByUuid(decodedToken as string)

            const userManager: UserControlManager = new UserControlManager(userConfiguration)

            if (!await userManager.checkIsEmailVerified()) {
                const codeVerify = generateJWT.generateUserToken(userManager.userUuid, '1h')
                const sendEmailConfig: ISendEmailConfig = {
                    to: userManager.email,
                    subject: 'Valide seu email!',
                    template: 'register-user-verify',
                    context: { codeVerify }
                }

                await new SendEmail(sendEmailConfig).send()

                throw new Error('User is not verified, verification email sent!')
            }
        }

        return decodedToken as string
    }
}

export const checkJWT = new CheckJWT()