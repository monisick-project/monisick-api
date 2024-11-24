import Food from "../models/FoodModel.js"; // Assuming FoodModel exists
import MonitoringPeriod from "../models/MonitoringPeriodModel.js"; // MonitoringPeriod Model
import { Op } from "sequelize";

// Create Food Entry and associate it with all active monitoring periods for the user
export const createFoodEntry = async (req, res) => {
    const { food_time, food_name, calories, proteins, carbo, fats, massa } = req.body;
    const userId = req.userId; // User ID from decoded JWT token
    try {
        // Find all active monitoring periods for the user
        const activeMonitoringPeriods = await MonitoringPeriod.findAll({
            where: {
                user_id: userId,
                end_date: { [Op.gt]: new Date() }, // Only consider active monitoring periods
            },
        });

        // If no active monitoring period is found, return an error
        if (activeMonitoringPeriods.length === 0) {
            return res.status(404).json({ msg: "No active monitoring periods found for the user" });
        }
        // Create the food entry for each active monitoring period
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
                food_date: new Date(), // Automatically set current date
                monitoringPeriodId: period.id, // Associate with the active monitoring period
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
    const { monitoringPeriodId } = req.params; // Get monitoringPeriodId from the URL parameter
    try {
        // Find all food entries for the given monitoring period
        const foodEntries = await Food.findAll({
            where: {
                monitoringPeriodId, // Only food entries that belong to the specific monitoring period
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
            ], // Specify the fields to return
            order: [["food_date", "ASC"]], // Optional: Order by food_date if you want to list them chronologically
        });
        // If no food entries are found for the monitoring period
        if (foodEntries.length === 0) {
            return res.status(404).json({ msg: "No food entries found for this monitoring period" });
        }
        // Send the found food entries as the response
        res.status(200).json(foodEntries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error while fetching food entries" });
    }
};

// Update a food entry
export const updateFoodEntry = async (req, res) => {
    const { id } = req.params; // Get food entry id from URL
    const { food_time, food_name, calories, proteins, carbo, fats, massa } = req.body;
    try {
        // Find the food entry by id
        const foodEntry = await Food.findByPk(id);
        if (!foodEntry) {
            return res.status(404).json({ msg: "Food entry not found" });
        }
        // Update the food entry
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
    const { id } = req.params; // Get food entry id from URL
    try {
        // Find the food entry by id
        const foodEntry = await Food.findByPk(id);
        if (!foodEntry) {
            return res.status(404).json({ msg: "Food entry not found" });
        }
        // Delete the food entry
        await foodEntry.destroy();
        res.status(200).json({ msg: "Food entry deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error while deleting food entry" });
    }
};
