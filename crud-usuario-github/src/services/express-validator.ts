import { validationResult } from "express-validator"
import { Request } from "express"

export class ValidateBody {
    async validate(req: Request): Promise<boolean> {
        const result = validationResult(req).array()
        if (result.length) {
            const error = result[0].msg
            throw new Error(error)
        }
        return true
    }
}

export const validateBody = new ValidateBody()