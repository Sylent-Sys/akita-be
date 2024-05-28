import { createClient } from 'redis';
const client = createClient({
    url: process.env.REDIS_URL
});
client.on('error', (err) => console.error('Redis Client Error', err));
async function connectRedis() {
    try {
        await client.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
}
connectRedis();
export const getRedisAsync = client.get.bind(client);
export const setRedisAsync = async (key: string, value: string, expiryInSeconds: number) => {
    try {
        await client.set(key, value, { EX: expiryInSeconds });
    } catch (err) {
        console.error('Error setting value in Redis:', err);
    }
};