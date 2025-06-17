import IOREDIS from 'ioredis'
import Redlock from 'redlock'
import { serverConfig } from '.'

//const redisA = new Client({ host: "a.redis.example.com" });
// export const redisClient = new IOREDIS(serverConfig.REDIS_SERVER_URL)

function connectionToRedis(){
    try{

        let connection: IOREDIS;
        return ()=>{
            if(!connection){
                connection = new IOREDIS(serverConfig.REDIS_SERVER_URL);
                return connection;
            }
            return connection;
        }
    }
    catch(error){
        console.log('Error connecting to Redis',error);
        throw error;
    }
}

export const getRedisConstObj = connectionToRedis();





export const redlock = new Redlock(
  // You should have one client for each independent redis node
  // or cluster.
  [getRedisConstObj()],
  {
    driftFactor: 0.01, // multiplied by lock ttl to determine drift time

    // The max number of times Redlock will attempt to lock a resource
    // before erroring.
    retryCount: 10,

    // the time in ms between attempts
    retryDelay: 200, // time in ms

    // the max time in ms randomly added to retries
    retryJitter: 200, // time in ms

    // The minimum remaining time on a lock before an extension is automatically
    // attempted with the `using` API.
    automaticExtensionThreshold: 500, // time in ms
  });