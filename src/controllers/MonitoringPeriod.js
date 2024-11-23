import MonitoringPeriod from "../models/MonitoringPeriodModel.js";
import { Op } from "sequelize";

// Create Monitoring Period 
//note : masih bisa ada kesalahan jika user atur start_date > end_date
export const createMonitoringPeriod = async (req, res) => {
    const { start_date, end_date } = req.body;
    const userId = req.userId;  
    try {
        const monitoringPeriod = await MonitoringPeriod.create({
            start_date,
            end_date,
            user_id: userId,
        });
        res.status(201).json({msg: "Monitoring Period has created successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
};

// Get Monitoring Periods for the User
export const getMonitoringPeriods = async (req, res) => {
    const userId = req.userId; 
    try {
        const monitoringPeriods = await MonitoringPeriod.findAll({
            where: { user_id: userId },
            attributes: ['start_date', 'end_date', 'user_id'],
        });
        res.json(monitoringPeriods);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
};


// Update Monitoring Period
export const updateMonitoringPeriod = async (req, res) => {
    const { id } = req.params;
    const { start_date, end_date } = req.body;
    if (new Date(end_date) <= new Date(start_date)) {
        return res.status(400).json({ msg: "End date must be after start date" });
    }
    try {
        // Find the monitoring period by ID
        const monitoringPeriod = await MonitoringPeriod.findByPk(id);
        if (!monitoringPeriod) {
            return res.status(404).json({ msg: "Monitoring Period not found" });
        }
        await monitoringPeriod.update({
            start_date,
            end_date,
        });
        res.status(200).json({ msg: "Monitoring Period has been updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
};

// // Delete Monitoring Period (Automatic - if end_date has passed)
// export const deleteExpiredMonitoringPeriods = async (req, res) => {
//     try {
//         const result = await MonitoringPeriod.destroy({
//             where: {
//                 end_date: { [Op.lt]: new Date() } 
//             }
//         });
//         res.json({ msg: `Expired monitoring periods deleted successfully`, count: result });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ msg: "Server error" });
//     }
// };

// // Delete Monitoring Period (Manual) -> error!
// export const deleteMonitoringPeriod = async (req, res) => {
//     const { id } = req.params;
//     const userId = req.userId;
//     try {
//         const monitoringPeriod = await MonitoringPeriod.findOne({
//             where: { id },
//         });
//         if (!monitoringPeriod) {
//             return res.status(404).json({ msg: "Monitoring Period not found" });
//         }
//         await MonitoringPeriod.destroy({
//             where: { id }
//         });
//         res.json({ msg: "Monitoring Period deleted successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ msg: "Server error" });
//     }
// };

// Delete Monitoring Period (Automatic - if end_date has passed)
export const deleteExpiredMonitoringPeriods = async (req, res) => {
    try {
        const result = await MonitoringPeriod.destroy({
            where: {
                end_date: { [Op.lt]: new Date() } 
            }
        });
        res.json({ 
            msg: "Expired monitoring periods and related medications deleted successfully", 
            deletedCount: result 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};

// Delete Monitoring Period (Manual)
export const deleteMonitoringPeriod = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    try {
        const monitoringPeriod = await MonitoringPeriod.findOne({
            where: { id },
        });

        if (!monitoringPeriod) {
            return res.status(404).json({ msg: "Monitoring Period not found" });
        }

        await monitoringPeriod.destroy(); // Cascade delete medications

        res.json({ msg: "Monitoring Period and related medications deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};
