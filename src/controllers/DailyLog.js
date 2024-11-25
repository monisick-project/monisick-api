import DailyLog from "../models/DailyLogModel.js";

// Create Daily Log
export const createDailyLog = async (req, res) => {
    const { monitoringPeriodId } = req.params;
    const { content } = req.body;
    const log_date = req.body.log_date || new Date().toISOString().split("T")[0]; // Tanggal default 
    try {
        await DailyLog.create({
            log_date,
            content,
            monitoringPeriodId,
        });
        res.status(201).json({ msg: "Daily log created successfully"});
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
    try {
        const log = await DailyLog.findByPk(logId);
        if (!log) {
            return res.status(404).json({ msg: "Daily log not found" });
        }
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
    try {
        const log = await DailyLog.findByPk(logId);
        if (!log) {
            return res.status(404).json({ msg: "Daily log not found" });
        }
        await log.destroy();
        res.status(200).json({ msg: "Daily log deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};
