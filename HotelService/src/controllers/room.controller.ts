import { StatusCodes } from "http-status-codes";
import { generateRooms } from "../services/roomGeneration.service";
import { NextFunction ,Request,Response} from "express";

export async function createRoomHandler(req: Request,res: Response,next : NextFunction){
    const roomResponse = await generateRooms(req.body);

    res.status(StatusCodes.CREATED).json({
        message: "Room created successfully",
        data: roomResponse,
        success: true
    });
}