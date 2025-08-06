import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import Hotel from "./hotel";
import sequelize from "./sequelize";

export enum RoomType{
    SINGLE = 'SINGLE',
    DOUBLE = 'DOUBLE',
    FAMILY = 'FAMILY',
    DELUXE = 'DELUXE',
    SUITE = 'SUITE'
}


class RoomCategory extends Model<InferAttributes<RoomCategory>,InferCreationAttributes<RoomCategory>>{
    declare id : CreationOptional<number>;
    declare roomType : RoomType;
    declare price : number;
    declare hotelId : number;
    declare roomCount : number;
    declare createdAt : CreationOptional<Date>;
    declare updatedAt : CreationOptional<Date>;
    declare deletedAt : CreationOptional<Date|null>;
}

RoomCategory.init(
    {
        id: {
            type :"INTEGER",
            autoIncrement : true,
            allowNull : false,
            primaryKey : true,
        },
        roomType:{
            type : "ENUM",
            values: [...Object.values(RoomType)],
        },
        price:{
            type : "INTEGER",
            allowNull : false,
        },
        hotelId:{
            type:  "INTEGER",
            references :{
                model : Hotel,
                key:'id'
            },
        },
        roomCount:{
            type: "INTEGER",
            allowNull: false
        },
        createdAt: {
            type: 'DATE',
            defaultValue: new Date(),
        },
        updatedAt: {
            type: 'DATE',
            defaultValue: new Date(),
        },
        deletedAt: {
            type: 'DATE',
            defaultValue: null,
        }
    },{
        tableName : 'room_categories',
        sequelize : sequelize,
        underscored:true,
        timestamps : true
    }
);

export default RoomCategory;