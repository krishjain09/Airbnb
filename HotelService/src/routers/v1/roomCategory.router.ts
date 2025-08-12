import { Router } from "express";
import { getRoomCategoryByIdHandler } from "../../controllers/roomCategory.controller";


const roomCategoryRouter = Router();
roomCategoryRouter.get('/:id', getRoomCategoryByIdHandler);

export default roomCategoryRouter;