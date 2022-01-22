import path from 'path'
import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import authrouter from './routers/authRouter'
import usersrouter from './routers/usersRouter'

const app = express()

const publicDirectoryPath = path.join(__dirname, './public')
const port : number|string = process.env.PORT || 3000

const db  = () : Promise<void>=> { //TODO Promise<>?
    return mongoose.connect('mongodb://127.0.0.1:27017/authdb'
    // ,
    // {
    //     useNewUrlParser: true,
    // }
    ).then(connected => {
        console.log("Db is ready")
    })
}

app.use(express.static(publicDirectoryPath))

app.use(bodyParser.json())
app.use(cookieParser())

app.use(express.urlencoded({
    extended: true
}))

app.use(session ({
    secret: "a-secret",
    resave: true,
    saveUninitialized: false, 
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/authdb',
        collectionName: 'sessions'
    })
}))

//set routers
app.use(authrouter)
app.use(usersrouter)

db().then(() => {
    app.listen(port, () => {
        console.log(`Server is up on port ${port}`)
    })
})

