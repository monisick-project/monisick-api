import express from "express";
import { getUsers, Register, Login, Logout } from '../controllers/Users.js';
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { getActiveMonitoringPeriods } from "../controllers/Homepage.js";
import { createMonitoringPeriod, getMonitoringPeriods, updateMonitoringPeriod, deleteMonitoringPeriod } from '../controllers/MonitoringPeriod.js';
import { createMedication, getMedications, updateMedication } from "../controllers/Medication.js";
import { getNotifications, updateNotificationStatus } from "../controllers/Notification.js";
import { createFoodEntry, getFoodEntries, deleteFoodEntry } from "../controllers/Food.js";
import { createDailyLog, getDailyLogs, updateDailyLog, deleteDailyLog } from "../controllers/DailyLog.js";
import { getMedicationReport, getFoodReport, getDailyLogReport, getReportForChart, } from "../controllers/Report.js";

const router = express.Router();

// Authentication
router.get('/auth/users', verifyToken, getUsers);
router.post('/auth/register', Register);
router.post('/auth/login', Login);
router.get('/auth/token', refreshToken);
router.delete('/auth/logout', Logout);

// Homepage
router.get('/homepage', verifyToken, getActiveMonitoringPeriods);

// Monitoring Periods
router.post('/monitoring-periods', verifyToken, createMonitoringPeriod);
router.get('/monitoring-periods', verifyToken, getMonitoringPeriods);
router.put('/monitoring-periods/:id', verifyToken, updateMonitoringPeriod);
router.delete("/monitoring-periods/:id", verifyToken, deleteMonitoringPeriod);  

// Medication
router.post("/monitoring-periods/:monitoringPeriodId/medications", verifyToken, createMedication);
router.get('/monitoring-periods/:monitoringPeriodId/medications', verifyToken, getMedications);
router.put("/monitoring-periods/:monitoringPeriodId/medications/:id", verifyToken, updateMedication);

// Notifications Medication
router.get('/medications/:medicationId/notifications', verifyToken, getNotifications);
router.patch('/notifications/:id', verifyToken, updateNotificationStatus);

// Food
router.post("/food", verifyToken, createFoodEntry);
router.get('/monitoring-periods/:monitoringPeriodId/foods', verifyToken, getFoodEntries);
router.delete('/food/:id', verifyToken, deleteFoodEntry);

// Daily Log
router.post("/monitoring-periods/:monitoringPeriodId/logs", verifyToken, createDailyLog);
router.get("/monitoring-periods/:monitoringPeriodId/logs", verifyToken, getDailyLogs);
router.put("/logs/:logId", verifyToken, updateDailyLog);
router.delete("/logs/:logId", verifyToken, deleteDailyLog);

// Reports
router.get("/:monitoringPeriodId/medications", verifyToken, getMedicationReport);
router.get("/:monitoringPeriodId/foods", verifyToken, getFoodReport);
router.get("/:monitoringPeriodId/logs", verifyToken, getDailyLogReport);
router.get("/:monitoringPeriodId/reports", verifyToken, getReportForChart);

export default router;