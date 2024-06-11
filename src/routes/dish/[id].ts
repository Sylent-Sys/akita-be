import { Handler } from "express";
import DishService from "../../service/dish.service.js";

export const get: Handler = async (req, res) => {
    if (req.params.id) {
        return res.json(await DishService.getDish(req.params.id));
    }
    return res.json({
        message: 'Please provide dish id'
    })
};