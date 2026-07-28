import type { Response } from "express";

interface IMetaData {
    page: number;
    limit: number;
    total: number;
}


interface IResponseData<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    meta: IMetaData
}

export const sendResponse = <T>(res: Response, data: IResponseData<T>) => {
    res.status(data.statusCode).json({
        success: data.success,
        statusCode: data.statusCode,
        message: data.message,
        data: data.data,
        meta: data.meta
    })
}


