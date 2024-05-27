import { prisma } from "../prisma.js";

export default class DishService {
    static async getDishes() {
        return await prisma.dish.findMany();
    }
}