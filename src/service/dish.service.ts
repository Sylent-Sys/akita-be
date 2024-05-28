import { Dish } from "@prisma/client";
import { prisma } from "../prisma.js";
import { getRedisAsync, setRedisAsync } from "../redis.js";

export default class DishService {
    static async getDishes() {
        return await prisma.dish.findMany();
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