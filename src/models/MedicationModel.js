import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Medications = db.define('medications', {
    medication_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    frequency: {
        type: DataTypes.JSON, // "morning", "afternoon", "evening"
        allowNull: false
    },
    before_after_meal: {
        type: DataTypes.STRING, // "before" or "after"
        allowNull: false
    },
    schedule_time: {
        type: DataTypes.JSON,
        allowNull: false
    },
    monitoringPeriodId: {
        type: DataTypes.INTEGER,
        references: {
            model: "monitoring_periods",
            key: 'id',
        },
        allowNull: false,
        onDelete: "CASCADE" // Cascade delete medications if the monitoring period is deleted
    }
}, {
    freezeTableName: true
});


export default Medications;

