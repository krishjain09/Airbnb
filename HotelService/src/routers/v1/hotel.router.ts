import express from 'express';
import { createHotelHandler, getAllHotelsHandler, getHotelByIdHandler,getHotelByLocationHandler} from '../../controllers/hotel.controller';
import { hotelSchema } from '../../validators/hotel.validator';
import { validateRequestBody } from '../../validators';



const hotelRouter = express.Router();

hotelRouter.post('/',validateRequestBody(hotelSchema),createHotelHandler); 

hotelRouter.get('/all',getAllHotelsHandler); 
hotelRouter.get('/hotel-location/:location',getHotelByLocationHandler); 
hotelRouter.get('/:id',getHotelByIdHandler); 

export default hotelRouter;