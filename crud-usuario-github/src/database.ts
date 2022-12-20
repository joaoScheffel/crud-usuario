import mongoose from "mongoose"

export class MongooseConnectConfiguration {
    protected databaseURL: string = process.env.DATABASE_URL
    constructor () {
        mongoose.connect(this.databaseURL, (e) => {
            if (e) {
                console.log(e)
            } else {
                console.log('Connected to database!')
            }
        })
    }
}