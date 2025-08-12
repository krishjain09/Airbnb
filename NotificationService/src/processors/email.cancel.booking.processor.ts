import { Job, Worker } from "bullmq";
import { NotificationDto } from "../dto/notification.dto";
import { getRedisConnObject } from "../config/redis.config";

import { sendEmail } from "../services/mailer.service";
import logger from "../config/logger.config";
import { MAILER_CANCEL_BOOKING_QUEUE } from "../queues/mailer.cancel.booking.queue";
import { MAILER_CANCEL_BOOKING_PAYLOAD } from "../producers/email.cancel.booking.producer";
import { renderCancelledBookingEmail } from "../templates/cancelled_booking.handler";

export const setUpCancelBookingWorker = () => {

    const emailProcessor = new Worker<NotificationDto>(
        MAILER_CANCEL_BOOKING_QUEUE, // Name of the queue
        async (job: Job) => {

            if(job.name !== MAILER_CANCEL_BOOKING_PAYLOAD) {
                throw new Error("Invalid job name");
            }

            // call the service layer from here.
            const payload = job.data;
            console.log(`Processing email for: ${JSON.stringify(payload)}`);

            const emailContent = await renderCancelledBookingEmail(payload.templateId, payload.params);
            await sendEmail(payload.to, payload.subject, emailContent);

            logger.info(`Email sent to ${payload.to} with subject ${payload.subject}`);

        }, // Process function
        {
            connection: getRedisConnObject()
        }
    )

    emailProcessor.on("failed", () => {
        console.error("Email processing failed");
    });

    emailProcessor.on("completed", () => {
        console.log("Email processing completed successfully");
    });
}