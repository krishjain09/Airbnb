import prismaClient from "../prisma/client";
import { CreateBookingDTO } from "../dto/booking.dto";
import {getIdempotencyKeyWithLock,confirmBooking,finalizeIdempotencyKey,createBooking,createIdempotencyKey} from "../repositories/booking.repository"
import { BadRequestError, InternalServerError, NotFoundError } from "../utils/errors/app.error";
import { generateIdempotencyKey } from "../utils/generateIdempotencyKey";
import { redlock } from "../config/redis.config";
import { serverConfig } from "../config";


export async function createBookingService(createBookingDTO : CreateBookingDTO) {
    const bookingResource = `hotel:${createBookingDTO.hotelId}`;
    const ttl = serverConfig.LOCK_TTL;
    try{
        await redlock.acquire([bookingResource],ttl);
        
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

    }catch(error){
        console.log(error);
        throw new InternalServerError("Failed to acquire lock for booking resource.")
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
