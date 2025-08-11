import { z } from "zod";

export const createBookingSchema = z.object(
    {
        userId: z.number({message: "User ID must be present"}),
        hotelId: z.number({message: "Hotel ID must be present"}),
        totalGuests: z.number({message:"Total Guests must be present"}).min(1,{message: "Total Guests must be greater than 1"}),
        bookingAmount: z.number({message:"Booking Amount must be present"}).min(1,{message: "Total Guests must be greater than 1"}),
        checkInDate : z.string({message: "Check-in date must be present"}),
        checkOutDate : z.string({message: "Check-out date must be present"}),
        roomCategoryId: z.string({message: "Room Category ID must be present"})
    }
)