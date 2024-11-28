import DailyLog from "../models/DailyLogModel.js";
import MonitoringPeriod from "../models/MonitoringPeriodModel.js";

// Create Daily Log
export const createDailyLog = async (req, res) => {
    const { monitoringPeriodId } = req.params;
    const { content } = req.body; // log_date tidak diambil dari body
    const log_date = req.body.log_date || new Date().toISOString().split("T")[0]; // Tanggal default = hari ini
    const userId = req.userId; // Dapatkan ID user dari JWT

    try {
        // Cek apakah monitoring period ada dan milik user yang sama
        const monitoringPeriod = await MonitoringPeriod.findOne({
            where: { id: monitoringPeriodId, user_id: userId },
        });

        if (!monitoringPeriod) {
            return res.status(404).json({ msg: "Monitoring Period not found" });
        }

        // Cek jika monitoring period sudah expired
        if (monitoringPeriod.status === "expired") {
            return res.status(400).json({ msg: "Cannot create daily log. Monitoring period is expired." });
        }

        // Buat log harian
        await DailyLog.create({
            log_date,
            content,
            monitoringPeriodId,
        });

        res.status(201).json({ msg: "Daily log created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};


// Read Daily Log
export const getDailyLogs = async (req, res) => {
    const { monitoringPeriodId } = req.params;
    try {
        const logs = await DailyLog.findAll({
            where: { monitoringPeriodId },
            attributes: ["log_date", "content"],
            order: [["log_date", "ASC"]],
        });
        if (logs.length === 0) {
            return res.status(404).json({ msg: "No logs found for this monitoring period" });
        }
        res.status(200).json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};

// Update Daily Log
export const updateDailyLog = async (req, res) => {
    const { logId } = req.params;
    const { log_date, content } = req.body;
    const userId = req.userId; // Dapatkan ID user dari JWT

    try {
        const log = await DailyLog.findByPk(logId);

        if (!log) {
            return res.status(404).json({ msg: "Daily log not found" });
        }

        // Cek apakah monitoring period terkait sudah expired
        const monitoringPeriod = await MonitoringPeriod.findOne({
            where: { id: log.monitoringPeriodId, user_id: userId },
        });

        if (!monitoringPeriod) {
            return res.status(404).json({ msg: "Monitoring Period not found" });
        }

        if (monitoringPeriod.status === "expired") {
            return res.status(400).json({ msg: "Cannot update daily log. Monitoring period is expired." });
        }

        // Perbarui log
        await log.update({ log_date, content });

        res.status(200).json({ msg: "Daily log updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};


// Delete Daily Log
export const deleteDailyLog = async (req, res) => {
    const { logId } = req.params;
    const userId = req.userId; // Dapatkan ID user dari JWT

    try {
        const log = await DailyLog.findByPk(logId);

        if (!log) {
            return res.status(404).json({ msg: "Daily log not found" });
        }

        // Cek apakah monitoring period terkait sudah expired
        const monitoringPeriod = await MonitoringPeriod.findOne({
            where: { id: log.monitoringPeriodId, user_id: userId },
        });

        if (!monitoringPeriod) {
            return res.status(404).json({ msg: "Monitoring Period not found" });
        }

        if (monitoringPeriod.status === "expired") {
            return res.status(400).json({ msg: "Cannot delete daily log. Monitoring period is expired." });
        }

        // Hapus log
        await log.destroy();

        res.status(200).json({ msg: "Daily log deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};

