import logger from "../config/logger.config";
import RoomCategory from "../db/models/roomCategory";
import { NotFoundError } from "../utils/errors/app.error";
import BaseRepository from "./base.repository";


class RoomCategoryRepository extends BaseRepository<RoomCategory>{
    constructor(){
        super(RoomCategory)
    }

    async findAllByHotelId(hotelId : number) {
        const room_categories = await this.model.findAll({
            where:{
                hotelId : hotelId,
                deletedAt: null
            }
        });
        
        if(!room_categories.length){
            logger.error("No room found");
            throw new NotFoundError(`No room categories found for hotel with id ${hotelId}`);
        }
        
        return room_categories;
    }
}


export default RoomCategoryRepository;