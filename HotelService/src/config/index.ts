// This file contains all the basic configuration logic for the app server to work
import dotenv from 'dotenv';

type ServerConfig = {
    PORT: number,
    REDIS_PORT: number,
    REDIS_HOST: string,
    ROOM_CRON : string
}

type DBConfig = {
    DB_USER: string,
    DB_PASSWORD : string,
    DB_NAME : string , 
    DB_HOST : string
}

function loadEnv() {
    dotenv.config();
    console.log(`Environment variables loaded`);
}

loadEnv();

export const serverConfig: ServerConfig = {
    PORT: Number(process.env.PORT) || 3001,
    REDIS_PORT : Number(process.env.REDIS_PORT) || 6379,
    REDIS_HOST : process.env.REDIS_HOST || 'localhost',
    ROOM_CRON : process.env.ROOM_CRON || '* * * * *'
};

export const dbConfig : DBConfig = {
    DB_USER : process.env.DB_USER || 'root',
    DB_HOST : process.env.DB_HOST || 'localhost',
    DB_NAME : process.env.DB_NAME || 'airbnb_dev',
    DB_PASSWORD : process.env.DB_PASSWORD || 'krishjain123'
}