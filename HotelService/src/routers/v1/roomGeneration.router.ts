import { Router } from "express";
import { validateRequestBody } from "../../validators";
import { RoomGenerationJobSchema } from "../../dto/roomGeneration.dto";
import { createRoomHandler } from "../../controllers/roomGeneration.controller";


const roomGenerationRouter = Router();

roomGenerationRouter.post('/',validateRequestBody(RoomGenerationJobSchema),createRoomHandler);

export default roomGenerationRouter;