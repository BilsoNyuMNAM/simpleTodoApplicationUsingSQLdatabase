import express from "express";
import { prisma } from "../database/lib/prisma.js"
const token = process.env.Token
import jwt from "jsonwebtoken" 
const userRouter = express.Router()


userRouter.post("/signup", function(req,res){
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    //check if the username is already taken or not
   //findUnique: {username:""}
    prisma.user.findUnique({
        where:{
            username:"bilson"
        }
    })
    .then(result=>{
        if(result == null){
            const jwt_token = jwt.sign(username, token);
            prisma.user.create({
                data:{
                    username:username,
                    email:email,
                    password:password,
                    token:jwt_token
                }
            })
            .then(result=>{
                return res.json({
                    message:"user created successfully",
                    result:result
                })
            })
            .catch(error=>{
                return res.json({
                    message:"there was an error creating the user",
                    error:error
                })
            })
        }
        else{
            return res.json({
                message:"username already exist"
            })
        }
    })
    .catch(error=>{
        console.log(error)
    })
    // if(username != " "){
    //     
    // }
    // res.send({
    //     message:"username already taken"
    // })
})
export default userRouter