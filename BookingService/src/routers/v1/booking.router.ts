import express from 'express';
import { confirmBookingHandler, createBookingHandler } from '../../controllers/booking.controller';
import {  validateRequestBody } from '../../validators';
import { createBookingSchema } from '../../validators/booking.validator';
import { userContext } from '../../middlewares/userContext.middleware';



const bookingRouter = express.Router();

bookingRouter.use(userContext)

bookingRouter.post('/', validateRequestBody(createBookingSchema),createBookingHandler); 
bookingRouter.post('/confirm/:idempotencyKey',confirmBookingHandler)

export default bookingRouter;