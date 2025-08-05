import logger from "../config/logger.config";
import Hotel from "../db/models/hotel";
import { NotFoundError } from "../utils/errors/app.error";
import BaseRepository from "./base.repository";

class HotelRepository extends BaseRepository<Hotel>{
    
    constructor(){
        super(Hotel)
    }

    async findAll(){
        const hotels = await this.model.findAll({
            where: {
                deletedAt : null
            }
        })
        if (!hotels.length) {
            logger.error("No hotels found");
            throw new NotFoundError("No hotels found");
        }
        return hotels;
    }

    async softDelete(id : number){
        const hotel = await Hotel.findByPk(id);
        if(!hotel){
            logger.error(`Hotel Not Found ${id}`);
            throw new NotFoundError(`Hotel with id ${id} Not Found`);
        }

        hotel.deletedAt = new Date();
        await hotel.save(); //Save changes to database.

        logger.info(`Hotel soft deleted ${hotel.id}`);
        return true;
    }

}

export default HotelRepository
