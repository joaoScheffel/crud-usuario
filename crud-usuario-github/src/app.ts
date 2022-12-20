import express, { Express } from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { MongooseConnectConfiguration } from './database'
import { routesApiConfiguration, routesClientConfiguration } from './routes'



export class AppServer {
    protected _express: Express
    constructor () {
        this._express = express()
        this.appServerConfiguration()
    }

    appServerConfiguration() {
        dotenv.config()
        this._express.use(morgan('dev'))
        this._express.use(express.json())
        this._express.use(express.urlencoded({ extended: true }))

        this._express.use(routesApiConfiguration())
        this._express.use(routesClientConfiguration())

        this._express.listen(process.env.PORT, () => {
            console.log(`Backend running in http://localhost:${process.env.PORT} `)
        })
    }
}

new AppServer
new MongooseConnectConfiguration