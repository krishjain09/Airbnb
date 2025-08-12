import { getAvailableRoomsDTO, updatingBookingIdToRoomsDTO } from "../dto/room.dto";
import RoomRepository from "../repositories/room.repository"


const roomRepository = new RoomRepository();

export async function getAvailableRoomsService(getAvailableRooms: getAvailableRoomsDTO){
    
    const rooms = await roomRepository.findByRoomCategoryIdAndDateRange(getAvailableRooms.roomCategoryId,new Date(getAvailableRooms.checkInDate),new Date(getAvailableRooms.checkOutDate))
    return rooms;
}

export async function updatingBookingIdToRoomsService(updatingBookingIdToRooms: updatingBookingIdToRoomsDTO){
    
    return await roomRepository.updatingBookingIdToRooms(updatingBookingIdToRooms.bookingId, updatingBookingIdToRooms.roomIds)
}

export async function updateBookingIdToRoomsAsNULLService(bookingId: number){
    return await roomRepository.updateBookingIdToRoomsAsNULL(bookingId);
}