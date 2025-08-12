import { CreationAttributes, Op } from "sequelize";
import Room from "../db/models/room";
import BaseRepository from "./base.repository";


class RoomRepository extends BaseRepository<Room>{
    constructor(){
        super(Room);
    }
     async findByRoomCategoryIdAndDate(roomCategoryId: number,currentDate : Date){
        return await this.model.findOne({
            where:{
                roomCategoryId,
                dateOfAvailability : currentDate,
                deletedAt: null
            }
        })
     }

     async bulkCreate(rooms: CreationAttributes<Room>[]){
        return await this.model.bulkCreate(rooms);
     }

     async findLatestDatesForAllCategories() : Promise<Array<{roomCategoryId : number,latestDate : Date}>>{
        const results = await this.model.findAll({
            where: {
                deletedAt : null
            },
            attributes: [
                'roomCategoryId',
                [this.model.sequelize!.fn('MAX', this.model.sequelize!.col('date_of_availability')), 'latestDate']
            ],
            group: ['roomCategoryId'],
            raw: true
        });

        return results.map((result: any) => ({
            roomCategoryId: result.roomCategoryId,
            latestDate: new Date(result.latestDate)
        }));
     }  

     async findByRoomCategoryIdAndDateRange(roomCategoryId: number,checkInDate: Date,checkOutDate: Date){
        
        return await this.model.findAll({
            where:{
                roomCategoryId,
                bookingId: null,
                dateOfAvailability :{
                    [Op.between] : [checkInDate,checkOutDate]
                }
            }
        })
     }


     async updatingBookingIdToRooms(bookingId: number, roomIds : number[]){
        
        return await this.model.update(
            {bookingId},{where:{
                id: {[Op.in]: roomIds}
            }})
     }

     async updateBookingIdToRoomsAsNULL(bookingId: number){
        return await this.model.update(
            {bookingId: null},
            {where: {bookingId}}
        )
     }


}

export default RoomRepository;