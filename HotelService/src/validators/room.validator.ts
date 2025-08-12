import { z } from "zod";

export const getAvailableRoomsSchema = z.object({
    checkInDate : z.string({message: "Check-in date must be present"}),
    checkOutDate : z.string({message: "Check-out date must be present"}),
    roomCategoryId: z.string({message: "Room Category ID must be present"})
})

export const updatingBookingIdToRoomsSchema = z.object({
    bookingId : z.number({message: "Booking ID must be present"}),
    roomIds : z.array(z.number({message: "Room IDs must be present"})),
})