import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import MonitoringPeriod from "./MonitoringPeriodModel.js";

const { DataTypes } = Sequelize;

const DailyLog = db.define("daily_logs", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    log_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    monitoringPeriodId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: MonitoringPeriod,
            key: "id",
        },
        onDelete: "CASCADE",
    },
}, {
    timestamps: true,
});

MonitoringPeriod.hasMany(DailyLog, { foreignKey: "monitoringPeriodId" });
DailyLog.belongsTo(MonitoringPeriod, { foreignKey: "monitoringPeriodId" });

export default DailyLog;
