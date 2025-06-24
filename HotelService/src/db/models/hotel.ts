import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "./sequelize";

class Hotel extends Model<InferAttributes<Hotel> , InferCreationAttributes<Hotel>>{

    declare id: CreationOptional<number>;
    declare name: string;
    declare address : string;
    declare location : string;
    declare createdAt : CreationOptional<Date>;
    declare updatedAt : CreationOptional<Date>;
    declare ratings : number;
    declare ratingCount: number;
}

Hotel.init(
{
   id:{
        type: "INTEGER",
        autoIncrement: true,
        primaryKey: true,
   },
   name:{
        type: "STRING",
        allowNull: false
    },
    address:{
        type: "STRING",
        allowNull: false
    },
   location:{
        type: "STRING",
        allowNull: false
   },
   createdAt:{
        type: "DATE",
        defaultValue: new Date()
   },
   updatedAt:{
        type: "DATE",
        defaultValue : new Date()
   },
   ratings: {
        type : "NUMBER",
        defaultValue : null
   },
   ratingCount:{ 
        type : "NUMBER",
        defaultValue : null,
   }
},
{
    tableName : "hotels",
    sequelize : sequelize,
    underscored : true, //createdAt -> created_at
    timestamps : true
});

export default Hotel;
