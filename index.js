//untuk  membuat database dengan sequelize

import express from "express";
import dotenv from  "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./src/config/Database.js";
import router from "./src/routes/Routes.js";
import cron from "node-cron"; 
import { updateExpiredMonitoringPeriod } from "./src/controllers/MonitoringPeriod.js";
dotenv.config();


const app = express();


try {
    await db.authenticate();
    console.log('Database Connected..');

    // Menjadwalkan pembaruan status expired setiap hari pada pukul 00:00
    cron.schedule('0 0 * * *', async () => {  // Ekspresi cron untuk setiap hari pukul 00:00
        console.log("Running cron job to update expired monitoring periods...");
        await updateExpiredMonitoringPeriod();  // Fungsi yang akan memperbarui status expired
    });
} catch (error) {
    console.error(error);
}

app.use(cors({ credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(5000, ()=> console.log('Server running at port 5000'));