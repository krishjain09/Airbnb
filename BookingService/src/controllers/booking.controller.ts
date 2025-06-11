import { Request , Response } from "express";
import { createBookingService , confirmBookingService } from "../services/booking.service";
export async function createBookingHandler(req: Request, res: Response){

    const booking= await createBookingService(req.body);

    res.status(201).json({
        bookingId : booking.bookingId,
        idempotencyKey: booking.idempotencyKey
    })
}

export async function confirmBookingHandler(req: Request, res: Response){

    const booking= await confirmBookingService(req.params.idempotencyKey);

    res.status(201).json({
        bookingId : booking.id,
        idempotencyKey: booking.status
    })
}