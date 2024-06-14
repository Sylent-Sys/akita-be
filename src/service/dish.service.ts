import { Dish } from "@prisma/client";
import { prisma } from "../prisma.js";
import { getRedisAsync, setRedisAsync } from "../redis.js";

export default class DishService {
    static async getDishes() {
        const today = new Date().toISOString().split('T')[0];
        const cacheKey = `dishes-${today}`;
        const dishes = await getRedisAsync(cacheKey);
        if (dishes) {
            return JSON.parse(dishes);
        }
        const allDish = await prisma.dish.findMany();
        await setRedisAsync(cacheKey, JSON.stringify(allDish), 86400);
        return dishes;
    }
    static async getDish(id: string) {
        const today = new Date().toISOString().split('T')[0];
        const cacheKey = `dish-${id}-${today}`;
        const dish = await getRedisAsync(cacheKey);
        if (dish) {
            return JSON.parse(dish);
        }
        const dishData = await prisma.dish.findUnique({
            where: {
                id
            }
        });
        await setRedisAsync(cacheKey, JSON.stringify(dishData), 86400);
        return dishData;
    }
    static async getDishDaily() {
        const today = new Date().toISOString().split('T')[0];
        const cacheKey = `daily-dishes-${today}`;
        let dailyDishes = await getRedisAsync(cacheKey);
        if (dailyDishes) {
            return JSON.parse(dailyDishes);
        }
        const allDish = await prisma.dish.findMany();
        const dishesTypes = [...new Set(allDish.map(dish => dish.type))];
        const selectedDishes: { [key: string]: Dish } = {};
        for (const type of dishesTypes) {
            const dishes = allDish.filter(dish => dish.type === type);
            if (dishes.length > 0) {
                const randomIndex = Math.floor(Math.random() * dishes.length);
                selectedDishes[type] = dishes[randomIndex];
            }
        }
        await setRedisAsync(cacheKey, JSON.stringify(selectedDishes), 86400);
        return selectedDishes
    }
}