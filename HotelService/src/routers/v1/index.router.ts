import express from 'express';
import hotelRouter from './hotel.router';
import { pingHandler } from '../../controllers/ping.controller';

const v1Router = express.Router();

v1Router.use('/hotels',hotelRouter);

v1Router.use('/ping',pingHandler)

export default v1Router;