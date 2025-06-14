import express from 'express';
import { confirmBookingHandler, createBookingHandler } from '../../controllers/booking.controller';
import {  validateRequestBody } from '../../validators';
import { createBookingSchema } from '../../validators/booking.validator';

const bookingRouter = express.Router();

bookingRouter.post('/', validateRequestBody(createBookingSchema),createBookingHandler); 
bookingRouter.post('/confirm/:idempotencyKey',confirmBookingHandler)

export default bookingRouter;