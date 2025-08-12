import { Queue } from "bullmq"
import { getRedisConstObj } from '../config/redis.config';

export const MAILER_CANCEL_BOOKING_QUEUE = "queue-cancel-booking-mailer";

export const mailerCancelBookingQueue = new Queue(MAILER_CANCEL_BOOKING_QUEUE, {
    connection: getRedisConstObj(),
});