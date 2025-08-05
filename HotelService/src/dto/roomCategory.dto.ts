import { RoomType } from "../db/models/roomCategory";

export type createRoomCategoryDTO={
    hotelId : number;
    roomType : RoomType;
    price: number;
    roomCount : number;
}