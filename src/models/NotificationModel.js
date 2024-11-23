import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Medications from "./MedicationModel.js";

const Notifications = db.define("notifications", {
    notificationId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("taken", "skip"),
        allowNull: false,
        defaultValue: "skip",
    },
    medicationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Medications,
            key: 'id'
        }
    }
},{
    freezeTableName: true
});

// Relasi dengan Medication
Medications.hasMany(Notifications, { foreignKey: "medicationId" });
Notifications.belongsTo(Medications, { foreignKey: "medicationId" });

export default Notifications;
