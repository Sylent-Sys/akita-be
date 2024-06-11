import { Handler } from "express";
import DishService from "../../service/dish.service.js";

export const get: Handler = async (req, res) => {
    if (req.body.id) {
        return res.json(await DishService.getDish(req.body.id));
    }
    return res.json(await DishService.getDishes());
};