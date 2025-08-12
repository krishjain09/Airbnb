import { Router } from 'express'
import { validateQueryParams, validateRequestBody } from '../../validators';
import { getAvailableRoomsSchema } from '../../validators/room.validator';
import { getAvailableRoomsHandler, updateBookingIdToRoomsAsNULLHandler, updatingBookingIdToRoomsHandler } from '../../controllers/room.controller';
import { updatingBookingIdToRoomsSchema } from '../../validators/room.validator';

const roomRouter = Router();

roomRouter.get('/available',validateQueryParams(getAvailableRoomsSchema),getAvailableRoomsHandler);
roomRouter.post('/update-booking-id',validateRequestBody(updatingBookingIdToRoomsSchema),updatingBookingIdToRoomsHandler)
roomRouter.post('/update-booking-id-null',updateBookingIdToRoomsAsNULLHandler)
export default roomRouter;