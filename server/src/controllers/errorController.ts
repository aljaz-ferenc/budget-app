import { NextFunction, Response, Request } from "express";

class CustomError extends Error{
    statusCode: number
    status: string

    constructor(message: string, statusCode: number){
        super(message)

        this.statusCode = statusCode
        this.status = `${statusCode}`.toString().startsWith('4') ? 'fail' : 'error'
    }
}

const GlobalErrorHandler = (err: CustomError,_req: Request,res: Response, _next: NextFunction) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
};

module.exports = {CustomError, GlobalErrorHandler}