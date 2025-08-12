import { NotificationDTO } from "../dto/notification.dto";
import { mailerCancelBookingQueue  } from "../queues/mailer.cancel.booking.queue";

export const MAILER_CANCEL_BOOKING_PAYLOAD = "payload:cancel:booking:mail";

export const addCancelBookingEmailToQueue = async (payload: NotificationDTO) => {
    await mailerCancelBookingQueue.add(MAILER_CANCEL_BOOKING_PAYLOAD, payload);
    console.log(`Email added to queue: ${JSON.stringify(payload)}`);    
}