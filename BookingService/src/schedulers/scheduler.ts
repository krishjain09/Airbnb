import * as cron from "node-cron"
import logger from "../config/logger.config";
import { cancelBooking, deleteIdempotencyKey, getsExpiredBookings } from "../repositories/booking.repository";
import {updateBookingIdToRoomsAsNULL } from "../gateway/hotel.gateway";

let cronJob : cron.ScheduledTask | null = null;


export async function startScheduler1() : Promise<void> {
    if(cronJob){
        logger.warn(`Scheduler is already running`);
        return;
    }

    cronJob = cron.schedule("* * * * * *", async () => {
        try{
            logger.info(`Scheduler is running at ${new Date().toISOString()}`);
            await cleanUpExpiredBookings();
            logger.info(`Scheduler completed at ${new Date().toISOString()}`);
        }catch(error){
            logger.error(`Error occurred while running scheduler: ${error}`);
        }
    });

}

const cleanUpExpiredBookings = async () => {
  logger.info(`Cleaning up expired bookings started at ${new Date().toISOString()}`);
  
  const expiredBookings = await getsExpiredBookings();
  logger.info(`Fetched ${expiredBookings.length} expired bookings at ${new Date().toISOString()}`);

  for (const booking of expiredBookings) {
    try {

      await updateBookingIdToRoomsAsNULL(booking.id);
      await cancelBooking(booking.id);
      await deleteIdempotencyKey(booking.id);

    } catch (error) {
      logger.error(`Failed to clean booking ${booking.id}:`, error);
    }
  }

  logger.info(`Cleaning up expired bookings finished at ${new Date().toISOString()}`);
};
