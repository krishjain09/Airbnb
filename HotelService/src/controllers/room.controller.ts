import { StatusCodes } from "http-status-codes";
import { getAvailableRoomsService, updateBookingIdToRoomsAsNULLService, updatingBookingIdToRoomsService } from "../services/room.service";
import {Request,Response,NextFunction} from 'express'


export async function getAvailableRoomsHandler(req: Request,res: Response,next: NextFunction){

    //1. call service layer
    const roomResponse = await getAvailableRoomsService({
        roomCategoryId : Number(req.query.roomCategoryId),
        checkInDate : req.query.checkInDate as string,
        checkOutDate: req.query.checkOutDate as string
    });

    //2. sends the response
    res.status(StatusCodes.CREATED).json({
        message: "Rooms found successfully",
        data: roomResponse,
        success: true
    })
}

export async function updatingBookingIdToRoomsHandler(req: Request,res: Response,next: NextFunction){
    //1. call service layer
    const roomResponse = await updatingBookingIdToRoomsService(req.body);

    //2. sends the response
    res.status(StatusCodes.CREATED).json({
        message: "Booking ID updated to rooms successfully",
        data: roomResponse,
        success: true
    })
}

export async function updateBookingIdToRoomsAsNULLHandler(req: Request, res: Response, next: NextFunction) {
    //1. call service layer
    const roomResponse = await updateBookingIdToRoomsAsNULLService(req.body.bookingId);

    //2. sends the response
    res.status(StatusCodes.CREATED).json({
        message: "Booking ID updated to NULL successfully",
        data: roomResponse,
        success: true
    })
}