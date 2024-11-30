import MonitoringPeriod from "../models/MonitoringPeriodModel.js";
import { Op } from "sequelize";

// Create Monitoring Period
export const createMonitoringPeriod = async (req, res) => {
    const { monitoring_name, start_date, end_date } = req.body;
    const userId = req.userId;
    try {
        await MonitoringPeriod.create({
            monitoring_name,
            start_date,
            end_date,
            user_id: userId,
        });
        res.status(201).json({msg: "Monitoring Period has been created successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
};

// Get Monitoring Periods for the User
export const getMonitoringPeriods = async (req, res) => {
    const userId = req.userId;
    const { status } = req.query; // Menambahkan query parameter untuk status
    try {
        const whereClause = { user_id: userId };
        if (status) {
            whereClause.status = status; // Menyaring berdasarkan status (active/expired)
        }

        const monitoringPeriods = await MonitoringPeriod.findAll({
            where: whereClause,
            attributes: ['monitoring_name', 'start_date', 'end_date', 'status'],
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
    const { monitoring_name, start_date, end_date } = req.body;
    if (new Date(end_date) <= new Date(start_date)) {
        return res.status(400).json({ msg: "End date must be after start date" });
    }
    try {
        const monitoringPeriod = await MonitoringPeriod.findByPk(id);
        if (!monitoringPeriod) {
            return res.status(404).json({ msg: "Monitoring Period not found" });
        }
        await monitoringPeriod.update({
            monitoring_name,
            start_date,
            end_date,
        });
        res.status(200).json({ msg: "Monitoring Period updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
};

// Update status monitoring period yang sudah expired
export const updateExpiredMonitoringPeriod = async () => {
    try {
        await MonitoringPeriod.update(
            { status: 'expired' }, 
            {
                where: {
                    end_date: { [Op.lt]: new Date() }, // Jika end_date < hari ini
                    status: 'active', 
                },
            }
        );
        console.log("Expired monitoring periods updated to 'expired'.");
    } catch (error) {
        console.error("Error updating expired monitoring periods:", error);
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

        await monitoringPeriod.destroy();

        res.json({ msg: "Monitoring Period deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};
