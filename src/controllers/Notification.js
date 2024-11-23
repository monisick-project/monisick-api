import Notifications from "../models/NotificationModel.js";
import Medications from "../models/MedicationModel.js";

// Saat pengguna menambahkan obat, notifikasi bisa dibuat secara otomatis.
export const createNotificationsForMedication = async (medication) => {
    const scheduleTimes = medication.scheduleTime; 
    const notifications = scheduleTimes.map((time) => ({
        message: `Time to take your medication: ${medication.medication_name}`,
        status: "skip",
        medicationId: medication.id,
        scheduleTime: time,
    }));

    await Notifications.bulkCreate(notifications);
};
// Hook pada Medication untuk otomatis membuat notifikasi
Medications.afterCreate(async (medication, options) => {
    await createNotificationsForMedication(medication);
});


// Ambil Notifikasi Berdasarkan Obat atau Waktu Tertentu
export const getNotifications = async (req, res) => {
    const { medicationId } = req.query;

    try {
        const notifications = await Notifications.findAll({
            where: { medicationId },
            attributes: ["notificationId", "message", "status"],
        });
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error retrieving notifications" });
    }
};


// Update Status Notifikasi
export const updateNotificationStatus = async (req, res) => {
    const { id } = req.params; // notificationId
    const { status } = req.body;

    if (!["taken", "skip"].includes(status)) {
        return res.status(400).json({ msg: "Invalid status value" });
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
        res.status(500).json({ msg: "Error updating notification status" });
    }
};

// Delete Notification
export const deleteNotification = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Notifications.destroy({ where: { notificationId: id } });
        if (!result) {
            return res.status(404).json({ msg: "Notification not found" });
        }
        res.json({ msg: "Notification deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Failed to delete notification" });
    }
};