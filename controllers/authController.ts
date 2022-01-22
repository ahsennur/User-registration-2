import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { RequestHandler } from 'express'//TODO 

import User, { IUser } from '../model/UserModel'

const SECRET = 'aurora'

export const register : RequestHandler = async (req, res, next) => {

    try{
        //create the user to register
        const user = new User() //TODO  : mongoose.Models (didnt write any type)
        user.name = req.body.name,
        user.surname = req.body.surname,
        user.userName = req.body.userName,

        //hash the password
        user.password = bcrypt.hashSync( req.body.password, 10)

        //generate the jwt token 
        const token = jwt.sign({ _id: user._id.toString() }, SECRET, {expiresIn:'7d'} )
        user.token = token

        const saved = await user.save()

        res.cookie("token", token, {
            httpOnly: true,
        })

        //session data
        req.session.useragent = req.headers['user-agent']
        req.session.user = user._id

        res.status(201).send(saved)
    
    }catch(e){
        res.status(400).send("username exists")
    }
    
}

export const login : RequestHandler = async (req, res, next) => {

    try{
        //check database with the username
        const user = await User.findOne({userName: req.body.userName})
        if(user){

            //check if the hashed password matches
            const pass = bcrypt.compareSync(req.body.password, user.password)

            if(pass){

                //session data
                req.session.useragent = req.headers['user-agent']      //TODO          
                req.session.user = user._id

                //generate the jwt token 
                const token = jwt.sign({ _id: user._id.toString() }, SECRET, {expiresIn:'7d'} ) //id is any, why?

                user.token = token
                const saved = await user.save()

                res.cookie("token", token, {
                    httpOnly: true,
                })

                res.status(200).send(saved)
            }
            else{
                res.status(400).send("wrong password")
            }
        }

        else{
            res.status(400).send('no such user')
        }
    
    }catch(e){
        res.status(400).send("cannot login")
    }
    
}


export const logout : RequestHandler = async (req, res, next) => {

    try{
        if(req.userId){
            //remove the data
            req.userId = undefined
            res.clearCookie("token")
            res.clearCookie("connect.sid")
            req.session.destroy(() => {})
            // req.session = null
        }
        res.status(200).send()
    }catch(e){
        res.status(400).send()
    }
    
}