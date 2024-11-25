import Notifications from "../models/NotificationModel.js";
import Medications from "../models/MedicationModel.js";

// Create notification when medication created
export const createNotificationsForMedication = async (medication) => {
    try {
        const { id, medication_name, schedule_time } = medication;
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
    const { medicationId } = req.params;
    try {
        const notifications = await Notifications.findAll({
            where: { medicationId }, 
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
