import logger from "../config/logger.config";
import Hotel from "../db/models/hotel";
import { createHotelDTO } from "../dto/hotel.dto";
import { NotFoundError } from "../utils/errors/app.error";


export async function createHotel(hotelData : createHotelDTO){
    const hotel=await Hotel.create(hotelData);
    logger.info(`Hotel created: ${hotel.id}`);
    return hotel;
}



export async function getHotelById(id:number) {
    const hotel = await Hotel.findByPk(id);

    if(!hotel){
        logger.error(`Hotel Not Found ${id}`);
        throw new NotFoundError(`Hotel with id ${id} Not Found`);
    }

    return hotel;
}

export async function getAllHotels() {
    const hotels = await Hotel.findAll({
        where:{
            deletedAt: null
        }
    });
    if (!hotels.length) {
        logger.error("No hotels found");
        throw new NotFoundError("No hotels found");
    }
    return hotels;
}


export async function getHotelByLocation(location : string){
    const hotel=await Hotel.findAll({
        where :{
            location
        }
    });

    if (!hotel.length) {
        logger.error("No hotels found");
        throw new NotFoundError("No hotels found");
    }
    logger.info(`Hotels found: ${hotel.length}`);
    
    return hotel;
}

export async function softDeleteHotel(id: number){
    const hotel = await Hotel.findByPk(id);

    if(!hotel){
        logger.error(`Hotel Not Found ${id}`);
        throw new NotFoundError(`Hotel with id ${id} Not Found`);
    }

    hotel.deletedAt = new Date();
    await hotel.save();

    logger.info(`Hotel soft deleted ${hotel.id}`);
    return true;
}
