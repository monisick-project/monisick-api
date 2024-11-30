import Notifications from "../models/NotificationModel.js";
import Medications from "../models/MedicationModel.js";
import Food from "../models/FoodModel.js";
import DailyLog from "../models/DailyLogModel.js";

// Mendapat data kepatuhan minum obat
export const getMedicationReport = async (req, res) => {
    const { monitoringPeriodId } = req.params;

    try {
        const medicationReport = await Notifications.findAll({
            include: [
                {
                    model: Medications,
                    attributes: ["medication_name"],
                    where: { monitoringPeriodId },
                },
            ],
            attributes: [
                "scheduled_time",
                "status", // 'taken' atau 'missed'
            ],
        });

        res.status(200).json(medicationReport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error while fetching medication report" });
    }
};

// Mendapat data makanan
export const getFoodReport = async (req, res) => {
    const { monitoringPeriodId } = req.params;

    try {
        const foodReport = await Food.findAll({
            where: { monitoringPeriodId },
            attributes: [
                "food_date",
                "food_time", // Breakfast, Lunch, Dinner
                "calories",
                "proteins",
                "carbo",
                "fats",
                "massa",
            ],
        });

        res.status(200).json(foodReport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error while fetching food report" });
    }
};

// Mendapatkan data log harian
export const getDailyLogReport = async (req, res) => {
    const { monitoringPeriodId } = req.params;

    try {
        const dailyLogs = await DailyLog.findAll({
            where: { monitoringPeriodId },
            attributes: ["log_date", "content"],
        });

        res.status(200).json(dailyLogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error while fetching daily log report" });
    }
};

// Report keseluruhan
export const getReportForChart = async (req, res) => {
    const { monitoringPeriodId } = req.params;

    try {
        // Data Kepatuhan Obat
        const medicationData = await Notifications.findAll({
            include: [
                {
                    model: Medications,
                    attributes: ["medication_name"],
                    where: { monitoringPeriodId },
                },
            ],
            attributes: ["scheduled_time", "status"],
        });

        // Data Makanan
        const foodData = await Food.findAll({
            where: { monitoringPeriodId },
            attributes: [
                "food_date",
                "food_time",
                "calories",
                "proteins",
                "carbo",
                "fats",
            ],
        });

        // Data Log Harian
        const dailyLogData = await DailyLog.findAll({
            where: { monitoringPeriodId },
            attributes: ["log_date", "content"],
        });

        // Gabungkan Data untuk Grafik
        res.status(200).json({
            medication: medicationData,
            food: foodData,
            dailyLogs: dailyLogData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error while generating report for chart" });
    }
};
