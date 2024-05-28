import { Handler } from "express";
import DishService from "../../service/dish.service.js";

export const get: Handler = async (_req, res) => {
    return res.json(await DishService.getDishDaily());
};