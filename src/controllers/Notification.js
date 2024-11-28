import { Op } from 'sequelize'; 
import Notifications from "../models/NotificationModel.js";
import Medications from "../models/MedicationModel.js";
import MonitoringPeriod from "../models/MonitoringPeriodModel.js";

// Create notifications for medication
export const createNotificationsForMedication = async (medication) => {
    try {
        const { id, medication_name, schedule_time, monitoringPeriodId } = medication;
        // Dapatkan monitoring period terkait
        const monitoringPeriod = await MonitoringPeriod.findOne({
            where: { id: monitoringPeriodId },
        });
        if (!monitoringPeriod) {
            console.error("Monitoring Period not found");
            return;
        }
        // Cek apakah monitoring period sudah expired
        if (monitoringPeriod.status === "expired") {
            console.error("Cannot create notifications. Monitoring period is expired.");
            // Menonaktifkan semua notifikasi yang ada untuk obat ini setelah expired
            await Notifications.update(
                { status: 'inactive' },
                { where: { medicationId: id } }
            );
            return;
        }
        // Buat notifikasi berdasarkan schedule_time
        const notifications = schedule_time.map((time) => ({
            message: `Time to take your medication: ${medication_name}`,
            scheduled_time: time,
            medicationId: id,
        }));
        await Notifications.bulkCreate(notifications);
        console.log("Notifications created successfully");
    } catch (error) {
        console.error("Error creating notifications:", error);
    }
};

// Get all notifications for a specific medication
export const getNotifications = async (req, res) => {
    const { medicationId } = req.params; // ID Obat
    try {
        // Cari medication terkait
        const medication = await Medications.findOne({
            where: { id: medicationId },
            attributes: ['monitoringPeriodId'],
        });
        if (!medication) {
            return res.status(404).json({ msg: "Medication not found" });
        }
        // Cari monitoring period terkait
        const monitoringPeriod = await MonitoringPeriod.findOne({
            where: { id: medication.monitoringPeriodId },
        });
        if (!monitoringPeriod) {
            return res.status(404).json({ msg: "Monitoring Period not found" });
        }
        // Cek apakah monitoring period sudah expired
        if (monitoringPeriod.status === 'expired') {
            // Menandai semua notifikasi untuk dihentikan
            await Notifications.update(
                { status: 'inactive' },
                { where: { medicationId: medicationId } }
            );
            return res.status(400).json({ msg: "Cannot display notifications. Monitoring period is expired." });
        }
        // Ambil notifikasi terkait medication yang statusnya masih aktif
        const notifications = await Notifications.findAll({
            where: { medicationId, status: { [Op.ne]: 'inactive' } },
            attributes: ["message", "status", "scheduled_time"],
        });
        if (!notifications.length) {
            return res.status(404).json({ msg: "No notifications found for this medication" });
        }
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};

// Update notification status
export const updateNotificationStatus = async (req, res) => {
    const { id } = req.params; 
    const { status } = req.body; 
    if (!["taken", "missed", "inactive"].includes(status)) {
        return res.status(400).json({ msg: "Invalid status" });
    }
    try {
        const notification = await Notifications.findByPk(id);
        if (!notification) {
            return res.status(404).json({ msg: "Notification not found" });
        }
        notification.status = status;
        await notification.save();
        res.status(200).json({ msg: "Notification status updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};
