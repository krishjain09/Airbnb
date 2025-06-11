import express from 'express';
import bookingRouter from './booking.router';

const v1Router = express.Router();



v1Router.use('/bookings',  bookingRouter);

export default v1Router;