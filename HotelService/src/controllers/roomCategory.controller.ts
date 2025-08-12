import { getRoomCategoryByIdService } from "../services/roomCategory.service";
import { Request,Response } from "express";

export async function getRoomCategoryByIdHandler(req: Request, res: Response) {
    const { id } = req.params;
    const roomCategory = await getRoomCategoryByIdService(Number(id));
    res.status(200).json({
        message: "Room category found successfully",
        data: roomCategory
    });
}