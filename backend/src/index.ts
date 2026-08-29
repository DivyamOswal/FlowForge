import "dotenv/config"
import express from "express"
import type {NextFunction, Response, Request} from "express"
import cors from "cors"
import session from "cookie-session"
import {config} from "./config/app.config.js"
import connectDatabase from "./config/database.config.js"
import { HTTPSTATUS } from "./config/http.config.js"
import { asyncHandler } from "./middlewares/asyncHandler.middleware.js"
import { errorHandler } from "./middlewares/errorHandler.middleware.js"
import { BadRequestException } from "./utils/appError.js"
import { ErrorCodeEnum } from "./enums/error-code-enum.js"

const app = express()
const BASE_PATH = config.BASE_PATH;

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(
    session({
        name: "session",
        keys: [config.SESSION_SECRET],
        maxAge: 24 * 60 * 60 * 1000,
        secure: config.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax"
    })
)

app.get('/', asyncHandler (async(req: Request, res:Response, next:NextFunction)=>{
    throw new BadRequestException("This is a bad request", ErrorCodeEnum.AUTH_INVALID_TOKEN)
    res.status(HTTPSTATUS.OK).json({
        message: "Hello Hi, my name is Divyam"
    })
})
)

app.use(errorHandler)

app.listen(config.PORT, async()=>{
    console.log(`Server running on port ${config.PORT} in ${config.NODE_ENV}`)
    await connectDatabase()
})