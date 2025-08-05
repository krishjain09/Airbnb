import express from 'express';
import { createHotelHandler, deleteHotelHandler, getAllHotelsHandler, getHotelByIdHandler} from '../../controllers/hotel.controller';
import { hotelSchema } from '../../validators/hotel.validator';
import { validateRequestBody } from '../../validators';



const hotelRouter = express.Router();

hotelRouter.post('/',validateRequestBody(hotelSchema),createHotelHandler); 

hotelRouter.get('/all',getAllHotelsHandler); 


hotelRouter.delete('/:id',deleteHotelHandler); 

hotelRouter.get('/:id',getHotelByIdHandler); 

export default hotelRouter;