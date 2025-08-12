import express from 'express';
import hotelRouter from './hotel.router';
import { pingHandler } from '../../controllers/ping.controller';
import roomGenerationRouter  from './roomGeneration.router';
import roomRouter from './room.router';
import roomCategoryRouter from './roomCategory.router';

const v1Router = express.Router();

v1Router.use('/hotels',hotelRouter);
v1Router.use('/room-generation',roomGenerationRouter);
v1Router.use('/rooms',roomRouter);
v1Router.use('/ping',pingHandler)
v1Router.use('/room-category', roomCategoryRouter);

export default v1Router;