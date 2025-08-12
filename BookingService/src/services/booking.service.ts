import prismaClient from "../prisma/client";
import { CreateBookingDTO } from "../dto/booking.dto";
import {getIdempotencyKey,confirmBooking,finalizeIdempotencyKey,createBooking,createIdempotencyKey, getBookingId, cancelBooking, deleteIdempotencyKey} from "../repositories/booking.repository"
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { generateIdempotencyKey } from "../utils/generateIdempotencyKey";
import { redlock } from "../config/redis.config";
import { serverConfig } from "../config";
import { getAvailableRooms, getRoomCategory, getUserProfile, updateBookingIdToRooms, updateBookingIdToRoomsAsNULL } from "../gateway/hotel.gateway";
import { addEmailToQueue } from "../producers/email.producer";
import { addCancelBookingEmailToQueue } from "../producers/email.cancel.booking.producer";


function groupByDate(rooms: any[]): Record<string, any[]> {
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

    const availabilityByDate =  groupByDate(allAvailableRooms);
 
    const requiredDates = getDatesBetween(checkInDate,checkOutDate);
    

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

        const roomCategory = await getRoomCategory(Number(roomCategoryId));
        const totalNights = roomsToBook.length;
        const bookingAmt = (totalNights * roomCategory.data.price);
        console.log("Booking Amount : ", bookingAmt);

        const booking = await createBooking({
            userId: userId,
            hotelId: hotelId,
            bookingAmount: bookingAmt,
            totalGuests: createBookingDTO.totalGuests,
            checkInDate : new Date(createBookingDTO.checkInDate),
            checkOutDate: new Date(createBookingDTO.checkOutDate),
            roomCategoryId : Number(createBookingDTO.roomCategoryId),
            status : "PENDING",
        });

        const idempotencyKey = generateIdempotencyKey();
        console.log(idempotencyKey);
        await createIdempotencyKey(idempotencyKey,booking.id);
        console.log("Sucessfully created IdempotencyKey");
        await updateBookingIdToRooms(booking.id,roomsToBook);

        return {
            bookingId: booking.id,
            idempotencyKey: idempotencyKey
        }

    }finally{
        await Promise.all(locks.map(lock => lock.release()));
    }
}
export async function confirmBookingService(key: string, authHeader: string | undefined) {
    // Phase 1: DB updates
    const booking = await prismaClient.$transaction(async (tx) => {
        const idempotencyKeyData = await getIdempotencyKey(tx, key);
        if (!idempotencyKeyData?.bookingId) throw new NotFoundError("Idempotency Key Not Found!");

        if (idempotencyKeyData.finalized) throw new BadRequestError("Idempotency Key already finalized");

        const booking = await confirmBooking(tx, idempotencyKeyData.bookingId);
        await finalizeIdempotencyKey(tx, key);

        return booking;
    });

    // Phase 2: External calls (outside transaction)
    await updateBookingIdToRoomsAsNULL(booking.id);

    const user = await getUserProfile(authHeader);
    addEmailToQueue({
        to: user.data.Email,
        subject: "Booking Confirmation",
        templateId: "confirmed_booking",
        params: { name: user.data.Username }
    });

    return booking;
}

export async function cancelBookingService(key: string, authHeader: string | undefined) {
    // Phase 1: Only DB work inside transaction
    const { bookingRecord, penalty } = await prismaClient.$transaction(async (tx) => {
        console.log("Transaction started for cancelBookingService");

        const idempotencyKeyData = await getIdempotencyKey(tx, key);
        if (!idempotencyKeyData?.bookingId) {
        throw new NotFoundError("Idempotency Key Not Found!");
        }

        const bookingId = idempotencyKeyData.bookingId;
        let bookingRecord = await getBookingId(bookingId);
        if (!bookingRecord) throw new NotFoundError("Booking Not Found!");

        let currentDate = new Date();
        if (currentDate >= bookingRecord.checkInDate) {
        throw new BadRequestError("Cannot cancel booking after check-in date");
        }

        if (bookingRecord.status === "CANCELLED") {
        throw new BadRequestError("Booking already cancelled");
        }
        
        let diffInDate = Math.floor((bookingRecord.checkInDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        let penalty = 0.25 * bookingRecord.bookingAmount;
        
        if (diffInDate === 1) {
        penalty = 0.5 * bookingRecord.bookingAmount;
        }

        bookingRecord = await cancelBooking(bookingId);
        await deleteIdempotencyKey(bookingId);

        return { bookingRecord, penalty };
    }, { timeout: 180000 }); // 3 minutes timeout

    await updateBookingIdToRoomsAsNULL(bookingRecord.id);

    // Phase 2: External calls (safe outside transaction)
    const user = await getUserProfile(authHeader);

    const payload = {
        to: user.data.Email,
        subject: "Booking Cancellation",
        templateId: "cancelled_booking",
        params: {
        name: user.data.Username,
        penalty: penalty,
        supportEmail: "support@airbnb.com",
        supportPhone: "+1-234-567-890"
        }
    };

    addCancelBookingEmailToQueue(payload);

    return {
        id: bookingRecord.id,
        status: bookingRecord.status
    };
}
