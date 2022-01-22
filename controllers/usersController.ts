import { RequestHandler } from 'express'//TODO 

import User, { IUser } from '../model/UserModel'

//list all users
export const getUsers : RequestHandler = async (req, res, next) => {

    try{

        //find and get the user info to display
       const users = await User.find()
       const usersInfo = users.map(element => {
        return {
            name: element.name,
            surname : element.surname,
            userName : element.userName
        }
    })
        res.status(200).send(usersInfo)

    }catch(e){
        res.status(400).send("Cannot get users")
    }
    
}
