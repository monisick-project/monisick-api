import { Op } from 'sequelize'; 
import Notifications from "../models/NotificationModel.js";
import Medications from "../models/MedicationModel.js";
import MonitoringPeriod from "../models/MonitoringPeriodModel.js";
import cron from 'node-cron';
import moment from 'moment'; // Untuk memeriksa waktu saat ini

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

        // Ambil notifikasi aktif terkait medication ini
        const notifications = await Notifications.findAll({
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
    if (!["taken", "missed"].includes(status)) {
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
