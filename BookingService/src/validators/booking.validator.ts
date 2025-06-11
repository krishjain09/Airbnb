import { z } from "zod";

export const createBookingSchema = z.object(
    {
        userId: z.number({message: "User ID must be present"}),
        hotelId: z.number({message: "Hotel ID must be present"}),
        totalGuests: z.number({message:"Total Guests must be present"}).min(1,{message: "Total Guests must be greater than 1"}),
        bookingAmount: z.number({message:"Booking Amount must be present"}).min(1,{message: "Total Guests must be greater than 1"}),
    }
)