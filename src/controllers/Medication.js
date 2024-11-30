import MonitoringPeriod from "../models/MonitoringPeriodModel.js";  // Pastikan path sesuai dengan struktur proyek Anda
import Medications from "../models/MedicationModel.js";
import { createNotificationsForMedication } from "./Notification.js";
import Notifications from "../models/NotificationModel.js";

// Create Medication for a specific Monitoring Period
export const createMedication = async (req, res) => {
    const { medication_name, frequency, before_after_meal, schedule_time } = req.body;
    const { monitoringPeriodId } = req.params; 
    const userId = req.userId;
    try {
        // Cek apakah monitoring period ada dan statusnya tidak expired
        const monitoringPeriod = await MonitoringPeriod.findOne({
            where: { id: monitoringPeriodId, user_id: userId }, 
        });
        if (!monitoringPeriod) {
            return res.status(404).json({ msg: "Monitoring Period not found" });
        }
        // Cek jika monitoring period sudah expired
        if (monitoringPeriod.status === "expired") {
            return res.status(400).json({ msg: "Cannot add medication. Monitoring period is expired." });
        }
        // Buat data medication
        const medication = await Medications.create({
            medication_name,
            frequency, 
            before_after_meal,
            schedule_time, 
            monitoringPeriodId, 
        });
        // Buat notifikasi otomatis
        await createNotificationsForMedication(medication);
        res.status(201).json({ msg: "Medication added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};

// Read Medications
export const getMedications = async (req, res) => {
    const { monitoringPeriodId } = req.params;
    try {
        const medications = await Medications.findAll({
            where: { monitoringPeriodId },
            attributes: ['medication_name', 'frequency', 'before_after_meal', 'schedule_time', 'monitoringPeriodId'],
        });
        res.status(200).json({
            message: "Medications retrieved successfully",
            data: medications,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: "An error occurred while retrieving medications"});
    }
};

// Update Medication
export const updateMedication = async (req, res) => {
    const { id, monitoringPeriodId } = req.params; 
    const { medication_name, frequency, before_after_meal, schedule_time } = req.body;
    const userId = req.userId;  
    try {
        // Cek apakah monitoring period ada dan statusnya tidak expired
        const monitoringPeriod = await MonitoringPeriod.findOne({
            where: { id: monitoringPeriodId, user_id: userId },
        });
        if (!monitoringPeriod) {
            return res.status(404).json({ msg: "Monitoring Period not found" });
        }
        // Cek jika monitoring period sudah expired
        if (monitoringPeriod.status === 'expired') {
            return res.status(400).json({ msg: "Cannot update medication. Monitoring period is expired." });
        }
        // Cari medication berdasarkan ID dan monitoringPeriodId
        const medication = await Medications.findOne({
            where: { id, monitoringPeriodId },
        });
        if (!medication) {
            return res.status(404).json({ msg: "Medication not found" });
        }
        // Update medication
        await Medications.update(
            {
                medication_name,
                frequency,
                before_after_meal, 
                schedule_time,
            },
            { where: { id, monitoringPeriodId } }
        );
        res.status(200).json({ msg: "Medication updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "An error occurred while updating the medication" });
    }
};


