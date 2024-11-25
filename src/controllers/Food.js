import Food from "../models/FoodModel.js"; 
import MonitoringPeriod from "../models/MonitoringPeriodModel.js"; 
import { Op } from "sequelize";

// Create a food entry 
export const createFoodEntry = async (req, res) => {
    const { food_time, food_name, calories, proteins, carbo, fats, massa } = req.body;
    const userId = req.userId;
    try {
        // Find all active monitoring periods for the user
        const activeMonitoringPeriods = await MonitoringPeriod.findAll({
            where: {
                user_id: userId,
                end_date: { [Op.gt]: new Date() }, // by active monitoring periode
            },
        });
        if (activeMonitoringPeriods.length === 0) {
            return res.status(404).json({ msg: "No active monitoring periods found for the user" });
        }
        const foodEntries = [];
        for (let period of activeMonitoringPeriods) {
            const foodEntry = await Food.create({
                food_time,
                food_name,
                calories,
                proteins,
                carbo,
                fats,
                massa,
                food_date: new Date(), 
                monitoringPeriodId: period.id,
            });
            foodEntries.push(foodEntry);
        }
        res.status(201).json({ msg: "Food entries created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error while creating food entries" });
    }
};

// Get all food entries for a specific monitoring period
export const getFoodEntries = async (req, res) => {
    const { monitoringPeriodId } = req.params; 
    try {
        const foodEntries = await Food.findAll({
            where: {
                monitoringPeriodId,
            },
            attributes: [
                "food_time",
                "food_name",
                "calories",
                "proteins",
                "carbo",
                "fats",
                "massa",
                "food_date",
            ], 
            order: [["food_date", "ASC"]], // Order by food_date
        });
        if (foodEntries.length === 0) {
            return res.status(404).json({ msg: "No food entries found for this monitoring period" });
        }
        res.status(200).json(foodEntries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error while fetching food entries" });
    }
};

// Update a food entry
export const updateFoodEntry = async (req, res) => {
    const { id } = req.params;
    const { food_time, food_name, calories, proteins, carbo, fats, massa } = req.body;
    try {
        const foodEntry = await Food.findByPk(id);
        if (!foodEntry) {
            return res.status(404).json({ msg: "Food entry not found" });
        }
        await foodEntry.update({
            food_time,
            food_name,
            calories,
            proteins,
            carbo,
            fats,
            massa,
        });
        res.status(200).json({ msg: "Food entry updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error while updating food entry" });
    }
};

// Delete a food entry
export const deleteFoodEntry = async (req, res) => {
    const { id } = req.params;
    try {
        const foodEntry = await Food.findByPk(id);
        if (!foodEntry) {
            return res.status(404).json({ msg: "Food entry not found" });
        }
        await foodEntry.destroy();
        res.status(200).json({ msg: "Food entry deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error while deleting food entry" });
    }
};
