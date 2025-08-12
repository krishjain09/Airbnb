import prismaClient from "../prisma/client";
import { CreateBookingDTO } from "../dto/booking.dto";
import {getIdempotencyKeyWithLock,confirmBooking,finalizeIdempotencyKey,createBooking,createIdempotencyKey} from "../repositories/booking.repository"
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { generateIdempotencyKey } from "../utils/generateIdempotencyKey";
import { redlock } from "../config/redis.config";
import { serverConfig } from "../config";
import { getAvailableRooms, getUserProfile, updateBookingIdToRooms } from "../gateway/hotel.gateway";
import { addEmailToQueue } from "../producers/email.producer";

function groupByDate(rooms: any[]): Record<string, any[]> {
    console.log("groupByDate is executed?");
    return rooms.reduce((acc: Record<string, any[]>, room: any) => {
        const dateStr = new Date(room.dateOfAvailability).toISOString().split('T')[0];
        acc[dateStr] = acc[dateStr] || [];
        acc[dateStr].push(room);
        return acc;
    }, {});
}

function getDatesBetween(startDate: string, endDate: string): string[] {
    console.log("get dates between executed");
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates: string[] = [];

    for (let dt = start; dt < end; dt.setDate(dt.getDate() + 1)) {
        dates.push(dt.toISOString().split('T')[0]);
    }
    console.log("Successfully get dates between executed");
    return dates;
}


export async function createBookingService(createBookingDTO : CreateBookingDTO,userId: number){
    const {checkInDate, checkOutDate, hotelId, roomCategoryId} = createBookingDTO;

    const allAvailableRooms = await getAvailableRooms(Number(roomCategoryId),checkInDate,checkOutDate);
    console.log("All available rooms:", allAvailableRooms);
    const availabilityByDate =  groupByDate(allAvailableRooms);
    console.log("Availability by date:", availabilityByDate);
    const requiredDates = getDatesBetween(checkInDate,checkOutDate);
    console.log("Required Dates: ", requiredDates)

    for(const date of requiredDates){
        if(!availabilityByDate[date] || availabilityByDate[date].length === 0){
            throw new BadRequestError(`No rooms available for the date: ${date}`);
        }
    }
    const roomsToBook = [];
    const locks = [];
    try{
        for(const date of requiredDates){
            const availableRoomsForNight = availabilityByDate[date];

            for(const room of availableRoomsForNight){
                const lockKey = `room_lock:${room.id}:${date}`;
                try{
                    const lock= await redlock.acquire([lockKey], serverConfig.LOCK_TTL);
                    locks.push(lock);
                    roomsToBook.push(room.id);
                    break;
                }catch(error){
                    continue;
                }
            }

            if(roomsToBook.length !== requiredDates.indexOf(date)+1){
                throw new BadRequestError(`No rooms available for the date: ${date}`);
            }
        }
        const booking = await createBooking({
            userId: userId,
            hotelId: hotelId,
            bookingAmount: createBookingDTO.bookingAmount,
            totalGuests: createBookingDTO.totalGuests,
            checkInDate : new Date(createBookingDTO.checkInDate),
            checkOutDate: new Date(createBookingDTO.checkOutDate),
            roomCategoryId : Number(createBookingDTO.roomCategoryId),
            status : "PENDING",
        });

        const idempotencyKey = generateIdempotencyKey();
        console.log(idempotencyKey);
        await createIdempotencyKey(idempotencyKey,booking.id);
        await updateBookingIdToRooms(booking.id,roomsToBook);

        return {
            bookingId: booking.id,
            idempotencyKey: idempotencyKey
        }

    }finally{
        await Promise.all(locks.map(lock => lock.release()));
    }
}

export async function confirmBookingService(key: string,authHeader : string|undefined){
    
    return await prismaClient.$transaction(async(tx)=>{
        const idempotencyKeyData =await getIdempotencyKeyWithLock(tx,key);
        if(!idempotencyKeyData || !idempotencyKeyData.bookingId){
            throw new NotFoundError("Idempotency Key Not Found!");
        }

        if(idempotencyKeyData.finalized){
            throw new BadRequestError("Idempotency Key already finalized");
        }

        const booking =await confirmBooking(tx,idempotencyKeyData.bookingId);
        await finalizeIdempotencyKey(tx,key);
 
        const user = await getUserProfile(authHeader);
        
        const payload = {
            to: user.data.Email,
            subject: "Booking Confirmation",
            templateId : "confirmed_booking",
            params:{
                name : user.data.Username
            }
        }
        addEmailToQueue(payload);
        return booking;
    });
}


