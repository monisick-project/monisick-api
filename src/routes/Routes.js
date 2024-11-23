import express from "express";
import { getUsers, Register, Login, Logout } from '../controllers/Users.js';
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { createMonitoringPeriod, getMonitoringPeriods, updateMonitoringPeriod, deleteExpiredMonitoringPeriods, deleteMonitoringPeriod } from '../controllers/MonitoringPeriod.js';
import { createMedication, getMedications, updateMedication, deleteMedication } from "../controllers/Medication.js";
import { createNotificationsForMedication, getNotifications, updateNotificationStatus, deleteNotification } from "../controllers/Notification.js";

const router = express.Router();

// Authentication
router.get('/auth/users', verifyToken, getUsers);
router.post('/auth/register', Register);
router.post('/auth/login', Login);
router.get('/auth/token', refreshToken);
router.delete('/auth/logout', Logout);
// Monitoring Periods
router.post('/monitoring-periods', verifyToken, createMonitoringPeriod);
router.get('/monitoring-periods', verifyToken, getMonitoringPeriods);
router.put('/monitoring-periods/:id', verifyToken, updateMonitoringPeriod);
router.delete("/monitoring-periods/expired", verifyToken, deleteExpiredMonitoringPeriods);
router.delete("/monitoring-periods/:id", verifyToken, deleteMonitoringPeriod);  

// Medication
router.post("/monitoring-periods/:monitoringPeriodId/medications", verifyToken, createMedication);
router.get('/monitoring-periods/:monitoringPeriodId/medications', verifyToken, getMedications);
router.put(" /monitoring-periods/:monitoringPeriodId/medications/:id", verifyToken, updateMedication);
router.delete("/monitoring-periods/:monitoringPeriodId/medications/:id", verifyToken, deleteMedication);

// Notifications Medication
router.post('/notifications', verifyToken, createNotificationsForMedication);
router.get('/notifications', verifyToken, getNotifications);
router.put('/notifications/:id', verifyToken, updateNotificationStatus);
router.delete('/notifications/:id', verifyToken, deleteNotification);

export default router;