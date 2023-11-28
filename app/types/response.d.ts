import { Meta } from "./global"

export interface Response{
    message: string
    data: any
    meta?: Meta
    errors?: any
}

export interface ErrorResponse{
    message: string
    error: string
    statusCode
}