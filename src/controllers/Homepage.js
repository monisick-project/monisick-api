import MonitoringPeriod from "../models/MonitoringPeriodModel.js";

export const getActiveMonitoringPeriods = async (req, res) => {
    const userId = req.userId;
    try {
        const activeMonitoringPeriods = await MonitoringPeriod.findAll({
            where: { user_id: userId, status: 'active' },
            attributes: ['monitoring_name', 'start_date', 'end_date', 'status'],
        });
        res.status(200).json(activeMonitoringPeriods);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error fetching active monitoring periods" });
    }
};
