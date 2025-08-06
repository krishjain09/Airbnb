import { StatusCodes } from "http-status-codes";
import { NextFunction ,Request,Response} from "express";
import { addRoomGenerationJobToQueue } from "../producers/roomGeneration.producer";

export async function createRoomHandler(req: Request,res: Response,next : NextFunction){
    
    await addRoomGenerationJobToQueue(req.body);

    res.status(StatusCodes.OK).json({
        message: "Room generation job added to queue",
        success: true,
        data: {},
    })
}