import axios from "axios"
import { serverConfig } from "../config"

export const getAvailableRooms = async (roomCategoryId : number, checkInDate: string, checkOutDate: string)=>{
   
    const response = await axios.get(`${serverConfig.HOTEL_SERVICE_URL}rooms/available`,{
        params:{
            roomCategoryId,
            checkInDate,
            checkOutDate,
        }
    });
    console.log("Available rooms response:", response.data.data);
    return response.data.data;
}

export const updateBookingIdToRooms = async(bookingId: number,roomIds: number[])=>{
    
    const response = await axios.post(`${serverConfig.HOTEL_SERVICE_URL}rooms/update-booking-id`,{
        bookingId,
        roomIds
    })
    return response.data;
}

export const updateBookingIdToRoomsAsNULL = async(bookingId: number)=>{
    
    const response = await axios.post(`${serverConfig.HOTEL_SERVICE_URL}rooms/update-booking-id-null`,{
        bookingId
    })
    return response.data;
}

export const getUserProfile = async (authHeader :string|undefined ) => {
    const response = await axios.get(`${serverConfig.AUTH_SERVICE_URL}profile`,{
        headers: {
            Authorization: authHeader
        }
    });
    console.log("User profile response:", response.data);
    return response.data;
}

export const getRoomCategory = async (id: number) => {
    const response = await axios.get(`${serverConfig.HOTEL_SERVICE_URL}room-category/${id}`);
    console.log("Room category response:", response.data);
    return response.data;
}