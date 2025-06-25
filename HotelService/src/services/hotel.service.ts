import { createHotelDTO } from "../dto/hotel.dto";
import { createHotel, getAllHotels, getHotelById, getHotelByLocation, softDeleteHotel } from "../repositories/hotel.repository";

export async function createHotelService(hotelData:createHotelDTO) {
    const hotel = await createHotel(hotelData);
    return hotel;
}

export async function getHotelByIdService(id: number){
    const hotel= await getHotelById(id);
    return hotel;
}

export async function getAllHotelsService(){
    const hotel = await getAllHotels();
    return hotel;
}

export async function getHotelByLocationService(location:string) {
    const hotel = await getHotelByLocation(location);
    return hotel;
}

export async function deleteHotelService(id:number) {
    const response = await softDeleteHotel(id);
    return response;
}