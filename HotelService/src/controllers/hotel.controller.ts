import { Request,Response,NextFunction } from "express";
import { createHotelService, deleteHotelService, getAllHotelsService, getHotelByIdService, getHotelByLocationService } from "../services/hotel.service";
import { StatusCodes } from "http-status-codes";


export async function createHotelHandler(req: Request,res: Response,next: NextFunction){
    //1. call service layer
    const hotelResponse = await createHotelService(req.body);

    //2. sends the response
    res.status(StatusCodes.CREATED).json({
        message: "Hotel created successfully",
        data: hotelResponse,
        success: true
    })
}

export async function getHotelByIdHandler(req: Request,res: Response,next: NextFunction){
    
    const hotelResponse=await getHotelByIdService(Number(req.params.id));

    res.status(StatusCodes.OK).json({
        message: "Hotel found successfully",
        data: hotelResponse,
        success: true
    });

}

export async function getAllHotelsHandler(req: Request,res: Response,next: NextFunction){
    const hotelResponse = await getAllHotelsService();
    res.status(StatusCodes.OK).json({
        message: "Hotel's found successfully",
        data: hotelResponse,
        success: true
    });
}

export async function getHotelByLocationHandler(req: Request,res: Response,next: NextFunction){
    const hotelResponse = await getHotelByLocationService(String(req.params.location));
    res.status(StatusCodes.OK).json({
        message: "Hotel's found successfully",
        data: hotelResponse,
        success: true
    });
}

export async function deleteHotelHandler(req: Request,res: Response,next: NextFunction){
    const hotelResponse = await deleteHotelService(Number(req.params.id));
    res.status(StatusCodes.OK).json({
        message: "Hotel's deleted successfully",
        data: hotelResponse,
        success: true
    });
}