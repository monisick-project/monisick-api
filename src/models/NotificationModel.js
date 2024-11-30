import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Medications from "./MedicationModel.js";

const { DataTypes } = Sequelize;

const Notifications = db.define("notifications", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('taken', 'missed'),
        defaultValue: 'missed',
    },
    scheduled_time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    medicationId: {
        type: DataTypes.INTEGER,
        references: {
            model: Medications,
            key: "id",
        },
        onDelete: "CASCADE",
    },
}, {
    freezeTableName: true,
});

Medications.hasMany(Notifications, { foreignKey: "medicationId", onDelete: "CASCADE" });
Notifications.belongsTo(Medications, { foreignKey: "medicationId" });

export default Notifications;
