import MonitoringPeriod from "../models/MonitoringPeriodModel.js";

// Endpoint untuk mengambil monitoring period milik user
export const getHomepageData = async (req, res) => {
    const userId = req.userId; // Mendapatkan userId dari token yang diterima di middleware
    try {
        const monitoringPeriods = await MonitoringPeriod.findAll({
            where: { user_id: userId },
            attributes: ['id', 'monitoring_name', 'start_date', 'end_date', 'user_id'], // Hanya ambil data yang diperlukan
        });
        res.json(monitoringPeriods); // Kirim data monitoring period ke frontend
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
};
