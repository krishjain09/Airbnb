import { createRoomCategoryDTO } from "../dto/roomCategory.dto";
import HotelRepository from "../repositories/hotel.repository";
import RoomCategoryRepository from "../repositories/roomCategory.repository";
import { NotFoundError } from "../utils/errors/app.error";


const roomCategoryRepository = new RoomCategoryRepository();
const hotelRepository = new HotelRepository();

export async function getAllRoomCategoryServiceByHotelId(id: number){
    const hotel = await hotelRepository.findById(id);
    if(!hotel){
        throw new NotFoundError(`No hotel found with given hotel id ${id}`)
    }
    const roomCategories = roomCategoryRepository.findAllByHotelId(id);

    return roomCategories;
}

export async function createRoomCategoryService(roomCategoryData:createRoomCategoryDTO) {
    const roomCategory = await roomCategoryRepository.create(roomCategoryData);
    return roomCategory;
} 
