import { Router } from "express"
import { userSessionController } from "./controllers/user-session-controller"
import { validatorUserSessionRegister } from "./services/user-session-express-validator"

export const routesApiConfiguration = (): Router => {
    const routes = Router()

    routes.post('/api/user/register', validatorUserSessionRegister, userSessionController.registerUser)
    routes.post('/api/user/login', userSessionController.loginUser)
    routes.post('/api/user/verify-email', userSessionController.verifyEmail)
    routes.post('/api/user/miss-password', userSessionController.sendMailToRedefinePassword)
    routes.post('/api/user/redefine-password', userSessionController.redefinePassword)

    return routes
}

export const routesClientConfiguration = (): Router => {
    const routes = Router()

    routes.get('/verify-email', (req, res) => {
        res.sendFile(__dirname + '/html/verify-email.html')
    })

    routes.get('/redefine-password', (req, res) => {
        res.sendFile(__dirname + '/html/redefine-password.html')
    })

    return routes
}