import { body } from "express-validator"

export const validatorUserSessionRegister = [
    body('email')
        .isEmail().withMessage('The email must be valid!')
        .isLowercase().withMessage('The email must be in lowercase!'),

    body('telephone')
        .isNumeric({ no_symbols: true }).withMessage('The telephone must be numeric!'),

    body('name')
        .isLength({ min: 3 }).withMessage('The name must have 3 letters!')
        .isAlpha('pt-BR', { ignore: ' ' }).withMessage('The name cant have numbers!'),

    body('birthDate')
        .isDate().withMessage('The date must be valid!')
        .custom((value, { req }) => {
            const date = new Date(req.body.birthDate)

            function maiorQueDezoito(data: Date) {
                const now = new Date()
                const moreThan18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate())

                return moreThan18 <= now
            }
            if (value && !maiorQueDezoito(date)) {
                throw new Error('The user must be 18 years!')
            }
            return true
        }),

    body('username')
        .isLength({ min: 3, max: 16 }).withMessage('The username must have a minimum of 3 letters and a maximum of 16!'),

    body('password')
        .trim().not().isEmpty().isLength({ min: 8 }).withMessage('The password must have a minimum of 8 letters!')
]