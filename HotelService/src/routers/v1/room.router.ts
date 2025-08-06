import { Router } from "express";
import { validateRequestBody } from "../../validators";
import { RoomGenerationJobSchema } from "../../dto/roomGeneration.dto";
import { createRoomHandler } from "../../controllers/room.controller";


const roomRouter = Router();

roomRouter.post('/',validateRequestBody(RoomGenerationJobSchema),createRoomHandler);

export default roomRouter;