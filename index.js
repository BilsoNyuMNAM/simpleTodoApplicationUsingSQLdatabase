import 'dotenv/config.js';
import express from "express"
import userRouter from "./backend/user.js"
import todoRouter from './backend/todo.js';
const app = express()
const PORT = 3000
app.use(express.json())
app.use(userRouter)
app.use(todoRouter)
app.listen(PORT)