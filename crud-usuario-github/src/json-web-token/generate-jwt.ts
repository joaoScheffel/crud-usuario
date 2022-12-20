import { sign } from "jsonwebtoken";

export class GenerateJWT {
    generateUserToken(params: {} = {}, expiresIn?: string | number) {
        if (expiresIn) {
            return sign({params}, process.env.SECRET, { expiresIn: expiresIn })
        }

        return sign({params}, process.env.SECRET)
    }
}

export const generateJWT = new GenerateJWT()