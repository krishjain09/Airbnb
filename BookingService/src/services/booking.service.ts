import prismaClient from "../prisma/client";
import { CreateBookingDTO } from "../dto/booking.dto";
import {getIdempotencyKeyWithLock,confirmBooking,finalizeIdempotencyKey,createBooking,createIdempotencyKey} from "../repositories/booking.repository"
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { generateIdempotencyKey } from "../utils/generateIdempotencyKey";

export async function createBookingService(createBookingDTO : CreateBookingDTO) {
    const booking = await createBooking({
        userId: createBookingDTO.userId,
        hotelId: createBookingDTO.hotelId,
        bookingAmount: createBookingDTO.bookingAmount,
        totalGuests: createBookingDTO.totalGuests
    });

    const idempotencyKey = generateIdempotencyKey();

    await createIdempotencyKey(idempotencyKey,booking.id);

    return {
        bookingId: booking.id,
        idempotencyKey: idempotencyKey
    }
}

export async function confirmBookingService(key: string){
    
    return await prismaClient.$transaction(async(tx)=>{
        const idempotencyKeyData =await getIdempotencyKeyWithLock(tx,key);

        if(!idempotencyKeyData || !idempotencyKeyData.bookingId){
            throw new NotFoundError("Idempotency Key Not Found!");
        }

        if(idempotencyKeyData.finalized){
            throw new BadRequestError("Idempotency Key Finalized");
        }

        const booking =await confirmBooking(tx,idempotencyKeyData.bookingId);
        await finalizeIdempotencyKey(tx,key);

        return booking;
    });
}
