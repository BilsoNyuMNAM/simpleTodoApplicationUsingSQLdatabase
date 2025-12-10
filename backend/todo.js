import express from "express"
const app = express()
const token_store = process.env.Token
import jwt from "jsonwebtoken"
const todoRouter = express.Router()
import { prisma } from "../database/lib/prisma.js"
//the following route are protected so create a midddle ware where it check and verify for jwt token every time a request is made
function authentication(req, res, next){
    const token = req.headers.authorization.split(' ')[1]
    
    try{
        const name = jwt.verify(token, token_store)
        req.name = name
        // console.log(name)
        next()
    }
    catch(error){
        return res.send({
            message:"the token was unable to verfy"
        })
    }
}
todoRouter.use(authentication) //this middleware will be used in every route 

todoRouter.post('/create', (req,res)=>{
    const title = req.body.taskname
    const Name = req.name
    
    prisma.user.findUnique({
        where:{
            username:Name
        }
    })
    .then(result=>{
        const id = result.id
        prisma.todo.create({
        data:{
            taskname:title,
            user_id: id
        }
        })
        .then(result=>{
            return res.json({
                message:"todo created successfully",
                result: result
            })
        })
        .catch(error=>{
            return res.json({
                message:"error creating the todo",
                error:error
            })
        })

    })
    .catch(error=>{
        res.json({
            info: "this is the error for findUnique username part",
            message:error
        })
    })
    
})

todoRouter.delete('/delete/:id', (req, res)=>{
    const Name = req.name
    const ID = parseInt(req.params.id)
    prisma.user.findUnique({
        where:{
            username:Name
        }
    })
    .then(result=>{
        if(result!=null){
            prisma.todo.delete({
                where:{
                    id:ID
                }
            })
            .then(result=>{
                return res.json({
                    message:"Todo deleted successfully",
                    Result:result
                })
            })
            .catch(error=>{
                return res.json({
                    message:"There was an error deleting the todo",
                    Error:error
                })
            })
        }
        else{
            return res.json({
                message:"this is the message coming from the ID deletion database query part"
            })
        }
    })
    .catch(error=>{
        
        return res.json({
            message:"this error is coming from the username finding query",
            Error:error,
        })
    })
})
todoRouter.put('/update/:id', (req,res)=>{
    // console.log("this is the put route")
    const iD = parseInt(req.params.id)
    const updated = req.body.update
    prisma.todo.update({
        where:{
            id:iD
        },
        data:{
            taskname:updated
        }
    })
    .then(result=>{
        return res.json({
            message:"the task has been updated successfully",
            Result:result                 
        })
    })
    .catch(error=>{
        return res.json({
            info: "the task could not be updated ",
            message:error
        })
    })
})

export default todoRouter