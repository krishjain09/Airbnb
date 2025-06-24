import { Request,Response,NextFunction } from "express";
import { createHotelService, getAllHotelsService, getHotelByIdService, getHotelByLocationService } from "../services/hotel.service";


export async function createHotelHandler(req: Request,res: Response,next: NextFunction){
    //1. call service layer
    const hotelResponse = await createHotelService(req.body);

    //2. sends the response
    res.status(201).json({
        message: "Hotel created successfully",
        data: hotelResponse,
        success: true
    })
}

export async function getHotelByIdHandler(req: Request,res: Response,next: NextFunction){
    
    const hotelResponse=await getHotelByIdService(Number(req.params.id));

    res.status(200).json({
        message: "Hotel found successfully",
        data: hotelResponse,
        success: true
    });

}

export async function getAllHotelsHandler(req: Request,res: Response,next: NextFunction){
    const hotelResponse = await getAllHotelsService();
    res.status(200).json({
        message: "Hotel's found successfully",
        data: hotelResponse,
        success: true
    });
}

export async function getHotelByLocationHandler(req: Request,res: Response,next: NextFunction){
    const hotelResponse = await getHotelByLocationService(String(req.params.location));
    res.status(200).json({
        message: "Hotel's found successfully",
        data: hotelResponse,
        success: true
    });
}