import Medications from "../models/MedicationModel.js";
import { createNotificationsForMedication } from "./Notification.js";

// Create Medication for a specific Monitoring Period
export const createMedication = async (req, res) => {
    const { medication_name, frequency, before_after_meal, schedule_time } = req.body;
    const { monitoringPeriodId } = req.params;
    try {
        const medication = await Medications.create({
            medication_name,
            frequency,
            before_after_meal,
            schedule_time,
            monitoringPeriodId,
        });
        await createNotificationsForMedication(medication);
        res.status(201).json({ msg: "Medication added successfully"});
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

    try {
        const medication = await Medications.findOne({
            where: { id, monitoringPeriodId },
        });
        if (!medication) {
            return res.status(404).json({ msg: "Medication not found" });
        }
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

// Delete Medication
export const deleteMedication = async (req, res) => {
    const { id, monitoringPeriodId } = req.params;

    try {
        const medication = await Medications.findOne({
            where: { id, monitoringPeriodId },
        });
        if (!medication) {
            return res.status(404).json({ msg: "Medication not found" });
        }
        await Medications.destroy({
            where: { id, monitoringPeriodId },
        });
        res.status(200).json({ msg: "Medication deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "An error occurred while deleting the medication" });
    }
};
